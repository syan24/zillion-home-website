# Editorial fields for feedback sections 1–5

The public sentences and photos below are stored in Payload. Changing one does not change the others. Service names are separate fields on purpose.

An empty optional field stays empty. Pages, the Projects page, and the Enquiry page do not substitute English when the Chinese field is blank. Header and footer still do, when a Chinese navigation or footer field is blank.

## Where to edit

| What visitors see | Admin path |
| --- | --- |
| Home hero eyebrow, headline, gold accent, description, three badge lines, photo, buttons | Collections → Pages → Home → Hero |
| Home “About Zillion Home”, “What Makes Us Different”, process, reasons, category bar | Collections → Pages → Home → Layout |
| About page modules | Collections → Pages → About → Layout |
| Services introduction, three services, process, joinery section | Collections → Pages → Services → Layout |
| “What we deliver” / “交付内容” | Pages → Services → Layout → Service details → Features label |
| Closing band eyebrow and background photo (Home, About, Services) | That page → Layout → CTA band → Eyebrow, Image, Image alt text |
| Header menu, including the three services | Globals → Header → Nav items and Secondary nav items |
| Header enquiry button label and link | Globals → Header → Enquiry button and Enquiry button link |
| Footer blurb, tagline, location, service links, company links | Globals → Footer |
| Projects introduction, By Project / By Room, type chip names, gallery photo, closing band | Globals → Projects page |
| Room chips and the room filter | Collections → Spaces. Active rooms are listed in Display order. Turning Active off removes the chip and the filter option. |
| Enquiry side panel and the text above the form | Globals → Enquiry page |
| Form questions, placeholders, option labels, submit button | Collections → Forms → the enquiry form |
| Who receives a new enquiry, and the From address | Globals → Enquiry notifications. Staff only. Empty fields use `ENQUIRY_NOTIFY_TO` and `ENQUIRY_NOTIFY_FROM`. |
| Project title, type value, cover, gallery | Collections → Projects and Project images |

Project type values stay `residential`, `commercial`, and `joinery`. The public name, order, and Active flag are on Globals → Projects page → Project types. A hidden type can still be opened with `?type=`. The address does not change.

`/projects?view=project` is By Project. `/projects?view=room` is By Room. Each service’s “view related project” link still uses those addresses.

## First deploy of these fields

Migrations `20261124_004753_editorial_fields_schema` and `20261124_004800_editorial_fields_backfill` add the fields and, when Home already exists, copy the current wording in once. The schema migration does not add `content_seeded` or move the select placeholder again; those already shipped in `20261123_150000_editor_content_schema`. On a brand-new database, `20261123_150100_editor_content_baseline` finds no pages and returns. The first seed then writes the current pages. That one-off still runs for a database that already has pages and has not applied it. The backfill does not run again. `pnpm seed:demo` fills the same fields on a new database after it creates the pages, then sets the Projects page mark so the next deploy leaves edits and blanks alone.

The gallery photo is the existing Media file `DSC03791.jpg` when that row exists. The Home band uses `service-joinery.jpg`. The Services band uses `hero-house.jpg`. The enquiry panel uses `kew-kitchen.jpg`. No new image file is uploaded for this. A missing file stays empty.

Notification API keys and SMTP passwords are not copied into the CMS and are not returned by the public API. Globals → Enquiry notifications is not readable without a logged-in user.

Saving Header, Footer, Projects page, or Enquiry page in the running site clears that global’s cache. The next request shows the save. A seed writes with revalidation disabled and does not clear the running cache by itself.

The enquiry form is read for the locale in the request, with no fallback to the other language. Select placeholders were previously one shared column. Saving the Chinese demo text wrote it for both languages, and migration `20261123_150000_editor_content_schema` copied that same string onto the English row. Migration `20261124_090000_enquiry_locale_leak` replaces an English string only when it is still exactly that known Chinese demo text for the same field, option, submit button, or confirmation. A custom value and a blank stay. The Chinese row is not rewritten, and later seeds do not run the repair again.

## Service names are not synchronised

| Placement | Admin path |
| --- | --- |
| Home category bar | Pages → Home → Layout → Category bar |
| Home opening cards | Pages → Home → Layout → Service cards |
| Home “About Zillion Home” | Pages → Home → Layout → Split feature |
| Services page titles | Pages → Services → Layout → Service details |
| Header dropdown | Globals → Header |
| Footer service column | Globals → Footer → Service links |

## Left in the interface dictionary

These stay in `src/i18n/messages.ts`. They are controls and status text, not the marketing sections from the 17 November feedback.

- Open and close menu, and the locale switch labels
- Footer column headings (Services, Company, Get in Touch), privacy and terms link labels, and “All rights reserved.”
- Not-found and the placeholder privacy and terms pages
- Enquiry validation, file rules, consent, thank-you, and “form is not available”
- Project controls: Filters, Apply, Clear, Close, All types, All spaces, All styles, All projects, empty states, image count, lightbox, copy link, back, and related projects

The submit button uses the form’s Submit button label. An empty label leaves the button blank. “Submitting…” stays in the dictionary because it is status text.
