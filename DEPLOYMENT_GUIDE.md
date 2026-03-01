# BuildShield - Complete Deployment Guide

This guide will walk you through deploying BuildShield from scratch. Follow each step carefully.

---

## Step 1: Set Up Supabase (Database)

### 1.1 Create Supabase Account
1. Go to https://supabase.com
2. Click "Start your project"
3. Sign up with GitHub or email
4. Verify your email

### 1.2 Create New Project
1. Click "New Project"
2. Organization: Select or create one
3. Project name: `buildshield`
4. Database password: **Save this somewhere safe!**
5. Region: Choose closest to your users (e.g., `US East`)
6. Click "Create new project"
7. Wait 2-3 minutes for project to be ready

### 1.3 Get Your API Keys
1. In your Supabase dashboard, click the Settings icon (gear) on left sidebar
2. Click "API" in the menu
3. Copy these values (you'll need them later):
   - **Project URL**: `https://xxxxxxxxxxxx.supabase.co`
   - **anon public**: `eyJ...` (long string)
   - Click "Reveal" next to `service_role secret` and copy it too

### 1.4 Create Database Tables
1. In Supabase dashboard, click "SQL Editor" on left sidebar
2. Click "New query"
3. Copy and paste the entire contents of `supabase/schema.sql` file
4. Click "Run" (green button)
5. You should see "Success. No rows returned"

---

## Step 2: Set Up Clerk (Authentication)

### 2.1 Create Clerk Account
1. Go to https://clerk.dev
2. Click "Get Started"
3. Sign up with GitHub or email
4. Verify your email

### 2.2 Create New Application
1. Click "Add application"
2. Application name: `BuildShield`
3. Click "Create application"

### 2.4 Get Your API Keys
1. You should see a page with API keys
2. Copy these values:
   - **Publishable key**: `pk_test_...`
   - **Secret key**: `sk_test_...`

### 2.5 Configure Authentication Methods
1. In left sidebar, click "User & Authentication" → "Email, Phone, Username"
2. Make sure these are enabled:
   - ✅ Email address (toggle ON)
   - ✅ Password (toggle ON)
   - ✅ Email verification link (toggle ON)
3. Click "Save"

### 2.6 Configure URLs (Important!)
1. In left sidebar, click "URLs & Endpoints"
2. Set these values:
   - **Sign-in URL**: `/sign-in`
   - **Sign-up URL**: `/sign-up`
   - **After sign-in URL**: `/dashboard`
   - **After sign-up URL**: `/dashboard`
   - **Application home**: `https://envelope-x.com` (or your domain)
3. Scroll to "Allowlist for redirect URLs"
4. Click "Add URL"
5. Add: `https://envelope-x.com/*`
6. Click "Save"

### 2.7 Set Up Webhook (Critical!)
This syncs Clerk users with your database.

1. In left sidebar, click "Webhooks"
2. Click "Add Endpoint"
3. Endpoint URL: `https://envelope-x.com/api/webhooks/clerk`
   - Note: Use your actual domain when you have it, or Vercel URL temporarily
4. Click "Create"
5. Scroll down to "Message Filtering"
6. Check only: ✅ `user.created`
7. Click "Save"
8. At top, click "Signing Secret" tab
9. Copy the secret: `whsec_...`

---

## Step 3: Get API Keys

### 3.1 Anthropic Claude API
1. Go to https://console.anthropic.com
2. Sign up with email
3. Verify email
4. Go to "API Keys" section
5. Click "Create Key"
6. Name: `BuildShield`
7. Copy the key: `sk-ant-api03-...`

### 3.2 Visual Crossing Weather API
1. Go to https://www.visualcrossing.com
2. Click "Sign Up" (free account)
3. Verify email
4. Log in
5. Go to "Account" → "API Key"
6. Copy your API key

---

## Step 4: Push Code to GitHub

### 4.1 Create GitHub Repository
1. Go to https://github.com
2. Log in to your account
3. Click "+" → "New repository"
4. Repository name: `buildshield`
5. Description: `Building Envelope Assessment Platform`
6. Make it Public or Private
7. **DO NOT** check "Add a README"
8. Click "Create repository"

### 4.2 Push Your Code
Open terminal/command prompt in your project folder:

```bash
# Navigate to your project
cd /path/to/buildshield-project

# Initialize git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit"

# Connect to GitHub (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/buildshield.git

# Push to GitHub
git branch -M main
git push -u origin main
```

If prompted, enter your GitHub username and password/token.

---

## Step 5: Deploy to Vercel

### 5.1 Create Vercel Account
1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub

### 5.2 Import Project
1. In Vercel dashboard, click "Add New..." → "Project"
2. Find `buildshield` in the list
3. Click "Import"

### 5.3 Configure Project
1. Project name: `buildshield`
2. Framework preset: Should auto-detect "Next.js"
3. Root directory: `./` (leave as is)
4. **DO NOT** click Deploy yet!
5. Click "Environment Variables" to expand

### 5.4 Add Environment Variables
Add each of these one by one:

| Name | Value |
|------|-------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `pk_test_...` (from Clerk) |
| `CLERK_SECRET_KEY` | `sk_test_...` (from Clerk) |
| `CLERK_WEBHOOK_SECRET` | `whsec_...` (from Clerk webhooks) |
| `NEXT_PUBLIC_SUPABASE_URL` | `https://...supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJ...` (anon key) |
| `SUPABASE_SERVICE_ROLE_KEY` | `eyJ...` (service role key) |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` |
| `VISUAL_CROSSING_API_KEY` | `your_visual_crossing_key` |
| `NEXT_PUBLIC_APP_URL` | `https://envelope-x.com` |

Click "Add" after each one.

### 5.5 Deploy
1. Click "Deploy"
2. Wait 2-5 minutes for build to complete
3. You should see "Congratulations! Your project has been deployed."
4. Click the URL (looks like `https://buildshield-xxx.vercel.app`)

---

## Step 6: Update Clerk Webhook URL

Since you now have a Vercel URL:

1. Go back to Clerk dashboard
2. Click "Webhooks"
3. Click your webhook endpoint
4. Change URL from `https://envelope-x.com/api/webhooks/clerk` to your actual Vercel URL:
   `https://buildshield-xxx.vercel.app/api/webhooks/clerk`
5. Click "Save"

---

## Step 7: Connect Custom Domain (envelope-x.com)

### 7.1 In Vercel
1. In your Vercel project, click "Settings" tab
2. Click "Domains" in left sidebar
3. Type: `envelope-x.com`
4. Click "Add"

### 7.2 In Namecheap (Your Domain Provider)
1. Log in to https://namecheap.com
2. Go to "Domain List"
3. Find `envelope-x.com`
4. Click "Manage"
5. Go to "Advanced DNS" tab
6. Delete any existing A records or CNAME records
7. Add new records:

**For root domain (envelope-x.com):**
- Type: `A Record`
- Host: `@`
- Value: `76.76.21.21` (Vercel's IP - get from Vercel dashboard)
- TTL: `Automatic`

**For www (www.envelope-x.com):**
- Type: `CNAME Record`
- Host: `www`
- Value: `cname.vercel-dns.com`
- TTL: `Automatic`

8. Click "Save All Changes"

### 7.3 Wait for DNS
- DNS changes can take 5 minutes to 48 hours
- In Vercel, you'll see the domain status change from "Invalid Configuration" to "Valid"

---

## Step 8: Update Environment Variables (After Domain Works)

Once your domain is working:

1. In Vercel dashboard, go to your project
2. Click "Settings" → "Environment Variables"
3. Find `NEXT_PUBLIC_APP_URL`
4. Click the three dots → "Edit"
5. Change value to: `https://envelope-x.com`
6. Click "Save"
7. Click "Deployments" tab
8. Find latest deployment
9. Click three dots → "Redeploy"
10. Click "Redeploy" again

Also update Clerk webhook URL back to your custom domain:
`https://envelope-x.com/api/webhooks/clerk`

---

## Step 9: Test Everything

### 9.1 Test Homepage
1. Go to `https://envelope-x.com`
2. You should see the BuildShield homepage
3. Click "Get Started" → should go to sign-up page

### 9.2 Test Sign Up
1. Enter email and password
2. Check your email for verification link
3. Click the link
4. You should be redirected to Dashboard
5. Check that you see "3 Credits" in the top right

### 9.3 Test Assessment
1. Click "New Assessment"
2. Fill in the form:
   - Address: `50 Saginaw Parkway, Cambridge, Ontario`
   - Roof Type: `Modified Bitumen (Mod-Bit)`
   - Roof Age: `20`
   - Building Use: `Educational/School`
3. Click "Generate Report"
4. Wait 1-2 minutes
5. You should see the report page with weather metrics

### 9.4 Test PDF Download
1. On report page, click "Download PDF"
2. PDF should download with professional styling

---

## Troubleshooting

### Build Fails
**Problem**: Vercel build fails
**Solution**: 
- Check build logs in Vercel dashboard
- Make sure all environment variables are set correctly
- Check that `package.json` has all dependencies

### Database Errors
**Problem**: "User not found" or database errors
**Solution**:
- Go to Supabase → SQL Editor
- Run the schema.sql again
- Check that tables were created in "Table Editor"

### Clerk Webhook Not Working
**Problem**: New users don't get 3 credits
**Solution**:
- Check webhook URL is correct in Clerk dashboard
- In Vercel, check Functions logs for webhook errors
- Make sure `CLERK_WEBHOOK_SECRET` is set correctly

### API Errors
**Problem**: Weather data or AI report fails
**Solution**:
- Check `ANTHROPIC_API_KEY` is valid
- Check `VISUAL_CROSSING_API_KEY` is valid
- Check Vercel Functions logs for error details

### Domain Not Working
**Problem**: envelope-x.com shows error
**Solution**:
- Check DNS records in Namecheap
- Wait longer (up to 48 hours)
- In Vercel, check domain status shows "Valid"

---

## Maintenance

### Update Code
```bash
# Make changes locally
git add .
git commit -m "Your changes"
git push origin main

# Vercel will auto-deploy
```

### View Logs
1. Vercel dashboard → your project
2. Click "Deployments"
3. Click latest deployment
4. Click "Functions" tab to see API logs

### Add More Credits to User (Manual)
If you need to manually add credits:
1. Go to Supabase → Table Editor
2. Click "users" table
3. Find the user
4. Edit `credits_remaining` field
5. Click "Save"

---

## Support

If you get stuck:
1. Check the logs in Vercel dashboard (Functions tab)
2. Check Clerk dashboard for auth issues
3. Check Supabase for database issues
4. Email: solutions@buildingenvelope.ca

---

## Checklist

Before going live, verify:
- [ ] Supabase project created
- [ ] Database tables created
- [ ] Clerk application created
- [ ] Webhook configured
- [ ] API keys obtained (Anthropic, Visual Crossing)
- [ ] Code pushed to GitHub
- [ ] Deployed to Vercel
- [ ] Environment variables set
- [ ] Custom domain connected
- [ ] Sign up works
- [ ] Assessment creation works
- [ ] PDF download works
- [ ] Credits system works

---

**You're all set!** 🎉
