# Stage 7 SWMS register

Status: Option A. Administrators filter SWMS acknowledgements in Payload Admin and download the current filtered list as CSV.

This stage does not add a PDF record, Chinese copy on the worker flow, or a notification when a worker must sign again.

## Where

Admin → SWMS → **SWMS register**

`/admin/collections/swms-acknowledgements`

The list columns are submission ref, worker name, project, version label, and signed at. Open a row to see company, phone, trade, question responses, the acknowledgement checkbox, the signature image, and the IP / user agent captured with the submit.

Signed rows cannot be edited or deleted. A published SWMS version stays immutable. A later edit of the Project SWMS publishes a new version; older signatures stay on the version they signed.

## Filters

Use **Filters** on the list. Add one condition per line:

| Filter | Field | Operator |
| --- | --- | --- |
| Project | Project | equals, then choose the project |
| Project SWMS | Project SWMS | equals, then choose the SWMS |
| SWMS version | Version label | equals, then choose the version (the title is the version label, for example `v1.0`) |
| Signer | Worker name | contains |
| Signed from | Signed at | is greater than or equal to |
| Signed to | Signed at | is less than or equal to |

The search box matches submission ref, worker name, company, phone, and trade. Export uses the filters and the search box together.

## CSV

**Export CSV** sits above the list. It downloads every acknowledgement that matches the current filters and search, including rows on later pages. It does not include the signature image. Open the row in admin to see the signature.

Columns, in order:

`submissionRef`, `signedAt`, `workerName`, `workerCompany`, `workerPhone`, `workerTrade`, `project`, `project SWMS`, `version`, `acknowledgement accepted`

`acknowledgement accepted` is `true` or `false`. `signedAt` is the stored UTC timestamp. `project` is the project name, `project SWMS` is the SWMS title, and `version` is the version label.

Filename:

- `swms-register-{project-slug}-{YYYY-MM-DD}.csv` when the filters name exactly one project. `Rosebery Residence` becomes `rosebery-residence`.
- `swms-register-filtered-{YYYY-MM-DD}.csv` for every other list, including an unfiltered list.

The date is the UTC date of the download. The request must be logged in. A logged-out request to `/api/swms-acknowledgements/export` returns 401 and no file.

## Demo

`pnpm seed:demo` and `pnpm seed:swms` add one acknowledgement when `ACK-DEMO-ROSEBERY` is missing. They do not change it if it is already there.

| Field | Value |
| --- | --- |
| Submission ref | `ACK-DEMO-ROSEBERY` |
| Project | Rosebery Residence |
| Project SWMS | Construction Works SWMS |
| Worker | Demo Worker, Demo Electrical, 0400 111 222, Electrician |
| Signed at | 15 Apr 2026, 01:30 UTC |
| Signature | Placeholder stroke stored with the row. Not a legal signature. |

`SEED_DEMO=true` on Preview or Production runs the same seed after migrate.

## QA

1. Log in to admin and open SWMS → SWMS register. Confirm `ACK-DEMO-ROSEBERY` / Demo Worker / Rosebery Residence / a version label / 15 Apr 2026.
2. Filter Project equals Rosebery Residence. Export CSV. The filename is `swms-register-rosebery-residence-{today}.csv`. The file includes Demo Worker and does not include acknowledgements from other projects.
3. Clear filters. Filter Worker name contains `Demo Worker`, and Signed at from 15 Apr 2026 through 16 Apr 2026. Export again. The filename is `swms-register-filtered-{today}.csv` and the row is still Demo Worker.
4. Open `ACK-DEMO-ROSEBERY`. Question responses lists each question from the signed version and the worker’s answer (Yes, No, Not applicable, or Accepted). It is not a JSON blob. The signature image is visible. There is no way to save a change or delete the row.
5. Open `/swms`, choose Rosebery Residence, and confirm the worker form still shows the project, the SWMS questions, and the signature step.
6. In a private window, open `/api/swms-acknowledgements/export`. The response is 401 and not a CSV file.

## Assumptions

CSV is the Phase 1 register export for this stage. A printable PDF record stays out of scope until the client asks for it. See `docs/02-product-specification.md` section 4.6 and `docs/07-phase-1-development-roadmap.md` Stage 7.
