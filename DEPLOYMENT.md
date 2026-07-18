# 🚀 Portfolio Deployment Guide
## Vercel + Supabase

---

## Overview

Your portfolio is a **Next.js 16** application with:
- **Supabase** (PostgreSQL) as the database via Prisma v7 + `@prisma/adapter-pg`
- **Vercel** for hosting
- **Admin panel** at `/admin` for managing content (no auth on public portfolio)

---

## Step 1: Set Up Supabase

### 1.1 Create a Supabase Project
1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Give it a name (e.g., `portfolio-db`), set a strong password, choose your region
4. Wait ~2 minutes for the project to spin up

### 1.2 Get Connection Strings
Go to: **Project Settings → Database → Connection string**

You need **two** URLs:

| Variable | Where to find | Which URL |
|---|---|---|
| `DATABASE_URL` | Connection → **Transaction** pooler | Port **6543** (e.g., `postgresql://postgres.xxxx:password@aws-0-us-east-1.pooler.supabase.com:6543/postgres`) |
| `DIRECT_URL` | Connection → **Session** pooler OR Direct connection | Port **5432** |

> **Important:** The `DATABASE_URL` (port 6543) uses PgBouncer connection pooling — used at runtime.  
> The `DIRECT_URL` (port 5432) is the direct connection — used by `prisma migrate deploy`.

---

## Step 2: Run Migrations on Supabase

On your **local machine**, update `.env` with your Supabase URLs:

```env
DATABASE_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres"
DIRECT_URL="postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"
ADMIN_PASSCODE="your_secret_passcode"
JWT_SECRET="your_jwt_secret_hex_string"
```

Then run:
```bash
npx prisma migrate deploy
```

This creates all the tables in your Supabase database.

---

## Step 3: Push Code to GitHub

### 3.1 Create a GitHub Repository
1. Go to [github.com](https://github.com) → **New repository**
2. Name it `portfolio` (or any name)
3. Keep it **private** (recommended)
4. Don't add README (we already have one)

### 3.2 Push Your Code
In your project folder, run:
```bash
git init
git add .
git commit -m "Initial portfolio commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/portfolio.git
git push -u origin main
```

---

## Step 4: Deploy to Vercel

### 4.1 Import Project
1. Go to [vercel.com](https://vercel.com) → **Add New → Project**
2. Connect your GitHub account if not already connected
3. Select your `portfolio` repository
4. Click **Import**

### 4.2 Configure Environment Variables
In Vercel's project settings, add these environment variables:

| Name | Value | Notes |
|---|---|---|
| `DATABASE_URL` | Your Supabase Transaction pooler URL (port 6543) | Required |
| `DIRECT_URL` | Your Supabase Direct/Session URL (port 5432) | Required for migrations |
| `ADMIN_PASSCODE` | A secret passcode of your choice | Used to set up admin at `/admin/setup` |
| `JWT_SECRET` | A 64-char hex string | Run `openssl rand -hex 32` to generate |

> **Generate a JWT secret:**
> ```bash
> node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
> ```

### 4.3 Deploy
Click **Deploy** — Vercel will:
1. Install dependencies
2. Run `npx prisma generate`
3. Build Next.js
4. Deploy your app

---

## Step 5: Set Up Your Admin Account

After deployment, visit:
```
https://your-portfolio.vercel.app/admin/setup
```

Enter:
- **Username** (e.g., your name)
- **Password** (min 6 chars)
- **Setup Passcode** — the value you set as `ADMIN_PASSCODE` in Vercel env vars

This creates your admin account and seeds the database with sample portfolio data.

> **This setup page is locked after first use** — once an admin exists, `/admin/setup` will reject further registrations.

---

## Step 6: Manage Your Portfolio

Visit `/admin` and log in to manage:

| Section | What you can do |
|---|---|
| **Projects** | Add/edit/delete projects with images, GitHub links, demo links, tech stack |
| **Experience** | Add/edit internships and work experience |
| **Skills** | Add/edit technical skills with categories and proficiency levels |
| **Certifications** | Add/edit certifications with verifiable credential links |
| **Messages** | View contact form submissions |

---

## Updating Content (Future Deployments)

No redeployment needed! Just:
1. Log into `/admin`
2. Add/edit/delete your content
3. Changes are live immediately

For code changes:
```bash
git add .
git commit -m "Update portfolio"
git push
```
Vercel auto-deploys on every push to `main`.

---

## Useful Commands

```bash
# Run locally
npm run dev

# Run database migrations locally (after updating schema.prisma)
npx prisma migrate dev --name describe_change

# Deploy migrations to Supabase (production)
npx prisma migrate deploy

# Open Prisma Studio (database GUI)
npx prisma studio

# Generate Prisma client
npx prisma generate
```

---

## Project Structure

```
portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Main portfolio page
│   │   ├── actions.ts         # Server actions (CRUD)
│   │   ├── globals.css        # Global styles
│   │   └── admin/             # Admin panel
│   │       ├── page.tsx       # Admin dashboard
│   │       ├── login/         # Login page
│   │       └── setup/         # Initial setup page
│   ├── components/            # Portfolio sections
│   │   ├── Hero.tsx
│   │   ├── About.tsx
│   │   ├── Skills.tsx
│   │   ├── Projects.tsx
│   │   ├── Experience.tsx
│   │   ├── Achievements.tsx
│   │   └── Contact.tsx
│   └── lib/
│       ├── prisma.ts          # Database client
│       ├── auth.ts            # JWT auth utilities
│       └── seed.ts            # Default portfolio data
├── prisma/
│   ├── schema.prisma          # Database models
│   └── migrations/            # Migration files
├── prisma.config.ts           # Prisma v7 config (DB URLs)
└── .env.example               # Environment variable template
```

---

## Troubleshooting

### Build fails on Vercel
- Check that all env vars are set correctly
- Ensure `DATABASE_URL` uses the **Transaction pooler** (port 6543)

### "relation does not exist" error
- Run `npx prisma migrate deploy` locally with the Supabase DATABASE_URL to push migrations

### Cannot log into admin
- Verify `ADMIN_PASSCODE` matches what you set in Vercel
- Visit `/admin/setup` to create the first account

### PrismaClientInitializationError
- Confirm `DATABASE_URL` is set in Vercel env vars and is correct
