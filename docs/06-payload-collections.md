# Recommended Payload CMS Collections and Globals

Status: Draft v0.1

The aim is to keep Phase 1 simple while avoiding a future rewrite for Phase 2.

## 1. Collections

### Users
**Purpose:** Payload admin authentication and future staff/customer expansion.

Initial fields:
- name
- email
- role
- active

Initial role values [ASSUMPTION]:
- admin
- editor

Future role values:
- staff
- customer

---

### Media
**Purpose:** reusable media library for public website/project content.

Recommended fields:
- alt text
- caption
- copyright/source optional
- focal point if supported by UI needs
- public/private classification where relevant

Note: sensitive SWMS signatures/documents should not be mixed casually into a public media model.

---

### Pages
**Purpose:** CMS-managed website pages.

Recommended fields:
- title
- slug
- status/draft
- layout blocks
- SEO metadata
- localised content fields where appropriate

---

### Services
**Purpose:** service scope content for public website.

Status: [ASSUMPTION] - the client requires service scope but not a specific content model.

Stage 2 uses Pages layout blocks for Home, About and Services instead of a Services collection. See `docs/12-stage-2-cms-and-demo-seed.md`.

---

### Projects
**Purpose:** core project/case entity used now for portfolio and later for project management.

Recommended fields:
- title
- slug
- type: Residential | Commercial
- short description
- full description
- full address (private/admin)
- public location text
- show address publicly: boolean
- featured image
- styles: relationship
- spaces: relationship
- gallery/project images
- featured: boolean
- display order
- publication status
- project status [future-compatible]
- client relationship [future, nullable]
- responsible staff [future, nullable]

Important: do not model Phase 1 project cases separately from future projects unless there is a strong business reason. Reusing the same Project entity reduces migration later.

---

### ProjectImages
**Purpose:** image-level metadata and filtering.

Recommended fields:
- project relationship
- image/media relationship
- title/caption
- styles relationship
- spaces relationship
- display order
- publish flag

Alternative: use an array inside Projects if image-level querying/filtering is not needed. A dedicated collection is recommended if filtering across many images is a primary feature.

---

### Styles
Examples from client:
- Modern
- Contemporary
- Classic
- Minimalist

Fields:
- name
- slug
- active
- display order

---

### Spaces
Examples from client:
- Kitchen
- Bathroom
- Living
- Bedroom
- Facade
- Office
- Restaurant

Fields:
- name
- slug
- active
- display order

---

### Enquiries
**Purpose:** store customer Quiz submissions.

Recommended fields:
- submission reference
- submitted at
- name
- phone
- email
- address
- project type
- project category/type detail
- project scope
- selected spaces
- selected/preferred style
- requirements/notes
- budget range
- expected start
- attachments
- status [ASSUMPTION]
- internal notes [ASSUMPTION]

Recommended access:
- create: public endpoint with validation/rate limiting
- read/update: admin only

---

### SWMSTemplates
**Purpose:** reusable company SWMS source templates.

Recommended fields:
- name
- description
- template content/structured sections
- active
- revision/update metadata

Important deferred decision: whether template content is rich text only or structured hazard/task/control rows. Prefer modelling from a real client SWMS template before finalising.

---

### ProjectSWMS
**Purpose:** logical SWMS assigned to a project.

Recommended fields:
- project relationship
- title/reference
- source template relationship
- current status
- current version relationship
- secure public token
- activated/published date
- archived date

This record is the stable identity used by the QR route.

---

### SWMSVersions
**Purpose:** immutable snapshot of exactly what a worker signed.

Recommended fields:
- ProjectSWMS relationship
- project relationship
- version number
- content snapshot
- created by
- created at
- activated/published at
- superseded at
- status

Access rule recommendation:
- no editing after publication/activation;
- new changes create another version.

---

### SWMSAcknowledgements
**Purpose:** worker signature/evidence record.

Recommended fields:
- project relationship
- ProjectSWMS relationship
- SWMSVersion relationship
- worker full name
- worker company [optional/deferred]
- worker phone/email [optional/deferred]
- acknowledgement statement/version
- signature
- signed at
- IP/user agent [optional/legal review]
- submission reference

Access:
- create through restricted public SWMS workflow;
- read/export admin only.

---

## 2. Globals

### SiteSettings
Recommended:
- company name
- contact details
- address
- social links
- default SEO
- logo/brand assets

### Header
- logo
- nav items
- CTA

### Footer
- contact information
- links
- copyright

---

## 3. Relationship overview

```text
Projects
  ├── ProjectImages
  │     ├── Styles
  │     └── Spaces
  │
  └── ProjectSWMS
        └── SWMSVersions
              └── SWMSAcknowledgements

SWMSTemplates
  └── source for ProjectSWMS / SWMSVersions

Enquiries
  └── independent Phase 1 lead records

Users
  └── administer content and later relate to projects
```

## 4. Localisation recommendation

Enable localisation selectively, not on every field.

Good candidates:
- page titles/content;
- service content;
- project public descriptions;
- style/space display labels if required.

Do not localise:
- IDs;
- addresses;
- system statuses;
- timestamps;
- signature evidence;
- internal references.

Default locale: `en`
Optional locale: `zh-CN`
