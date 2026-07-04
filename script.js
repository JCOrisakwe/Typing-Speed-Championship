// TEXT BOX LAYOUT AND FUNCTIONALITY
const indicators = document.querySelector(".validity-indicators");
const promptContainer = document.querySelector(".prompt-container");
let roundOver = false;
let charIndex = 0;

const getBottomDistance = (el) => el.getBoundingClientRect().bottom;
const pcBottomDistance = getBottomDistance(promptContainer);
const pcLineHeight = Number(
  getComputedStyle(promptContainer).lineHeight.replace("px", ""),
);

document.addEventListener("keydown", (e) => {
  if (e.key.length === 1 && !roundOver) {
    // adding validity indicator
    const indicator = document.createElement("span");
    indicator.textContent = "!";

    if (promptContainer.innerText[charIndex] === e.key) {
      indicator.classList.add("correct-char");
    } else {
      indicator.classList.add("wrong-char");
    }
    indicators.append(indicator);
    charIndex += 1;
    roundOver = indicators.children.length >= promptContainer.innerText.length;

    // textbox scroll down mechanism
    if (getBottomDistance(indicator) > pcBottomDistance) {
      indicators.scrollTop += pcLineHeight;
    }
    // removing validity indicator
  } else if (e.key.toLowerCase() === "backspace") {
    const lastIndicator = indicators.children[indicators.children.length - 1];
    if (lastIndicator) lastIndicator.remove();
    charIndex = Math.max(0, charIndex - 1);
  }
  promptContainer.scrollTop = indicators.scrollTop;
});

// KEYBOARD LAYOUT AND FUNCTIONALITY
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
    if (e.repeat) return;
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
