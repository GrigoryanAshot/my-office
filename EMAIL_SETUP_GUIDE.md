# Email Configuration Setup Guide

## Problem
The admin login verification system is failing with the error: "Սխալ է տեղի ունեցել: Խնդրում ենք փորձել կրկին" (An error occurred: Please try again)

This happens because the email service is not properly configured to send verification codes.

## Solution

### Step 1: Set up Gmail App Password

1. **Enable 2-Factor Authentication** on your Gmail account (myofficearmenia@gmail.com)
   - Go to Google Account settings
   - Security → 2-Step Verification
   - Enable if not already enabled

2. **Generate App Password**:
   - Go to Google Account settings
   - Security → 2-Step Verification → App passwords
   - Select "Mail" as the app
   - Generate a new password
   - Copy the generated password (16 characters)

### Step 2: Configure Environment Variables

#### For Local Development:
Update your `.env.local` file with:

```env
EMAIL_USER=myofficearmenia@gmail.com
EMAIL_PASS=your_16_character_app_password_here
```

#### For Production (Vercel):
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Add these variables:
   - `EMAIL_USER` = `myofficearmenia@gmail.com`
   - `EMAIL_PASS` = `your_16_character_app_password_here`

### Step 3: Test the Configuration

1. **Local Testing**:
   ```bash
   npm run dev
   ```
   Then visit: `http://localhost:3000/api/test-email-config`

2. **Production Testing**:
   Visit: `https://your-domain.vercel.app/api/test-email-config`

### Step 4: Alternative Email Services

If Gmail doesn't work, you can use other services:

#### SendGrid:
```env
EMAIL_SERVICE=sendgrid
EMAIL_USER=apikey
EMAIL_PASS=your_sendgrid_api_key
```

#### Mailgun:
```env
EMAIL_SERVICE=mailgun
EMAIL_USER=your_mailgun_username
EMAIL_PASS=your_mailgun_password
```

### Step 5: Verify the Fix

After setting up the environment variables:

1. Restart your development server
2. Try the admin login again
3. The verification code should now be sent to your email

## Troubleshooting

### Common Issues:

1. **"Invalid credentials" error**:
   - Make sure you're using an App Password, not your regular Gmail password
   - Ensure 2-Factor Authentication is enabled

2. **"Connection timeout" error**:
   - Check your internet connection
   - Verify firewall settings

3. **"Service not configured" error**:
   - Ensure environment variables are set correctly
   - Restart the development server after changing .env.local

### Testing Commands:

```bash
# Test email configuration
curl http://localhost:3000/api/test-email-config

# Test sending verification code
curl -X POST http://localhost:3000/api/send-verification \
  -H "Content-Type: application/json" \
  -d '{"email":"myofficearmenia@gmail.com"}'
```

## Security Notes

- Never commit your `.env.local` file to version control
- Use different App Passwords for different environments
- Regularly rotate your App Passwords
- Consider using a dedicated email service for production

## Support

If you continue to have issues:
1. Check the browser console for detailed error messages
2. Check the server logs for email-related errors
3. Verify your Gmail account settings
4. Test with a different email service if needed 