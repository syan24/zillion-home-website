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

**[ASSUMPTION]** The enquiry is saved first. Email never blocks the submission. A company notification is sent only when `ENQUIRY_NOTIFY_TO` and `ENQUIRY_NOTIFY_FROM` are set and a provider is configured. `RESEND_API_KEY` sends through the Resend HTTPS API. Otherwise `SMTP_HOST` (optional `SMTP_PORT`, default 587, `SMTP_USER`, `SMTP_PASS`, `SMTP_SECURE`) sends through SMTP. If both providers are set, Resend is used. When the mailbox or provider is missing, the enquiry is still stored and the admin record is marked skipped, with the reason in the email detail. A send failure is marked failed and logged. The message is English, uses the visitor’s email as Reply-To, and links to the admin enquiry. It does not include the visitor’s IP. The client still needs to choose the real mailbox and provider.

### D3. File limits
**[ASSUMPTION]** Until the client confirms a different limit, enquiry attachments accept PDF, PNG, JPG/JPEG, and DWG. Up to 10 files, 10MB each. This matches the file note on the approved enquiry page. Files are stored on the `enquiry-files` upload collection, not in the public Media library. Payload read access is admin-only. The stored filename is random. The Vercel Blob adapter currently only supports public blob access, so someone who already has the file URL can open it. The website API does not list those URLs.

### D4. Single-page form
**[ASSUMPTION]** Stage 4 keeps the approved Fig 02 page: one form, not a new multi-step wizard. Progress, back navigation, and a review step are not added. The questions on that page are the seeded Form Builder form, so staff can change labels, options, required flags, and questions in Admin without a deploy.

### D5. Project type, scope, and spaces
**[ASSUMPTION]** The seeded enquiry form offers Residential, Commercial, and Custom Joinery. Interior Fit-out is not in that seed. Staff can add or rename options on the form; the submitted option value is stored on the enquiry. `projectTypeDetail` is an optional staff field. Scope checkboxes are stored as submitted. Kitchen, wardrobe, and bathroom vanity are also copied to `spaces` when those exact values are selected. Other scope values stay on scope only. Style is free text inside the project description, not a Styles relationship.

### D11. Form Builder is the public form
**[ASSUMPTION]** Payload Form Builder is the source for the public `/enquiry` questions. The page uses the earliest form with **Enquiry form** checked. Seed creates that form once and does not overwrite later edits. English and 中文 labels are stored on the form. The page heading, image, consent sentence, and thank-you text stay in the site locale messages so the reference can be shown after save.

Field `name` values map onto Enquiries like this:

| Form field name | Enquiry field |
| --- | --- |
| `name` | Name |
| `phone` | Phone |
| `email` | Email |
| `address` | Project address / suburb |
| `projectType` | Project type (the option value) |
| `scope` | Scope of work. A checkbox group stores every selected value. |
| `budget` | Approximate budget |
| `timeline` | Expected start |
| `notes` | Style and notes |
| `description` | Style and notes, when the form has no `notes` field |
| `attachments` or `files` | Attachments |

Any other named question is stored in **Additional answers**, including the filenames for an upload question that uses a different name. The files themselves are still saved on the enquiry. A value is accepted when it is one of that question’s options. The original three project types are the seed, not a hard reject list.

The enquiry page is the only public create path for that form. Posting it to form submissions is rejected. Other forms can still use form submissions.

The confirmation message on the Form document is kept so the form is valid. `/enquiry` shows its own thank-you and reference instead, because the reference is created with the enquiry.

### D6. Phone and consent
**[ASSUMPTION]** Email is required. Phone is optional. The asterisk on the contact group is met by the email. The existing consent sentence stays. A separate checkbox is not added.

### D7. What staff can change
**[ASSUMPTION]** After submit, the visitor’s answers, files, reference, and time stay as submitted. Staff can change status (New, Contacted, Qualified, Closed), internal notes, and project type detail. Authenticated users can delete an enquiry, including its files, so spam can be removed.

### D8. Duplicate submits
**[ASSUMPTION]** The browser keeps one idempotency key for the tab until the enquiry succeeds. A repeated click or a retry of that same attempt returns the original reference. After success, reloading `/enquiry` shows the confirmation for that tab. “Submit another enquiry” starts a new key. A second visitor is not blocked by someone else’s success.

### D9. Submission limit
**[ASSUMPTION]** The same IP address can create 20 enquiries per hour. Retries of an existing idempotency key do not count again. The IP and user agent are stored on the enquiry for that limit and for spam review.

### D10. Attachments and Blob
**[ASSUMPTION]** With `BLOB_READ_WRITE_TOKEN`, the browser uploads each file straight to Vercel Blob, then the server copies it into `enquiry-files` and deletes the temporary object. That avoids the platform request-body limit. Without the token, the file is posted with the form and stored on local disk under `enquiry-uploads/`, which is not a public folder. Anonymous REST create on Enquiries and Enquiry files is closed. The public form is the only create path, so validation and the idempotency key cannot be skipped. Abandoned temporary Blob uploads are not swept in this stage. A successful or rejected submit deletes the temporary objects it knows about.

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
**[ASSUMPTION]** The project owner has asked for demo data on Preview and Production after each deploy. `pnpm seed:demo` creates missing website pages, placeholder media, portfolio projects, the existing SWMS demo, and one sample enquiry (`ENQ-DEMO-KEW`) when that reference is missing. It does not overwrite an existing page, project, project-image row, SWMS record, or that sample enquiry. The sample enquiry has no attachment. Empty header and footer fields are filled. Chinese locale fields are filled only when that locale is still empty. The deploy runs this only when `SEED_DEMO=true`, using the deployment’s existing `DATABASE_URL`.

### G8. Orphan seed media is re-uploaded in place
**[ASSUMPTION]** A Media document whose filename is already taken is not proof that the file can be served. Rows created before `BLOB_READ_WRITE_TOKEN` was available can point at `/api/media/file/<filename>` while the bytes never landed in Vercel Blob. `pnpm seed:demo` and `pnpm seed:demo:deploy` re-upload that seed file onto the same Media id when the URL is missing or local-only, the filesize is missing or 0, Blob does not have the object, or the public file URL returns 404. Marketing images and portfolio images both follow this rule. A healthy file is left alone: same filesize as the seed asset and a working URL is sufficient, and a reachable file with a different size is kept so an admin replacement that actually serves is not reset. The exception remains `hero-house.jpg`: a different stored size is replaced so the darker hero stays on pages that still use that media item. A 404 re-uploads the seed asset even if an admin had previously replaced that filename, because the replacement is not being served. `seed:demo:deploy` fails when `SEED_DEMO=true` and the Blob token is missing, so a deploy cannot create more orphan rows. Durability is confirmed with the Blob API `head` call (the same call `/api/media/file/<filename>` makes), using the Blob URL stored on the Media document when there is one, otherwise the object path from `prefix`, `_objectKey`, and filename. An anonymous GET of the public Blob CDN is not treated as proof, because that CDN can keep a cached 404 after a successful upload. Local `pnpm seed:demo` still runs without the token and stores files on disk. The public check uses `NEXT_PUBLIC_SERVER_URL`, or the Vercel production host when that is unset. This code does not change Production until a deploy with `SEED_DEMO=true` and the Blob token runs.

### G4. Icons stay in code
**[ASSUMPTION]** Process-step icons and the category-bar icons are chosen by item order. Admins edit the labels. Adding a sixth item reuses the last icon.

### G5. Enquiry form stays in code
**[ASSUMPTION]** The enquiry form stays in code rather than a CMS form, and it follows the locale cookie. Stage 4 saves each submission. `/contact` keeps redirecting to `/enquiry`. See `docs/14-stage-4-enquiry.md`.

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
9. What file types/max size should enquiry attachments support? Working assumption: D3.
10. Who receives enquiry notification emails? Working assumption: D2. The recipient is `ENQUIRY_NOTIFY_TO` until the client names the mailbox.
