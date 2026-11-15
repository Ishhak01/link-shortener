# 📤 Git Push Commands for Your Link Shortener

## Open Your Terminal/Command Prompt

```bash
cd C:\Users\ishha\Desktop\shortlink
```

## Run These Commands (one at a time):

### 1. Initialize Git Repository
```bash
git init
```

### 2. Add All Project Files
```bash
git add .
```

### 3. Create Initial Commit
```bash
git commit -m "Initial: Express link shortener with Supabase and URL blocking"
```

### 4. Connect to Your GitHub Repository
```bash
git remote add origin https://github.com/Ishhak01/link-shortener.git
```

### 5. Rename Branch to Main
```bash
git branch -M main
```

### 6. Push to GitHub
```bash
git push -u origin main
```

---

## 🔧 If You Get Errors

| Error | Solution |
|-------|----------|
| `fatal: not a git repository` | Make sure you're in `C:\Users\ishha\Desktop\shortlink` |
| `fatal: remote origin already exists` | Run: `git remote remove origin` then re-add |
| `fatal: refusing to merge` | Your GitHub repo must be EMPTY (no README, .gitignore, etc.) when you create it |
| `Permission denied` | Use HTTPS (which you're doing) or generate SSH key |
| `Error: unknown repo or path` | Check that GitHub repo name is exactly `link-shortener` |

---

## ✅ After Successful Push

Your code is now on GitHub at: `https://github.com/Ishhak01/link-shortener`

### Next: Connect with Vercel

1. Go to [vercel.com](https://vercel.com) and sign up (free with GitHub)
2. Click "Add New Project"
3. Import GitHub repository: `link-shortener`
4. Vercel auto-detects Node.js settings
5. Add Environment Variables:
   - **Key**: `SUPABASE_URL`
   - **Value**: `https://scducnrzhvfvcoecowzr.supabase.co`
   - **Key**: `SUPABASE_ANON_KEY`
   - **Value**: `sb_publishable_OPhrylgdu4B7_AvfG7yagQ_rY9qVYQu`
6. Click "Deploy"

### Your Live URL
Vercel will give you something like: `https://link-shortener-xyz.vercel.app`

---

## 🗄️ Set Up Supabase Table

In your Supabase dashboard → SQL Editor, run:

```sql
create table if not exists urls (
  id uuid default gen_random_uuid() primary key,
  short_code text not null unique,
  original_url text not null,
  click_count integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  expires_at timestamp with time zone,
  is_blocked boolean default false,
  blocked_reason text,
  referrer_data jsonb default '{}'::jsonb
);

create index if not exists idx_urls_short_code on urls(short_code);
```

---

## 🎯 Complete Free Stack Checklist

| Component | Status | Service |
|-----------|--------|---------|
| **Code** | ✅ Ready | Node.js + Express |
| **Repository** | 📤 Push needed | GitHub (`Ishhak01/link-shortener`) |
| **Hosting** | ⏳ Next | Vercel (free) |
| **Database** | ✅ Configured | Supabase (`scducnrzhvfvcoecowzr`) |
| **Analytics** | ⏳ Next | Umami or Plausible |
| **Emails** | ⏳ Next | Resend (3,000/month free) |
| **Contact Form** | ⏳ Next | Tally (free) |

---

**Run the git commands in your terminal, then let me know when it's pushed and we'll move to Vercel deployment!**