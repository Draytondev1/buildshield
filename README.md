# BuildShield - Building Envelope Assessment Platform

A professional building envelope assessment platform powered by 30-year historical weather data analysis and AI-powered expert reports.

## Features

- **Professional Assessments**: Generate comprehensive building envelope reports with weather stress analysis
- **30-Year Weather Data**: Analyze historical weather patterns including freeze-thaw cycles, precipitation, thermal shock events
- **AI-Powered Reports**: Expert assessments from AI-generated fictional experts (Roofing Consultant, Building Engineer, Climate Specialist)
- **PDF Generation**: Download professional PDF reports with charts and expert analysis
- **Credit System**: 3 free credits for new users, with purchase options for additional assessments
- **Secure Authentication**: Clerk-powered authentication with protected routes

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (serverless)
- **Auth**: Clerk (email/password + magic links)
- **Database**: Supabase (PostgreSQL + Storage)
- **AI**: Anthropic Claude 3.5 Sonnet
- **Weather API**: Visual Crossing (20-year historical data)
- **PDF Generation**: Puppeteer

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account
- Clerk account
- Anthropic API key
- Visual Crossing API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/buildshield.git
cd buildshield
```

2. Install dependencies:
```bash
npm install
```

3. Copy environment variables:
```bash
cp .env.local.example .env.local
```

4. Fill in your environment variables in `.env.local`

5. Set up Supabase database:
   - Go to your Supabase project SQL Editor
   - Run the SQL from `supabase/schema.sql`

6. Run the development server:
```bash
npm run dev
```

7. Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | Clerk publishable key | Yes |
| `CLERK_SECRET_KEY` | Clerk secret key | Yes |
| `CLERK_WEBHOOK_SECRET` | Clerk webhook secret | Yes |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon key | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key | Yes |
| `ANTHROPIC_API_KEY` | Anthropic Claude API key | Yes |
| `VISUAL_CROSSING_API_KEY` | Visual Crossing Weather API key | Yes |

## Database Schema

### Tables

- **users**: User accounts synced with Clerk, credits tracking
- **reports**: Generated assessment reports with weather metrics
- **weather_cache**: Cached weather data (30-day expiry)
- **credit_transactions**: Audit trail for credit purchases/usage
- **rate_limits**: Daily request limiting per user

## API Routes

| Route | Method | Description | Auth Required |
|-------|--------|-------------|---------------|
| `/api/assess` | POST | Create new assessment | Yes |
| `/api/reports` | GET | List user's reports | Yes |
| `/api/reports/[id]` | GET | Get specific report | Yes |
| `/api/reports/[id]/pdf` | GET | Download report PDF | Yes |
| `/api/credits` | GET | Get user's credits | Yes |
| `/api/webhooks/clerk` | POST | Clerk webhook handler | No |

## Weather Metrics Calculated

- **Freeze-Thaw Days**: Days crossing 0°C annually
- **Annual Precipitation**: Total rainfall + snowfall (mm)
- **Thermal Shock Events**: Temperature changes >10°C in 3 hours
- **High Humidity Hours**: Hours with >90% relative humidity
- **Extreme Temperature Events**: Hours <-20°C or >30°C
- **Temperature Range**: Max - Min temperature over 20 years
- **Heavy Rain Events**: Days with >25mm precipitation

## Roof Types Supported

- Modified Bitumen (Mod-Bit)
- TPO Single-Ply Membrane
- EPDM Single-Ply Membrane
- PVC Single-Ply Membrane
- Built-Up Roofing (BUR)
- Metal Standing Seam
- Asphalt Shingles
- Green/Vegetative Roof
- Spray Polyurethane Foam (SPF)
- Concrete/Inverted Assembly

## Building Use Types

- Educational/School
- Office/Commercial
- Industrial/Warehouse
- Retail/Mixed-Use
- Healthcare/Institutional
- Multi-Residential
- Municipal/Government
- Religious/Community

## Deployment

### Vercel

1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Custom Domain

1. Add domain in Vercel project settings
2. Configure DNS records with your domain provider
3. Wait for SSL certificate provisioning

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details

## Support

For support, email solutions@buildingenvelope.ca or visit our website at envelope-x.com

## Acknowledgments

- Weather data provided by Visual Crossing
- AI analysis powered by Anthropic Claude
- Built with Next.js and Supabase
