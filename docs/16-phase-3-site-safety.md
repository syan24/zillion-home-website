# Phase 3 site safety

The project QR still uses the Project SWMS public token. It opens the Site Safety Menu for that project.

Workers are recognised by name and phone. There is no staff ID or PIN.

## What an editor configures

1. Open the project and set **Site induction trades**. Only those eight groups are offered. Leave the field empty and workers cannot start induction. Interior Fit-out & Finishes is a trade here, not a public service.
2. Under SWMS → **SWMS documents**, upload one PDF per file. Choose the project and one or more trades. Replacing the PDF publishes the next file version (`v2`, `v3`, …). Archive a file to hide it without deleting past confirmations.
3. Under SWMS → **Project SWMS**, keep one active SWMS per project. Its questions are the Site Induction questionnaire. The worker link and QR are unchanged. Print that QR.
4. Read records under SWMS:
   - **SWMS register** — induction signature, trades, and the PDF versions confirmed at that time
   - **SWMS confirmations** — each PDF confirmation, including a later version
   - **Site attendance** — sign-in and sign-out
   - **Site safety reports** — incident, hazard, and toolbox records

Signed induction rows, confirmations, attendance, and reports cannot be edited or deleted.

## Worker path

`/swms/[token]` is the menu: Sign-in / Out, Site Induction, SWMS & Safety Documents, Incident Report, Hazard Identification, Toolbox Talk.

The first sign-in sends the worker to induction. Induction is: select trades, name and phone, review each matching SWMS in a popup (the acknowledgement appears after the last page is scrolled into view), then the existing questions and signature. Submitting induction also signs them in.

A later visit signs in and out with the same name and phone and does not repeat the questionnaire. If a matching PDF is new or its file version changed, they confirm only those files, then sign in.

SWMS & Safety Documents lists every active file for the project and does not record a confirmation.

## Seed

`pnpm seed:demo` fills empty trade lists on the three demo projects and adds two placeholder PDFs to Rosebery Residence when those titles are missing. It does not replace an existing PDF, change a project that already has trades, or rewrite `ACK-DEMO-ROSEBERY`.

On a new database the demo worker (Demo Worker, `0400 111 222`) already has an induction for electrical work and still needs to confirm **SWMS - Working at heights** on the next sign-in. That is the new-file path, not a second induction.

## Migrate

Production runs `pnpm payload migrate` before the demo seed. The Phase 3 migration adds the trade field, SWMS files, documents, confirmations, attendance, and site safety reports, and backfills name and phone keys on existing induction rows.
