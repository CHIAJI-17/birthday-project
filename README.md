# Birthday scrapbook website

Plain HTML, CSS, vanilla JavaScript and Bootstrap 5 (loaded from a CDN, so visitors need internet). No build step.

## Run it
Open `index.html` in a browser, or host the folder (GitHub Pages, Netlify, etc.). All five pages share one nav, which is built by `js/main.js`.

## Structure (and changes from your suggestion)
```
index.html  memories.html  letters.html  questionnaire.html  surprises.html
css/style.css
js/config.js         <- NEW: your settings (Apps Script URL)
js/main.js           shared: reveal schedule, nav, home envelope, locked/unlocked card renderer
js/gallery.js  js/letters.js  js/questionnaire.js  js/surprises.js
assets/images/memories/
google-apps-script/Code.gs
```
Changes: added `js/config.js` so there is one obvious place for settings; the nav and the letter/gift cards are drawn by `main.js` so they stay identical across pages.


## Placeholders to replace
| Where | What |
|---|---|
| `js/config.js` | `appsScriptUrl` (see below); `siteTitle` if you want a different brand; optional `unlockOverrideCode` |
| `index.html` | welcome letter text, `[her name]`, `[your name]` |
| `js/letters.js` | the 4 letter titles and bodies |
| `js/surprises.js` | the 4 gift titles and descriptions (Grand Finale is the 4th) |
| `js/gallery.js` | photo file names and captions |
| `js/questionnaire.js` | edit/reorder questions if you like (see warning in the file) |

## Where to paste the Apps Script URL
Open **`js/config.js`** and replace `PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE` with your Web App URL (it ends in `/exec`). Nothing else needs editing.

## Google Sheets setup
1. Go to script.google.com (or open a Sheet > Extensions > Apps Script) and paste in `google-apps-script/Code.gs`, replacing everything. Save.
2. In the toolbar choose the function **`setup`**, click **Run**, and accept the permission prompts ("Advanced > Go to project" is normal for your own script). This creates/locates your private Sheet. Click **Execution log** to see its link. If the script is standalone, the Sheet is named "Birthday Questionnaire Responses" in your Google Drive. Don't share it.
3. **Deploy > New deployment > Web app**. Execute as: **Me**. Who has access: **Anyone**. (Already deployed? **Deploy > Manage deployments > pencil > Version: New version > Deploy**; the URL stays the same.)
4. Click **Copy** next to the Web app URL and paste it into `js/config.js` as `appsScriptUrl`.
5. Open that URL in a browser: you should see `{"ok":true,"message":"Questionnaire endpoint is running."}`.
6. Submit the questionnaire once. A `Responses` tab appears with one row.

## Deploying on GitHub Pages
1. Create a GitHub repository and upload the **contents** of this folder so `index.html` sits at the top level (not inside an extra folder). Include `.nojekyll`.
2. Repo **Settings > Pages > Source: Deploy from a branch > `main` / `(root)` > Save**. After about a minute your site is at `https://<username>.github.io/<repo>/`.
3. Everything uses relative links, so the repo sub-path is fine. GitHub is **case-sensitive**: file names in `js/gallery.js` must match your photo file names exactly (`Photo1.JPG` is not `photo1.jpg`).
4. After any change, commit it and wait about a minute; hard-refresh (Ctrl/Cmd+Shift+R) to see it.

**Privacy warning:** free GitHub Pages needs a **public** repository, so anyone who finds it can read every file, including the letter and gift text in `js/letters.js` and `js/surprises.js`, and the commit history. Safer: commit placeholder text now and edit in each real letter/gift on or just before its reveal day (the GitHub web editor is fine for this), and give the repo an unguessable name. This is mitigation, not secrecy. Your Google Sheet stays private either way.

### What "private" means here
- The Sheet stays private: the script runs as you and writes into the Sheet it is attached to, so no spreadsheet ID or credentials appear in the website.
- The Web App URL itself is public to anyone who finds it in the site's source, so someone could in theory post junk rows to it. They can't read your sheet. `Code.gs` ignores duplicate submission IDs and strips formula characters. This is not authentication.
- Submission uses a normal `fetch` POST with a `text/plain` body (no preflight) and reads the JSON reply `{ok:true}`. I did **not** use `no-cors`, because that hides the response and the site could never tell success from failure. The success screen only appears after the script confirms `ok:true`; on failure the user sees an error and can resubmit (duplicates are ignored via the submission ID).
- Apart from the "questionnaire finished" flag described below, nothing is stored in the browser.

## Troubleshooting submission
Open your Web App URL directly in a browser. You should see exactly `{"ok":true,"message":"Questionnaire endpoint is running."}`.
- **Something different (or a Google sign-in page):** the URL isn't running this `Code.gs`. Paste the current `Code.gs` into the Apps Script editor, then **Deploy > Manage deployments > pencil icon > Version: New version > Deploy**. Saving alone does not update the live `/exec` URL. Also check access is set to **Anyone**.
- **"script error: ..."** on the form: the script ran and reported a problem; the text after it says what.
- **"unexpected reply from the server: ..."**: the text shows what came back, which tells you what is deployed.
- Resubmitting after an error is safe; duplicate submissions are ignored.

## Surprises gate (questionnaire first)
The Surprises page shows a "finish the questionnaire first" card and draws **no gifts** until the questionnaire has been submitted and the script confirmed it. There is no automatic redirect: the success screen has a "Go to my surprises" button she presses herself. Letters are not gated.

Limits to know about:
- The "finished" flag is stored in her browser (`localStorage`). It is a gate, not security: anyone can set it from the browser console, and the gift text is still readable in `js/surprises.js`.
- If she clears site data, switches device/browser or uses private mode, the page locks again. Backup: set `unlockOverrideCode` in `js/config.js` (e.g. a word only you two know) and a code box appears on the locked page. Leave it `""` to disable. The code is visible in the source, so it is a convenience, not a password.
- The gate checks that she *submitted*, not that your Sheet received a row from her specifically. Check the Sheet to confirm.
- Gift dates still apply on top: after passing the gate, each gift stays locked until its own date.

## Reveal schedule (important limitation)
Letters and gifts unlock on **9, 16, 23 and 27 November 2026** at 00:00 on the **visitor's own device clock**. This is *not* secure scheduling: changing the device date unlocks content early, and anyone using "view source" can read the text in `letters.js`/`surprises.js`. Locked cards are never drawn with their text, but the text is still in the file. For true secrecy, keep the real letters off the site until the day (edit and re-upload), or use a server.

## Adding photos
Copy images into `assets/images/memories/` (JPG/PNG, ideally square-ish and under ~500 KB each), then list them in `js/gallery.js`. Missing files show a friendly placeholder.

## Testing checklist
- [ ] Each of the 5 pages loads; the nav highlights the current page and works on a phone (hamburger menu).
- [ ] Home: tapping the envelope opens and closes the letter.
- [ ] Questionnaire: Start, then Next/Previous keep your answers; required questions (marked `*`) block Next when empty; optional ones skip.
- [ ] With the URL still as the placeholder, Submit shows "isn't set up yet" and never a success screen.
- [ ] With your real URL, Submit shows the success screen and a row appears in the Sheet.
- [ ] Turn Wi-Fi off, Submit: you get an error, not a success screen.
- [ ] Letters and Surprises show 🔒 cards before their dates. To test early unlocks, temporarily change the date strings in `REVEALS` in `js/main.js`, or change your device date; restore afterwards.
- [ ] Fresh browser: Surprises shows the questionnaire gate and no gift cards.
- [ ] After a confirmed submission, the success screen's button opens Surprises with locked/unlocked cards by date; no automatic redirect.
- [ ] Clear site data: the gate returns (expected); if you set `unlockOverrideCode`, entering it unlocks the page, and a wrong code shows an error.

## Not verified
I checked syntax and the date logic with Node, and cross-checked element IDs, but I could not open the pages in a real browser, and **the Google Apps Script submission cannot be tested without your deployed URL**. Please run the checklist above.
