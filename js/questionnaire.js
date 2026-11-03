// 50 questions. type: text | long | choice | multi. req:true = required. EDIT freely, but if you change
// questions after people have answered, start a fresh sheet tab (column order follows the questions).
const T = (q, hint, req) => ({ type: "text", q, hint, req });
const L = (q, hint, req) => ({ type: "long", q, hint, req });
const C = (q, opts, req) => ({ type: "choice", q, opts, req });
const M = (q, opts, req) => ({ type: "multi", q, opts, req });
const QUESTIONS = [
  T("What's your name, or what should I call you today?", "", true),
  C("Pick your perfect birthday vibe", ["Cosy night in", "Big party", "Adventure day", "Fancy dinner"], true),
  C("Cats or dogs?", ["Cats", "Dogs", "Both", "Neither (plants)"]),
  T("If you were a biscuit, which one would you be?"),
  T("Shoe size (optional)", "Say which system: UK / US / EU"),
  T("Top / jumper size (optional)", "e.g. S, M, L or UK 10"),
  T("Jeans / trousers size (optional)"),
  T("Dress size (optional)"),
  C("Favourite jewellery metal", ["Gold", "Silver", "Rose gold", "A mix", "Not a jewellery person"], true),
  M("Which jewellery do you actually wear?", ["Rings", "Necklaces", "Bracelets", "Earrings", "Watches", "Anklets"]),
  T("Ring size (optional)", "Skip if unsure. A ring you already own works for sizing later."),
  C("Preferred finger for a ring (optional)", ["Left ring finger", "Right ring finger", "Index finger", "Middle finger", "Thumb", "Not sure"]),
  T("Wrist size or bracelet fit in cm (optional)", "Wrap a piece of string round your wrist and measure it."),
  C("Bracelet fit you like (optional)", ["Snug", "Comfortable", "Loose and dangly"]),
  M("Fragrance families you enjoy", ["Floral", "Fruity", "Woody", "Vanilla / sweet", "Fresh / citrus", "Musky", "Spicy"]),
  T("Perfumes you currently love (optional)"),
  T("Scents you really dislike (optional)"),
  T("Favourite flowers"),
  M("Favourite colours", ["Black", "Burgundy", "Pink", "Blue", "Green", "Yellow", "Purple", "Neutrals"]),
  L("Wishlist: anything you'd love, big or small (optional)"),
  L("Things you've wanted but never bought yourself (optional)"),
  C("On a scale of 1/10 how much do you like this so far", ["5/10 or less", "10/10 (its perfect)", "100000000/10 (its amazing, I love it, I want to marry it, I want to have its babies)"]),
  T("Favourite snack"),
  T("Favourite dessert or sweet treat"),
  T("Your usual coffee, tea or drink order"),
  C("Morning person or night owl?", ["Morning person", "Night owl", "Neither, I'm a zombie"]),
  C("Pick a superpower", ["Teleportation", "Invisibility", "Reading minds", "Pausing time"]),
  T("Zombie apocalypse: the one item you'd grab?"),
  C("Pineapple on pizza?", ["Yes please", "Never", "Only if nobody's watching"]),
  T("A film you could rewatch forever"),
  T("A song or artist on repeat lately"),
  T("A favourite book or series"),
  C("Favourite season", ["Spring", "Summer", "Autumn", "Winter"]),
  M("Things you'd like to do more of", ["Painting / crafts", "Baking", "Travel", "Exercise", "Reading", "Gaming", "Photography", "Nothing, rest!"]),
  T("Dream holiday destination"),
  C("Ideal date night", ["Dinner out", "Cinema", "Movie at home", "Outdoor adventure", "Something new"]),
  T("Favourite restaurant or cuisine"),
  M("Allergies or sensitivities I should know about (optional)", ["Nuts", "Dairy", "Gluten", "Strong fragrances", "Nickel / certain metals", "Flowers / pollen", "None"]),
  T("Anything you definitely do NOT want as a gift? (optional)"),
  C("Gift style you like best", ["Practical", "Sentimental", "Luxury", "An experience", "Handmade"], true),
  T("Favourite shops or brands (optional)"),
  T("What's always in your bag?"),
  C("Socks with sandals?", ["Totally acceptable", "A crime"]),
  L("A whole free day, no responsibilities: what do you do?"),
  T("Your favourite memory of us so far"),
  T("Your most irrational fear"),
  C("Sleeping style", ["Duvet hog", "Cold feet on you", "Perfect sleeper", "Pillow-fort architect"]),
  T("Your hidden talent"),
  T("A food you could happily eat every day for a week"),
  L("Any hints, or anything else you'd like to add? (optional)")
];

(function () {
  if (typeof document === "undefined" || !document.getElementById("q-app")) return; // not on the questionnaire page
  const $ = id => document.getElementById(id);
  const answers = {};           // index -> string | string[]
  const submissionId = (window.crypto && crypto.randomUUID) ? crypto.randomUUID() : "id-" + Date.now() + "-" + Math.random().toString(16).slice(2);
  let i = 0, sending = false;

  const isEmpty = v => v === undefined || (Array.isArray(v) ? v.length === 0 : String(v).trim() === "");
  const showError = msg => { $("q-error").textContent = msg; $("q-error").hidden = !msg; };

  function save() {
    const q = QUESTIONS[i], body = $("q-body");
    if (q.type === "text" || q.type === "long") answers[i] = body.querySelector(".q-input").value;
    else if (q.type === "choice") { const c = body.querySelector("input:checked"); answers[i] = c ? c.value : undefined; }
    else answers[i] = [...body.querySelectorAll("input:checked")].map(c => c.value);
  }

  function render() {
    const q = QUESTIONS[i], body = $("q-body");
    showError("");
    $("q-counter").textContent = "Question " + (i + 1) + " of " + QUESTIONS.length;
    const pct = Math.round(i / QUESTIONS.length * 100);
    $("q-percent").textContent = pct + "%";
    $("q-progress-bar").style.width = pct + "%";
    body.innerHTML = "";
    const h = document.createElement("p");
    h.className = "q-text";
    h.textContent = q.q + (q.req ? " *" : "");
    body.append(h);
    if (q.hint) { const p = document.createElement("p"); p.className = "hint"; p.textContent = q.hint; body.append(p); }
    if (!q.req && !/optional/i.test(q.q)) { const p = document.createElement("p"); p.className = "hint"; p.textContent = "You can skip this one."; body.append(p); }
    if (q.type === "text" || q.type === "long") {
      const el = document.createElement(q.type === "text" ? "input" : "textarea");
      el.className = "form-control q-input";
      el.maxLength = 500;
      if (q.type === "long") el.rows = 4;
      el.value = answers[i] || "";
      if (q.type === "text") el.addEventListener("keydown", e => { if (e.key === "Enter") { e.preventDefault(); next(); } });
      body.append(el);
    } else {
      const multi = q.type === "multi";
      q.opts.forEach(o => {
        const lab = document.createElement("label"), inp = document.createElement("input");
        lab.className = "opt";
        inp.type = multi ? "checkbox" : "radio";
        inp.name = "q-opt";
        inp.value = o;
        inp.checked = multi ? (answers[i] || []).includes(o) : answers[i] === o;
        lab.append(inp, document.createTextNode(o));
        body.append(lab);
      });
    }
    $("q-prev").disabled = i === 0;
    $("q-next").textContent = i === QUESTIONS.length - 1 ? "Submit ✓" : "Next →";
    $("q-next").disabled = false;
  }

  function prev() { if (sending || i === 0) return; save(); i--; render(); }
  function next() {
    if (sending) return;
    save();
    if (QUESTIONS[i].req && isEmpty(answers[i])) { showError("This question is required. Please answer it to continue."); return; }
    if (i < QUESTIONS.length - 1) { i++; render(); } else submit();
  }

  async function submit() {
    const url = CONFIG.appsScriptUrl;
    if (!url || url.startsWith("PASTE_")) { showError("Submission isn't set up yet: the Google Apps Script URL hasn't been added (see README). Your answers are NOT saved."); return; }
    sending = true;
    $("q-next").disabled = true; $("q-prev").disabled = true; $("q-next").textContent = "Sending…";
    showError("");
    const payload = {
      submissionId,
      submittedAt: new Date().toISOString(),
      answers: QUESTIONS.map((q, n) => ({ id: "Q" + (n + 1), question: q.q, answer: Array.isArray(answers[n]) ? answers[n].join(", ") : (answers[n] || "") }))
    };
    const ctrl = new AbortController(), timer = setTimeout(() => ctrl.abort(), 25000);
    try {
      // No custom headers => a "simple" request (text/plain), so no CORS preflight, and the JSON reply is readable.
      const res = await fetch(url, { method: "POST", body: JSON.stringify(payload), signal: ctrl.signal });
      const raw = await res.text();
      let data = null;
      try { data = JSON.parse(raw); } catch (e) { /* not JSON */ }
      if (!data || data.ok !== true) {
        throw new Error(data && data.error ? "script error: " + data.error
          : "unexpected reply from the server: " + raw.slice(0, 150).replace(/\s+/g, " "));
      }
      if (!markQuestionnaireDone()) $("q-storage-warning").hidden = false;
      $("q-app").hidden = true;
      $("q-success").hidden = false;
      window.scrollTo(0, 0);
    } catch (err) {
      showError("We couldn't confirm that your answers were saved (" + (err.name === "AbortError" ? "timed out" : err.message) + "). Please check your connection and press Submit again; resubmitting is safe.");
      $("q-next").disabled = false; $("q-prev").disabled = false; $("q-next").textContent = "Submit ✓";
    } finally { clearTimeout(timer); sending = false; }
  }

  $("q-start").addEventListener("click", () => { $("q-intro").hidden = true; $("q-app").hidden = false; render(); });
  $("q-prev").addEventListener("click", prev);
  $("q-next").addEventListener("click", next);
})();
if (typeof module !== "undefined") module.exports = { QUESTIONS };
