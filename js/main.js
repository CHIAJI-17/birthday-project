// Shared code: reveal schedule, nav, home page. Dates use the visitor's LOCAL device clock.
const REVEALS = [
  { id: 1, date: "2026-11-04" },
  { id: 2, date: "2026-11-17" },
  { id: 3, date: "2026-11-23" },
  { id: 4, date: "2026-11-27", final: true }
];
const PAGES = [["index.html","Home","home"],["memories.html","Memories","memories"],["letters.html","Letters","letters"],["questionnaire.html","Questionnaire","questionnaire"],["surprises.html","Surprises ✦","surprises"]];

// "Questionnaire finished" flag. Stored only in THIS browser, so it is a gate, not security.
const DONE_KEY = "scrapbookQuestionnaireDone";
function questionnaireDone() { try { return localStorage.getItem(DONE_KEY) === "1"; } catch (e) { return false; } }
function markQuestionnaireDone() { try { localStorage.setItem(DONE_KEY, "1"); return true; } catch (e) { return false; } }

function dateAtMidnight(str) { const [y, m, d] = str.split("-").map(Number); return new Date(y, m - 1, d, 0, 0, 0); }
function isUnlocked(r, now = new Date()) { return now >= dateAtMidnight(r.date); }
function daysUntilDate(str, now = new Date()) {
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((dateAtMidnight(str) - today) / 864e5);
}
function daysUntil(r, now = new Date()) { return daysUntilDate(r.date, now); }
function fmtDate(r) { return dateAtMidnight(r.date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" }); }

// Draws the 4 letter/gift cards. Locked cards never receive their title or text.
function renderReveals(boxId, items, noun, finalLabel) {
  const box = document.getElementById(boxId);
  if (!box) return;
  const draw = () => {
    const now = new Date();
    box.innerHTML = "";
    REVEALS.forEach((r, i) => {
      const open = isUnlocked(r, now);
      const col = document.createElement("div");
      col.className = "col-12 col-md-6";
      const card = document.createElement("article");
      card.className = "paper reveal " + (r.final ? "finale " : "") + (open ? "open" : "locked");
      const tag = document.createElement("p");
      tag.className = "hand tag";
      tag.textContent = r.final ? finalLabel : noun + " " + r.id;
      const h = document.createElement("h2");
      card.append(tag, h);
      if (open) {
        h.textContent = items[i].title;
        items[i].body.split("\n\n").forEach(t => { const p = document.createElement("p"); p.textContent = t; card.append(p); });
      } else {
        const n = daysUntil(r, now);
        h.textContent = "🔒 Locked";
        const p = document.createElement("p");
        p.textContent = "Opens on " + fmtDate(r) + " · " + n + " day" + (n === 1 ? "" : "s") + " to go.";
        card.append(p);
      }
      col.append(card);
      box.append(col);
    });
  };
  draw();
  setInterval(draw, 60000); // unlocks without a reload
}

function initNav() {
  const cur = document.body.dataset.page;
  const links = PAGES.map(([href, label, key]) =>
    `<li class="nav-item"><a class="nav-link${key === cur ? " active" : ""}" ${key === cur ? 'aria-current="page"' : ""} href="${href}">${label}</a></li>`).join("");
  document.getElementById("site-nav").innerHTML =
    `<nav class="navbar navbar-expand-lg navbar-dark site-nav"><div class="container">
     <a class="navbar-brand hand" href="index.html">${CONFIG.siteTitle} <span class="heart">♡</span></a>
     <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navMenu" aria-controls="navMenu" aria-expanded="false" aria-label="Toggle navigation"><span class="navbar-toggler-icon"></span></button>
     <div class="collapse navbar-collapse" id="navMenu"><ul class="navbar-nav ms-auto gap-lg-1">${links}</ul></div></div></nav>`;
}

function initHome() {
  const env = document.getElementById("envelope"), letter = document.getElementById("welcome-letter");
  if (env && letter) env.addEventListener("click", () => {
    const open = env.classList.toggle("open");
    env.setAttribute("aria-expanded", String(open));
    letter.hidden = !open;
  });
  const cd = document.getElementById("birthday-countdown");
  if (cd) {
    const n = daysUntilDate(CONFIG.birthday);
    cd.textContent = n > 0 ? n + " day" + (n === 1 ? "" : "s") + " until your birthday" : n === 0 ? "Happy birthday! 🎂" : "I hope your birthday was wonderful ♡";
  }
}

if (typeof document !== "undefined") document.addEventListener("DOMContentLoaded", () => { initNav(); initHome(); });
if (typeof module !== "undefined") module.exports = { REVEALS, isUnlocked, daysUntil };
