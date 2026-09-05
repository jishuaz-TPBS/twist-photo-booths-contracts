# Twist Photo Booths — Event Contract & E-Signature Page

Live page (once GitHub Pages finishes deploying): see the repository's
**Settings > Pages** section for the exact URL, or check the "About" panel on
this repo's homepage.

## Files

- **`index.html`** — the contract + signature page. Staff generate a
  personalized signing link from the "Staff Login" panel at the bottom of the
  page; clients open that link, review the contract, sign, and get an instant
  PDF copy.
- **`twist-contracts-backend.gs`** — an optional Google Apps Script that logs
  every signed contract to a Google Sheet and emails a notification. See the
  comment block at the top of that file for the ~5 minute deploy steps.

## Before going live

Open `index.html` and edit the three values marked `CONFIG` near the top of
the `<script>` block:

1. `STAFF_PASSCODE` — change from the placeholder value.
2. `APPS_SCRIPT_URL` — paste your deployed Apps Script URL here (optional,
   enables automatic email + Sheet logging).
3. `CONTRACT_TEMPLATE` — replace the draft agreement text with your
   finalized wording. Not legal advice — have an attorney review it.

After editing, commit and push the change; GitHub Pages redeploys
automatically within a minute or two.
