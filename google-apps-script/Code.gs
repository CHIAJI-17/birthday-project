/**
 * Receives questionnaire answers and appends them to a PRIVATE Google Sheet.
 * Works two ways, with no changes needed:
 *  - Script created from a Sheet (Extensions > Apps Script): uses that Sheet.
 *  - Standalone script (script.google.com): creates a private Sheet in YOUR Drive on first use
 *    called "Birthday Questionnaire Responses" and remembers it. No spreadsheet ID goes in the website.
 *
 * ONE-TIME: choose "setup" in the function dropdown, click Run, accept the permissions,
 * then Deploy > Manage deployments > pencil > New version > Deploy.
 */
const SHEET_NAME = "Responses";
const FILE_NAME = "Birthday Questionnaire Responses";

function setup() {
  const ss = getSpreadsheet_();
  getSheet_(ss);
  Logger.log("Responses are saved in: " + ss.getUrl());
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    const p = JSON.parse(e.postData.contents);
    if (!p.submissionId || !Array.isArray(p.answers)) return reply_({ ok: false, error: "Bad payload" });

    const sh = getSheet_(getSpreadsheet_());
    if (sh.getLastRow() === 0) {
      sh.appendRow(["Timestamp", "SubmissionId"].concat(p.answers.map(a => a.id + ": " + a.question)));
      sh.setFrozenRows(1);
    }
    // Ignore retries of the same submission (the form may resend after a network error).
    if (sh.getLastRow() > 1) {
      const hit = sh.getRange(2, 2, sh.getLastRow() - 1, 1).createTextFinder(p.submissionId).matchEntireCell(true).findNext();
      if (hit) return reply_({ ok: true, duplicate: true });
    }
    sh.appendRow([new Date(), p.submissionId].concat(p.answers.map(a => clean_(a.answer))));
    return reply_({ ok: true });
  } catch (err) {
    return reply_({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (_) {}
  }
}

// Visiting the Web App URL in a browser should show this (handy for checking the deployment).
function doGet() { return reply_({ ok: true, message: "Questionnaire endpoint is running." }); }

function getSpreadsheet_() {
  const active = SpreadsheetApp.getActiveSpreadsheet(); // null when the script is standalone
  if (active) return active;
  const props = PropertiesService.getScriptProperties();
  const id = props.getProperty("SHEET_ID");
  if (id) return SpreadsheetApp.openById(id);
  const ss = SpreadsheetApp.create(FILE_NAME);
  props.setProperty("SHEET_ID", ss.getId());
  return ss;
}
function getSheet_(ss) {
  let sh = ss.getSheetByName(SHEET_NAME);
  if (sh) return sh;
  const first = ss.getSheets()[0];
  if (ss.getSheets().length === 1 && first.getLastRow() === 0) { first.setName(SHEET_NAME); return first; }
  return ss.insertSheet(SHEET_NAME);
}
function clean_(v) {
  let s = String(v == null ? "" : v).slice(0, 2000);
  if (/^[=+\-@]/.test(s)) s = "'" + s; // stop answers being treated as spreadsheet formulas
  return s;
}
function reply_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
