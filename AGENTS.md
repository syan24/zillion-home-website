# Agents

This project uses the Payload CMS skill at `.agents/skills/payload/`.
Start with `.agents/skills/payload/SKILL.md` for a quick reference, then see `.agents/skills/payload/reference/` for detailed docs.


## Stack

- Next.js
- Payload CMS
- TypeScript
- PostgreSQL
- Tailwind CSS
- Vercel
- Vercel Blob
- pnpm

Do not introduce Prisma.

## Documentation

Read relevant files in `/docs` before implementation.

Priority:

1. Explicit client requirement
2. Product specification
3. Documented assumptions
4. UX/UI design brief
5. Approved v0 prototype
6. Engineering judgement

Do not silently invent business requirements.

## Scope

Phase 1:

- Company website
- Project portfolio
- Enquiry Quiz
- SWMS management

Do not implement Phase 2 unless explicitly requested.

## Design

Follow:

- `docs/08-ux-ui-design-brief.md`
- `docs/10-design-reference.md`
- approved v0 prototype

Avoid generic SaaS styling.

SWMS must be mobile-first.

## Payload

Prefer Payload-native features.

Do not duplicate authentication.

Do not manually edit `src/payload-types.ts`.

Use Payload Local API on the server where appropriate.

## SWMS

- workers do not need accounts
- public SWMS links must use secure tokens
- do not expose sequential DB IDs
- signatures must reference exact SWMS versions
- signed historical versions must remain recoverable
- do not overwrite signed content

## Quality

Before completing work:

```bash
pnpm lint
pnpm build
```

## Cursor Cloud specific instructions

- Node `24.21.0` (`.nvmrc`) and pnpm `11.28.0` are required. The platform `node` on `PATH` may be older. Put `~/.nvm/versions/node/v24.21.0/bin` first, or run `nvm use`.
- PostgreSQL 16 is installed on the VM. `policy-rc.d` blocks `service postgresql start`; use `sudo pg_ctlcluster 16 main start`. Database `zillion_home`, user `postgres`, password `postgres`.
- If `.env` is missing, copy `.env.example`. `BLOB_READ_WRITE_TOKEN` is optional; without it, media stays on local disk.
- Dev server: `pnpm dev` at `http://localhost:3000`. Admin: `http://localhost:3000/admin`. In development the Postgres adapter pushes schema changes, so a migrate step is not required for local work.
- `pnpm test:int` needs Postgres and `.env`. `pnpm test:e2e` reuses a running dev server when one is already up (`reuseExistingServer`).

<!-- BEGIN:nextjs-agent-rules -->

Cloud Agents must treat this repository as a development environment.

### Safety

- Never use, modify, migrate, seed, or delete production data from a laptop or an ad-hoc script. The only production write allowed is the env-gated deploy seed (`SEED_DEMO=true` during Vercel migrate/build). It is idempotent and does not overwrite existing pages. Do not point a local seed at the production database.
- Never connect to the production Neon database.
- Never use production Vercel Blob credentials.
- Never deploy directly to production.
- Never push directly to `main`.
- Never modify infrastructure or environment configuration unless the task explicitly requires it.
- Never invent product requirements. Follow the documentation in `/docs`.

### Workflow

1. Read `AGENTS.md` and relevant `/docs` files before making changes.
2. Inspect the existing implementation before proposing changes.
3. Work on a dedicated feature branch.
4. Keep changes limited to the requested task.
5. Run relevant validation before finishing:
   - `pnpm lint`
   - `pnpm build`
   - relevant tests
6. Report:
   - files changed
   - implementation decisions
   - assumptions
   - tests performed
   - known limitations
7. Create a PR for review rather than merging directly.

### Architecture

- Use the existing Next.js + Payload architecture.
- Use Payload-native functionality where practical.
- Do not introduce Prisma.
- Do not manually edit `src/payload-types.ts`.
- Do not implement Phase 2 requirements unless explicitly requested.
- Follow `/docs/02-product-specification.md` as the primary product specification.
- Follow `/docs/08-ux-ui-design-brief.md` and the approved v0 reference for public UI.

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
