const keyRows = document.querySelectorAll(".key-row");

function getKeys(e) {
  let keyText = CSS.escape(e.key.toLocaleLowerCase());
  let dataValue = `[data-normal-value='${keyText}'], [data-shift-value='${keyText}']`;
  return document.querySelectorAll(dataValue);
}

document.addEventListener("keydown", (e) => {
  const keys = getKeys(e);
  if (keys.length) {
    e.preventDefault();
    keys.forEach((key) => key.classList.add("active"));
    if (e.key.toLocaleLowerCase() === "shift") {
      keyRows.forEach((row) => row.classList.add("shift-down"));
    }
  }
});

document.addEventListener("keyup", (e) => {
  const keys = getKeys(e);
  if (keys.length) {
    e.preventDefault();
    keys.forEach((key) => key.classList.remove("active"));
    if (e.key.toLocaleLowerCase() === "shift") {
      keyRows.forEach((row) => row.classList.remove("shift-down"));
    }
  }
});
