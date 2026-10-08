# Stage 2 CMS and demo seed

Status: Stage 2 content path

Primary marketing pages are Payload Pages. Admins edit them in **Pages**, plus **Header** and **Footer**. A fresh database does not show the Zillion Home design until `pnpm seed:demo` has run, or until a Vercel deploy runs with `SEED_DEMO=true`.

Until that seed exists, Home, About and Services still render the previous hardcoded fallbacks. A published CMS page replaces the fallback. Deleting the page, or saving it with no hero and no blocks, brings the fallback back.

## What admin can edit

| Surface | Where | Notes |
| --- | --- | --- |
| Home | Pages → Home | Builder hero (headline, copy, badge, hero image, enquiry link) plus layout blocks |
| About | Pages → About | Page intro, prose, capabilities, checklist, CTA |
| Services | Pages → Services | Intro, service sections with anchors, process, joinery feature, CTA |
| Header navigation | Globals → Header | Primary and secondary links. The beige **Start an Enquiry** button stays in code and always goes to `/enquiry` |
| Footer | Globals → Footer | Blurb, tagline, location, service links, company links |
| Images | Media, then the upload field on the hero or block | Replace the file in Media, or choose a different image on the block |

Marketing blocks (group **Marketing** in the layout editor):

- Page intro
- Service cards
- Split feature
- Process
- Category bar
- CTA band
- Prose section
- Capability list
- Service details

Hero and section images are Media uploads. Alt text can be set on the media item or overridden on that placement.

Service anchors (`residential`, `commercial`, `joinery`, `interior`) keep `/services#…` links working. Edit the anchor if you change those hashes, and update the header/footer links to match.

## Still owned by code

These are intentionally not CMS pages in this stage:

| Surface | Why it stays in code |
| --- | --- |
| Enquiry form (`/enquiry`) | Stage 4. The page is still the beige marketing shell. The submit button stays charcoal. The form does not save an Enquiry yet. |
| `/contact` | Redirects to `/enquiry` |
| Projects listing (`/projects`) | Stage 3 shell. Filters, detail, styles and spaces are not in this change |
| Header enquiry button | Always the beige enquiry style, always `/enquiry` |
| EN / 中文 toggle | Visual only. It does not switch a locale |
| Process and category icons | Chosen by item order. Labels are editable; the SVG set is not |
| Privacy and Terms links | Placeholder routes. No CMS pages yet |
| SWMS worker flow | Stages 5–6. Demo records come from the same seed |

Chinese lines on service cards are ordinary subtitle fields, not Payload localisation.

The About hero photo is a construction site. An earlier hotlink labelled “Construction team at work” pointed at an office photograph, so the seed does not use that file.

On a phone, the homepage hero keeps a stronger light wash over the photo so the headline and paragraph stay readable. Desktop keeps the original left-to-right fade.

## Demo seed

`pnpm seed:demo` is idempotent:

- uploads the stock images in `src/seed/assets` when that filename is not already in Media
- creates published Home, About and Services pages only when that slug does not already exist
- fills Header and Footer fields that are still empty
- runs the existing SWMS demo (Rosebery Residence, Linfield House, Marrickville Duplex)

Running it again does **not** overwrite pages, media or SWMS records an admin has changed. To re-seed a page, delete that page in admin and run `pnpm seed:demo` again. To re-seed an image, delete the media item with that filename first.

`pnpm seed:swms` still seeds only the SWMS demo.

### Local

```bash
pnpm seed:demo
```

`SEED_DEMO` is not required for this command. Leave it unset in local `.env` so a normal build does not seed.

### Vercel Preview and Production

The project owner has asked for demo data on Preview and Production after each deploy. The app uses the deployment’s existing `DATABASE_URL`. Do not add a second production database URL for seeding.

1. In the Vercel project, set `SEED_DEMO` to `true` for **Preview** and **Production**.
2. Keep `BLOB_READ_WRITE_TOKEN` set in those environments so seeded images are stored in Vercel Blob. Without it, uploads stay on the build filesystem and can disappear on serverless.
3. Use the default build, or set the build command to `pnpm ci`.

Both `pnpm ci` and `vercel-build` run:

```bash
pnpm payload migrate && pnpm seed:demo:deploy && pnpm build
```

`seed:demo:deploy` seeds only when `SEED_DEMO=true`. Any other value, including empty, skips the seed and the deploy continues. A failed seed fails the deploy.

If the Vercel project overrides the build command and does not call `pnpm ci` or `vercel-build`, add `pnpm seed:demo:deploy` after `pnpm payload migrate`.

### Disable

Remove `SEED_DEMO` or set it to anything other than `true`, then redeploy. Existing rows stay. Later deploys will not insert missing demo rows until the flag is turned back on.

### Demo URLs

- `/` Home
- `/about`
- `/services`
- `/enquiry` (form shell, not saved)
- `/contact` redirects to `/enquiry`
- `/swms` project list, after the SWMS portion of the seed
- `/projects` listing shell (Stage 3)

## Assumptions

See `docs/03-assumptions.md` section G.
