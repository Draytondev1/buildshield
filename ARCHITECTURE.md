# BuildShield - System Architecture

This diagram shows how all the pieces of BuildShield work together.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              USER BROWSER                                    │
│  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐             │
│  │   Homepage      │  │  Sign Up/Sign   │  │   Dashboard     │             │
│  │                 │  │     In          │  │                 │             │
│  └────────┬────────┘  └────────┬────────┘  └────────┬────────┘             │
└───────────┼────────────────────┼────────────────────┼──────────────────────┘
            │                    │                    │
            ▼                    ▼                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                         VERCEL (Next.js App)                                 │
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         NEXT.JS APP ROUTER                           │   │
│  │                                                                      │   │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌────────────┐ │   │
│  │  │  Homepage   │  │   Auth      │  │  Dashboard  │  │  New       │ │   │
│  │  │    Page     │  │   Pages     │  │    Page     │  │ Assessment │ │   │
│  │  └─────────────┘  └─────────────┘  └─────────────┘  └────────────┘ │   │
│  │                                                                      │   │
│  │  ┌────────────────────────────────────────────────────────────────┐ │   │
│  │  │                      API ROUTES                                 │ │   │
│  │  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐          │ │   │
│  │  │  │ /assess  │ │ /reports │ │ /credits │ │ /webhooks│          │ │   │
│  │  │  │   POST   │ │   GET    │ │   GET    │ │  /clerk  │          │ │   │
│  │  │  └────┬─────┘ └────┬─────┘ └────┬─────┘ └────┬─────┘          │ │   │
│  │  └───────┼────────────┼────────────┼────────────┼────────────────┘ │   │
│  └──────────┼────────────┼────────────┼────────────┼──────────────────┘   │
└─────────────┼────────────┼────────────┼────────────┼──────────────────────┘
              │            │            │            │
              ▼            ▼            ▼            ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           EXTERNAL SERVICES                                  │
│                                                                              │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐        │
│  │   CLERK    │  │  SUPABASE   │  │ ANTHROPIC  │  │   VISUAL    │        │
│  │   (Auth)   │  │ (Database)  │  │  (Claude)  │  │  CROSSING   │        │
│  │            │  │             │  │            │  │  (Weather)  │        │
│  │ • Sign up  │  │ • Users     │  │ • AI       │  │ • 20-year   │        │
│  │ • Sign in  │  │ • Reports   │  │   Report   │  │   history   │        │
│  │ • Webhooks │  │ • Weather   │  │   Gen      │  │ • Metrics   │        │
│  │            │  │   Cache     │  │            │  │             │        │
│  └─────────────┘  └─────────────┘  └─────────────┘  └─────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

## Data Flow: Creating an Assessment

```
1. USER fills out form
   │
   ▼
2. NEXT.JS receives POST /api/assess
   │
   ├──► 3. Check credits (Supabase)
   │
   ├──► 4. Geocode address (OpenStreetMap)
   │
   ├──► 5. Check weather cache (Supabase)
   │       │
   │       ├──► Cache miss? Fetch from Visual Crossing
   │       │
   │       └──► Save to cache
   │
   ├──► 6. Calculate metrics
   │
   ├──► 7. Create report (Supabase)
   │
   ├──► 8. Deduct credit (Supabase)
   │
   └──► 9. Generate AI report (Claude) ← Async
            │
            └──► Update report with AI content
   │
   ▼
10. Return report ID to user
```

## Database Schema

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│     users       │     │     reports     │     │  weather_cache  │
├─────────────────┤     ├─────────────────┤     ├─────────────────┤
│ user_id (PK)    │◄────┤ user_id (FK)    │     │ location_key(PK)│
│ email           │     │ id (PK)         │     │ latitude        │
│ first_name      │     │ property_address│     │ longitude       │
│ last_name       │     │ roof_type       │     │ metrics (JSON)  │
│ credits_remaining│    │ roof_age        │     │ expires_at      │
│ role            │     │ building_use    │     └─────────────────┘
│ created_at      │     │ weather_metrics │
└─────────────────┘     │ ai_report       │
                        │ pdf_url         │
                        │ status          │
                        │ created_at      │
                        └─────────────────┘
```

## File Structure

```
buildshield-project/
│
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Homepage
│   ├── layout.tsx                # Root layout with Clerk
│   ├── globals.css               # Global styles
│   │
│   ├── sign-in/[[...sign-in]]/   # Sign in page
│   ├── sign-up/[[...sign-up]]/   # Sign up page
│   │
│   ├── dashboard/                # User dashboard
│   ├── new-assessment/           # Assessment form
│   ├── purchase-credits/         # Credits page
│   ├── reports/[id]/             # Report detail page
│   │
│   └── api/                      # API routes
│       ├── assess/route.ts       # Create assessment
│       ├── credits/route.ts      # Get credits
│       ├── reports/route.ts      # List reports
│       ├── reports/[id]/route.ts # Get report
│       ├── reports/[id]/pdf/     # Generate PDF
│       └── webhooks/clerk/       # Clerk webhook
│
├── lib/
│   ├── supabase.ts               # Supabase clients
│   └── utils.ts                  # Utility functions
│
├── types/
│   └── index.ts                  # TypeScript types
│
├── supabase/
│   └── schema.sql                # Database schema
│
├── middleware.ts                 # Clerk middleware
├── tailwind.config.ts            # Tailwind config
├── next.config.mjs               # Next.js config
└── package.json                  # Dependencies
```

## Environment Variables

These connect your app to external services:

```
┌─────────────────────────────────────────────────────────────┐
│  CLERK (Authentication)                                      │
│  ─────────────────────                                       │
│  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY  →  Frontend auth         │
│  CLERK_SECRET_KEY                   →  Backend auth          │
│  CLERK_WEBHOOK_SECRET               →  User creation sync    │
├─────────────────────────────────────────────────────────────┤
│  SUPABASE (Database)                                         │
│  ───────────────────                                         │
│  NEXT_PUBLIC_SUPABASE_URL           →  Database connection   │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY      →  Frontend queries      │
│  SUPABASE_SERVICE_ROLE_KEY          →  Backend admin         │
├─────────────────────────────────────────────────────────────┤
│  EXTERNAL APIs                                               │
│  ─────────────                                               │
│  ANTHROPIC_API_KEY                  →  Claude AI             │
│  VISUAL_CROSSING_API_KEY            →  Weather data          │
├─────────────────────────────────────────────────────────────┤
│  APP CONFIG                                                  │
│  ──────────                                                  │
│  NEXT_PUBLIC_APP_URL                →  Your domain           │
└─────────────────────────────────────────────────────────────┘
```

## Security

```
┌─────────────────────────────────────────────────────────────┐
│  SECURITY LAYERS                                             │
├─────────────────────────────────────────────────────────────┤
│  1. CLERK MIDDLEWARE                                         │
│     └── Protects /dashboard, /new-assessment, /reports/*     │
│                                                              │
│  2. SUPABASE RLS (Row Level Security)                        │
│     └── Users can only see their own data                    │
│                                                              │
│  3. API VALIDATION                                           │
│     └── All inputs validated before processing               │
│                                                              │
│  4. CREDIT CHECK                                             │
│     └── Can't create report without credits                  │
│                                                              │
│  5. WEBHOOK VERIFICATION                                     │
│     └── Clerk webhooks verified with secret                  │
└─────────────────────────────────────────────────────────────┘
```

## Credit System Flow

```
User Signs Up
     │
     ▼
┌─────────────┐
│ Clerk sends │
│ webhook     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Create user │
│ in Supabase │
│ credits = 3 │
└──────┬──────┘
       │
       ▼
User Creates Assessment
       │
       ▼
┌─────────────┐
│ Check       │
│ credits > 0 │
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
  Yes     No
   │       │
   ▼       ▼
┌──────┐ ┌──────────┐
│Create│ │"Purchase │
│Report│ │ Credits" │
└──┬───┘ └──────────┘
   │
   ▼
┌─────────────┐
│ credits - 1 │
└─────────────┘
```

## Key Technologies

| Layer | Technology | Purpose |
|-------|------------|---------|
| Frontend | Next.js 14 + React | Web application |
| Styling | Tailwind CSS | Styling |
| Auth | Clerk | User authentication |
| Database | Supabase (PostgreSQL) | Data storage |
| AI | Claude 3.5 Sonnet | Report generation |
| Weather | Visual Crossing | Historical weather |
| PDF | Puppeteer | PDF generation |
| Hosting | Vercel | Deployment |

---

This architecture is:
- **Scalable**: Serverless functions handle load
- **Secure**: Multiple layers of protection
- **Maintainable**: Clear separation of concerns
- **Cost-effective**: Pay only for what you use
