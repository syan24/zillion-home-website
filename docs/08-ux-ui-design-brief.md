# UX/UI Design Brief

Status: Draft v0.2

Project: Zillion Home Website, Project Portfolio, Enquiry and SWMS Platform

Primary design reference: `AQUA Homepage v1.2.html`

## 1. Purpose

This brief defines the visual direction, UX principles and reusable UI rules for Phase 1. It is intended to guide v0 prototypes, implementation agents and later manual refinement.

The design should feel related to the supplied AQUA e-commerce homepage, especially its colour system, buttons, typography hierarchy, spacious layouts and premium architectural presentation. It must not look like an e-commerce store. Zillion Home is a construction/project business, so the same visual language should be adapted around services, completed projects, enquiry and site safety workflows.

## 2. Phase 1 surfaces

The initial design system must support four different but related experiences:

1. Public company website.
2. Project portfolio / case library.
3. Multi-step enquiry Quiz.
4. Mobile-first SWMS worker signing flow.

Payload Admin should keep the standard Payload interaction model where possible. It may receive light branding, but Phase 1 should not spend significant time redesigning the CMS administration interface.

## 3. Design goals

### 3.1 Brand impression

The public site should feel:

- premium but not luxurious for its own sake;
- architectural and design-led;
- professional and established;
- trustworthy and practical;
- visually driven by real project photography;
- clean, calm and easy to scan;
- contemporary Australian construction/interior design rather than generic SaaS.

### 3.2 Product UX goals

- Make completed projects the strongest proof of capability.
- Make it easy to browse and filter project photography.
- Make enquiry feel short and approachable despite collecting structured information.
- Make the SWMS flow extremely clear on a phone, including for workers who have never used the system.
- Keep interaction patterns consistent across all public-facing pages.
- Do not add complexity simply because a component exists in the UI library.

## 4. Reference prototype analysis

The AQUA prototype establishes a strong visual language that should be retained selectively.

### 4.1 Elements to keep

#### Warm neutral backgrounds

The reference uses several very close neutral tones rather than pure white everywhere. This creates visual separation while remaining calm and premium.

Recommended base tokens:

```text
White                #FFFFFF
Page background      #FAFAF8
Warm background      #F7F5F2
Section background   #F5F5F3
Divider / border     #E5E5E5
```

Use alternating warm and white sections instead of cards with heavy shadows.

#### Navy primary colour

```text
Primary navy         #1B2F4B
Primary navy dark    #142339
```

This should become the main functional brand colour for:

- primary buttons;
- links requiring emphasis;
- selected filters;
- form progress/current states;
- important admin/site status accents where appropriate.

#### Gold accent

```text
Accent gold          #B8965A
Accent gold light    #C9A96E
```

Gold should be used sparingly for premium visual accents, small labels or special editorial sections. It should not replace navy as the main action colour.

Do not rely on gold for small body text because accessibility contrast can become weak on light backgrounds.

#### Text colours

```text
Primary ink          #1A1A1A
Secondary ink        #3D3D3D
Muted text           #888888
Dark section         #1C1C1C
```

#### Editorial typography

The AQUA reference combines a serif display face with a clean sans-serif body face. This is suitable for Zillion Home because it gives the public site an architectural/editorial character without making functional pages difficult to use.

Recommended initial typography:

- Display / major headings: Cormorant Garamond.
- Body / UI / navigation: DM Sans.
- Small technical eyebrow labels: DM Sans by default; JetBrains Mono may be retained only where it adds value.

Use `next/font` in implementation rather than loading Google Fonts dynamically from the browser.

The serif should be used mainly for marketing/editorial headings. Functional UI such as forms, filters, tables, SWMS content and buttons should primarily use the sans-serif family.

#### Restrained corner radius

The reference uses approximately 4px button radii rather than large rounded pills. Preserve this character.

The site should not use the common AI/SaaS visual style of very rounded cards, gradients and floating glass panels.

#### Photography-led composition

The reference uses large images, edge-to-edge image tiles and subtle image zoom on hover. This is highly suitable for Zillion Home's project library.

Project photography should be treated as primary content, not decoration.

#### Motion

The reference uses restrained motion:

- around 200ms for buttons and simple interactions;
- approximately 500-600ms for image zoom;
- soft reveal-on-scroll transitions.

Keep motion subtle and respect `prefers-reduced-motion`.

### 4.2 Elements to adapt rather than copy

- Product cards become project/case-study cards.
- Room category tiles become Services or Residential/Commercial project entry points.
- The e-commerce hero becomes a company/project hero.
- Shop/Trade language becomes Projects/Services/Enquiry language.
- Product icons such as account, wishlist and cart should not appear on the public Zillion Home site unless a real requirement exists.
- The dark premium product section can become a strong project/service statement or enquiry CTA section.

### 4.3 Elements to avoid

- Do not make the site feel like an online store.
- Do not display fake awards, licences, review scores, years in business or "Australian owned" claims unless the client confirms them.
- Do not invent project locations or customer testimonials as final content.
- Do not overuse gold.
- Do not use decorative animations that interfere with reading or mobile performance.
- Do not use generic SaaS dashboard cards on public pages.

## 5. Design tokens

These tokens should become CSS variables / Tailwind theme values so the same system is shared by generated prototypes and production code.

```css
:root {
  --background: #FAFAF8;
  --background-warm: #F7F5F2;
  --background-section: #F5F5F3;
  --surface: #FFFFFF;

  --foreground: #1A1A1A;
  --foreground-soft: #3D3D3D;
  --muted: #888888;
  --border: #E5E5E5;

  --primary: #1B2F4B;
  --primary-hover: #142339;
  --accent: #B8965A;
  --accent-light: #C9A96E;
  --dark: #1C1C1C;

  --radius-button: 4px;
  --container: 1280px;
}
```

Do not create many additional brand colours unless required by status/validation UI.

Functional colours may be introduced for success, warning and error states, but they should remain subdued and accessible.

## 6. Layout system

### Desktop

- Maximum content width: approximately 1280px.
- Standard horizontal page padding: 32px.
- Standard major-section vertical spacing: approximately 80px.
- Header height: approximately 80-84px.
- Large photography may intentionally break out wider than the normal content container.

### Tablet

- Reduce multi-column layouts to one or two columns.
- Preserve generous whitespace but reduce section spacing to approximately 56-64px.
- Filters may become horizontally scrollable controls or a compact filter panel.

### Mobile

- Design from 375px upward.
- Horizontal page padding: approximately 20px.
- Major section spacing: approximately 48px.
- Minimum touch target: 44px.
- Do not simply shrink desktop typography and grids.
- Enquiry and SWMS are priority mobile experiences.

Recommended QA widths:

```text
375px
430px
768px
1024px
1440px
```

## 7. Buttons and actions

### Primary button

Visual reference:

```text
Background: #1B2F4B
Text: white
Radius: 4px
Font: DM Sans, semibold
Desktop padding: about 16-17px vertical / 30-34px horizontal
Hover: #142339 + subtle elevation
```

Typical uses:

- Start an Enquiry
- View Projects where it is the main page action
- Next / Continue in the enquiry flow
- Acknowledge / Continue in SWMS
- Submit / Sign when safe to do so

### Secondary / outline button

```text
Background: white/transparent
Border: 1-1.5px solid #1A1A1A
Text: #1A1A1A
Radius: 4px
Hover: dark background with white text
```

Typical uses:

- View Services
- Back
- Secondary navigation actions
- Download/share where appropriate

### Gold action

Gold buttons may be used for one highly editorial CTA or dark-background section. Do not use gold for routine forms or safety actions.

### Destructive actions

Do not use navy/gold for destructive actions. Use a conventional accessible error/destructive colour and require confirmation for destructive admin behaviour.

## 8. Header and navigation

### Desktop public navigation

Recommended structure:

```text
Logo
Home
About
Services
Projects
Contact
[Optional EN / 中文]
[Start an Enquiry]
```

The enquiry action should be visually distinct as the main header CTA.

SWMS should not be a normal public navigation item. Workers should reach an assigned SWMS using the secure QR/link supplied for that project.

Use a sticky white/near-white header with subtle transparency/blur and a 1px divider, similar to the AQUA reference.

### Mobile navigation

Use a conventional accessible menu/drawer with clear text labels. Keep the enquiry CTA easy to reach.

Do not use unnecessary e-commerce icons.

## 9. Homepage design direction

The homepage should establish the entire visual language.

Recommended structure:

### 9.1 Hero

Desktop: approximately 40/60 text/image split, inspired by the reference.

Content:

- short company positioning statement;
- one concise supporting paragraph;
- Primary CTA: `View Projects` or `Start an Enquiry`;
- Secondary CTA: the other of those two;
- large high-quality completed-project image.

Do not invent final marketing claims. Placeholder copy must be clearly replaceable in Payload.

### 9.2 Services overview

Use 3-4 image-led or restrained service blocks rather than generic icon cards.

The exact services are not provided in the current client brief, so prototype content must be labelled as provisional.

### 9.3 Featured projects

This is one of the most important homepage sections.

- asymmetrical or editorial image grid;
- 3-5 featured projects;
- project name;
- Residential / Commercial;
- optional location only when allowed;
- subtle hover image scale;
- `View all projects` link.

### 9.4 Residential / Commercial positioning

A strong visual split can explain the two primary project categories and lead into filtered project results.

### 9.5 Company / qualifications / trust

Design the section but do not populate unverified claims.

It may later contain:

- qualifications;
- licences/accreditations;
- industries served;
- capabilities;
- company experience.

### 9.6 Enquiry CTA

Use a strong full-width or split layout section near the bottom of the page.

This is an appropriate place for the dark `#1C1C1C` background and restrained gold accent from the AQUA reference.

### 9.7 Footer

Simple multi-column footer containing:

- company summary;
- navigation;
- services/projects links;
- contact details;
- social links if supplied;
- privacy/terms.

Do not reuse irrelevant e-commerce footer categories.

## 10. Project portfolio UX

The project library is a major product feature rather than a normal marketing gallery.

### Desktop

Recommended structure:

```text
Page intro
Residential / Commercial segmented control
Filter bar
Active filter chips
Results count
Photography grid
Load more / pagination if required later
```

Filters supported by the client brief:

- project type: Residential / Commercial;
- project;
- style;
- space.

### Filter behaviour

- Filters can be combined.
- Selected filters must remain visible.
- Provide clear `Reset filters` behaviour.
- Keep filter state in the URL so filtered results can be shared/bookmarked.
- Empty results need a useful state, not a blank page.

### Project cards

Cards should be visually minimal:

- image first;
- project title;
- Residential/Commercial metadata;
- optional location subject to visibility rules;
- optional style/space labels.

Avoid bordered/shadowed SaaS cards.

### Mobile

Do not show four dropdowns permanently.

Recommended:

- Residential/Commercial control remains visible;
- `Filters` button opens a bottom sheet/drawer;
- active filters displayed as compact chips;
- one-column photography feed or carefully selected two-column layout where images remain useful.

## 11. Project detail UX

Recommended structure:

- project title and type;
- optional location according to privacy setting;
- short project description;
- style/space metadata;
- strong photography gallery;
- click/tap to open large image;
- download when permitted;
- copy/share link;
- enquiry CTA;
- related projects.

The photography experience should be closer to architecture/editorial sites than product PDPs.

## 12. Enquiry Quiz UX

The client explicitly requests a short multi-step Quiz rather than presenting all questions at once.

Recommended steps:

```text
1. About You
2. Project
3. Requirements
4. Budget & Timing
5. Photos / Files
6. Review & Submit
```

### Principles

- One clear task per step.
- Progress indicator with human-readable step names or `Step X of Y`.
- Preserve entered information when navigating back.
- Use large labels and simple helper text.
- Prefer selectable visual options where the options are known.
- Use standard fields for freeform information.
- Drag/drop + file picker on desktop, camera/file-friendly control on mobile.
- Show upload limits before upload.
- Validate at the point where users can fix the problem.
- Final review screen before submission.
- Clear completion/thank-you state.

Do not use playful quiz styling. It should feel simple and professional.

## 13. SWMS worker UX

The worker flow has different priorities from the marketing site.

### Design priorities

1. Readability.
2. Safety-critical clarity.
3. Mobile usability.
4. Clear project/SWMS identity.
5. Clear evidence of what is being acknowledged.
6. Reliable signature/submission behaviour.

### Visual treatment

Retain the same brand colours, but reduce editorial styling.

- warm or white background;
- DM Sans for almost all content;
- navy primary controls;
- minimal gold;
- no decorative hero section;
- simple top bar/logo/project context;
- clear section boundaries;
- large readable text;
- accessible form controls.

### Suggested flow

```text
Project / SWMS identity
        ↓
Important introduction
        ↓
SWMS content
        ↓
Worker details
        ↓
Acknowledgement checkbox / statement
        ↓
Signature
        ↓
Review / Submit
        ↓
Completed confirmation
```

The exact SWMS content/schema remains subject to review of a real client SWMS template.

### Mobile behaviour

- Avoid tiny document viewers requiring pinch zoom.
- Render SWMS content as responsive HTML where possible.
- Keep primary navigation/continue action easy to reach.
- Signature canvas must work reliably with touch.
- Warn before leaving if entered information/signature would be lost.
- Handle invalid, superseded or expired links with explicit states.

## 14. Payload Admin direction

Do not build a separate custom admin application in Phase 1.

Use Payload Admin as the primary internal management interface and customise only where it materially improves usability.

Recommended light customisation:

- Zillion Home logo/branding;
- consistent navy/accent colours where supported;
- clear collection groups: Website, Projects, Enquiries, SWMS, Administration;
- meaningful field labels/help text;
- curated list columns;
- saved/default sorting where useful;
- simple dashboard shortcuts if they provide real value.

The priority is a maintainable administration experience, not visual parity with the public website.

## 15. Localisation / English and Chinese

English is the default product language.

The design and content model should remain localisation-ready for Simplified Chinese.

Rules:

- Do not place text directly inside images.
- Do not use fixed-width text containers that break when translated.
- Allow headings/buttons to grow.
- Keep frontend application strings in a localisation-friendly structure.
- Payload content fields that are likely to be public-facing may be configured as localised where appropriate.

Chinese content entry should remain optional until the client explicitly requires it.

## 16. Photography and imagery

### Direction

Use images that feel like real Australian residential/commercial construction, fit-out, joinery, renovation and interior architecture work.

Preferred qualities:

- natural light;
- strong material/detail photography;
- professional completed-project images;
- wide architectural scenes plus detail crops;
- restrained colour grading;
- avoid exaggerated HDR or generic corporate stock photography.

### Prototype imagery

Stock/placeholder images are acceptable for design prototyping only.

Production should prioritise real client project photography. The CMS must make imagery replaceable without layout changes.

## 17. Content voice

Public copy should be:

- concise;
- confident;
- professional;
- plain English;
- design/construction aware;
- not excessively promotional.

Avoid unsupported superlatives such as `best`, `leading`, `award-winning` or `No. 1`.

SWMS and functional copy should prioritise clarity over brand voice.

## 18. Accessibility baseline

Phase 1 should target sensible WCAG 2.2 AA practices.

At minimum:

- keyboard-operable navigation/forms;
- visible focus states;
- sufficient colour contrast;
- semantic headings;
- form labels and error associations;
- alt text management through Payload;
- 44px mobile touch targets;
- no information communicated by colour alone;
- reduced-motion support;
- signature flow that does not rely on inaccessible instructions alone.

## 19. Component inventory

The initial shared component library should remain intentionally small.

### Marketing / shared

- Header
- MobileNav
- Footer
- Container
- Section
- SectionHeader
- Button
- TextLink
- ImageCard
- ProjectCard
- Tag/Chip
- EmptyState
- Breadcrumbs

### Forms

- TextInput
- TextArea
- Select
- RadioGroup
- Checkbox
- SegmentedControl
- FileUpload
- FormError
- ProgressIndicator
- StepNavigation

### Project library

- ProjectTypeSwitch
- ProjectFilters
- ActiveFilterChips
- ProjectGrid
- Gallery
- Lightbox
- ShareAction

### SWMS

- SWMSHeader
- SWMSSection
- WorkerDetailsForm
- AcknowledgementPanel
- SignaturePad
- SWMSProgress
- CompletionState

Use shadcn/ui primitives where they fit, but restyle them to this design system. Do not let default shadcn styling determine the visual identity.

## 20. Prototype priorities

To establish the design language with minimum design effort, prototype only these three screens initially:

### Prototype A - Homepage

Purpose: validate brand/visual direction, header/footer, typography, buttons, image treatment and major page rhythm.

Required desktop and mobile states.

### Prototype B - Project Library

Purpose: validate photography grid, Residential/Commercial switch, filters and mobile browsing.

Required desktop and mobile states.

### Prototype C - Mobile SWMS

Purpose: validate the most operational/safety-focused experience and prove that the design language also works outside marketing pages.

Primary viewport should be mobile, with one desktop/tablet representation sufficient for now.

Do not prototype the entire site before these three directions are accepted.

## 21. v0 usage strategy with limited credits

The current v0 Free plan includes a small monthly credit allowance, so the objective is to minimise exploratory prompts.

Recommended approach:

1. Use this brief as the source of truth.
2. Use one high-quality initial prompt to generate a small multi-route prototype containing Home, Projects and a Mobile SWMS demo using shared design tokens/components.
3. Ask v0 not to implement backend, Payload, database or authentication logic.
4. Do not ask it to generate every Phase 1 page.
5. Review the first result manually before spending another prompt.
6. Use at most one focused revision for visual direction, not a broad "make it better" prompt.
7. Once the direction is acceptable, move the generated design patterns/components into the real Payload repository and continue refinement with the normal coding agent.

If the free credit is consumed before all three screens are satisfactory, keep the strongest generated screen as the reference design and implement the remaining screens manually from this design brief. The project should not depend on continued v0 usage.

## 22. Prototype acceptance checklist

A prototype direction can be accepted when:

- it clearly resembles the supplied AQUA reference in colour, typography, buttons and restraint;
- it no longer looks like an e-commerce store;
- project photography is visually dominant;
- Home and Projects feel premium/editorial rather than SaaS;
- SWMS feels simple, mobile-first and operational;
- navy is the dominant action colour and gold is only an accent;
- mobile layouts are intentionally designed rather than compressed desktop pages;
- there is one consistent button, spacing and typography system;
- the design can be implemented using Next.js, Tailwind and shadcn/ui without unusual custom technology;
- no unverified client claims have been presented as factual content.

## 23. Implementation handoff rule

Once the design direction is accepted, coding agents should treat this document as the UI source of truth.

If a screen is not explicitly designed, the agent should extend existing components/tokens rather than inventing a new visual style.

Any new design pattern that changes typography, colour, radius, spacing or primary navigation should be documented here before becoming a repeated pattern.
