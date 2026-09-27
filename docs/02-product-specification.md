# Initial Product Specification

Status: Draft v0.1
Primary delivery target: Phase 1

## 1. Product summary

Zillion Home requires a public-facing company website with a strong visual project portfolio, a guided enquiry experience and a lightweight SWMS management/signing workflow.

The same technical foundation should support a later customer/project portal without requiring a platform rewrite.

## 2. Phase 1 product goals

**[CLIENT]**
1. Launch the company website quickly.
2. Allow non-developers to maintain website content and project cases.
3. Make project photography easy to browse, filter and share.
4. Capture higher-quality customer enquiries through a guided Quiz.
5. Allow project/site workers to access project-specific SWMS documents by QR/link and sign on mobile.
6. Retain signed SWMS evidence against the correct project and SWMS version.

**[ASSUMPTION]**
7. The initial product should be visually polished enough to act as the company's primary marketing site, not only as an internal operations tool.
8. English is the launch language. The data model should permit Chinese localisation later without requiring a schema redesign.

## 3. Primary user types

### Public visitor
**[CLIENT]** Can browse public website content and project cases and submit an enquiry.

### Worker / installer
**[CLIENT]** Can access only a specified SWMS via QR/link and complete acknowledgement/signature without entering the admin system.

### Administrator
**[CLIENT]** Can maintain website content, projects, photos, enquiry records and SWMS content/records.

### Staff user
**[FUTURE]** Required in Phase 2 for project-specific access and mobile progress uploads.

### Customer portal user
**[FUTURE]** Required in Phase 2 to access only their projects, documents, progress photos, messages and Variations.

## 4. Phase 1 functional scope

### 4.1 Public website

**[CLIENT]** Must include company information, service scope, qualifications and contact details.

**[ASSUMPTION]** Initial public pages:
- Home
- About
- Services
- Projects
- Project Detail
- Enquiry
- Contact
- Privacy / Terms placeholders if required

**[ASSUMPTION]** Homepage content blocks should be CMS-managed so the client can alter marketing content without code changes.

### 4.2 Project portfolio

**[CLIENT]** Must support Residential/Commercial classification, project filters, style filters, space filters, combined filtering, multiple images, descriptions/tags, ordering, unpublishing, image download and share-link copy.

**[ASSUMPTION]** Public filtering will use URL query parameters so a filtered gallery can be shared/bookmarked.

**[ASSUMPTION]** A project can contain multiple images and an image can have its own space/style tags when useful.

**[ASSUMPTION]** Project address visibility will be controlled by an explicit admin setting, rather than inferred from publication state.

**[ASSUMPTION]** Public project pages will prioritise photography and use a responsive lightbox/gallery experience.

### 4.3 Enquiry Quiz

**[CLIENT]** Multi-step form capturing contact details, project details, requirements, budget/timing and attachments.

**[ASSUMPTION]** Recommended step structure:
1. Contact details
2. Project type and location
3. Scope / spaces / service requirements
4. Style / notes
5. Budget / target start
6. Attachments
7. Review and submit

**[ASSUMPTION]** Each step should validate before continuing.

**[ASSUMPTION]** Final submission creates an immutable submission snapshot visible to administrators.

**[ASSUMPTION]** The UI should include explicit consent/acknowledgement for collection of submitted details if required by the client's privacy policy.

### 4.4 SWMS administration

**[CLIENT]** Administrators can create reusable templates and project-specific SWMS documents.

**[ASSUMPTION]** Recommended baseline lifecycle:
- Draft
- Published / Active
- Superseded / Archived

**[ASSUMPTION]** A published SWMS version must become immutable for evidence integrity. Editing an active SWMS creates a new version rather than changing previously signed content.

**[ASSUMPTION]** A project SWMS can be created from a reusable template and then customised for project-specific information before publishing.

**[ASSUMPTION]** QR codes should point to a stable project-SWMS access URL containing a random, non-sequential token.

### 4.5 Worker SWMS experience

**[CLIENT]** Mobile worker flow must support reading, entering personal data, confirmation and signature.

**[ASSUMPTION]** Initial worker fields:
- Full name
- Company/employer (optional unless confirmed as required)
- Mobile or email (optional unless confirmed as required)
- acknowledgement checkbox/statement
- signature

**[ASSUMPTION]** On completion, store:
- worker-submitted details;
- signature data/file;
- acknowledgement timestamp;
- SWMS version ID;
- project ID;
- basic audit metadata such as IP/user agent where lawful and useful.

**[ASSUMPTION]** Completion page should show confirmation and a reference/time rather than exposing admin navigation.

### 4.6 SWMS register and export

**[CLIENT]** Admin can view, search, download and export signed records by project.

**[ASSUMPTION]** Initial filters:
- project;
- SWMS;
- SWMS version;
- signer;
- signed date range.

**[ASSUMPTION]** Export formats:
- CSV register;
- printable/downloadable PDF record where practical.

## 5. Non-functional requirements

### Responsive design
**[CLIENT]** Website must support desktop, tablet and mobile.

**[ASSUMPTION]** SWMS signing must be designed mobile-first because QR scanning is the expected entry point.

### Content administration
**[CLIENT]** Admin must be able to update site content, images and projects without developer support.

### Security
**[ASSUMPTION]**
- authenticated admin access;
- role-based permissions where required;
- private storage for SWMS signatures and non-public documents;
- non-guessable public SWMS tokens;
- validation and rate limiting on public forms;
- separate staging and production data.

### Auditability
**[CLIENT]** Signed SWMS records must preserve project/SWMS version relationship.

**[ASSUMPTION]** Admin changes to published SWMS versions should not alter already-signed evidence.

### Accessibility
**[ASSUMPTION]** Target WCAG 2.1 AA practices for major public and worker flows where practical.

### Localisation
**[ASSUMPTION]** English is default. Localisable CMS fields should be used for public marketing content that may later be translated into Chinese.

## 6. Explicitly outside Phase 1 unless separately approved

**[FUTURE]**
- customer accounts;
- customer project portal;
- project document confirmation/signature;
- progress photo portal;
- project messaging;
- Variation workflow;
- staff project permissions;
- staff mobile progress upload;
- advanced SWMS approval chains;
- inductions/toolbox talks/incident management/SDS/permits;
- complex HSEQ analytics.
