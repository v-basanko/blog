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
| `NODE_ENV`                  | ⛔ (auto)            | `development` / `production`                                        | Node environment.                                   |
| `BASE_URL`                  | ✅                   | `http://localhost:3000`                                             | Your app public base URL used in email links.       |
| `RESEND_API_KEY`            | ✅ (for emails)      | `re_************************`                                       | Resend API key to send verification & reset emails. |
| `GOOGLE_CLIENT_ID`          | ✅ (if Google login) | `1234-abc.apps.googleusercontent.com`                               | Google OAuth client ID.                             |
| `GOOGLE_CLIENT_SECRET`      | ✅ (if Google login) | `********`                                                          | Google OAuth client secret.                         |
| `GITHUB_CLIENT_ID`          | ✅ (if GitHub login) | `Iv1.********`                                                      | GitHub OAuth client ID.                             |
| `GITHUB_CLIENT_SECRET`      | ✅ (if GitHub login) | `********`                                                          | GitHub OAuth client secret.                         |
| `AUTH_URL` / `NEXTAUTH_URL` | ✅ (prod)            | `https://your-domain.com`                                           | Public URL for Auth.js.                             |
| `AUTH_SECRET`               | ✅ (prod)            | `long-random-string`                                                | Secret used by Auth.js.                             |
| `AUTH_TRUST_HOST`           | ✅ (behind proxy)    | `true`                                                              | Trust proxy headers for callbacks/cookies.          |

### 3) Database (Local via Docker)

A `docker-compose.yml` is included for local PostgreSQL + pgAdmin:

```bash
docker compose up -d
```

- `DATABASE_URL` in `.env.local` should match the compose configuration.
- Run initial migration:

```bash
pnpm prisma migrate deploy
# or (for dev)
pnpm prisma migrate dev
pnpm prisma db seed
```

### 4) Development

Start the app (Next.js + Socket.io are served by `server.js`):

```bash
pnpm dev
# or: npm run dev / yarn dev / bun dev
```

By default, `server.js` listens on `PORT` (defaults to **3001**). The app will be available at:

- `http://localhost:3001` (Next.js)
- `ws(s)://localhost:3001/socket.io` (Socket.io path)

If you prefer port **3000**, set `PORT=3000` in `.env.local`.

---

## Realtime (Socket.io)

This project includes a Socket.io server integrated into `server.js`. It runs in the same Node
process as Next.js and exposes the WebSocket endpoint at **`/socket.io`**.

### Environment variables

Add these to your `.env.local` / production env:

```bash
# server.js
PORT=3001                               # Port server.js listens on (defaults to 3001)
ALLOWED_ORIGIN=http://localhost:3000    # Comma-separated list; may include regex: /^https:\/\/.*\.vercel\.app$/
SOCKET_REQUIRE_AUTH=true                # In production require an authenticated user
ACCEPT_UNVERIFIED_NEXTAUTH_JWT=false    # DEV-only: if true, parses next-auth JWT from cookie WITHOUT signature verification
NEXTAUTH_SECRET=your-strong-secret      # Required by Auth.js in prod; also used by socket cookie parsing
AUTH_TRUST_HOST=true                    # Behind proxies / Vercel / nginx
```

- **CORS**: Only origins listed in `ALLOWED_ORIGIN` can connect. Do **not** use `*` in production.
- **Auth**: The server tries to identify the user from `handshake.auth.token` (custom JWT with
  `{ userId }`) or from next-auth cookies (if `ACCEPT_UNVERIFIED_NEXTAUTH_JWT=true` in DEV). If
  `SOCKET_REQUIRE_AUTH=true`, unauthenticated connections are rejected.

### Events (legacy names preserved)

- `addOnlineUser` (**client → server**) — optional ping after connect. **Args are ignored**; the
  server trusts only its own user identification.
- `onlineUsers` (**server → clients**) — broadcasts an array of `userId` that are currently online.
- `onNotification` (**bidirectional**) — send/receive notifications.
  - Client → server payload: `{ toUserId?: string, ...any }`
  - If `toUserId` is online, the server emits `onNotification` only to that user; otherwise it
    broadcasts to all.
  - Basic rate limiting: max ~2 events/second per socket.

**Socket path:** `/socket.io`

## Auth (NextAuth v5)

- Credentials, Google, GitHub providers supported.
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
