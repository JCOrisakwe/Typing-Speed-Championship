const keyRows = document.querySelectorAll(".key-row");
let capsLockActive = false;

function getKeys(e) {
  const keyText = CSS.escape(e.key.toLowerCase());
  const elements = document.querySelectorAll(
    `[data-normal-value='${keyText}'], [data-shift-value='${keyText}']`,
  );
  return { keyText, elements };
}

document.addEventListener("keydown", (e) => {
  const { keyText, elements: keys } = getKeys(e);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.add("shift-down"));
  }

  if (keyText === "capslock") {
    capsLockActive = !capsLockActive;
    keyRows.forEach((row) =>
      row.classList.toggle("capslock-down", capsLockActive),
    );
    keys.forEach((key) => key.classList.toggle("active", capsLockActive));
  } else {
    keys.forEach((key) => key.classList.add("active"));
  }
});

document.addEventListener("keyup", (e) => {
  const { keyText, elements: keys } = getKeys(e);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.remove("active"));
  }
  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.remove("shift-down"));
  }
});
