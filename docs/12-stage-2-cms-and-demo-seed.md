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
| Projects listing (`/projects`) | Stage 3 library. See `docs/13-stage-3-projects-and-locales.md` |
| Header enquiry button | Always the beige enquiry style, always `/enquiry` |
| EN / 中文 toggle | Sets a `locale` cookie and switches marketing copy between English and Simplified Chinese. See `docs/03-assumptions.md` A1 |
| Process and category icons | Chosen by item order. Labels are editable; the SVG set is not |
| Privacy and Terms links | Placeholder routes. No CMS pages yet |
| SWMS worker flow | Stages 5–6. Demo records come from the same seed |

Page title, hero, marketing blocks, SEO text, and header/footer labels are Payload-localised (`en` and `zh`). `pnpm seed:demo` fills Chinese when that locale is still empty, and clears the four old bilingual subtitle lines on English pages. It does not overwrite Chinese copy an admin has already saved.

The About hero photo is a construction site. An earlier hotlink labelled “Construction team at work” pointed at an office photograph, so the seed does not use that file.

The homepage hero uses a dusk architectural photograph with a dark left-to-right overlay so the white headline and paragraph stay readable on the photo.

## Demo seed

`pnpm seed:demo` is idempotent for pages and records:

- creates published Home, About and Services pages only when that slug does not already exist
- fills Header and Footer fields that are still empty
- runs the existing SWMS demo (Rosebery Residence, Linfield House, Marrickville Duplex)
- uploads stock images from `src/seed/assets` (marketing images and portfolio images)

Running it again does **not** overwrite pages, project records, project-image rows, or SWMS records an admin has changed. To re-seed a page, delete that page in admin and run `pnpm seed:demo` again.

### Media files

A Media row whose filename already exists is not treated as success by itself. The seed re-uploads that file in place (`overwriteExistingFiles: true`) when any of these are true:

- the row has no usable URL
- the URL is local-only (localhost, a `file:` path, or `/media/...` on the build disk) and `BLOB_READ_WRITE_TOKEN` is set
- `filesize` is missing or 0
- the token is set and the Vercel Blob API does not have the object (the check is `head` with `BLOB_READ_WRITE_TOKEN`, on the Blob URL stored on the Media document, or on the `prefix` / `_objectKey` / filename path that `/api/media/file/<filename>` reads)
- `GET /api/media/file/<filename>` on this deployment’s server URL returns 404 and Blob does not already have the object

The same Media id is kept, so pages and project images do not need to be deleted. A file is left alone when it is actually healthy: non-zero size, a usable URL, and the bytes are reachable. The same filesize as the seed asset plus a working URL is enough. `hero-house.jpg` is still replaced when the stored size differs from the seed asset, even if the current file answers.

An anonymous GET of the public Blob CDN is not used as proof. That URL can keep serving a cached 404 immediately after a successful upload. The file route itself asks the Blob API with the token, and the seed does the same.

This repairs orphan rows. A previous deploy can insert Media documents whose files never reached Vercel Blob (no token, or the file only existed on the build machine). The filename is then already in Media, so an older seed skipped the upload forever and `/api/media/file/<filename>` kept returning 404. The next deploy with `SEED_DEMO=true` and a Blob token re-uploads those files. This repository change does not itself update the live site; Production is fixed when that deploy finishes.

`pnpm seed:swms` still seeds only the SWMS demo. It does not repair website images.

### Local

```bash
pnpm seed:demo
```

`SEED_DEMO` is not required for this command. Leave it unset in local `.env` so a normal build does not seed.

### Vercel Preview and Production

The project owner has asked for demo data on Preview and Production after each deploy. The app uses the deployment’s existing `DATABASE_URL`. Do not add a second production database URL for seeding.

1. In the Vercel project, set `SEED_DEMO` to `true` for **Preview** and **Production**.
2. Set `BLOB_READ_WRITE_TOKEN` in those environments and make it available at **build** time. The seed runs during `vercel-build`, before the new deployment is serving traffic. `seed:demo:deploy` exits with an error if `SEED_DEMO=true` and the token is missing or not a `vercel_blob_rw_...` token, so the build cannot create more Media rows whose files only exist on the build machine.
3. Use the default build, or set the build command to `pnpm ci`.

Both `pnpm ci` and `vercel-build` run:

```bash
pnpm payload migrate && pnpm seed:demo:deploy && pnpm build
```

`seed:demo:deploy` seeds only when `SEED_DEMO=true`. Any other value, including empty, skips the seed and the deploy continues. A failed seed fails the deploy. With `SEED_DEMO=true`, a missing Blob token also fails the deploy.

One Production redeploy with `SEED_DEMO=true` and the Blob token re-uploads broken seed files, including `service-residential.jpg` and the Kew and Armadale portfolio images, without deleting pages or project records. After that deploy, `/api/media/file/<filename>` for those seed files should return 200. Do not treat the live site as fixed until that deploy has finished.

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
- `/projects` project library (Stage 3)

## Assumptions

See `docs/03-assumptions.md` section G.
