# Critical User Flows

Status: Draft v0.1

## Flow 1 - Visitor browses project inspiration

**Goal:** quickly find relevant project imagery and share it.

```text
Home
  -> Projects
  -> choose Residential or Commercial
  -> optionally filter by project
  -> optionally filter by style
  -> optionally filter by space
  -> open image/project
  -> view larger image
  -> copy link or download
  -> optionally start enquiry
```

**Source:** project case library, filtering, image viewing/download/sharing are client requirements.

**UX assumptions:**
- filtering should update quickly without a full page reload where practical;
- selected filters should remain visible;
- filtered state should be URL-backed for sharing;
- mobile filter controls should use a compact drawer/sheet.

---

## Flow 2 - Visitor submits an enquiry

```text
Home / Project / CTA
  -> Start Enquiry
  -> Step 1: name / phone / email
  -> Step 2: address / Residential-Commercial / project type
  -> Step 3: spaces / work scope
  -> Step 4: style / additional notes
  -> Step 5: budget / expected start
  -> Step 6: upload photos / plans / files
  -> Review
  -> Submit
  -> Confirmation
  -> record stored in Payload
  -> company notification triggered
```

**Source:** client defines a short multi-step Quiz and the data categories above.

**UX assumptions:**
- show step/progress indicator;
- preserve data when navigating backward;
- validate step-by-step;
- clearly display upload state/errors;
- prevent duplicate submission on repeated clicks.

---

## Flow 3 - Admin creates/updates a project case

```text
Admin login
  -> Projects
  -> Create project
  -> enter title / Residential-Commercial / description
  -> enter address and public-address setting
  -> assign styles/spaces/tags
  -> upload multiple photos
  -> order photos
  -> preview
  -> publish
```

**Source:** client requires project creation, multiple images, text, tags, ordering and unpublishing.

**Assumption:** Payload draft/preview should be used where appropriate.

---

## Flow 4 - Admin creates an SWMS from a company template

```text
Admin login
  -> SWMS Templates
  -> select template
  -> create Project SWMS
  -> select project
  -> customise project-specific content
  -> save draft
  -> publish/activate
  -> system creates current version
  -> secure QR/link available
  -> admin downloads/copies QR/link
```

**Source:** reusable template + project-specific SWMS + QR/link are client requirements.

**Assumptions:**
- published versions are immutable;
- activation creates a version snapshot;
- QR URL uses an unguessable token.

---

## Flow 5 - Worker reads and signs an SWMS on mobile

```text
Worker scans QR
  -> SWMS landing page
  -> sees project / SWMS identification
  -> reads SWMS content
  -> enters personal details
  -> confirms acknowledgement
  -> signs
  -> submits
  -> system stores signature against exact SWMS version + project
  -> confirmation screen
```

**Source:** client explicitly requires QR, mobile reading, personal details, confirmation/signature and stored signer/date/time/signature/project/version.

**UX assumptions:**
- mobile-first layout;
- large tap targets and readable content;
- worker does not see admin navigation;
- submit action must clearly indicate success/failure;
- reloading after success should not accidentally duplicate a record.

---

## Flow 6 - Admin reviews signed SWMS records

```text
Admin login
  -> SWMS
  -> Signatures / Acknowledgements
  -> filter by project / SWMS / version / date / signer
  -> open record
  -> verify signature and metadata
  -> download/export register or record
```

**Source:** client requires view/search/download/export by project.

**Assumption:** both CSV register export and printable/PDF record are desirable unless scope needs to be reduced.

---

## Flow 7 - Admin supersedes an SWMS version

```text
Admin opens active Project SWMS
  -> Edit/Create new revision
  -> publish new version
  -> previous version becomes superseded
  -> existing signatures remain linked to previous version
  -> QR route resolves to new active version
```

**Assumption:** this is recommended for evidence integrity but is not explicitly defined by the client.

**Deferred decision:** whether workers who signed an earlier version must be notified or forced to sign the new version.
