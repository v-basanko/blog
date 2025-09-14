# Next.js Blog (App Router) — Project Documentation

A production‑ready blog application built with **Next.js 15 (App Router)**, **TypeScript**,
**Prisma + PostgreSQL**, **Auth.js/NextAuth v5** (Google, GitHub, Credentials), **Resend** for
transactional emails, **EdgeStore** for file uploads, and a **BlockNote** rich‑text editor. Includes
comments, claps (likes), bookmarks, tags, email verification, and password reset.

## Tech Stack

- **Next.js 15** (App Router, Server Actions)
- **TypeScript**
- **Auth.js (NextAuth v5)**: Google, GitHub, Credentials providers
- **Prisma** ORM with **PostgreSQL**
- **Resend**: email verification + password reset
- **EdgeStore**: uploads (cover images)
- **BlockNote**: WYSIWYG editor
- **Zod**, **react-hook-form**
- **ESLint + Prettier** (with Tailwind/organize-imports/package.json plugins)
- **Radix UI** primitives + custom components

## Features

- Register/Login with **Google**, **GitHub**, or **email + password** (credentials)
- **Email verification** link and **password reset** via Resend
- Create, edit, publish/unpublish blog posts with **cover image** uploads (EdgeStore)
- **Tags**, **bookmarks**, **claps** (toggle), **comments** and **replies**
- Protected routes via middleware, public feed and detail pages
- Fully typed forms with validation via **Zod**

## Getting Started

### 1) Requirements

- **Node.js 20+** (recommended) or 18.18+
- **pnpm / npm / yarn / bun** (choose one)
- **PostgreSQL 14+** (local Docker setup below)

### 2) Environment Variables

Create a `.env.local` from the provided `.env.example` and fill values:

```bash
cp .env.example .env.local
```

> **Notes**
>
> - `AUTH_SECRET` is **required in production** by Auth.js. Generate one: `npx auth secret`
> - `BASE_URL` must be the **full origin** of your app (used in email links).
> - When deploying behind a proxy (Vercel, Nginx, etc.) set `AUTH_TRUST_HOST=true`.
> - If you enable social login, fill the Google/GitHub credentials accordingly.

**Variables**

| Name                        | Required             | Example                                                             | Description                                         |
| --------------------------- | -------------------- | ------------------------------------------------------------------- | --------------------------------------------------- |
| `DATABASE_URL`              | ✅                   | `postgresql://postgres:admin@localhost:5432/postgres?schema=public` | Prisma PostgreSQL connection string.                |
| `NODE_ENV`                  | ⛔ (auto)            | `development`                                                       | Node environment.                                   |
| `BASE_URL`                  | ✅                   | `http://localhost:3000`                                             | Your app public base URL used in email links.       |
| `RESEND_API_KEY`            | ✅ (for emails)      | `re_************************`                                       | Resend API key to send verification & reset emails. |
| `GOOGLE_CLIENT_ID`          | ✅ (if Google login) | `1234-abc.apps.googleusercontent.com`                               | Google OAuth client ID.                             |
| `GOOGLE_CLIENT_SECRET`      | ✅ (if Google login) | `xxxxxxxx`                                                          | Google OAuth client secret.                         |
| `GITHUB_CLIENT_ID`          | ✅ (if GitHub login) | `Iv1.abcdef`                                                        | GitHub OAuth client ID.                             |
| `GITHUB_CLIENT_SECRET`      | ✅ (if GitHub login) | `xxxxxxxx`                                                          | GitHub OAuth client secret.                         |
| `AUTH_SECRET`               | ✅ (prod)            | `long-random-string`                                                | Secret for Auth.js cookies/tokens (prod required).  |
| `AUTH_URL` / `NEXTAUTH_URL` | ✅ (prod)            | `https://your-domain.com`                                           | Canonical URL for auth callbacks.                   |
| `AUTH_TRUST_HOST`           | ➕ recommended       | `true`                                                              | Trust proxy headers when app is behind a proxy/CDN. |

> The code references `GOOGLE_*`, `GITHUB_*`, `RESEND_API_KEY`, `BASE_URL`, `DATABASE_URL`, and
> reads `NODE_ENV`. `AUTH_*` / `NEXTAUTH_*` are required by the Auth.js runtime in production.

### 3) Database (Local via Docker)

A `docker-compose.yml` is included for local PostgreSQL + pgAdmin:

```bash
docker compose up -d
```

Then create the database schema with Prisma:

```bash
# install deps first (see step 4)
npx prisma generate
npx prisma migrate dev --name init
```

### 4) Install & Run

```bash
# install
pnpm install
# or npm i / yarn / bun i

# dev server
pnpm dev
# http://localhost:3000
```

### 5) Build & Start

```bash
pnpm build
pnpm start
```

## Available Scripts

- `dev` — run Next.js in dev with Turbopack
- `build` — production build (Turbopack)
- `start` — start production server
- `lint` — run ESLint
- `format` — Prettier write with cache
- `format:check` — Prettier check

## OAuth Setup (Google/GitHub)

- **Google**: set **Authorized redirect URI** to `{BASE_URL}/api/auth/callback/google`
- **GitHub**: set **Authorization callback URL** to `{BASE_URL}/api/auth/callback/github`

## Email (Resend)

- Add `RESEND_API_KEY` and verified sender (e.g. `onboarding@resend.dev` in the code).
- Verification and reset emails build links using `{BASE_URL}`.

## File Uploads (EdgeStore)

- The project uses the App Router handler at `/api/edgestore/[...edgestore]`.
- For production keys/providers consult EdgeStore docs if you move away from the default setup.

## Troubleshooting

- **Auth error “Host must be trusted”**: set `AUTH_TRUST_HOST=true` and `AUTH_URL`/`NEXTAUTH_URL`.
- **“Please define a secret in production”**: set `AUTH_SECRET` to a strong random value.
- **Emails not sent**: check `RESEND_API_KEY` and sender domain verification.
- **Images not loading**: ensure `next.config.ts` allows your image host(s).
