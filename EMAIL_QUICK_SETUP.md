# Quick Email Setup for Admin Verification

## Quick Fix (For Now)
Use the **"Skip verification (Dev mode)"** button in the popup to access the admin panel without email setup.

## To Enable Email Verification

### Step 1: Get Gmail App Password

1. Go to your Google Account: https://myaccount.google.com/
2. Go to **Security** → **2-Step Verification** (enable if not enabled)
3. Go to **App passwords**: https://myaccount.google.com/apppasswords
4. Select **Mail** and **Other (Custom name)** → Enter "My Office Admin"
5. Click **Generate**
6. Copy the 16-character password (e.g., `abcd efgh ijkl mnop`)

### Step 2: Add to .env File

Open your `.env` file in the project root and add:

```env
EMAIL_USER=myofficearmenia@gmail.com
EMAIL_PASS=your_16_character_app_password_here
```

**Important:** 
- Remove spaces from the app password (e.g., `abcdefghijklmnop`)
- Don't use your regular Gmail password - only App Password works

### Step 3: Restart Dev Server

After adding the variables:
1. Stop the dev server (Ctrl+C)
2. Start it again: `npm run dev`
3. Try the verification again

### Step 4: Test

Visit: `http://localhost:3000/api/test-email-config` to verify email is configured.

---

**Note:** For production (Vercel), add the same variables in Vercel Dashboard → Settings → Environment Variables.
