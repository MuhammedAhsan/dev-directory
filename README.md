## Dev Directory

A modern Next.js directory of tech companies in Pakistan with recruiter LinkedIn profiles, searchable company listings, and protected admin CRUD.

## Start and Stop (Normal Next.js flow)

Start:

```bash
npm run dev
```

Stop:

- Press Ctrl+C in the same terminal where npm run dev is running.

## Build and Lint

```bash
npm run build
npm run lint
```

## Database Setup

1. Create a Supabase project.
2. Open Project Settings > Database and copy:
- Transaction pooler connection string (port 6543)
- Direct connection string (port 5432)
3. Set values in [.env](.env):
- DATABASE_URL: pooled connection
- DIRECT_URL: direct connection

Then run:

```bash
npm run db:generate
npm run db:migrate
npm run db:seed
```

For production deployments, run migrations with:

```bash
npm run db:migrate:deploy
```

## Admin Login

- Route: /admin/login
- Credentials are controlled by ADMIN_EMAIL and ADMIN_PASSWORD in .env

## Tech Stack

- Next.js App Router + TypeScript
- Tailwind CSS + custom UI primitives
- Prisma + Supabase PostgreSQL
- NextAuth credentials auth
