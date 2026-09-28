# Approved Design Reference

## Client Feedback — 2026-09-28 (SUPERSEDES NAVY UI)

Client feedback images in `docs/design-feedback/` define the current design direction:

- **Builder-first positioning** — Zillion Home is a builder, not a design studio.
- **No navy primary colour** — Navy stays on separate plumbing/shop site. Use warm beige/charcoal.
- **Dedicated enquiry page** — All "Start an Enquiry" CTAs route to `/enquiry`.
- **Custom Joinery standalone** — Listed as a distinct service offering.
- **Bilingual ready** — EN | ZH toggle in header (content translation out of scope for Phase 1).

See `docs/design-feedback/README.md` for image descriptions and colour tokens.

## v0 Prototype (layout reference only)

https://zillion-nine.vercel.app/

source code: ../zillion_prototype

The v0 prototype remains useful for:
- Typography hierarchy (Cormorant Garamond + DM Sans)
- Layout patterns and spacing
- Photography-led composition

**Note**: The navy button colour (`#1b2f4b`) in the prototype is superseded. Use charcoal/beige system from client feedback.

### Reference Routes

- `/` — Homepage layout patterns
- `/projects` — Project Library grid/filters
- `/swms/demo` — Worker SWMS flow structure

## Design Direction

Public-facing UI should follow (in priority order):

1. `docs/design-feedback/` — Client feedback images (colour, positioning)
2. `docs/08-ux-ui-design-brief.md` — UX patterns, accessibility, layout principles
3. v0 prototype — Typography, layout structure (not colour)

Do not replace the established design language with generic SaaS styling.

## UI Surfaces

### Public Website

Premium, architectural, photography-led. Builder-first positioning with warm neutral palette.

### Project Library

Visual, searchable, client-facing. Dual entry: By Project / By Room.

### SWMS

Functional, mobile-first, safety-focused. QR code entry, project context, signature capture.

### Payload Admin

Use Payload's standard admin UI wherever possible.

Only apply light Zillion Home branding and collection organisation.

Do not spend significant development effort restyling Payload Admin.