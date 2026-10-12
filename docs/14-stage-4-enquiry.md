# Stage 4 enquiry

Status: the `/enquiry` form saves a Payload enquiry.

The page stays the single form from the approved enquiry layout. Marketing buttons stay beige. The submit button stays charcoal. `/contact` redirects to `/enquiry`. English is the default. 中文 mode uses the Chinese form strings only.

## What is stored

Admin → Enquiries:

- reference, submitted time, idempotency key
- name, phone, email, address
- project type: Residential, Commercial, or Custom Joinery
- optional project type detail for staff
- scope, and spaces when the scope is kitchen, wardrobe, or bathroom vanity
- style and notes (the project description)
- budget and expected start
- attachments
- status and internal notes
- visitor language, email result, IP, and user agent

Visitor answers are not edited after submit. Staff can change status, internal notes, and project type detail. Deleting an enquiry deletes its files.

Attachments are Enquiry files, not Media. With `BLOB_READ_WRITE_TOKEN`, the browser uploads to Vercel Blob and the server copies the file onto the enquiry. Without the token, files stay on local disk in `enquiry-uploads/`.

## Email

The enquiry is saved even when email is not configured. Set `ENQUIRY_NOTIFY_TO`, `ENQUIRY_NOTIFY_FROM`, and either `RESEND_API_KEY` or `SMTP_HOST`. See `.env.example`. The admin record shows sent, skipped, or failed.

## Demo

```bash
pnpm seed:demo
```

`SEED_DEMO=true` on Preview or Production runs the same seed after migrate. It adds `ENQ-DEMO-KEW` only when that reference is missing, with no attachment. Media repair is unchanged.

1. Open `/enquiry`, submit the form, and include a PDF or image if you want a file.
2. The confirmation shows the reference. Reload the tab and the confirmation stays. Submit again only from “Submit another enquiry”.
3. In admin, open Enquiries. Search by name or reference, and filter by status or project type.
4. Switch the header to 中文 and confirm the form is Chinese only.

## Assumptions

See `docs/03-assumptions.md` D2–D10. The recipient mailbox, the final file policy, and whether phone is required are still client decisions. The behaviour above is the working assumption.
