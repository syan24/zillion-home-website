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
