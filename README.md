# Twist Photo Booths — Event Contract & E-Signature Page

Live page: https://jishuaz-tpbs.github.io/twist-photo-booths-contracts/

## How it works

- **`index.html`** — the contract + signature page. Staff generate a
  personalized signing link from the "Staff Login" panel at the bottom of the
  page; clients open that link, review the contract, sign, and get an instant
  PDF copy.
- When a client signs, the page also sends the signed contract to a
  **Supabase** backend (an Edge Function called `submit-contract`), which:
  - stores the contract details in the `contracts` table,
  - stores the signature image in the private `signatures` storage bucket,
  - emails a notification to Twist Photo Booths via **Resend**.

## Viewing signed contracts

Open the Supabase dashboard for this project (Twist Photo Booths org →
`twist-booking-board` project) and use the **Table Editor** on the
`contracts` table — that's the dashboard of everything signed. Each row
links to its stored signature image in the `signatures` storage bucket.

## Before going live

Open `index.html` and edit the two values marked `CONFIG` near the top of
the `<script>` block:

1. `STAFF_PASSCODE` — change from the placeholder value.
2. `CONTRACT_TEMPLATE` — replace the draft agreement text with your
   finalized wording. Not legal advice — have an attorney review it.

After editing, commit the change; GitHub Pages redeploys automatically
within a minute or two.

## Backend (for reference)

The Supabase project ref is `mklxquarwjyyegkxtyvv`. The Edge Function's
source lives in Supabase (Edge Functions → `submit-contract`), not in this
repo. It uses two secrets configured in the Supabase dashboard
(Edge Functions → Secrets): `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_URL`
(both injected automatically), plus a custom `RESEND_API_KEY` secret used
to send the notification email via Resend.
