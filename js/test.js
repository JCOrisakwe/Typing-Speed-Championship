// INITIALIZE GLOBAL VARIABLES & FUNCTIONS

let testInactive = true;
let screenInactive = true;
let remainingSeconds;
let roundDuration;
let currCharIdx;
let highWaterMark;

let promptText;
let wpm;
let accuracy;
let totalKeystrokes;
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
  testInactive = true;
  screenInactive = true;
  let trueAccuracy =
    Math.round((correctFirstAttempts / highWaterMark) * 100) || 0;
  let errors = highWaterMark - correctFirstAttempts;
  let duration = formatTime(roundDuration * 60 - remainingSeconds);

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

function initTest() {
  roundDuration = 10;
  remainingSeconds = roundDuration * 60;
  correctKeystrokes = 0;
  correctFirstAttempts = 0;
  currCharIdx = 0;
  highWaterMark = 0;
  totalKeystrokes = 0;
  testInactive = false;
  screenInactive = false;

  textBox.scrollTop = 0;
  textBox.replaceChildren();

  promptText = `Molestiae! consequuntur explicabo, vel at minus mollitia autem impedit alias
  voluptas totam similique nihil temporibus aut. Quae veritatis ut iusto sequi, ad
  sint provident aliquid facere expedita delectus magnam blanditiis
  perspiciatis culpa harum laborum illo excepturi! Neque sunt incidunt omnis iste.`;

  updateTimer();
  updateWPM();
  updateAccuracy();
  populateTextBox();
  if (chars) chars[0].append(caret);
}

const textBox = document.querySelector(".text-box");
function populateTextBox() {
  chars = [];
  let wordEl = document.createElement("span");

  // populate text box with character spans
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
  let elapsedMinutes = roundDuration - remainingSeconds / 60;
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

// ---------------- TEXT BOX LAYOUT AND TYPING FUNCTIONALITY ----------------

// create caret
const caret = document.createElement("span");
caret.classList.add("caret");

function updateScroll(scrollup = true) {
  const styles = getComputedStyle(textBox);
  const lineHeight = Number(styles.lineHeight.replace("px", ""));
  const relativeTop = chars[currCharIdx].offsetTop - textBox.scrollTop;

  if (scrollup && relativeTop > textBox.clientHeight) {
    textBox.scrollTop += lineHeight;
  } else if (!scrollup && textBox.clientHeight - relativeTop >= lineHeight) {
    textBox.scrollTop -= lineHeight;
  }
}

function handleTypingKeydown(e) {
  const isValidKeystroke =
    e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey;

  if (isValidKeystroke && currCharIdx < chars.length) {
    const currentEl = chars[currCharIdx];
    const isCorrect =
      e.key === currentEl.innerText ||
      isWhiteSpace(e.key, currentEl.textContent);
    totalKeystrokes += 1;

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
  } else if (e.key.toLowerCase() === "backspace") {
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
}

// ---------------- VIRTUAL KEYBOARD LAYOUT AND FUNCTIONALITY ----------------
const keyRows = document.querySelectorAll(".key-row");

const getKeys = (e) => {
  const keyText = CSS.escape(e.key.toLowerCase());
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

function handleVirtualKeyboardKeydown(e) {
  syncCapsLockUI(e); // always check first, on every keydown

  const { keyText, elements: keys } = getKeys(e);
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

// ---------------- QUIT/RESET POP-UP LAYOUT AND FUNCTIONALITY ----------------
const popUp = document.querySelector(".test-screen .pop-up");
const popUpMsg = document.querySelector(".test-screen .pop-up > div");
const popUpThemeEls = document.querySelectorAll(".pop-up-theme");
const quitBtn = document.querySelector(".test-screen__header > button");
const resetBtn = document.querySelector(".test-screen__footer > button");
const popUpProceedBtn = document.querySelector(".pop-up-proceed-btn");
const popUpReturnBtn = document.querySelector(".pop-up-return-btn");

let popUpTheme;
let popUpEvent;

const togglePopUp = (popUpThemeArg = "quit", show = true) => {
  testInactive = show;
  popUp.classList.toggle("active", show);

  if (!show) return;

  popUpThemeEls.forEach((el) => (el.textContent = popUpThemeArg));
  popUpTheme = popUpThemeArg;
};

const handleEscKeydown = (e) => {
  if (e.key.toLowerCase() !== "escape" || screenInactive) return;
  togglePopUp("quit", !popUp.classList.contains("active"));
};

quitBtn.addEventListener("click", () => togglePopUp());
resetBtn.addEventListener("click", () => togglePopUp("restart"));
popUpReturnBtn.addEventListener("click", () => togglePopUp(null, false));

popUp.addEventListener("click", (e) => {
  if (!popUpMsg.contains(e.target)) togglePopUp(null, false);
});

popUpProceedBtn.addEventListener("click", () => {
  if (popUpTheme === "quit") {
    popUpEvent = "returnHome";
    screenInactive = true;
  } else if (popUpTheme === "restart") {
    popUpEvent = "startTest";
  }
  if (popUpEvent) {
    document.dispatchEvent(new CustomEvent(popUpEvent));
    popUp.classList.remove("active");
  }
});

// ---------------- UPDATE TEST STATE ----------------

document.addEventListener("startTest", initTest);

const timerInterval = setInterval(() => {
  if (testInactive) return;

  updateTimer();
  updateWPM();
}, 1000);

document.addEventListener("keydown", (e) => {
  handleEscKeydown(e);

  if (testInactive) return;
  handleTypingKeydown(e);
  handleVirtualKeyboardKeydown(e);
});

document.addEventListener("keyup", (e) => {
  handleVirtualKeyboardKeyup(e);
});
