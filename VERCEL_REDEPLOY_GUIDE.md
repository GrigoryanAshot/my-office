# Vercel Redeploy Guide - SEO Updates

## 🚀 Quick Redeploy Options

You have **3 options** to redeploy your SEO changes to Vercel:

---

## Option 1: Auto-Deploy via GitHub (Recommended) ⭐

If your Vercel project is connected to GitHub:

### Steps:
1. **Push to GitHub** (if not already done):
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/my-office.am.git
   git push -u origin main
   ```

2. **Vercel will automatically deploy** when you push to the main branch
   - Go to your Vercel dashboard
   - You'll see a new deployment starting automatically
   - Wait for it to complete (usually 2-5 minutes)

3. **Verify deployment**:
   - Check the deployment status in Vercel dashboard
   - Visit your site and test the SEO changes

---

## Option 2: Manual Redeploy in Vercel Dashboard

If you want to redeploy immediately without pushing to GitHub:

### Steps:
1. **Go to Vercel Dashboard**: https://vercel.com/dashboard
2. **Select your project**: `my-office.am` (or your project name)
3. **Go to Deployments tab**
4. **Click the "..." menu** on your latest deployment
5. **Select "Redeploy"**
6. **Confirm** and wait for deployment to complete

**Note**: This redeploys the last committed code. Make sure your local changes are committed first!

---

## Option 3: Deploy via Vercel CLI

If you have Vercel CLI installed:

### Steps:
1. **Install Vercel CLI** (if not installed):
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   cd "c:\Users\user\Desktop\Codeing\my projects\my-office.am"
   vercel --prod
   ```

---

## ✅ After Deployment - Test SEO

### 1. Test with Google Rich Results Test

1. **Visit**: https://search.google.com/test/rich-results
2. **Enter your deployed URL**:
   - Category page: `https://your-site.vercel.app/softfurniture/sofas`
   - Product page: `https://your-site.vercel.app/softfurniture/sofas/1`
3. **Verify schemas**:
   - ✅ CollectionPage schema (for category pages)
   - ✅ BreadcrumbList schema
   - ✅ Product schema (for product pages)

### 2. Test Pages to Check

**Category Pages** (should have Collection + Breadcrumb schemas):
- `/softfurniture/sofas`
- `/softfurniture/armchairs`
- `/softfurniture/poufs`
- `/other/whiteboard`
- `/other/wall_decor`
- `/other/hangers`
- `/other/podium`

**Product Pages** (should have Product schema):
- `/softfurniture/sofas/[id]`
- `/softfurniture/armchairs/[id]`
- `/softfurniture/poufs/[id]`
- `/other/whiteboard/[id]`

### 3. View Page Source

Check that metadata is present:
- `<title>` with optimized keywords
- `<meta name="description">`
- `<meta name="keywords">`
- JSON-LD schemas in `<script type="application/ld+json">`

---

## 🔍 Verify Environment Variables

Make sure these are set in Vercel (Settings > Environment Variables):

### Required for SEO:
- ✅ All existing variables (Redis, Email, etc.)

### New SEO Features Don't Require New Variables:
- ✅ All SEO features work with existing setup
- ✅ No additional environment variables needed

---

## 📊 Deployment Checklist

Before redeploying, verify:

- [x] All SEO changes are committed
- [ ] Code is pushed to GitHub (if using auto-deploy)
- [ ] Environment variables are set in Vercel
- [ ] Ready to test after deployment

---

## 🐛 Troubleshooting

### Build Fails

**Error**: TypeScript errors or build errors
**Solution**: 
1. Check build logs in Vercel dashboard
2. Run `npm run build` locally to catch errors
3. Fix any TypeScript/import errors

### SEO Not Working After Deploy

**Check**:
1. View page source - are schemas present?
2. Check browser console for errors
3. Verify Redis connection (for product data)
4. Check Vercel function logs

### Environment Variables Missing

**Solution**:
1. Go to Vercel Settings > Environment Variables
2. Add any missing variables
3. Redeploy after adding variables

---

## 🎯 Quick Commands

```bash
# Check git status
git status

# Commit changes (if any)
git add .
git commit -m "SEO updates"

# Push to GitHub (triggers auto-deploy)
git push origin main

# Or deploy directly with Vercel CLI
vercel --prod
```

---

## 📝 What's Being Deployed

Your deployment includes:

✅ **7 Category Pages** with full SEO:
- Sofas, Armchairs, Poufs
- Whiteboard, Wall Decor, Hangers, Podium

✅ **Product Pages** with SEO metadata:
- Dynamic titles, descriptions, keywords
- Product schema (JSON-LD)
- OpenGraph and Twitter cards

✅ **SEO Utilities**:
- Keyword system (Armenian + Translit + English)
- Metadata generators
- Schema components

---

**Ready to deploy?** Choose one of the options above! 🚀

