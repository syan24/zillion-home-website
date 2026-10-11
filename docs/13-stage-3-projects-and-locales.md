# Stage 3 projects and locales

Status: Stage 3 portfolio, plus the public English / 中文 switch.

## Homepage hero

The Home hero uses the Media item `hero-house.jpg`: a dusk architectural photograph with a dark left-to-right overlay and light text. `pnpm seed:demo` replaces that file when the stored size differs, including on a Home page an admin has already edited, as long as the hero still points at this media item. A different image chosen on the hero is left alone.

## Locale

Default is English. The header EN | 中文 control sets a `locale` cookie and reloads Header, Footer, Home, About, Services, Projects, Enquiry, and the enquiry button. It does not prefix URLs.

Payload locales are `en` and `zh` (Simplified Chinese, `lang="zh-CN"`). Localised fields: page title, hero copy, marketing-block text, SEO title and description, header and footer labels, project public text, style and space names, project-image title and caption.

Not localised: slugs, addresses, statuses, SWMS content, and the template blocks (Content, Call to Action, Form, Media). The SWMS worker flow stays English and does not use the marketing header.

Empty Chinese CMS fields fall back to English. The seed writes Chinese only when the Chinese title (or name, or nav label) is still empty, matched to the existing block order. It also clears these old English-page subtitles when they are still the mixed-language lines: 住宅施工与翻新, 商业空间装修, 定制橱柜与木作, 室内装修与项目交付.

## Project library

`projects` is the same collection SWMS uses. Publish a project to show it on the website. Unpublish to hide it. SWMS can still reference it.

Admin:

- Projects: title, slug, type, descriptions, address, public location (`suburb`), show address publicly, featured image, styles, spaces, order, drafts
- Project Images: upload, caption, style and space tags, display order, publish, allow download
- Styles and Spaces: name in both locales, slug, active, order

Public:

- `/projects` — By Project and By Room, style chips, and a filter form (drawer on small screens)
- Filters combine and stay in the query string: `type`, `style`, `space`, `project`
- `/projects/[slug]` — description, tags, gallery, related projects, enquiry
- Lightbox, copy link, and download when `allowDownload` is on
- Full address only when `showAddressPublicly` is on. Otherwise the suburb is shown. Anonymous API reads follow the same rule.

Demo projects:

| Project | Address on the website | Notes |
| --- | --- | --- |
| Kew Residence | Suburb only | Modern / contemporary rooms |
| Armadale Terrace | Full address | Laundry image cannot be downloaded |
| Richmond Studio | Suburb only | Commercial |
| South Yarra Courtyard | Suburb only | Classic outdoor and home office |

`pnpm seed:demo` creates these when the slug is missing, and does not overwrite a project an admin has edited. Images are added only when that project has none. Delete the project to re-seed it.

## Demo

```bash
pnpm seed:demo
```

- `/` English hero, then 中文
- `/projects`
- `/projects?type=residential&style=modern`
- `/projects?space=kitchen`
- `/projects/kew-residence`
- `/projects/armadale-terrace` (address visible; laundry has no download)
- `/enquiry`

Preview and Production still seed only when `SEED_DEMO=true`, after `pnpm payload migrate`.

The Stage 3 migration copies existing English field values into the new locale tables before dropping those columns, marks every project that already exists as published, and fills a slug from the English title when the slug is empty. New projects can still be saved as drafts.

## Limitations

- SWMS screens are English only.
- A reordered page that has never had Chinese saved can receive Chinese on the wrong block. Translate that page in admin, or delete it and run `pnpm seed:demo` again.
- Template blocks outside the marketing set are not localised.
- Chinese type uses the visitor’s system CJK fonts.
- The gallery loads up to 200 published images.
