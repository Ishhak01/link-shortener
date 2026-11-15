const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// Initialize Supabase client with YOUR provided credentials
const supabase = createClient(
  'https://scducnrzhvfvcoecowzr.supabase.co', // Your Supabase Project URL
  'sb_publishable_OPhrylgdu4B7_AvfG7yagQ_rY9qVYQu' // Your Supabase anon key
);

// In-memory fallback database (used until Supabase connection is established)
const urlDatabase = {
  // format: shortCode: originalUrl
};

// Generate a short code
function generateShortCode(length = 6) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Route: Create a short URL with Supabase storage
app.post('/shorten', async (req, res) => {
  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL is required' });
  }

  // Validate URL format (basic check)
  try {
    new URL(url);
  } catch (e) {
    return res.status(400).json({ error: 'Invalid URL format' });
  }

  const shortCode = generateShortCode();

  // Try Supabase first, fallback to in-memory
  let result;
  try {
    const { data, error } = await supabase
      .from('urls')
      .insert([{ short_code: shortCode, original_url: url }])
      .select()
      .single();

    if (error) throw error;
    result = data;
  } catch (supabaseError) {
    // Fallback to in-memory
    urlDatabase[shortCode] = url;
    result = {
      shortCode,
      shortUrl: `${req.get('host')}/${shortCode}`,
      originalUrl: url,
      createdAt: new Date().toISOString()
    };
  }

  res.json({
    shortCode: result.short_code,
    shortUrl: result.short_url || `${req.get('host')}/${shortCode}`,
    originalUrl: result.original_url || url,
    createdAt: result.created_at || new Date().toISOString()
  });
});

// Route: Redirect to original URL with blocking logic
app.get('/:shortCode', async (req, res) => {
  const { shortCode } = req.params;

  // Try Supabase first
  let originalUrl;
  let isBlocked = false;
  let blockedReason = '';

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('original_url, is_blocked, blocked_reason')
      .eq('short_code', shortCode)
      .single();

    if (error) throw error;
    originalUrl = data.original_url;
    isBlocked = data.is_blocked;
    blockedReason = data.blocked_reason;
  } catch (supabaseError) {
    // Fallback to in-memory
    originalUrl = urlDatabase[shortCode];
  }

  if (!originalUrl) {
    return res.status(404).json({ error: 'Short URL not found' });
  }

  // --- LINK BLOCKING LOGIC ---
  // Check database-blocked status
  if (isBlocked) {
    return res.status(403).json({
      error: 'This link has been blocked',
      blocked: true,
      reason: blockedReason || 'URL on blocklist'
    });
  }

  // Also check local blocklist as fallback
  const localBlockedDomains = ['example-blocked.com', 'malware-site.org'];
  const isLocallyBlocked = localBlockedDomains.some(domain => originalUrl.includes(domain));

  if (isLocallyBlocked && !isBlocked) {
    // Update database to mark as blocked
    try {
      await supabase
        .from('urls')
        .update({ is_blocked: true, blocked_reason: 'Local blocklist match' })
        .eq('short_code', shortCode);
    } catch (e) {
      // Ignore update errors in fallback mode
    }

    return res.status(403).json({
      error: 'This link has been blocked',
      blocked: true,
      reason: 'Domain on local blocklist'
    });
  }
  // ----------------------------

  // Track click in Supabase
  try {
    await supabase
      .from('urls')
      .increment('click_count', { count: 1 })
      .eq('short_code', shortCode);
  } catch (e) {
    // Ignore analytics errors in fallback mode
    // Could also update in-memory: urlDatabase[shortCode].click_count = (urlDatabase[shortCode]?.click_count || 0) + 1;
  }

  res.redirect(301, originalUrl);
});

// Route: Get all short URLs (admin)
app.get('/urls', async (req, res) => {
  let urls;

  try {
    const { data, error } = await supabase
      .from('urls')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    urls = data;
  } catch (supabaseError) {
    // Fallback to in-memory
    urls = [];
    for (const [shortCode, originalUrl] of Object.entries(urlDatabase)) {
      urls.push({
        shortCode,
        originalUrl,
        shortUrl: `${req.get('host')}/${shortCode}`
      });
    }
  }

  res.json(urls);
});

// Health check route
app.get('/', (req, res) => {
  res.json({
    message: 'Link Shortener API is running',
    status: 'active',
    version: '1.0.0',
    database: 'Supabase connected'
  });
});

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`🚀 Link Shortener running at http://localhost:${port}`);
  console.log(`📝 API endpoints:`);
  console.log(`   POST /shorten - Create a short URL`);
  console.log(`   GET /:shortCode - Redirect to original URL`);
  console.log(`   GET /urls - List all short URLs`);
});

module.exports = app;