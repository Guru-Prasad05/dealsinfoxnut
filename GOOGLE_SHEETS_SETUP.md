# Google Sheets Setup for Enquiry Form

## Steps to connect the enquiry form to Google Sheets:

### 1. Create a Google Sheet
- Go to https://sheets.google.com
- Create a new spreadsheet named **"DealsInfoxNut Enquiries"**

### 2. Open Apps Script
- In the sheet, click **Extensions → Apps Script**
- Delete any existing code and paste the script below

### 3. Paste this script:

```javascript
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = JSON.parse(e.postData.contents);

    // Add headers on first row if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        'Timestamp', 'Name', 'Email', 'Phone',
        'City', 'Enquiry Type', 'Quantity', 'Message'
      ]);
      sheet.getRange(1, 1, 1, 8).setFontWeight('bold');
    }

    sheet.appendRow([
      new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }),
      data.name    || '',
      data.email   || '',
      data.phone   || '',
      data.city    || '',
      data.enquiryType || '',
      data.quantity    || '',
      data.message     || '',
    ]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: err.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```

### 4. Deploy as Web App
- Click **Deploy → New deployment**
- Select type: **Web app**
- Description: `DealsInfoxNut Enquiry Form`
- Execute as: **Me**
- Who has access: **Anyone**
- Click **Deploy** → Authorize → **Copy the Web App URL**

### 5. Update .env.local
Replace the placeholder URL in `.env.local`:

```
NEXT_PUBLIC_SHEET_WEBHOOK=https://script.google.com/macros/s/YOUR_ACTUAL_SCRIPT_ID/exec
```

Replace `YOUR_ACTUAL_SCRIPT_ID` with the ID from your deployed Web App URL.

---
> After updating `.env.local`, run `npm run build` again for the change to take effect.
