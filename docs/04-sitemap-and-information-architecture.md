# Sitemap and Information Architecture

Status: Draft v0.1

## 1. Phase 1 public website

```text
/
├── /about
├── /services
│   └── /services/[slug]              [ASSUMPTION]
├── /projects
│   └── /projects/[slug]
├── /enquiry
├── /contact
├── /privacy                          [ASSUMPTION]
└── /terms                            [ASSUMPTION]
```

### Home
**Purpose:** introduce company, establish trust, show services and strong project imagery, drive users to projects or enquiry.

**Suggested sections [ASSUMPTION]:**
- hero;
- services overview;
- featured projects;
- Residential / Commercial positioning;
- qualifications/trust section;
- enquiry CTA;
- contact/footer.

### About
**[CLIENT]** Company introduction, qualifications and contact/context information.

### Services
**[CLIENT]** Communicate service scope.

**[ASSUMPTION]** Individual service pages are useful for SEO/content flexibility but can be omitted initially if content volume is small.

### Projects
**[CLIENT]** Main project case library with filters for project type, project, style and space.

**Recommended UI [ASSUMPTION]:**
- Residential / Commercial switch;
- filter drawer/dropdowns;
- active filter chips;
- responsive photography grid;
- clear reset filters;
- shareable URL state.

### Project Detail
**[CLIENT]** Supports project images, description/tags, large image view, download and sharing.

**Suggested structure [ASSUMPTION]:**
- title;
- Residential/Commercial;
- location according to privacy setting;
- description;
- style/space tags;
- gallery;
- related projects;
- enquiry CTA.

### Enquiry
**[CLIENT]** Multi-step Quiz.

### Contact
**[CLIENT]** Contact information.

---

## 2. Phase 1 worker-only route

```text
/swms/[token]
├── overview
├── content
├── worker-details
├── acknowledgement
├── signature
└── completed
```

This does not need to be represented as separate URLs; it can be a single mobile-first guided flow.

**[CLIENT]** Worker must not receive access to the company admin system.

---

## 3. Payload admin information architecture

```text
/admin
├── Dashboard
│
├── Website
│   ├── Pages
│   ├── Navigation
│   ├── Media
│   └── SEO / Redirects
│
├── Projects
│   ├── Projects
│   ├── Project Images
│   ├── Styles
│   └── Spaces
│
├── Enquiries
│   └── Enquiry Submissions
│
├── SWMS
│   ├── SWMS Templates
│   ├── Project SWMS
│   ├── SWMS Versions
│   └── Signatures / Acknowledgements
│
└── Administration
    └── Users
```

**[ASSUMPTION]** Use Payload Admin grouping/labels to keep the experience simple for non-technical client users.

---

## 4. Phase 2 information architecture (future only)

```text
/portal
├── /projects
│   └── /projects/[id]
│       ├── overview
│       ├── documents
│       ├── progress
│       ├── messages
│       └── variations
└── /account

/staff
├── /projects
└── /projects/[id]/upload
```

The Phase 1 schema should preserve project IDs/relationships so these features can be added later without redesigning the core data model.
