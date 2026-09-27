# Assumptions and Deferred Decisions

Status: Draft v0.1

This file records decisions we may need to make because the client brief is intentionally high-level. These are not treated as confirmed client requirements.

## A. Product assumptions

### A1. English-first launch
**[ASSUMPTION]** The product will launch in English.

**[ASSUMPTION]** Payload localisation will be enabled or the schema will be localisation-ready so Chinese can be added later.

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

## C. Project portfolio assumptions

### C1. Project vs image metadata
**[ASSUMPTION]** Project-level data contains project type, title, address settings and project description.

**[ASSUMPTION]** Individual images may optionally have their own style/space metadata to improve filtering accuracy.

### C2. Address privacy
**[CLIENT]** Admin controls whether project address is public.

**[ASSUMPTION]** Admin may store full address privately while publishing a suburb/general location if needed later.

### C3. Sharing
**[ASSUMPTION]** "Copy share link" initially means copying a public project/image URL, not generating time-limited private links.

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
