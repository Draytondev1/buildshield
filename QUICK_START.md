# BuildShield - Quick Start Checklist

## What You Need Before Starting

1. **GitHub account** (free) - https://github.com
2. **Vercel account** (free) - https://vercel.com
3. **Supabase account** (free tier works) - https://supabase.com
4. **Clerk account** (free tier works) - https://clerk.dev
5. **Anthropic API key** (need credits) - https://console.anthropic.com
6. **Visual Crossing API key** (free tier works) - https://visualcrossing.com
7. **Your domain** (envelope-x.com at Namecheap)

---

## The 9 Steps to Go Live

### Step 1: Supabase (Database) - 10 minutes
- [ ] Create account at supabase.com
- [ ] Create new project named "buildshield"
- [ ] Save your password somewhere safe
- [ ] Go to Settings → API
- [ ] Copy: Project URL, anon key, service_role key
- [ ] Go to SQL Editor
- [ ] Run the schema.sql file (copy/paste)

### Step 2: Clerk (Login System) - 10 minutes
- [ ] Create account at clerk.dev
- [ ] Create new app named "BuildShield"
- [ ] Copy: Publishable key, Secret key
- [ ] Go to URLs & Endpoints
- [ ] Set: Sign-in URL = `/sign-in`
- [ ] Set: Sign-up URL = `/sign-up`
- [ ] Set: After sign-in = `/dashboard`
- [ ] Set: After sign-up = `/dashboard`
- [ ] Add redirect URL: `https://envelope-x.com/*`
- [ ] Go to Webhooks
- [ ] Add endpoint: `https://envelope-x.com/api/webhooks/clerk`
- [ ] Select event: `user.created`
- [ ] Copy: Signing Secret

### Step 3: API Keys - 5 minutes
- [ ] Get Anthropic API key (console.anthropic.com)
- [ ] Get Visual Crossing API key (visualcrossing.com)

### Step 4: GitHub - 5 minutes
- [ ] Create new repository named "buildshield"
- [ ] Don't add README
- [ ] Push your code:
```bash
cd /path/to/buildshield-project
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOURNAME/buildshield.git
git push -u origin main
```

### Step 5: Vercel (Hosting) - 15 minutes
- [ ] Sign up at vercel.com with GitHub
- [ ] Click "Add New Project"
- [ ] Import your buildshield repo
- [ ] **BEFORE clicking Deploy**, add all environment variables:

| Variable | Value |
|----------|-------|
| NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY | pk_test_... |
| CLERK_SECRET_KEY | sk_test_... |
| CLERK_WEBHOOK_SECRET | whsec_... |
| NEXT_PUBLIC_SUPABASE_URL | https://... |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | eyJ... |
| SUPABASE_SERVICE_ROLE_KEY | eyJ... |
| ANTHROPIC_API_KEY | sk-ant-... |
| VISUAL_CROSSING_API_KEY | ... |
| NEXT_PUBLIC_APP_URL | https://envelope-x.com |

- [ ] Click Deploy
- [ ] Wait for build to finish

### Step 6: Update Webhook URL - 2 minutes
- [ ] Go back to Clerk → Webhooks
- [ ] Change webhook URL to your Vercel URL temporarily
- [ ] Format: `https://buildshield-xxx.vercel.app/api/webhooks/clerk`

### Step 7: Connect Domain - 10 minutes
- [ ] In Vercel: Settings → Domains
- [ ] Add domain: `envelope-x.com`
- [ ] In Namecheap: Domain List → Manage → Advanced DNS
- [ ] Delete old records
- [ ] Add A Record: Host=@, Value=76.76.21.21
- [ ] Add CNAME: Host=www, Value=cname.vercel-dns.com
- [ ] Save
- [ ] Wait 5-60 minutes for DNS to propagate

### Step 8: Update Environment Variables - 5 minutes
- [ ] In Vercel: Settings → Environment Variables
- [ ] Update NEXT_PUBLIC_APP_URL to `https://envelope-x.com`
- [ ] Redeploy the project
- [ ] Update Clerk webhook back to `https://envelope-x.com/api/webhooks/clerk`

### Step 9: Test - 10 minutes
- [ ] Visit https://envelope-x.com
- [ ] Click "Get Started"
- [ ] Create account
- [ ] Verify email
- [ ] Check you have 3 credits
- [ ] Create test assessment
- [ ] Download PDF

---

## Common Mistakes to Avoid

❌ **Don't** deploy to Vercel without setting environment variables first
❌ **Don't** forget to run the SQL schema in Supabase
❌ **Don't** use the wrong webhook URL (update it after getting Vercel URL)
❌ **Don't** panic if domain takes time (DNS can be slow)

---

## If Something Breaks

**Website won't load?**
→ Check Vercel dashboard for build errors

**Can't sign up?**
→ Check Clerk dashboard → User list for errors

**No credits after signup?**
→ Check webhook is working (Clerk → Webhooks → Logs)

**Assessment fails?**
→ Check Vercel Functions logs for API errors

---

## Your API Keys Summary

Keep this safe:

```
Clerk Publishable: pk_test_...
Clerk Secret: sk_test_...
Clerk Webhook: whsec_...

Supabase URL: https://...
Supabase Anon: eyJ...
Supabase Service: eyJ...

Anthropic: sk-ant-...
Visual Crossing: ...
```

---

## Total Time Estimate

- **First time**: 60-90 minutes
- **If you've done it before**: 30 minutes
- **DNS propagation**: Additional 5-60 minutes

---

## Need Help?

1. Check DEPLOYMENT_GUIDE.md for detailed steps
2. Check logs in Vercel dashboard
3. Email: solutions@buildingenvelope.ca

**You've got this!** 🚀
