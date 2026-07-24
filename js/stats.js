const figures = document.querySelectorAll(".slide-r");
const graphs = document.querySelectorAll(".graph");
const next = document.querySelector(".stats-analysis-panel > button");

document.addEventListener("testOver", (e) => {
  for (const [statLabel, statFigure] of Object.entries(e.detail)) {
    let figureSelector = `[data-final-stat='${statLabel}'] > .stats-figure`;
    const figureEl = document.querySelector(figureSelector);

    if (!figureEl) continue;

    figureEl.insertAdjacentText("afterbegin", statFigure);
    if (statLabel === "characters") {
      figureEl.querySelector("span").textContent += `${e.detail.promptLength}`;
    }
  }
});

next.addEventListener("click", () => {
  graphs.forEach((el) => el.classList.toggle("show-n-slide"));
  figures.forEach((el) => el.classList.toggle("show-n-slide"));
});
