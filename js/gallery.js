// EDIT: put photos in assets/images/memories/ and list their file names here.
const MEMORIES = [
  { file: "Ole Sereni Post Spa.jpeg", caption: "SAY SPAAAA DATEEEEEEEEEEEEE" }, { file: "She's Drop dead gorgeous.jpeg", caption: "Woah. She's too Stunning its unfairrrrr😣" },
  { file: "Day i Proposed.jpeg", caption: "Guesss Who was taken off the market without touch it😜❤️" }, { file: "Love her eyes.jpeg", caption: "Omds. The eyeesss chico, they never lie!!! (But they trap😍)" },
  { file: "Foodies.jpeg", caption: "Awwww. She visited me on a very boring Saturday and made me eat Chinese w her🥹" }, { file: "Surpriseeee.jpeg", caption: "You'll have to wait for this one... Lets seee that patience get tested😊" }
];
(function () {
  const box = document.getElementById("gallery");
  if (!box) return;
  MEMORIES.forEach((m, i) => {
    const col = document.createElement("div");
    col.className = "col-10 col-sm-6 col-lg-4";
    const fig = document.createElement("figure");
    fig.className = "polaroid";
    fig.style.setProperty("--r", [-3, 2, -1.5, 3, -2, 1.5][i % 6] + "deg");
    const img = document.createElement("img");
    img.src = "assets/images/memories/" + m.file;
    img.alt = m.caption;
    img.loading = "lazy";
    img.addEventListener("error", () => { // missing photo: show a friendly placeholder instead of a broken icon
      const ph = document.createElement("div");
      ph.className = "ph";
      ph.textContent = "Add " + m.file + " to assets/images/memories/";
      img.replaceWith(ph);
    });
    const cap = document.createElement("figcaption");
    cap.textContent = m.caption;
    fig.append(img, cap);
    col.append(fig);
    box.append(col);
  });
})();
