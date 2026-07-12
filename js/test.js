//test.js

// INITIALIZE GLOBAL VARIABLES & FUNCTIONS
const roundDuration = 10; // in minutes
let remainingSeconds = roundDuration * 60;
let validKeystrokes = 0;
let currCharIdx = 0;

const promptText = `Molestiae! consequuntur explicabo, vel at minus mollitia autem impedit alias
  voluptas totam similique nihil temporibus aut. Quae veritatis ut iusto sequi, ad
  sint provident aliquid facere expedita delectus magnam blanditiis
  perspiciatis culpa harum laborum illo excepturi! Neque sunt incidunt omnis iste.`;

// ---------------- UPDATE STATS ----------------

// update timer
const timerEl = document.querySelector("[data-function='timer']");
const to2digits = (num) => String(num).padStart(2, "0");
function updateTimer() {
  let mins = Math.floor(remainingSeconds / 60);
  let secs = remainingSeconds % 60;
  timerEl.textContent = `${to2digits(mins)}:${to2digits(secs)}`;
  remainingSeconds -= 1;
}

// update wpm
const wpmEl = document.querySelector("[data-function='wpm']");
function updateWPM() {
  let elapseMinutes = roundDuration - remainingSeconds / 60;
  let grossWPM = Math.round(validKeystrokes / (5 * elapseMinutes));
  wpmEl.textContent = grossWPM || 0;
}

// update accuracy
const accuracyEl = document.querySelector("[data-function='accuracy']");
const textBox = document.querySelector(".text-box");
function updateAccuracy() {
  let correctCount = textBox.querySelectorAll(".correct-char").length;
  let accuracy =
    currCharIdx > 0 ? Math.round((correctCount / currCharIdx) * 100) : 0;
  accuracyEl.textContent = accuracy;
}

updateWPM();
updateTimer();
updateAccuracy();
const timerInterval = setInterval(() => {
  updateTimer();
  updateWPM();
}, 1000);

// ---------------- TEXT BOX LAYOUT AND TYPING FUNCTIONALITY ----------------

// initialize typing/text box variables and constants
const chars = [];
let wordEl = document.createElement("span");
const textBoxLineHeight = Number(
  getComputedStyle(textBox).lineHeight.replace("px", ""),
);

const getBottom = (el) => el.getBoundingClientRect().bottom;
const textBoxBottom = getBottom(textBox);
const isValidKeystroke = (e) =>
  e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;
const isWhiteSpace = (...chars) =>
  chars.reduce((_, char) => !char.trim() && _, true);

// populate text box whith character spans
for (let char of promptText) {
  // remove excess white space
  if (!wordEl.hasChildNodes() && isWhiteSpace(char)) continue;

  const charEl = document.createElement("span");
  charEl.innerHTML = char.trim() || "&nbsp;"; // replace white space with non-breakable space
  charEl.classList.add("char");
  chars.push(charEl);

  wordEl.classList.add("word");
  wordEl.append(charEl);

  if (isWhiteSpace(char) || char === promptText.at(-1)) {
    textBox.append(wordEl);
    // create a new word element after a space
    if (isWhiteSpace(char)) wordEl = document.createElement("span");
  }
}

// create caret and place before first character
const caret = document.createElement("span");
caret.classList.add("caret");
chars[0].append(caret);

function handleTypingKeydown(e) {
  if (isValidKeystroke(e) && currCharIdx < chars.length) {
    const currentEl = chars[currCharIdx];
    const isCorrect =
      e.key === currentEl.innerText ||
      isWhiteSpace(e.key, currentEl.textContent);

    if (isWhiteSpace(currentEl.textContent) && !isCorrect) {
      currentEl.classList.add("wrong-space");
    }
    currentEl.classList.add(isCorrect ? "correct-char" : "wrong-char");

    if (currCharIdx + 1 < chars.length) chars[currCharIdx + 1].append(caret);

    validKeystrokes += 1;
    currCharIdx += 1;
    updateAccuracy();

    if (getBottom(caret) > textBoxBottom) {
      textBox.scrollTop += textBoxLineHeight;
    }
  } else if (e.key.toLowerCase() === "backspace") {
    const prevElemIdx = Math.max(0, currCharIdx - 1);
    const prevEl = chars[prevElemIdx];
    if (prevEl) {
      prevEl.classList.remove("correct-char", "wrong-char", "wrong-space");
      currCharIdx = prevElemIdx;
      prevEl.append(caret);
    }
    if (textBoxBottom - getBottom(prevEl) >= textBoxLineHeight) {
      textBox.scrollTop -= textBoxLineHeight;
    }
    updateAccuracy();
  }
}

// ---------------- VIRTUAL KEYBOARD LAYOUT AND FUNCTIONALITY ----------------
const keyRows = document.querySelectorAll(".key-row");

const getKeys = (e) => {
  const keyText = CSS.escape(e.key.toLowerCase());
  const elements = document.querySelectorAll(
    `[data-normal-value='${keyText}'], [data-shift-value='${keyText}']`,
  );
  return { keyText, elements };
};

let capsLockActive = false;
const capsLockKey = document.querySelector("[data-normal-value='capslock']");
function syncCapsLockUI(e) {
  const isOn = e.getModifierState("CapsLock");
  if (isOn === capsLockActive) return; // no change, skip DOM work
  capsLockActive = isOn;
  keyRows.forEach((row) =>
    row.classList.toggle("capslock-down", capsLockActive),
  );
  capsLockKey.classList.toggle("active-key", capsLockActive);
}

function handleVirtualKeyboardKeydown(e) {
  syncCapsLockUI(e); // always check first, on every keydown

  const { keyText, elements: keys } = getKeys(e);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.add("shift-down"));
  }

  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.add("active-key"));
  }
}

function handleVirtualKeyboardKeyup(e) {
  const { keyText, elements: keys } = getKeys(e);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.remove("active-key"));
  }
  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.remove("shift-down"));
  }
}

document.addEventListener("keydown", (e) => {
  handleTypingKeydown(e);
  handleVirtualKeyboardKeydown(e);
});

document.addEventListener("keyup", (e) => {
  handleVirtualKeyboardKeyup(e);
});
