# GitHub Push Guide

## ✅ Step 1: Create a GitHub Repository

1. Go to https://github.com/new
2. Create a new repository:
   - **Repository name**: `my-office.am` (or your preferred name)
   - **Visibility**: Private or Public (your choice)
   - **DO NOT** initialize with README, .gitignore, or license (we already have these)
3. Click **"Create repository"**

## ✅ Step 2: Add Remote and Push

After creating the repository, GitHub will show you commands. Use these:

### Option A: If you haven't pushed anything yet (our case)

```bash
cd "c:\Users\user\Desktop\Codeing\my projects\my-office.am"
git remote add origin https://github.com/YOUR_USERNAME/my-office.am.git
git branch -M main
git push -u origin main
```

**Replace `YOUR_USERNAME` with your GitHub username!**

### Option B: If you already have a repository URL

```bash
cd "c:\Users\user\Desktop\Codeing\my projects\my-office.am"
git remote add origin YOUR_REPOSITORY_URL
git branch -M main
git push -u origin main
```

## ✅ Step 3: Verify Push

After pushing, check your GitHub repository to see all files uploaded.

## 🔐 Authentication

If you're asked for credentials:
- **Username**: Your GitHub username
- **Password**: Use a **Personal Access Token** (not your GitHub password)
  - Create one at: https://github.com/settings/tokens
  - Select scope: `repo` (full control of private repositories)

## 📝 Quick Commands Reference

```bash
# Check status
git status

# Add all changes
git add .

# Commit changes
git commit -m "Your commit message"

# Push to GitHub
git push origin main

# Check remote
git remote -v
```

---

## 🚀 After Pushing

Once your code is on GitHub, you can:

1. **Test with Google Rich Results Test**:
   - Deploy your site (Vercel, Netlify, etc.)
   - Visit: https://search.google.com/test/rich-results
   - Enter your deployed URL
   - Test category pages like: `https://your-site.com/softfurniture/sofas`

2. **Share the repository** with team members

3. **Set up CI/CD** for automatic deployments

---

**Need help?** Let me know if you encounter any issues!

