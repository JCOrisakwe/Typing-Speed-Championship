const figures = document.querySelectorAll(".stats-summary-panel > .slide-r");
const prevStats = document.querySelector(".stats-summary-panel > button");
const graphs = document.querySelectorAll(".stats-analysis-panel > .graph");
const nextStats = document.querySelector(".stats-analysis-panel > button");
const NumOfpages = 2;
let pageNum;

document.addEventListener("testOver", (e) => {
  for (const [statLabel, statFigure] of Object.entries(e.detail)) {
    let figureSelector = `[data-final-stat='${statLabel}'] > .stats-figure`;
    const figureEl = document.querySelector(figureSelector);

    if (!figureEl) continue;
    if (statLabel === "characters") {
      figureEl.querySelector("span:first-of-type").textContent =
        `${statFigure}`;
      figureEl.querySelector("span:last-of-type").innerHTML =
        `&nbsp;of&nbsp;${e.detail.promptLength}`;
    } else {
      figureEl.textContent = statFigure;
    }
  }
  pageNum = 1;
});

function toggleVisibility() {
  graphs.forEach((el) => el.classList.toggle("show-n-slide"));
  figures.forEach((el) => el.classList.toggle("show-n-slide"));
}

nextStats.addEventListener("click", () => {
  if (pageNum < NumOfpages) {
    toggleVisibility();
    pageNum += 1;
    prevStats.classList.add("active");
  } else {
    document.dispatchEvent(new CustomEvent("returnHome"));
    toggleVisibility();
    prevStats.classList.remove("active");
  }
});

prevStats.addEventListener("click", () => {
  if (pageNum > 1) {
    toggleVisibility();
    pageNum -= 1;
    prevStats.classList.toggle("active", pageNum > 1);
  }
});
