# 📤 GitHub Repository Setup Guide

## Prerequisites
- GitHub account (free at github.com)
- Node.js project already created (you have this ✅)

## Step 1: Create New Repository on GitHub

### 1.1 Go to GitHub
Navigate to: **[github.com](https://github.com)**

### 1.2 Create New Repository
1. Click the **+** button in top-right corner
2. Select **"New repository"**
3. Fill in the form:

| Setting | Value |
|---------|-------|
| **Repository name** | `link-shortener` |
| **Description** | (Optional) "Free link shortener with URL blocking" |
| **Visibility** | Select **Public** (recommended for free tier) or **Private** |
| **Add a README** | ❌ **UNCHECK** this box |
| **Add .gitignore** | ❌ **UNCHECK** this box |
| **Add a license** | Skip or choose one |

### 1.3 Click "Create Repository"

---

## Step 2: Push Your Existing Code

### 2.1 Open Terminal/Command Prompt
Navigate to your project folder:
```bash
cd C:\Users\ishha\Desktop\shortlink
```

### 2.2 Run These Commands (one at a time):

```bash
# Initialize git repository
git init

# Add all project files
git add .

# Create initial commit
git commit -m "Initial: Express link shortener with URL blocking and Supabase integration"
```

### 2.3 Get GitHub Commands

After creating the repo, GitHub will show you "quick setup" commands. **OR** use these standard commands:

```bash
# Replace YOUR-USERNAME with your actual GitHub username
git remote add origin https://github.com/YOUR-USERNAME/link-shortener.git

# Rename branch to main
git branch -M main

# Push to GitHub
git push -u origin main
```

---

## Step 3: Optional - Add .gitignore

To exclude node_modules (saves space and time on GitHub):

```bash
# Create .gitignore file
echo "node_modules/" > .gitignore
echo "package-lock.json" >> .gitignore

# Add and commit
git add .gitignore
git commit -m "Add gitignore for node_modules"
git push -u origin main
```

---

## ✅ What Happens After Push

### 3.1 Vercel Deployment
1. Go to [vercel.com](https://vercel.com) and sign up (free)
2. Click "Add New Project" 
3. Import your GitHub repository (`link-shortener`)
4. Vercel auto-detects Node.js settings
5. Add Environment Variables:
   - `SUPABASE_URL`: Your Supabase project URL
   - `SUPABASE_ANON_KEY`: Your Supabase anon key
6. Click "Deploy"

### 3.2 Your Live Shortener
- Vercel gives you a free URL like: `https://link-shortener-xyz.vercel.app`
- HTTPS is automatic via Let's Encrypt
- Your Express app is now running worldwide!

---

## 📝 Notes

- **First push may take 1-2 minutes**
- If you get errors, check that GitHub repo is empty (no README, .gitignore, etc.)
- You can always add more files later and push again
- Your Supabase database will persist independently of GitHub/Vercel

---

## 🆘 Troubleshooting

| Error | Solution |
|-------|----------|
| `fatal: remote origin already exists` | `git remote remove origin` then re-add |
| `fatal: refusing to merge` | Make sure GitHub repo has NO files initially |
| `Permission denied (publickey)` | Use HTTPS instead of SSH, or generate SSH key |
| `Everything up-to-date` | Run `git push -u origin main` force if needed |

---

**Ready to create your GitHub repo? Follow the steps above, then let me know when it's pushed and we'll move to Step 3c: Vercel deployment!**