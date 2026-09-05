/**
 * TWIST PHOTO BOOTHS — Signed Contract Backend
 * =============================================
 * This is a Google Apps Script. It gives you two things, both free,
 * using only your own Google account:
 *   1. A Google Sheet "dashboard" — one row per signed contract.
 *   2. An automatic email to you every time a client signs.
 *
 * ---- ONE-TIME SETUP (about 5 minutes) ----
 * 1. Go to https://sheets.google.com and create a new blank spreadsheet.
 *    Name it something like "Twist Photo Booths — Signed Contracts".
 * 2. In that sheet, click Extensions > Apps Script.
 * 3. Delete any starter code in the editor, and paste in this entire file.
 * 4. At the top, set NOTIFY_EMAIL to the address that should receive
 *    notifications (defaults to jishuaz@gmail.com below).
 * 5. Click Deploy > New deployment.
 *    - Click the gear icon next to "Select type" and choose "Web app".
 *    - Description: anything, e.g. "Twist contract intake".
 *    - Execute as: Me.
 *    - Who has access: Anyone.
 *    - Click Deploy, then authorize it with your Google account when asked
 *      (you'll see an "unverified app" warning since this is your own
 *      script — click Advanced > Go to (your project name) to proceed).
 * 6. Copy the "Web app URL" it gives you.
 * 7. Open twist-photo-booths-contract.html, find the line:
 *        const APPS_SCRIPT_URL = "";
 *    and paste your URL between the quotes. Save/re-upload that file.
 * 8. That's it — signed contracts will now log to this Sheet and email you.
 *
 * If you ever change the wording of the emails or add a step (e.g. also
 * texting yourself), you can edit this script any time and click
 * Deploy > Manage deployments > Edit (pencil) > New version > Deploy,
 * without needing to change the HTML file's URL.
 *
 * NOTE ON PRIVACY: this Web App is set to "Anyone" access so that your
 * clients' browsers (which aren't signed into your Google account) can
 * submit their signed contract to it. It only *accepts* submissions —
 * it does not expose your Sheet's contents to the public.
 */

const NOTIFY_EMAIL = "jishuaz@gmail.com";
const SHEET_NAME = "Contracts";
const SIGNATURES_FOLDER_NAME = "Twist Signatures";

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = getOrCreateSheet_();
    const sigUrl = saveSignatureImage_(data);

    sheet.appendRow([
      new Date(),                 // Signed At (server time)
      data.id || "",              // Booking ID
      data.clientName || "",
      data.clientEmail || "",
      data.clientPhone || "",
      data.eventDate || "",
      data.eventType || "",
      data.venueName || "",
      data.packageName || "",
      data.price || "",
      data.deposit || "",
      data.balanceDueDate || "",
      data.notes || "",
      data.signedName || "",
      data.signedAt || "",
      sigUrl
    ]);

    sendNotificationEmail_(data, sigUrl);

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

function getOrCreateSheet_() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    sheet.appendRow([
      "Signed At (server)", "Booking ID", "Client Name", "Client Email",
      "Client Phone", "Event Date", "Event Type", "Venue", "Package",
      "Price", "Deposit", "Balance Due Date", "Notes", "Signed Name",
      "Signed At (client)", "Signature Image"
    ]);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function saveSignatureImage_(data) {
  if (!data.signature || data.signature.indexOf(",") === -1) return "";
  try {
    const base64 = data.signature.split(",")[1];
    const blob = Utilities.newBlob(
      Utilities.base64Decode(base64), "image/png",
      (data.id || "signature") + ".png"
    );
    let folders = DriveApp.getFoldersByName(SIGNATURES_FOLDER_NAME);
    const folder = folders.hasNext() ? folders.next() : DriveApp.createFolder(SIGNATURES_FOLDER_NAME);
    const file = folder.createFile(blob);
    file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
    return file.getUrl();
  } catch (err) {
    return "";
  }
}

function sendNotificationEmail_(data, sigUrl) {
  const subject = `New signed contract: ${data.clientName || "Unknown"} — ${data.eventDate || ""}`;
  const rows = [
    ["Booking ID", data.id],
    ["Client", data.clientName],
    ["Email", data.clientEmail],
    ["Phone", data.clientPhone],
    ["Event date", data.eventDate],
    ["Event type", data.eventType],
    ["Venue", data.venueName],
    ["Package", data.packageName],
    ["Price", data.price],
    ["Deposit", data.deposit],
    ["Balance due", data.balanceDueDate],
    ["Notes", data.notes],
    ["Signed name", data.signedName],
    ["Signed at", data.signedAt]
  ];
  let html = "<table style='font-family:sans-serif;font-size:13px'>";
  rows.forEach(([k, v]) => {
    html += `<tr><td style='padding:3px 10px;color:#666'>${k}</td><td style='padding:3px 10px'><b>${v || ""}</b></td></tr>`;
  });
  html += "</table>";
  if (sigUrl) {
    html += `<p><a href="${sigUrl}">View signature image</a></p>`;
  }

  MailApp.sendEmail({
    to: NOTIFY_EMAIL,
    subject: subject,
    htmlBody: html
  });
}
