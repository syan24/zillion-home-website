# v0 Prototype Prompt - Phase 1 Design Direction

Status: Draft v0.2

Use this prompt for the first v0 generation. It is intentionally detailed so that we can minimise follow-up prompts and conserve the limited v0 credit.

---

Design a small multi-route UI prototype for an Australian construction and fit-out company called **Zillion Home**.

This is NOT an e-commerce website and NOT a SaaS dashboard. The application will eventually be built with Next.js, Payload CMS, Tailwind CSS and shadcn/ui, but for this task I only want the frontend visual prototype and reusable components. Do not implement a database, authentication, CMS integration or backend logic.

## Goal

Create a premium, architectural, photography-led visual direction that can become the design system for the full project.

Generate these three prototype routes/screens using shared components and design tokens:

1. `/` - public Homepage, desktop-first but fully responsive.
2. `/projects` - searchable/filterable Project Library, desktop and mobile responsive.
3. `/swms/demo` - worker SWMS acknowledgement/signing experience, designed mobile-first.

## Visual reference and style

The visual style should feel like a premium Australian architectural/interior design website.

Use this exact base palette:

- White: `#FFFFFF`
- Page background: `#FAFAF8`
- Warm background: `#F7F5F2`
- Section background: `#F5F5F3`
- Primary text: `#1A1A1A`
- Secondary text: `#3D3D3D`
- Muted text: `#888888`
- Border: `#E5E5E5`
- Primary navy: `#1B2F4B`
- Primary navy hover: `#142339`
- Gold accent: `#B8965A`
- Gold light: `#C9A96E`
- Dark section: `#1C1C1C`

Use Cormorant Garamond for major editorial/marketing headings and DM Sans for body text, navigation, forms and functional UI.

Use restrained 4px button radius. Do not use large pill buttons or overly rounded SaaS cards.

Primary buttons:
- navy background;
- white text;
- DM Sans semibold;
- approximately 16px vertical and 30-34px horizontal padding;
- subtle darker navy/elevation hover.

Secondary buttons:
- white/transparent background;
- dark 1-1.5px border;
- dark text;
- dark background/white text hover.

Gold is an accent, not the main action colour.

Use generous whitespace, thin borders instead of heavy shadows, subtle image zoom on hover and restrained motion. Avoid gradients unless extremely subtle. Avoid glassmorphism.

## Responsive layout system

- Desktop max content width around 1280px.
- Desktop horizontal padding around 32px.
- Major section vertical spacing around 80px.
- Mobile horizontal padding around 20px.
- Design intentionally for 375px, 430px, 768px, 1024px and 1440px widths.
- Minimum mobile touch target 44px.

## Global header

Desktop header:
- sticky white/near-white header;
- subtle transparency/backdrop blur;
- thin bottom divider;
- Zillion Home wordmark/logo placeholder on left;
- navigation: Home, About, Services, Projects, Contact;
- optional compact `EN / 中文` language control;
- primary `Start an Enquiry` button on the right.

Do NOT include cart, wishlist, product search or other e-commerce icons.

Mobile:
- logo;
- menu button;
- accessible drawer/navigation;
- enquiry CTA remains easy to access.

## Screen 1 - Homepage

Create a polished company homepage with these sections:

### Hero
- desktop split layout around 42% text / 58% project image;
- short construction/company positioning headline;
- concise supporting paragraph;
- primary CTA `View Projects`;
- secondary CTA `Start an Enquiry`;
- large architectural/project image;
- do not invent awards, review scores, years in business or licences.

Use provisional copy that can easily be replaced later.

### Services
- 3 or 4 restrained image-led service items;
- clearly label service content as representative/provisional;
- avoid generic icon-card SaaS layout.

### Featured Projects
- one of the strongest visual sections;
- editorial/asymmetrical project image grid;
- show project name, Residential/Commercial and optional sample location;
- subtle hover zoom;
- `View all projects` text link.

### Residential / Commercial
- strong two-way visual split or section that introduces the two project types and links to filtered project results.

### Company / Trust section
- design the space for qualifications/capabilities but use neutral placeholder labels rather than making factual claims.

### Enquiry CTA
- use a dark `#1C1C1C` section with restrained gold accent;
- concise call to action;
- navy or gold-accented action appropriate to the dark background.

### Footer
- company summary;
- navigation;
- services/projects links;
- placeholder contact details;
- privacy/terms;
- no e-commerce footer categories.

## Screen 2 - Project Library

This is a major functional feature, not just a marketing gallery.

Desktop structure:
- elegant page intro;
- clearly visible Residential / Commercial segmented switch;
- compact filter bar for Project, Style and Space;
- active filter chips;
- results count;
- `Reset filters` action;
- photography-led project grid.

Project cards should be minimal: image first, title, project type, optional location and a few understated tags. Avoid boxed SaaS cards and unnecessary shadows.

Use sample styles such as Modern, Contemporary, Classic, Minimalist and sample spaces such as Kitchen, Bathroom, Living, Bedroom, Facade, Office, Restaurant.

Show an example filtered state, not only the default state.

Mobile:
- Residential/Commercial control remains visible;
- one `Filters` button opens a bottom sheet/drawer;
- active filters appear as chips;
- photography remains visually dominant;
- intentionally designed mobile layout, not a shrunk desktop page.

## Screen 3 - `/swms/demo`

Design this as a mobile-first worker experience for reading and signing a project SWMS after scanning a QR code.

This screen should share the brand palette but be much more functional than the public website.

Use DM Sans for almost everything. Do not use a decorative marketing hero.

Show a realistic prototype flow/state containing:

- compact Zillion Home header/logo;
- Project name and project address/context;
- SWMS title and version;
- clear progress indicator;
- short important introduction;
- readable SWMS content presented as responsive HTML sections, not a tiny PDF viewer;
- worker details fields;
- acknowledgement statement/checkbox;
- touch-friendly signature area;
- primary Continue/Submit action;
- clear success/completed state preview if practical.

Use large readable type, clear vertical spacing and 44px+ controls.

Do not invent detailed legal SWMS content. Use clearly labelled sample/placeholder sections such as `Work activity`, `Hazards`, `Control measures` and `Worker acknowledgement`.

## Shared component direction

Create reusable styled components/patterns for:

- Header
- Footer
- Button
- Container/Section
- Section heading
- Project card
- Filter chip
- Segmented control
- Form input
- File upload placeholder
- Progress indicator
- SWMS section
- Signature area

Use shadcn/ui primitives where useful but customise them so the result does not look like default shadcn.

## Accessibility

- strong focus states;
- semantic structure;
- sufficient contrast;
- 44px mobile targets;
- labels for every form field;
- do not communicate state only with colour;
- respect reduced motion.

## Important restrictions

- Do not make this an online shop.
- Do not add pricing/products/cart/wishlist.
- Do not invent unverified company facts.
- Do not create a separate dashboard/admin design in this prototype.
- Do not implement backend or Payload CMS logic.
- Do not add unnecessary dependencies.
- Avoid generic startup/SaaS styling.
- Keep the code simple enough to transfer into a real Next.js + Payload project later.

The priority is visual quality and a coherent reusable design system across these three screens.
