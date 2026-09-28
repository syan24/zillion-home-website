# Client Design Feedback — 2026-09-28

This folder contains client feedback mockups that supersede the previous navy-button UI direction.

## Files

| File | Description |
|------|-------------|
| `01-homepage-builder-positioning.png` | Homepage with Builder-first positioning. Shows "Built from the ground up." hero, four core services (Residential Construction & Renovation, Commercial Fit-out, Custom Joinery & Cabinetry, Interior Fit-out & Project Delivery), and service category icons. |
| `02-enquiry-page.png` | Dedicated `/enquiry` page design. Shows "Start an Enquiry" form with project type selection (Residential, Commercial, Custom Joinery), scope of work checkboxes, budget/timeline dropdowns, and file upload. |
| `03-projects-by-project-by-room.png` | Projects page with dual entry points: "By Project" (Residential Projects, Commercial Projects) and "By Room" (Kitchen, Bathroom, Living, Bedroom, Wardrobe & Joinery, Laundry, Home Office, Outdoor). |
| `04-swms-project-qr-signature.png` | Mobile SWMS flow showing project QR code scanning, project info confirmation, SWMS questions, worker details entry, and signature capture. |
| `05-homepage-services-process.png` | Homepage sections showing "Different briefs. Same care." service overview and "Clarity at every stage." process timeline (Consultation → Planning & Coordination → Construction/Fit-out → Joinery & Finishes → Handover). |

## Key Decisions

1. **Builder-first positioning** — Zillion Home is a builder, not a design studio. Design/interior capabilities are additional offerings.
2. **Custom Joinery standalone** — Custom Joinery is a standalone service, not only part of full renovations.
3. **Dedicated enquiry page** — All "Start an Enquiry" CTAs route to `/enquiry`.
4. **No navy primary colour** — Navy stays on the separate plumbing/shop site. This site uses warm beige/charcoal.
5. **Bilingual ready** — EN | ZH language switch in header.

## Colour Tokens (from feedback images)

```css
/* Background / Neutral */
--background: #fafaf8;
--background-warm: #f7f4f0;

/* Accent / CTA */
--accent-beige: #b8a48f;
--accent-tan: #a88f71;
--accent-gold: #b28a68;

/* Text */
--foreground: #15130e;
--foreground-alt: #1a1a1a;
```
