// EDIT: one entry per gift, in order. Separate paragraphs with a blank line (\n\n).
const GIFTS = [
  { title: "Teddy Bear", body: "Hug me when im not next you(●'◡'●)" },
  { title: "[Gift 2 name]", body: "[PLACEHOLDER: describe or link Gift 2.]" },
  { title: "[Gift 3 name]", body: "[PLACEHOLDER: describe or link Gift 3.]" },
  { title: "[Grand Finale name]", body: "[PLACEHOLDER: describe the grand finale.]" }
];
(function () {
  const gate = document.getElementById("gift-gate"), wrap = document.getElementById("gifts-wrap");
  if (!gate || !wrap) return;
  function showGifts() { gate.hidden = true; wrap.hidden = false; renderReveals("gifts-list", GIFTS, "Gift", "Grand Finale"); }
  if (questionnaireDone()) { showGifts(); return; }   // gifts are not drawn at all until the gate is passed
  gate.hidden = false;
  const code = (CONFIG.unlockOverrideCode || "").trim().toLowerCase();
  if (!code) return;
  document.getElementById("gate-code-wrap").hidden = false;
  document.getElementById("gate-code-btn").addEventListener("click", () => {
    const v = document.getElementById("gate-code").value.trim().toLowerCase();
    if (v && v === code) { markQuestionnaireDone(); showGifts(); }
    else document.getElementById("gate-code-msg").textContent = "That code doesn't match.";
  });
})();
