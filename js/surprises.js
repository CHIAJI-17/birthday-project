// EDIT: one entry per gift, in order. Separate paragraphs with a blank line (\n\n).
const GIFTS = [
  { title: "Teddy Bear", body: "Ik you haven't realized it yet but the whole reason why i chose this day to begin all this on this very day 4th November 2026 is cuz its 2/3 months (i dont know how to count it for some reason my head is too full) since we started dating. I remember how you hugged me on that day and it felt so genuine and your smile and joy... its just a memory that constantly hovers in my mind. Sooo hug me when im far away, when your peace is under siege orrrr just when im not next you(●'◡'●)." },
  { title: "A certain Bag", body: "Sooooooo, I know you've been wanting a bag but you were toooo secretive about it like arghhhhhhhh. I took the liberty of testing how well I know your testing so with 10 days left to your actual day, hope it matches the drop dead gorgeous queen thaat you areeee. Love you❤️" },
  { title: "Sweet treats For the sweetest", body: "My Sweet Queen has been working overtime to plan her party and i strongly believe she really deserve sth as sweet as everything she's been not only for me but everyone she cares about. Please send me a list of candy you'd love to have this week(sorry it couldn't spawn in your room tn, shit got a bit hectic) I LOVE YOU SO MUCH❤️❤️❤️ KEEP YOUR HEAD UP WE'RE ALMOST THEREEEEEEEEEEEEEE" },
  { title: "You'll just have to guess it", body: "Im so sorry to do this but i had to have one last surprise. So gerreadyyyyyyyyyyyyy. It might show up at anytimeeeeeee!!!" }
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
