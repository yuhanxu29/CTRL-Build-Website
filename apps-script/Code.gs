/**
 * CTRL Build form backend (Google Apps Script).
 *
 * SETUP (Yuhan, once):
 * 1. Create a Google Sheet named "CTRL Build sign-ups". Leave it empty.
 * 2. In the sheet, choose Extensions > Apps Script. Delete the default code and paste this file.
 * 3. Click Deploy > New deployment > type "Web app".
 *    Execute as: Me. Who has access: Anyone.
 * 4. Copy the web app URL. Paste it into the FORM_ENDPOINT constant near the top of app.js,
 *    replacing the empty string. Commit and push to the branch, not to main.
 * 5. Submit a test from the site. A row should appear in the "students" or "sponsors" tab.
 *
 * Each time you change this file, use Deploy > Manage deployments > Edit > New version.
 * The URL stays the same only if you edit the existing deployment.
 *
 * Nothing here stores money details, dollar amounts or sensitive data. Forms collect
 * name, school or work email, company, contact name and a short message.
 */

var TABS = {
  student: {
    name: 'students',
    headers: ['timestamp', 'type', 'name', 'email', 'page']
  },
  sponsor: {
    name: 'sponsors',
    headers: ['timestamp', 'type', 'company', 'contact', 'email', 'package', 'message', 'page']
  }
};

var MAX_FIELD = 1000;

function doGet() {
  return json({ ok: true, service: 'CTRL Build forms', status: 'running' });
}

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    var data = parse_(e && e.postData && e.postData.contents);
    if (!data) return json({ ok: false, error: 'bad_request' });

    // Honeypot: real visitors leave "website" empty. Pretend success so bots learn nothing.
    if (clean_(data.website)) return json({ ok: true });

    var type = clean_(data.type);
    var tab = TABS[type];
    if (!tab) return json({ ok: false, error: 'unknown_form' });

    var email = clean_(data.email);
    if (!isEmail_(email)) return json({ ok: false, error: 'bad_email' });

    if (type === 'student' && !clean_(data.name)) return json({ ok: false, error: 'missing_name' });
    if (type === 'sponsor' && (!clean_(data.company) || !clean_(data.contact))) {
      return json({ ok: false, error: 'missing_fields' });
    }

    if (!lock.tryLock(10000)) return json({ ok: false, error: 'busy' });

    var sheet = getTab_(tab);
    var now = new Date();
    var row;
    if (type === 'student') {
      row = [now, type, clean_(data.name), email, clean_(data.page)];
    } else {
      row = [now, type, clean_(data.company), clean_(data.contact), email,
             clean_(data.package), clean_(data.message), clean_(data.page)];
    }
    sheet.appendRow(row);
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: 'server' });
  } finally {
    try { lock.releaseLock(); } catch (e2) {}
  }
}

/* ---------- helpers ---------- */

function getTab_(tab) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(tab.name);
  if (!sheet) {
    sheet = ss.insertSheet(tab.name);
    sheet.appendRow(tab.headers);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function parse_(raw) {
  if (!raw) return null;
  try {
    var obj = JSON.parse(raw);
    return (obj && typeof obj === 'object') ? obj : null;
  } catch (err) {
    return null;
  }
}

function clean_(v) {
  if (v === null || v === undefined) return '';
  // Trim, cap length, and neutralise leading formula characters so sheet cells stay plain text.
  var s = String(v).trim().slice(0, MAX_FIELD);
  if (/^[=+\-@]/.test(s)) s = "'" + s;
  return s;
}

function isEmail_(s) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) && s.length <= 254;
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
