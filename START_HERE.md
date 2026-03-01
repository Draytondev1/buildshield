# 🚀 BuildShield - START HERE

Welcome! This folder contains everything you need to deploy BuildShield.

## 📁 What's In This Folder?

```
buildshield-project/
├── 📄 START_HERE.md          ← You are here!
├── 📄 QUICK_START.md         ← 9-step deployment checklist
├── 📄 DEPLOYMENT_GUIDE.md    ← Detailed step-by-step guide
├── 📄 ARCHITECTURE.md        ← How everything works
├── 📄 PROJECT_SUMMARY.md     ← What was built
├── 📄 README.md              ← General documentation
├── 📄 DEPLOYMENT.md          ← Deployment overview
├── 📄 .env.local.example     ← Environment variables template
│
├── 💻 app/                   ← All the code
│   ├── page.tsx              ← Homepage
│   ├── dashboard/            ← User dashboard
│   ├── new-assessment/       ← Assessment form
│   ├── reports/              ← Report pages
│   └── api/                  ← API routes
│
├── 🗄️ supabase/
│   └── schema.sql            ← Database setup
│
└── ⚙️ Configuration files    ← Next.js, Tailwind, etc.
```

## 🎯 What You Need to Do (Overview)

Deploying BuildShield requires setting up 5 services:

1. **Supabase** (Database) - Store users, reports, weather data
2. **Clerk** (Authentication) - Handle login/signup
3. **API Keys** - Claude AI + Weather data
4. **GitHub** (Code storage) - Store your code
5. **Vercel** (Hosting) - Run your website

Then connect your domain `envelope-x.com`.

---

## 📋 Step-by-Step (Simplified)

### Phase 1: Set Up Services (30 minutes)

**1. Supabase (Database)**
- Go to https://supabase.com
- Create account → New project
- Copy: Project URL, anon key, service_role key
- Run `schema.sql` in SQL Editor

**2. Clerk (Authentication)**
- Go to https://clerk.dev
- Create account → New application
- Copy: Publishable key, Secret key
- Set URLs: `/sign-in`, `/sign-up`, `/dashboard`
- Add webhook: `https://envelope-x.com/api/webhooks/clerk`
- Copy: Webhook signing secret

**3. API Keys**
- Anthropic: https://console.anthropic.com
- Visual Crossing: https://visualcrossing.com

### Phase 2: Deploy (20 minutes)

**4. GitHub**
- Create repo: `buildshield`
- Push code (commands in QUICK_START.md)

**5. Vercel**
- Go to https://vercel.com
- Sign up with GitHub
- Import `buildshield` repo
- Add all environment variables
- Deploy!

### Phase 3: Connect Domain (10 minutes + wait time)

**6. Domain Setup**
- In Vercel: Add domain `envelope-x.com`
- In Namecheap: Update DNS records
- Wait for DNS (5-60 minutes)

### Phase 4: Test (10 minutes)

**7. Verify Everything**
- Homepage loads
- Can sign up
- Get 3 credits
- Create assessment
- Download PDF

---

## 📚 Read These Files

| File | When to Read | What It Does |
|------|--------------|--------------|
| **QUICK_START.md** | ⭐ Start here | 9-step checklist with commands |
| **DEPLOYMENT_GUIDE.md** | If stuck | Detailed explanations |
| **ARCHITECTURE.md** | Curious | How everything connects |
| **PROJECT_SUMMARY.md** | Review | What was built |

---

## 🔑 Your API Keys (Save These!)

You'll collect these during setup:

```
┌────────────────────────────────────────┐
│  CLERK                                 │
│  ─────                                 │
│  Publishable: pk_test_...              │
│  Secret: sk_test_...                   │
│  Webhook: whsec_...                    │
├────────────────────────────────────────┤
│  SUPABASE                              │
│  ───────                               │
│  URL: https://...supabase.co           │
│  Anon: eyJ...                          │
│  Service: eyJ...                       │
├────────────────────────────────────────┤
│  APIS                                  │
│  ────                                  │
│  Anthropic: sk-ant-api03-...           │
│  Visual Crossing: ...                  │
└────────────────────────────────────────┘
```

---

## ⚠️ Common Issues

| Problem | Solution |
|---------|----------|
| Build fails | Check environment variables in Vercel |
| Can't sign up | Check Clerk webhook URL is correct |
| No credits | Check webhook secret is correct |
| Assessment fails | Check API keys are valid |
| Domain not working | Wait longer for DNS (up to 48 hours) |

---

## 🆘 Need Help?

1. **Check the logs**
   - Vercel: Dashboard → Functions tab
   - Clerk: Dashboard → Users → Logs
   - Supabase: Dashboard → Logs

2. **Read the guides**
   - QUICK_START.md for checklist
   - DEPLOYMENT_GUIDE.md for details

3. **Contact support**
   - Email: solutions@buildingenvelope.ca

---

## ✅ Pre-Deployment Checklist

Before you start, make sure you have:

- [ ] GitHub account
- [ ] Vercel account (use GitHub to sign up)
- [ ] Supabase account
- [ ] Clerk account
- [ ] Anthropic API key (with credits)
- [ ] Visual Crossing API key
- [ ] Domain (envelope-x.com at Namecheap)
- [ ] This project folder on your computer

---

## 🎬 Let's Begin!

**Ready?** Open `QUICK_START.md` and follow the 9 steps.

**Estimated time:** 60-90 minutes first time

**You've got this!** 💪

---

*BuildShield - Professional Building Envelope Assessment Platform*
*Built for Waterloo Intel (envelope-x.com)*
