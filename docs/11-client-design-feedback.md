# Client Design Feedback Summary — 2026-09-28

This document summarises the five key design decisions from client feedback.

## 1. Homepage: Builder Positioning

**Source**: `docs/design-feedback/01-homepage-builder-positioning.png`

- Hero headline: "Built from the ground up."
- Zillion Home is a **builder**, not a design studio
- Four core services displayed prominently:
  1. Residential Construction & Renovation
  2. Commercial Fit-out
  3. Custom Joinery & Cabinetry
  4. Interior Fit-out & Project Delivery
- Service category icons in footer area

## 2. Enquiry: Dedicated Page

**Source**: `docs/design-feedback/02-enquiry-page.png`

- All "Start an Enquiry" CTAs route to `/enquiry`
- Standalone form page, not a contact modal
- Form fields:
  - Name, phone, email
  - Project address/suburb
  - Project type (Residential, Commercial, Custom Joinery)
  - Scope of work checkboxes
  - Approximate budget
  - Expected timeline
  - Project description
  - File upload

## 3. Projects: Dual Entry Points

**Source**: `docs/design-feedback/03-projects-by-project-by-room.png`

- Two primary navigation paths:
  - **By Project**: Residential Projects, Commercial Projects
  - **By Room**: Kitchen, Bathroom, Living, Bedroom, Wardrobe & Joinery, Laundry, Home Office, Outdoor
- Image-led browsing with style filters
- Clicking an image leads to complete project details

## 4. SWMS: Mobile Flow with QR

**Source**: `docs/design-feedback/04-swms-project-qr-signature.png`

- Two entry methods:
  1. Scan project-specific QR code
  2. Select from project list (admin-created)
- Flow: Project/Address → SWMS Questions → Worker Details → Signature → Submit
- Mobile-first design
- Project name and address displayed throughout

## 5. Homepage: Services & Process

**Source**: `docs/design-feedback/05-homepage-services-process.png`

- "Different briefs. Same care." section with service thumbnails
- "Clarity at every stage." process timeline:
  1. Consultation
  2. Planning & Coordination
  3. Construction / Fit-out
  4. Joinery & Finishes
  5. Handover
- Trust signals: Qualified & Insured, In-house Joinery Capability, Quality & Care

## Colour Direction

Replace navy (`#1b2f4b`) with:

| Token | Value | Usage |
|-------|-------|-------|
| `--background` | `#fafaf8` | Page background |
| `--background-warm` | `#f7f4f0` | Section backgrounds |
| `--foreground` | `#15130e` | Primary text |
| `--primary` | `#1a1a1a` | Charcoal buttons |
| `--accent` | `#b8a48f` | Warm beige accents |
| `--accent-gold` | `#b28a68` | Gold highlights |

Navy stays on the separate plumbing/shop site only.

---

## Slice B Implementation Notes (2026-09-28)

### Design System Decisions

#### CTA Button Rule (PO Locked)
- **Marketing CTAs** (Header, hero, dark bands): Beige/gold fill (`--accent`) + white text → `Button variant="enquiry"`
- **Form submit** (Enquiry form): Charcoal fill (`--primary`) → `Button variant="default"`

#### Contact ≡ Enquiry
- `/contact` redirects to `/enquiry`
- Nav and footer "Contact" links point to `/enquiry`
- No separate contact page

#### Navigation IA
Primary nav includes service-oriented links:
1. Residential (`/services#residential`)
2. Commercial (`/services#commercial`)
3. Custom Joinery (`/services#joinery`)
4. Interior Fit-out (`/services#interior`)
5. Projects (`/projects`)
6. About Us (`/about`)

"Start an Enquiry →" remains a beige CTA button, not a text link.

#### Projects Dual Entry
- **By Project**: Two cards — Residential Projects, Commercial Projects
- **By Room**: Eight cards — Kitchen, Bathroom, Living, Bedroom, Wardrobe & Joinery, Laundry, Home Office, Outdoor
- Style filter chips placeholder (All Styles, Modern, Minimalist, Contemporary, Classic)

### Pages Implemented

| Route | Status | Description |
|-------|--------|-------------|
| `/` | Complete | Full-bleed hero with overlay, Interior Fit-out in eyebrow |
| `/about` | Complete | Short builder-focused introduction |
| `/services` | Complete | Four core services with detail sections |
| `/enquiry` | Complete | Split layout form matching mockup 02 |
| `/projects` | Complete | Dual entry (By Project / By Room), bilingual hero |
| `/contact` | Redirect | Redirects to `/enquiry` |

### Placeholder Image Strategy

- Uses public Unsplash URLs for warm architectural photography
- `PlaceholderImage` component provides fallback UI when no image provided
- Components wired to accept CMS Media replacement via `src` prop
- No fake brand photos used — all clearly architectural stock or labeled placeholders

### Remaining Work (Out of Scope for Slice B)

- Project detail pages (`/projects/residential`, `/projects/room/kitchen`, etc.)
- File upload functionality in enquiry form — stubbed
- Enquiries Payload collection — form shows success state only
- SWMS quiz/QR/signature — Slice D
