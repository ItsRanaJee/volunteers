# Goal
Create a comprehensive, step-by-step developer guide to build and deploy a **Volunteer Registration App** using **Next.js (App Router)**, **Supabase** and **Vercel**, with source control on **GitHub**. The guide must cover **two separate environments: Development (dev) and Production (prod)**.

> Note: Streamlit is intentionally NOT used. Vercel runs short-lived serverless functions and does not support the long-running server and WebSockets that Streamlit needs.

# Target Architecture

| Layer | Dev | Prod |
|---|---|---|
| Git branch | `dev` (plus feature branches and PRs) | `main` (protected) |
| Vercel deployment | Preview (every push to `dev` and every PR) | Production (every merge to `main`) |
| Supabase project | `volunteers-dev` | `volunteers-prod` |
| Env var scope in Vercel | Preview + Development | Production |
| Local machine | `.env.local` points to **dev** Supabase only | never used locally |

One GitHub repo, one Vercel project, two Supabase projects. The database schema lives in the repo as migrations so both Supabase projects stay identical.

# Core Requirements

1. **Local Setup (Windows + VS Code):**
   - Install prerequisites (Node.js LTS, Git, Supabase CLI) and verify versions.
   - Create the Next.js app (TypeScript, App Router) and run it locally.
   - Create `.gitignore` (including `.env*` except `.env.example`) **before the first commit**.

2. **Supabase (dev and prod):**
   - Create two projects: `volunteers-dev` and `volunteers-prod`.
   - Initialize the Supabase CLI in the repo and write the schema as migration files in `supabase/migrations/`.
   - `volunteers` table: `id`, `full_name`, `email` (unique), `phone`, `availability`, `skills`, `created_at`.
   - Enable **Row Level Security**: allow public `INSERT` only (with column validation), no public `SELECT`/`UPDATE`/`DELETE`.
   - Install `@supabase/supabase-js` and `@supabase/ssr`; provide a client for the form (anon key) and a server-only client for admin reads.
   - Show how to link the CLI to dev, apply migrations (`supabase db push`), then promote the same migrations to prod.

3. **App Features:**
   - Public registration form with server-side validation (email format, required fields, duplicate email handled with a friendly message) and spam protection (honeypot field, optional Cloudflare Turnstile).
   - Success and error states.
   - **Admin page** at `/admin` to view registrations, protected by Supabase Auth (or a server route using the `service_role` key). The `service_role` key must never reach client code or any `NEXT_PUBLIC_*` variable.

4. **Git & GitHub:**
   - `git init`, first commit, create the GitHub repo, push `main`, then create `dev`.
   - Branching model: feature branch -> PR into `dev` -> PR from `dev` into `main`.
   - Enable branch protection on `main` (PR required, no direct pushes).
   - Optional: a GitHub Actions workflow that runs lint, type-check and build on PRs.

5. **Vercel Deployment (dev and prod):**
   - Import the GitHub repo into Vercel (framework auto-detected as Next.js; no `vercel.json` needed unless required).
   - Set Production Branch = `main`; `dev` and PRs become Preview deployments.
   - Show how to add environment variables **per scope** (Production vs Preview/Development) in the Vercel dashboard.
   - Explain how to use preview URLs for testing, and how to roll back (Vercel Instant Rollback).
   - Show how to pull dev env vars locally with `vercel env pull .env.local` as an alternative to manual entry.

6. **Security & Environment Variables:**
   - Provide a committed `.env.example` listing every variable with placeholder values:
     - `NEXT_PUBLIC_SUPABASE_URL`
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - `SUPABASE_SERVICE_ROLE_KEY` (server-only, never `NEXT_PUBLIC_`)
   - Local uses dev keys only; Preview uses dev keys; Production uses prod keys.
   - Explain what to do if a key is accidentally committed (rotate it in Supabase, remove from history).
   - Explain why RLS is the real security boundary and the anon key is public by design.

# Expected Output
Provide, in order:
1. All terminal commands (PowerShell-compatible) for each step.
2. Code snippets: registration form, server action or API route, Supabase client helpers, admin page.
3. Configuration files: `.gitignore`, `.env.example`, Supabase migration SQL (table + RLS policies), optional GitHub Actions workflow.
4. A **testing checklist** for each stage:
   - Local (against dev Supabase): submit form, verify row in `volunteers-dev`, verify anon user cannot read rows.
   - Preview (`dev` branch URL): same checks on the deployed preview.
   - Production (`main` URL): smoke test with a clearly marked test entry, then delete it.
5. A **promotion and rollback checklist**: apply migrations to prod, merge `dev` -> `main`, confirm the Production deploy, how to roll back.
6. A simple **"How to Use" guide written in clean HTML** for **[volunteers / admins: specify audience]**, covering how to register (volunteers) or how to log in and view registrations (admins).

# Constraints
- Do not hardcode secrets anywhere in code or docs.
- Keep schema changes in migrations only; never hand-edit the prod database.
- Keep steps beginner-friendly and numbered, with a verification step after each major section.
