# Zillion Home Platform - Product & Delivery Docs

Status: Draft v0.2
Basis: Client requirement document `Zillionhome_公司门户网站及项目关系系统需求_V1.0.pdf`.

This folder turns the client's short requirement into an implementation-ready planning baseline for product, UX/UI, architecture and development agents.

## Source vs assumptions

- **[CLIENT]** = directly supported by the client's requirement.
- **[ASSUMPTION]** = proposed interpretation added because the requirement is incomplete.
- **[FUTURE]** = useful later but intentionally outside Phase 1 unless separately approved.

Do not silently convert assumptions into client requirements. If an assumption affects scope, cost, legal/compliance behaviour or user permissions, review it before implementation.

## Documents

1. `01-client-requirements-en.md` - English translation/normalisation of the client brief.
2. `02-product-specification.md` - initial product specification for Phase 1, with Phase 2 context.
3. `03-assumptions.md` - assumptions, defaults and deferred decisions.
4. `04-sitemap-and-information-architecture.md` - public site and application navigation structure.
5. `05-user-flows.md` - critical user journeys.
6. `06-payload-collections.md` - recommended Payload CMS collections/globals and relationships.
7. `07-phase-1-development-roadmap.md` - recommended vertical-slice delivery plan.
8. `08-ux-ui-design-brief.md` - visual/interaction direction based on the supplied AQUA reference prototype.
9. `09-v0-prototype-prompt.md` - credit-conscious first prompt for Home, Projects and Mobile SWMS prototypes.
10. `12-stage-2-cms-and-demo-seed.md` - which primary pages are CMS-editable, what is still a stub, and how demo seed runs on Vercel.

## Recommended next planning steps

1. Review and edit the assumptions.
2. Lock Phase 1 scope.
3. Use `08-ux-ui-design-brief.md` and `09-v0-prototype-prompt.md` to produce the first three key UI directions.
4. Review and accept/refine Home, Project Gallery and Mobile SWMS visual direction.
5. Confirm the initial Payload data model.
6. Initialise the Payload project and deploy the baseline to Vercel staging.
