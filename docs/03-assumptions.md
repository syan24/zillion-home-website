# Assumptions and Deferred Decisions

Status: Draft v0.1

This file records decisions we may need to make because the client brief is intentionally high-level. These are not treated as confirmed client requirements.

## A. Product assumptions

### A1. English default, Chinese optional
**[ASSUMPTION]** The public marketing site defaults to English. A header control switches the whole marketing experience to Simplified Chinese, and back.

**[ASSUMPTION]** The choice is stored in a `locale` cookie (`en` or `zh`). Routes stay unprefixed (`/`, `/projects`, `/enquiry`) so existing links keep working. `zh` is Simplified Chinese; the document language is `zh-CN`.

**[ASSUMPTION]** Payload localisation is enabled for public copy: page title, hero and marketing-block text, SEO title and description, header and footer labels, project public text, and style/space names. Addresses, slugs, statuses, and SWMS evidence are not localised.

**[ASSUMPTION]** If a Chinese CMS field is empty, Payload falls back to English for that field. Chrome strings (navigation button, footer headings, enquiry form, project library) are complete in both languages and do not mix.

**[ASSUMPTION]** The SWMS worker flow stays English. It does not use the marketing header or the locale cookie.

### A2. Public site visual direction
**[ASSUMPTION]** Public-facing UI should feel premium, architectural and photography-led rather than like a generic SaaS dashboard.

### A3. Admin UI
**[ASSUMPTION]** Payload Admin will be used for most administration rather than building a separate custom back-office application for Phase 1.

### A4. No worker account for SWMS
**[CLIENT]** Workers do not require admin accounts.

**[ASSUMPTION]** QR access will use a secure random token and access only the intended SWMS worker flow.

## B. SWMS assumptions

### B1. Version immutability
**[ASSUMPTION]** Once a worker has signed a published SWMS version, that version must remain immutable.

### B2. Version update behaviour
**[ASSUMPTION]** Editing a published SWMS creates a new version.

### B3. Re-signing
**[ASSUMPTION]** Previously signed workers will not automatically be considered signed against a new version.

Whether the system actively requires/re-notifies workers to sign the new version is deferred until SWMS workflow is reviewed.

### B4. SWMS status
**[ASSUMPTION]** Minimum statuses: Draft, Active, Superseded/Archived.

### B5. Approval workflow
**[DEFERRED]** The client has not specified Draft -> Review -> Approval roles. Phase 1 can begin with administrator-controlled publish/activate unless management requests a formal approval process.

### B6. SWMS internal structure
**[DEFERRED / IMPORTANT]** The client has not defined the exact SWMS fields, hazards/controls structure, high-risk categories, risk matrix or legal wording.

Before final SWMS implementation, obtain either:
- a real SWMS template used by the client; or
- review/approval from their WHS/safety responsible person.

### B7. Signature format
**[ASSUMPTION]** Browser-drawn signature captured on mobile is acceptable unless the client requires another signature method.

### B8. Placeholder SWMS content
**[ASSUMPTION]** Slice D ships a clearly labelled placeholder template. It is not the client’s legal SWMS. Question wording, hazards, and controls must be replaced after a real template or WHS review (see B6).

### B9. Answers do not block signing
**[ASSUMPTION]** Required questions must be answered. A “No” or “Not applicable” answer is stored for review and does not stop submission. Phase 1 treats the flow as an acknowledgement, not a pass/fail exam.

### B10. Worker fields
**[ASSUMPTION]** Full name, acknowledgement, and signature are required. Company, phone, and trade/role are optional until the client confirms the register fields.

### B11. Stable QR, new version
**[ASSUMPTION]** The public token on a Project SWMS does not change after it is created, so a printed QR keeps working. Setting the Project SWMS to Active publishes an immutable version. Later edits while Active publish another version and mark the previous one superseded. Signatures remain linked to the version that was current at signing. The QR then resolves to the new active version. Notifying workers to sign again stays deferred (B3).

### B12. Project address on the worker flow
**[ASSUMPTION]** Workers never type an address. They scan the project QR or choose an admin-created project that has an active SWMS. The worker flow always shows that project’s name and address. `showAddressPublicly` is reserved for the future public portfolio and does not hide the address inside SWMS.

### B13. SWMS chrome
**[ASSUMPTION]** Worker routes use a focused header (logo and progress) and do not render the marketing header, footer, or admin bar.

### B14. Signature storage
**[ASSUMPTION]** The signature is stored as a PNG data URL on the acknowledgement record, not in the public Media collection. A private file upload can replace this later if file size or retention requires it.

### B15. Projects collection
**[ASSUMPTION]** Slice D adds a minimal `projects` collection (name, address, type, status) so SWMS can bind to a project. The portfolio slice should extend this collection rather than create a second project entity.

## C. Project portfolio assumptions

### C1. Project vs image metadata
**[ASSUMPTION]** Project-level data contains project type, title, address settings and project description.

**[ASSUMPTION]** Individual images may optionally have their own style/space metadata to improve filtering accuracy.

### C2. Address privacy
**[CLIENT]** Admin controls whether project address is public.

**[ASSUMPTION]** Admin may store full address privately while publishing a suburb/general location if needed later.

### C3. Sharing
**[ASSUMPTION]** "Copy share link" initially means copying a public project/image URL, not generating time-limited private links. An image link is `/projects/[slug]?image=[id]`.

### C4. One project record, publication controls the website
**[ASSUMPTION]** Portfolio fields extend the existing `projects` collection. Payload drafts control whether a project appears on the public website. SWMS can still reference a draft or published project. The public gallery only lists published images whose project is published.

### C5. Suburb is the public location
**[ASSUMPTION]** `suburb` is the public location text. The full `address` is shown on the website only when `showAddressPublicly` is on. Anonymous REST reads follow the same rule. The SWMS worker flow still receives the address through the server Local API.

### C6. Image download
**[ASSUMPTION]** Each project image has `allowDownload`. When it is off, the public page hides the download action and the download route returns 404. The image can still be viewed.

### C7. Style and space filters match the image or its project
**[ASSUMPTION]** A style or space filter matches an image that has that tag, or whose project has that tag. Project type and a specific project narrow the same result set. The filters are combined with AND and stored in the query string.

### C8. By Room entries
**[ASSUMPTION]** The eight room cards follow the design feedback: Kitchen, Bathroom, Living, Bedroom, Wardrobe & Joinery, Laundry, Home Office, Outdoor. An Office space exists for commercial images and appears in the filter drawer, not as a ninth card.

## D. Enquiry assumptions

### D1. Enquiry status
**[ASSUMPTION]** Admin status may initially be:
- New
- Contacted
- Qualified
- Closed

This is a convenience feature and not client-specified.

### D2. Email behaviour
**[CLIENT]** Submission details are sent to the company and retained in admin.

**[ASSUMPTION]** Existing client email infrastructure will be integrated later; email provider/cost is outside this project planning document.

### D3. File limits
**[ASSUMPTION]** Accepted enquiry file types and size limits will be defined before implementation based on Vercel Blob policy and practical UX.

## E. Technical assumptions

### E1. Single full-stack app
**[ASSUMPTION]** Next.js + Payload will run as one application and one main codebase.

### E2. Hosting
**[ASSUMPTION]** Vercel Pro is the production hosting platform.

### E3. Database
**[ASSUMPTION]** PostgreSQL will be used. Neon is the initial preferred managed database because it fits the Payload/Vercel stack.

### E4. Object storage
**[ASSUMPTION]** Vercel Blob will be used initially with public/private separation.

### E5. Environments
**[ASSUMPTION]** Local, Preview, Staging and Production environments will be maintained with isolated staging/production data.

### E6. Payload admin vs custom admin
**[ASSUMPTION]** Use Payload Admin whenever it gives an acceptable experience. Build custom staff screens only where workflow/user experience clearly requires it.

## G. Stage 2 website CMS and demo seed

### G1. Pages blocks instead of a Services collection
**[ASSUMPTION]** Home, About and Services are documents in the existing Pages collection, using marketing layout blocks. A separate Services collection is not added. `docs/06-payload-collections.md` already allows page blocks when services are simple.

### G2. Locales replace bilingual subtitle lines
**[ASSUMPTION]** Service-card subtitles are an optional second line in the current locale. They are not a second language under an English title. See A1.

### G3. Demo seed is skip-if-exists, including production
**[ASSUMPTION]** The project owner has asked for demo data on Preview and Production after each deploy. `pnpm seed:demo` creates missing website pages, placeholder media, portfolio projects and the existing SWMS demo. It does not overwrite an existing page, media file, project or SWMS record. Empty header and footer fields are filled. Chinese locale fields are filled only when that locale is still empty. The one exception is the homepage hero file `hero-house.jpg`: if that media item is still in the library, a changed file is replaced so the darker hero reaches pages that already use it. The deploy runs this only when `SEED_DEMO=true`, using the deployment’s existing `DATABASE_URL`.

### G4. Icons stay in code
**[ASSUMPTION]** Process-step icons and the category-bar icons are chosen by item order. Admins edit the labels. Adding a sixth item reuses the last icon.

### G5. Enquiry stays a shell
**[ASSUMPTION]** The Enquiry form shell stays hardcoded until Stage 4. It does follow the locale cookie. `/contact` keeps redirecting to `/enquiry`. The project library is Stage 3.

### G6. Header chrome that is not navigation
**[ASSUMPTION]** The header enquiry button always uses the beige enquiry style and links to `/enquiry`. Its label follows the active locale. The EN / 中文 control sets the `locale` cookie and reloads marketing copy. See A1.

### G7. About hero photo
**[ASSUMPTION]** The Unsplash id previously labelled “Construction team at work” (`photo-1581094794329`) is an office photograph. The seed and the no-CMS fallback use a construction-site photo (`photo-1541888946425`) for that placement.

## F. Decisions that should be confirmed internally before implementation

1. Is Phase 1 English-only at launch?
2. Does the client have an existing brand guide/logo/colour palette?
3. Does the client have real project photos/content available?
4. Does the client have a real SWMS template we can model?
5. What exact worker details must be recorded when signing?
6. Is a formal SWMS reviewer/approver required?
7. Should a new SWMS version force re-signing?
8. What export output does the client expect: CSV, PDF, or both?
9. What file types/max size should enquiry attachments support?
10. Who receives enquiry notification emails?
