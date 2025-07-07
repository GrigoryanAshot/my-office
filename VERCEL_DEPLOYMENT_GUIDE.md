# Vercel Deployment Guide

## Overview
This guide will help you deploy your Next.js application to Vercel with all the necessary configurations for the admin login system, email functionality, and Redis storage.

## Prerequisites
- Vercel account
- GitHub repository with your code
- Gmail account with App Password
- Upstash Redis database

## Step 1: Prepare Your Repository

### 1.1 Ensure All Files Are Committed
```bash
git add .
git commit -m "Prepare for Vercel deployment"
git push origin main
```

### 1.2 Verify Key Files Are Present
- `next.config.js` (updated for Vercel)
- `middleware.ts` (admin panel protection)
- `lib/emailConfig.ts` (email configuration)
- `lib/verificationStorage.ts` (Redis storage)
- All API routes in `app/api/`

## Step 2: Deploy to Vercel

### 2.1 Connect Your Repository
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Select the repository and click "Deploy"

### 2.2 Configure Build Settings
- **Framework Preset**: Next.js
- **Root Directory**: `./` (default)
- **Build Command**: `npm run build` (default)
- **Output Directory**: `.next` (default)
- **Install Command**: `npm install` (default)

## Step 3: Configure Environment Variables

### 3.1 Required Environment Variables
In your Vercel project dashboard, go to **Settings > Environment Variables** and add:

#### Email Configuration
```
EMAIL_USER=myofficearmenia@gmail.com
EMAIL_PASS=your_gmail_app_password_here
EMAIL_SERVICE=gmail
```

#### Redis Configuration (Upstash)
```
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

#### Security
```
JWT_SECRET=your_secure_jwt_secret_here
```

### 3.2 How to Get These Values

#### Gmail App Password
1. Go to [Google Account Security](https://myaccount.google.com/security)
2. Enable 2-Step Verification if not already enabled
3. Go to "App passwords"
4. Generate a new password for "Mail"
5. Use the 16-character password as `EMAIL_PASS`

#### Upstash Redis
1. Go to [Upstash Console](https://console.upstash.com/)
2. Create or select your Redis database
3. Copy the **REST URL** and **REST TOKEN**
4. Use these as `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`

#### JWT Secret
Generate a secure random string (at least 32 characters):
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Deploy and Test

### 4.1 Trigger Deployment
1. After setting environment variables, go to **Deployments**
2. Click "Redeploy" on your latest deployment
3. Wait for the build to complete

### 4.2 Test Your Application
1. Visit your Vercel domain (e.g., `https://your-app.vercel.app`)
2. Test the admin login:
   - Press `Ctrl+Shift+A` (or `Cmd+Shift+A` on Mac)
   - Enter your email: `myofficearmenia@gmail.com`
   - Click "Ուղարկել կոդ" (Send Code)
   - Check your email for the verification code
   - Enter the code and verify login

### 4.3 Verify Admin Panel Access
1. After successful verification, you should be redirected to `/admin-panel`
2. Test that you can access all admin panel features
3. Verify that the middleware protection works (try accessing `/admin-panel` without login)

## Step 5: Custom Domain (Optional)

### 5.1 Add Custom Domain
1. In Vercel dashboard, go to **Settings > Domains**
2. Add your custom domain
3. Follow the DNS configuration instructions
4. Wait for DNS propagation (can take up to 48 hours)

### 5.2 Update Environment Variables
If you're using a custom domain, you might want to update:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
```

## Troubleshooting

### Common Issues

#### 1. Email Not Sending
- Check that `EMAIL_USER` and `EMAIL_PASS` are correct
- Verify Gmail App Password is valid
- Check Vercel function logs for errors

#### 2. Redis Connection Issues
- Verify `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
- Check that your Upstash database is active
- Review Vercel function logs for connection errors

#### 3. Admin Panel Not Accessible
- Check that the `admin-verified` cookie is being set
- Verify middleware is working correctly
- Check browser console for any JavaScript errors

#### 4. Build Failures
- Check that all dependencies are in `package.json`
- Verify that all imports are correct
- Review build logs for specific error messages

### Debugging

#### Check Vercel Function Logs
1. Go to your Vercel dashboard
2. Click on a deployment
3. Go to **Functions** tab
4. Check logs for any errors

#### Test Environment Variables
Create a test API route to verify environment variables:
```typescript
// app/api/test-env/route.ts
export async function GET() {
  return Response.json({
    hasEmailUser: !!process.env.EMAIL_USER,
    hasEmailPass: !!process.env.EMAIL_PASS,
    hasRedisUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasRedisToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    nodeEnv: process.env.NODE_ENV,
  });
}
```

## Security Considerations

### 1. Environment Variables
- Never commit sensitive environment variables to your repository
- Use Vercel's environment variable system
- Rotate secrets regularly

### 2. HTTPS
- Vercel automatically provides HTTPS
- All cookies are set with `secure: true` in production

### 3. Rate Limiting
Consider implementing rate limiting for:
- Email sending (`/api/send-verification`)
- Code verification (`/api/verify-code`)
- Admin panel access

## Monitoring

### 1. Vercel Analytics
- Enable Vercel Analytics for performance monitoring
- Monitor function execution times
- Track error rates

### 2. Logs
- Monitor Vercel function logs
- Set up error tracking (e.g., Sentry)
- Monitor email delivery rates

## Maintenance

### 1. Regular Updates
- Keep Next.js and dependencies updated
- Monitor for security vulnerabilities
- Update environment variables as needed

### 2. Backup
- Regularly backup your Upstash Redis data
- Keep local copies of important configurations
- Document any custom configurations

## Support

If you encounter issues:
1. Check Vercel documentation
2. Review function logs
3. Test locally with production environment variables
4. Contact Vercel support if needed

---

**Your application should now be fully functional on Vercel with all features working as expected!** 