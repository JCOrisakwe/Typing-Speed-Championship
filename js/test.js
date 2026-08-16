// INITIALIZE GLOBAL VARIABLES & FUNCTIONS

let testPaused = true;
let remainingSeconds;
let roundDuration;
let timerInterval;
let currCharIdx;
let highWaterMark;

let promptText;
let wpm;
let accuracy;
let correctKeystrokes;
let correctFirstAttempts;

let chars;

function isWhiteSpace(...chars) {
  return chars.reduce((_, char) => !char.trim() && _, true);
}

function formatTime(seconds) {
  const to2digits = (num) => String(num).padStart(2, "0");
  return `${to2digits(Math.floor(seconds / 60))}:${to2digits(seconds % 60)}`;
}

function endTest() {
  updateWPM();
  testPaused = true;
  let trueAccuracy =
    Math.round((correctFirstAttempts / highWaterMark) * 100) || 0;
  let errors = highWaterMark - correctFirstAttempts;
  let duration = formatTime(roundDuration - remainingSeconds);
  textBoxOverlay.blur();

  document.dispatchEvent(
    new CustomEvent("testOver", {
      detail: {
        wpm: wpm,
        accuracy: `${accuracy}%`,
        "true-accuracy": `${trueAccuracy}%`,
        errors: errors,
        characters: `${highWaterMark}`,
        duration: duration,
        promptLength: chars.length,
      },
    }),
  );
}

function initTest(e) {
  if (e?.detail?.duration) {
    roundDuration = e.detail.duration;
  }
  if (e?.detail?.promptText) {
    promptText = e.detail.promptText;
  }

  remainingSeconds = roundDuration;
  correctKeystrokes = 0;
  correctFirstAttempts = 0;
  currCharIdx = 0;
  highWaterMark = 0;

  textBox.scrollTop = 0;
  textBox.replaceChildren();

  updateTimer();
  updateWPM();
  updateAccuracy();
  populateTextBox();
  startCountDown();
  textBoxOverlay.blur();
  if (chars) chars[0].append(caret);
}

const textBox = document.querySelector(".text-box > div");
function populateTextBox() {
  chars = [];
  let wordEl = document.createElement("span");

  // populate text box with character spans
  for (let char of promptText) {
    // remove excess white space
    if (!wordEl.hasChildNodes() && isWhiteSpace(char)) continue;

    const charEl = document.createElement("span");
    charEl.textContent = char.trim() || "\u00A0"; // replace white space with non-breakable space
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
}

// ---------------- UPDATE STATS ----------------

// update timer
const timerEl = document.querySelector("[data-current-stat='time-left']");
function updateTimer() {
  if (!remainingSeconds) return endTest();
  timerEl.textContent = formatTime(remainingSeconds);
  remainingSeconds -= 1;
}

// update wpm
const wpmEl = document.querySelector("[data-current-stat='wpm']");
function updateWPM() {
  let elapsedMinutes = (roundDuration - remainingSeconds) / 60;
  wpm = Math.round(correctKeystrokes / (5 * elapsedMinutes));
  wpmEl.textContent = wpm || 0;
}

// update accuracy
const accuracyEl = document.querySelector("[data-current-stat='accuracy']");
function updateAccuracy() {
  accuracy =
    currCharIdx > 0 ? Math.round((correctKeystrokes / currCharIdx) * 100) : 0;
  accuracyEl.textContent = accuracy;
}

function updateStats() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    if (testPaused) return;
    updateTimer();
    updateWPM();
  }, 1000);
}

// ---------------- TEXT BOX LAYOUT AND TYPING FUNCTIONALITY ----------------

// create caret
const caret = document.createElement("span");
caret.classList.add("caret");

function updateScroll(scrollup = true) {
  const styles = getComputedStyle(textBox);
  const lineHeight = Number(styles.lineHeight.replace("px", ""));
  const relativeTop = chars[currCharIdx].offsetTop - textBox.scrollTop;

  if (scrollup && relativeTop + lineHeight > textBox.clientHeight) {
    textBox.scrollTop += lineHeight;
  } else if (
    !scrollup &&
    textBox.clientHeight - relativeTop >= 2 * lineHeight
  ) {
    textBox.scrollTop -= lineHeight;
  }
}

function handleValidUserInput(charTxt) {
  const currentEl = chars[currCharIdx];
  const isCorrect =
    charTxt === currentEl.textContent ||
    isWhiteSpace(charTxt, currentEl.textContent);

  currentEl.classList.add(isCorrect ? "correct-char" : "wrong-char");
  if (isWhiteSpace(currentEl.textContent) && !isCorrect) {
    currentEl.classList.add("wrong-space");
  }

  if (currCharIdx === highWaterMark && isCorrect) {
    correctFirstAttempts += 1;
    highWaterMark += 1;
    correctKeystrokes += 1;
  } else if (currCharIdx === highWaterMark) {
    highWaterMark += 1;
  } else if (isCorrect) {
    correctKeystrokes += 1;
  }

  currCharIdx += 1;
  updateAccuracy();

  if (currCharIdx >= chars.length) return endTest();

  updateScroll();
  chars[currCharIdx].append(caret);
}

function handleBackspace() {
  const prevElemIdx = Math.max(0, currCharIdx - 1);
  const prevEl = chars[prevElemIdx];

  if (!prevEl) return;

  if (prevEl.classList.contains("correct-char")) correctKeystrokes -= 1;
  prevEl.classList.remove("correct-char", "wrong-char", "wrong-space");

  currCharIdx = prevElemIdx;
  prevEl.append(caret);

  updateScroll(false);
  updateAccuracy();
}

function handleTypingKeydownEvent(e) {
  const isValidKeystroke =
    e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

  if (isValidKeystroke && currCharIdx < chars.length) {
    e.preventDefault();
    handleValidUserInput(e.key);
  } else if (e.key.toLowerCase() === "backspace") {
    e.preventDefault();
    handleBackspace();
  }
}

const textBoxOverlay = document.querySelector(".text-box > input");
function handleTypingInputEvent(e) {
  if (e.inputType === "deleteContentBackward") {
    handleBackspace();
  } else if (e.data) {
    handleValidUserInput(e.data);
  }
  textBoxOverlay.value = "";
}

// ---------------- VIRTUAL KEYBOARD LAYOUT AND FUNCTIONALITY ----------------
const keyRows = document.querySelectorAll(".key-row");

const getKeys = (charTxt) => {
  const keyText = CSS.escape(charTxt.toLowerCase());
  const elements = document.querySelectorAll(
    `[data-key-value-1='${keyText}'], [data-key-value-2='${keyText}']`,
  );
  return { keyText, elements };
};

let capsLockActive = false;
const capsLockKey = document.querySelector("[data-key-value-1='capslock']");
function syncCapsLockUI(e) {
  const isOn = e.getModifierState("CapsLock");
  if (isOn === capsLockActive) return; // no change, skip DOM work
  capsLockActive = isOn;
  keyRows.forEach((row) =>
    row.classList.toggle("capslock-down", capsLockActive),
  );
  capsLockKey.classList.toggle("active", capsLockActive);
}

function handleVirtualKeyboardInputEvent(e) {
  const dataKey =
    e.inputType === "deleteContentBackward" ? "backspace" : e.data;
  if (!dataKey) return;

  const keys = getKeys(dataKey).elements;
  if (!keys.length) return;

  keys.forEach((key) => {
    key.classList.add("active");
    if (key.getAttribute("data-key-value-2") === dataKey)
      key.classList.add("shift-char-active");
  });
  setTimeout(() => {
    keys.forEach((key) => key.classList.remove("active", "shift-char-active"));
  }, 200);
}

function handleVirtualKeyboardKeydownEvent(e) {
  syncCapsLockUI(e);
  const { keyText, elements: keys } = getKeys(e.key);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.add("shift-down"));
  }
  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.add("active"));
  }
}

function handleVirtualKeyboardKeyup(e) {
  const { keyText, elements: keys } = getKeys(e.key);
  if (!keys.length) return;

  e.preventDefault();

  if (keyText !== "capslock") {
    keys.forEach((key) => key.classList.remove("active"));
  }
  if (keyText === "shift") {
    keyRows.forEach((row) => row.classList.remove("shift-down"));
  }
}

// ---------------- COUNTDOWN MODAL LAYOUT AND FUNCTIONALITY ----------------

const countdownModal = document.querySelector(".countdown-modal");
const countdownModalNum = document.querySelector(".countdown-modal > span");
function startCountDown() {
  let Num = 3;
  countdownModal.classList.add("active");
  countdownModalNum.textContent = Num;

  let intervalId = setInterval(() => {
    Num -= 1;
    if (Num < 0) {
      textBoxOverlay.focus();
      clearInterval(intervalId);
      countdownModal.classList.remove("active");
      testPaused = false;
      updateStats();
    }
    countdownModalNum.textContent = Num || "Go";
  }, 1000);
}

// ---------------- CONFIRM MODAL LAYOUT AND FUNCTIONALITY ----------------
const confirmModal = document.querySelector(".confirm-modal");
const confirmModalMsg = document.querySelector(".confirm-modal > div");
const confirmModalThemeEls = document.querySelectorAll(".confirm-modal-theme");
const quitBtn = document.querySelector(".test-screen__header > button");
const resetBtn = document.querySelector(".test-screen__footer > button");
const confirmModalProceedBtn = document.querySelector(
  ".confirm-modal-proceed-btn",
);
const confirmModalReturnBtn = document.querySelector(
  ".confirm-modal-return-btn",
);

let confirmModalTheme;
let confirmModalEvent;

const toggleConfirmModal = (confirmModalThemeArg = "quit", show = true) => {
  testPaused = show;
  confirmModal.classList.toggle("active", show);

  if (show) {
    textBoxOverlay.blur();
  } else {
    textBoxOverlay.focus();
    return;
  }
  confirmModalThemeEls.forEach((el) => (el.textContent = confirmModalThemeArg));
  confirmModalTheme = confirmModalThemeArg;
};

// ---------------- REACT TO EVENTS ----------------

document.addEventListener("startTest", initTest);

document.addEventListener("keydown", (e) => {
  if (testPaused) return;
  handleTypingKeydownEvent(e);
  handleVirtualKeyboardKeydownEvent(e);
});

document.addEventListener("keyup", (e) => {
  handleVirtualKeyboardKeyup(e);
});

textBoxOverlay.addEventListener("input", (e) => {
  if (testPaused) return;
  handleTypingInputEvent(e);
  handleVirtualKeyboardInputEvent(e);
});

quitBtn.addEventListener("click", () => toggleConfirmModal());
resetBtn.addEventListener("click", () => toggleConfirmModal("restart"));

confirmModalProceedBtn.addEventListener("click", () => {
  if (confirmModalTheme === "quit") {
    confirmModalEvent = "returnHome";
  } else if (confirmModalTheme === "restart") {
    confirmModalEvent = "startTest";
  }
  if (confirmModalEvent) {
    document.dispatchEvent(new CustomEvent(confirmModalEvent));
    confirmModal.classList.remove("active");
  }
});

confirmModalReturnBtn.addEventListener("click", () =>
  toggleConfirmModal(null, false),
);

confirmModal.addEventListener("click", (e) => {
  if (!confirmModalMsg.contains(e.target)) toggleConfirmModal(null, false);
});
