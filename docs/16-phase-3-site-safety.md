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

## Where workers read Admin values

Publish the project after changing its name, Chinese name, address, or site induction trades. Workers read that published project. A project that has never been published still opens from its latest save. Project SWMS, SWMS documents, and templates have no draft step: saving them updates the worker pages on the next request.

| What workers see | Admin path |
| --- | --- |
| Project name, Chinese name, and address | Collections → Projects → the project → Project name, Project address |
| Trades offered at induction. Empty means induction cannot start. | That project → Site induction trades |
| Menu link and QR | SWMS → Project SWMS → the active row → Worker QR link. The token does not change after the first save. |
| SWMS title and questionnaire version on the menu, sign-in, induction, and documents | That Project SWMS → SWMS title. The version label is published when the questions change. |
| Induction sections, questions, required flag, and question type | That Project SWMS → Sections. Saving an active SWMS publishes the next version. Signed rows stay on the old version. |
| Final acknowledgement statement | That Project SWMS → Final acknowledgement statement |
| PDF title, trade tags, version label, and order | SWMS → SWMS documents. Sort order is lowest first. |
| Whether a PDF is on the worker list | That document → Status. Archived files stay on past confirmations and disappear from the worker list. |
| PDF bytes | That document → SWMS PDF. Replacing the file publishes the next file version. The worker address stays `/swms/[token]/files/[accessToken]`. |
| Incident, hazard, and toolbox records | SWMS → Site safety reports. Workers submit them. The rows are append-only. |

Templates are copied only when a Project SWMS is created with empty sections. Editing a template does not change an induction that was already published.

## Left in code

These are the fixed eight trades, the six menu items, and the control text. They are not fields.

- Trade names, in `src/lib/swms/trades.ts`. A project chooses which of those eight are offered. It does not rename them.
- Menu labels: Sign-in / Out, Site Induction, SWMS & Safety Documents, Incident Report, Hazard Identification, Toolbox Talk.
- Step labels, Next / Back, Yes / No / Not applicable, and “I acknowledge”. The question sentence and its type come from the Project SWMS.
- Expected answer is stored for review. A different answer does not block the signature.
- Validation and status sentences, including the empty-trades message.
- The report form labels (name, phone, time, description, attachment). The submitted text is what the report stores.
- “Safe work / Safe sites” in the worker header and footer.
- The project picker’s search labels. The names, addresses, and SWMS titles in that list come from Admin.

The header dropdown “Residential / 住宅施工” is the public marketing menu, not a SWMS trade.

## Seed

`pnpm seed:demo` creates a missing demo project, its Project SWMS, and the Rosebery placeholder PDFs. A project that already exists is left alone, including an empty Site induction trades list, a renamed title, a changed address, and a Project SWMS that was archived or edited. The hidden demo key is filled in once when it is empty and the English title still matches, and that write does not put trades back.

A Rosebery PDF is found by its hidden seed key, then by its title. Renaming it does not create a second document. When that file can be opened, the seed leaves the title, trades, status, access token, and file version alone. When the file row is still there but the bytes are not readable after a serverless deploy, it writes the placeholder PDF back onto that same file. Workers who already confirmed that version are not asked again. Attaching a new file, and therefore publishing the next file version, happens only when the document points at a file row that no longer exists. Deleting the placeholder document row makes the next seed create it again. Archive it, or change its title and trades, to keep an edit.

`ACK-DEMO-ROSEBERY` is created only with a new Rosebery project. A later seed does not rewrite it, and it does not create it again after it has been removed. Confirmations, attendance, and report rows are never rewritten.

## Cache

Worker routes are dynamic. The next request after a save reads the database, including a save made from a script while the server is already running. Saving a project, a Project SWMS, or a SWMS document also clears `/swms` and that project’s `/swms/[token]` pages inside the running site. A seed writes with revalidation disabled. Restarting the server is not required.

Workers open those PDFs only through `/swms/[token]/files/[accessToken]`. With `BLOB_READ_WRITE_TOKEN`, the bytes are read from Vercel Blob (`prefix` and `_objectKey` on the file). Without the token, they are read from `swms-uploads/`. `/api/swms-files/file/...` stays authenticated.

On a new database the demo worker (Demo Worker, `0400 111 222`) already has an induction for electrical work and still needs to confirm **SWMS - Working at heights** on the next sign-in. That is the new-file path, not a second induction.

## Migrate

Production runs `pnpm payload migrate` before the demo seed. The Phase 3 migration adds the trade field, SWMS files, documents, confirmations, attendance, and site safety reports, and backfills name and phone keys on existing induction rows. Migration `20261124_130000_swms_seed_keys` adds the hidden demo key on projects and the hidden seed key on SWMS documents. It does not copy trades, titles, or files. A redeploy with `SEED_DEMO=true` and `BLOB_READ_WRITE_TOKEN` repairs a Rosebery demo PDF whose Blob object is missing, without changing `fileVersion` when the file row is still there.
