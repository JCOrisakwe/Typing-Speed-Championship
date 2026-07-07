// INITIALIZE GLOBAL VARIABLES & FUNCTIONS
const roundDuration = 10; // in minutes
let remainingSeconds = roundDuration * 60;
let validKeystrokes = 0;
let currCharIdx = 0;

const prompt = `Molestiae! consequuntur explicabo, vel at minus mollitia autem impedit alias
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
function updateAccuracy() {
  let correctCount = document.querySelectorAll(".correct-char").length;
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

// populate text box whith character spans
const textBox = document.querySelector(".text-box");
for (let char of prompt) {
  const charEl = document.createElement("span");
  charEl.append(char);
  textBox.append(charEl);
}

// initialize typing/text box variables and functions
const getBottom = (el) => el.getBoundingClientRect().bottom;
const textBoxBottom = getBottom(textBox);
const textBoxLineHeight = Number(
  getComputedStyle(textBox).lineHeight.replace("px", ""),
);
const isValidKeystroke = (e) =>
  e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

function handleTypingKeydown(e) {
  if (isValidKeystroke(e) && currCharIdx < textBox.children.length) {
    const currentEl = textBox.children[currCharIdx];
    const isCorrect = e.key === currentEl.innerText;

    currentEl.classList.add(isCorrect ? "correct-char" : "wrong-char");

    validKeystrokes += 1;
    currCharIdx += 1;
    updateAccuracy();

    if (getBottom(currentEl) > textBoxBottom) {
      textBox.scrollTop += textBoxLineHeight;
    }
  } else if (e.key.toLowerCase() === "backspace") {
    const prevElemIdx = Math.max(0, currCharIdx - 1);
    const prevEl = textBox.children[prevElemIdx];
    if (prevEl) {
      prevEl.classList.remove("correct-char", "wrong-char");
      currCharIdx = prevElemIdx;
    }
    if (textBoxBottom - getBottom(prevEl) >= textBoxLineHeight) {
      textBox.scrollTop -= textBoxLineHeight;
    }
    updateAccuracy();
  }
}

// ---------------- VIRTUAL KEYBOARD LAYOUT AND FUNCTIONALITY ----------------
const keyRows = document.querySelectorAll(".key-row");
let capsLockActive = false;

const getKeys = (e) => {
  const keyText = CSS.escape(e.key.toLowerCase());
  const elements = document.querySelectorAll(
    `[data-normal-value='${keyText}'], [data-shift-value='${keyText}']`,
  );
  return { keyText, elements };
};

function handleVirtualKeyboardKeydown(e) {
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
}

function handleVirtualKeyboardKeyup(e) {
  const { keyText, elements: keys } = getKeys(e);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.remove("active"));
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
