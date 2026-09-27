# Phase 1 Development Roadmap

Status: Draft v0.1

Approach: deliver complete vertical slices instead of building all backend first and all UI later.

## Stage 0 - Product and design foundation

### Goals
- confirm product assumptions;
- establish information architecture;
- establish design direction;
- create technical baseline.

### Tasks
1. Review this `/docs` package.
2. Mark assumptions as accepted/rejected/deferred internally.
3. Obtain client brand assets if available.
4. Obtain real project photos/content if available.
5. Request at least one real client SWMS template before finalising SWMS schema.
6. Create UI concepts for:
   - Home;
   - Project Gallery;
   - Mobile SWMS worker page.
7. Define design tokens/components.
8. Finalise initial Payload collections.

### Exit criteria
- Phase 1 scope is clear;
- three key UI directions are approved internally;
- unresolved SWMS questions are documented.

---

## Stage 1 - Project bootstrap and deployment baseline

### Tasks
- initialise official Payload Website template locally;
- use current stable Payload release;
- standardise Node/pnpm versions;
- configure PostgreSQL local development;
- create GitHub repository/branch strategy;
- add `AGENTS.md`;
- add `/docs`;
- configure lint/typecheck/tests;
- connect Vercel;
- configure development/preview/staging deployment;
- provision staging database/storage;
- confirm Payload admin login and baseline deployment.

### Exit criteria
- app runs locally;
- app builds in CI;
- preview deployment works;
- staging deployment works;
- migrations can be applied safely.

---

## Stage 2 - Design system + core website CMS

### Tasks
- define typography/spacing/colours/components;
- implement Header/Footer;
- implement Pages/layout blocks;
- implement Home/About/Services/Contact;
- configure media management;
- responsive QA.

### Exit criteria
- admin can update primary website content without code;
- public site meets agreed visual direction across mobile/tablet/desktop.

---

## Stage 3 - Project portfolio vertical slice

### Data
- Projects
- ProjectImages
- Styles
- Spaces

### Admin
- create/edit project;
- upload/reorder images;
- manage tags;
- control address visibility;
- publish/unpublish.

### Public UI
- Projects listing;
- filters;
- combined filtering;
- Project Detail;
- lightbox;
- image download where permitted;
- copy/share link.

### Testing
- CRUD permissions;
- filtering combinations;
- mobile gallery/filter experience;
- hidden address behaviour.

### Exit criteria
- complete project library requirement is usable end-to-end.

---

## Stage 4 - Enquiry Quiz vertical slice

### Data
- Enquiries

### UI
- multi-step responsive Quiz;
- validation;
- attachments;
- review/submit;
- confirmation.

### Admin
- enquiry list/detail;
- basic filter/search;
- optional internal status/notes.

### Integration
- company email notification using client-provided email arrangement.

### Testing
- validation;
- file uploads;
- mobile flow;
- duplicate prevention;
- persisted submission.

### Exit criteria
- complete enquiry is captured, retained and visible to admin.

---

## Stage 5 - SWMS model and admin vertical slice

### Prerequisite
- review a real client SWMS template or formally document that the initial structure is an assumption.

### Data
- SWMSTemplates
- ProjectSWMS
- SWMSVersions
- SWMSAcknowledgements

### Admin
- create/reuse template;
- create project SWMS;
- customise project-specific content;
- publish/activate;
- generate/copy QR/link;
- preserve versions.

### Testing
- version creation;
- immutable published versions;
- token access;
- permissions.

### Exit criteria
- admin can create a project-specific active SWMS and obtain a working QR/link.

---

## Stage 6 - Mobile worker signing vertical slice

### UI
- SWMS identification/project context;
- readable SWMS content;
- worker details;
- acknowledgement;
- signature;
- submit;
- completion.

### Data behaviour
- store signer/date/time/signature/project/exact SWMS version;
- prevent accidental duplicate submission.

### Testing
- iOS/Android responsive widths;
- touch signature behaviour;
- expired/invalid token states;
- submit error/success;
- evidence linked to exact version.

### Exit criteria
- worker can complete the full process from QR scan on mobile without admin access.

---

## Stage 7 - SWMS register/export

### Admin
- filter by project/SWMS/version/signer/date;
- view signature details;
- download/export records.

### Export
- CSV register;
- PDF/printable record if included in Phase 1 scope.

### Exit criteria
- administrators can retrieve signed evidence efficiently by project.

---

## Stage 8 - Phase 1 hardening and UAT

### Functional QA
- public website;
- project filters;
- enquiry flow;
- admin operations;
- SWMS creation/signing/export.

### Non-functional QA
- mobile/responsive;
- accessibility basics;
- performance;
- security review;
- private/public file access;
- environment separation;
- backup/restore process;
- error monitoring.

### Content/UAT
- real company content;
- real projects/photos;
- real SWMS sample;
- manager/client review.

### Exit criteria
- production release approved;
- migration/deployment rollback documented;
- Phase 1 acceptance checklist passed.

---

## Suggested implementation order summary

```text
Product/design foundation
        ↓
Bootstrap + Vercel staging
        ↓
Website CMS
        ↓
Project portfolio
        ↓
Enquiry Quiz
        ↓
SWMS admin/versioning
        ↓
Worker mobile signing
        ↓
Register/export
        ↓
Hardening/UAT
        ↓
Production
```

## Important rule for AI/code agents

Each implementation task should reference:
- this roadmap;
- `02-product-specification.md`;
- `03-assumptions.md`;
- the UI design system once created.

Agents should not invent new business behaviour silently. Any new assumption that affects workflow, permissions, data retention or scope should be added to `03-assumptions.md` for review.
