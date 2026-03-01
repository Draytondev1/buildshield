# BuildShield Deployment Guide

This guide will walk you through deploying the BuildShield application to Vercel with all required services.

## Prerequisites

Before starting, ensure you have:
- GitHub account
- Vercel account
- Supabase account
- Clerk account
- Anthropic API key
- Visual Crossing Weather API key
- Domain name (envelope-x.com)

## Step 1: Set Up Supabase

1. Create a new Supabase project at https://supabase.com
2. Go to the SQL Editor
3. Run the schema from `supabase/schema.sql`
4. Note down your project URL and anon key from Settings > API
5. Generate a service role key (Settings > API > service_role key)

## Step 2: Set Up Clerk

1. Create a new application at https://clerk.dev
2. Configure authentication providers (Email/Password + Magic Links)
3. Note down your Publishable Key and Secret Key
4. Set up webhook:
   - Go to Webhooks in Clerk Dashboard
   - Add endpoint: `https://your-domain.com/api/webhooks/clerk`
   - Select events: `user.created`
   - Copy the Signing Secret

## Step 3: Get API Keys

### Anthropic Claude
1. Sign up at https://anthropic.com
2. Get API key from console

### Visual Crossing Weather
1. Sign up at https://visualcrossing.com
2. Get API key from account settings

## Step 4: Deploy to Vercel

### Option A: Deploy via Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy:
```bash
vercel
```

### Option B: Deploy via GitHub Integration

1. Push code to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/buildshield.git
git push -u origin main
```

2. Import project in Vercel:
   - Go to https://vercel.com/new
   - Import your GitHub repository
   - Select "Next.js" framework preset

## Step 5: Configure Environment Variables

In Vercel Dashboard > Project Settings > Environment Variables, add:

```
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_SUPABASE_URL=https://...
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-...
VISUAL_CROSSING_API_KEY=...
NEXT_PUBLIC_APP_URL=https://envelope-x.com
```

## Step 6: Configure Custom Domain

1. In Vercel Dashboard > Domains
2. Add `envelope-x.com`
3. Follow DNS configuration instructions:
   - Add A record pointing to Vercel's IP
   - Or add CNAME record for www subdomain

## Step 7: Update Clerk Redirect URLs

In Clerk Dashboard > URLs & Endpoints:
- Sign-in URL: `/sign-in`
- Sign-up URL: `/sign-up`
- After sign-in URL: `/dashboard`
- After sign-up URL: `/dashboard`
- Allowed redirect URLs: `https://envelope-x.com/*`

## Step 8: Test the Application

1. Visit https://envelope-x.com
2. Sign up for a new account
3. Verify you receive 3 free credits
4. Create a new assessment
5. Download the PDF report

## Troubleshooting

### Build Errors
- Check that all environment variables are set
- Verify Node.js version is 18+
- Check build logs in Vercel Dashboard

### Database Errors
- Verify Supabase schema is applied correctly
- Check RLS policies are configured
- Verify service role key has correct permissions

### API Errors
- Check API keys are valid
- Verify rate limits haven't been exceeded
- Check Vercel function logs

### Authentication Errors
- Verify Clerk webhook is configured correctly
- Check webhook secret is correct
- Verify redirect URLs match

## Maintenance

### Updating Dependencies
```bash
npm update
npm audit fix
```

### Database Migrations
When updating schema:
1. Test changes in Supabase SQL Editor
2. Update schema.sql file
3. Document changes in CHANGELOG.md

### Monitoring
- Set up Vercel Analytics
- Configure error tracking (Sentry recommended)
- Monitor Supabase usage

## Support

For deployment issues:
1. Check Vercel documentation: https://vercel.com/docs
2. Check Next.js documentation: https://nextjs.org/docs
3. Contact support: solutions@buildingenvelope.ca

## Security Checklist

- [ ] All API keys stored in environment variables
- [ ] Clerk webhook secret configured
- [ ] Supabase RLS policies enabled
- [ ] Service role key not exposed to frontend
- [ ] HTTPS enabled on custom domain
- [ ] Rate limiting configured
- [ ] Input validation on all API routes
