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