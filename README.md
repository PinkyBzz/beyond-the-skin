# Beyond The Skin Project

> Every girl deserves to be seen beyond her skin.

A production-ready curated storytelling platform for teenage girls — built with Next.js 15, Supabase, TypeScript, and Tailwind CSS.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15 (App Router), TypeScript, Tailwind CSS v4 |
| UI | shadcn/ui components (Radix UI), Framer Motion, Lucide Icons |
| Backend | Supabase (PostgreSQL, Auth, Storage, RLS) |
| Validation | Zod v4, React Hook Form |
| Deployment | Vercel |

---

## Getting Started

### 1. Clone & Install

```bash
git clone <your-repo>
cd beyond-the-skin
npm install
```

### 2. Set Up Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Run the SQL schema: copy `supabase/schema.sql` into the Supabase SQL Editor and execute it
3. In Supabase → Authentication → Settings → enable Email auth

### 3. Environment Variables

Copy `.env.local` and fill in your values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Create Your First Admin

1. Sign up via Supabase Auth (or use the SQL editor to insert a user)
2. In the Supabase Table Editor, find your user in `profiles` and set `role = 'admin'`

### 5. Run Locally

```bash
npm run dev
```

Visit `http://localhost:3000` for the public site and `http://localhost:3000/admin` for the admin panel.

---

## Project Structure

```
app/
  (public pages)        Home, Stories, Articles, Changemaker, Search, Share
  admin/
    (dashboard)/        All admin pages with sidebar layout
    login/              Admin login (no sidebar)
  api/
    admin/              Protected admin API routes
    stories/            Public story submission & listing
    comments/           Comment submission & listing
    search/             Global search
    track/              Page view tracking

components/
  admin/                Admin UI components (tables, forms, managers)
  features/             Public feature components (story form, grid, comments)
  home/                 Home page sections
  layout/               Navbar, Footer
  ui/                   Base UI components (Button, Input, Card, etc.)

lib/
  supabase/             client.ts, server.ts, middleware.ts, admin.ts
  utils.ts              Shared utility functions
  validations.ts        Zod schemas

types/
  database.ts           Full Supabase Database type
  index.ts              Derived TypeScript types

supabase/
  schema.sql            Complete PostgreSQL schema + RLS policies + storage
```

---

## Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, mission, how it works, latest stories, spotlight, changemaker, articles |
| `/stories` | Behind Every Smile — filterable story grid |
| `/stories/[id]` | Individual story with reflection and community messages |
| `/articles` | Beauty & Beyond — all three sections |
| `/articles/[section]` | Section listing (skin-talk, girl-talk, creators-corner) |
| `/articles/[section]/[slug]` | Individual article |
| `/changemaker` | Confidence Changemaker page |
| `/share` | Multi-step story submission form |
| `/share/thank-you` | Thank you page after submission |
| `/search` | Global search |
| `/admin` | Admin dashboard overview |
| `/admin/stories` | Story moderation (approve/reject/publish/delete) |
| `/admin/articles` | Article management (create/edit/delete) |
| `/admin/comments` | Comment moderation |
| `/admin/spotlight` | Weekly spotlight management |
| `/admin/changemaker` | Monthly changemaker management |
| `/admin/analytics` | Analytics dashboard |
| `/admin/settings` | Site settings |

---

## Security

- RLS enabled on **every** table
- Public users: read-only access to published content
- Admins: full CRUD via service role (server-side only)
- Phone numbers: never exposed publicly
- Service role key: never sent to the browser
- All form data validated with Zod (client + server)

---

## Deploy to Vercel

```bash
vercel --prod
```

Set these environment variables in Vercel:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

---

## License

MIT — Beyond The Skin Project
