const prompt = `Molestiae consequuntur explicabo, vel at minus mollitia autem impedit alias
  voluptas totam similique nihil temporibus aut. Quae veritatis ut iusto sequi, ad
  sint provident aliquid facere expedita delectus magnam blanditiis
  perspiciatis culpa harum laborum illo excepturi! Neque sunt incidunt omnis iste.`;

let roundDuration = 10; // in minutes
let remainingSeconds = roundDuration * 60;
let validKeystrokes = 0;
let correctKeystrokes = 0;

// COUNTDOWN TIMER
const to2digits = (num) => String(num).padStart(2, "0");
const timerEl = document.querySelector("[data-function='timer']");

const updateDisplay = () => {
  const mins = Math.floor(remainingSeconds / 60);
  const secs = remainingSeconds % 60;
  timerEl.textContent = `${to2digits(mins)}:${to2digits(secs)}`;
};

const wpmEl = document.querySelector("[data-function='wpm']");
const updateWPM = () => {
  let elapseMinutes = roundDuration - remainingSeconds / 60;
  let grossWPM = Math.round(validKeystrokes / (5 * elapseMinutes));
  wpmEl.textContent = grossWPM || 0;
};

const accuracyEl = document.querySelector("[data-function='accuracy']");
const UpdateAccuracy = () => {
  accuracyEl.textContent =
    Math.round((correctKeystrokes / validKeystrokes) * 100) || 0;
};

updateDisplay();

const timerInterval = setInterval(() => {
  remainingSeconds -= 1;
  updateDisplay();
  updateWPM();
  UpdateAccuracy();
}, 1000);

// TEXT BOX LAYOUT AND FUNCTIONALITY

// populate text box whith character spans
const textBox = document.querySelector(".text-box");
for (let char of prompt) {
  const charEl = document.createElement("span");
  charEl.append(char);
  textBox.append(charEl);
}

// create highlighting variables & functions
const getBottom = (el) => el.getBoundingClientRect().bottom;
const textBoxBottom = getBottom(textBox);
let currCharIdx = 0;
const textBoxLineHeight = Number(
  getComputedStyle(textBox).lineHeight.replace("px", ""),
);

document.addEventListener("keydown", (e) => {
  if (e.key.length === 1 && currCharIdx < textBox.children.length) {
    // add character hightlight
    const currentEl = textBox.children[currCharIdx];
    if (e.key === currentEl.innerText) {
      currentEl.classList.add("correct-char");
      correctKeystrokes += 1;
    } else {
      currentEl.classList.add("wrong-char");
    }
    currCharIdx += 1;
    validKeystrokes += 1;

    // textbox scroll down mechanism
    if (getBottom(currentEl) > textBoxBottom) {
      textBox.scrollTop += textBoxLineHeight;
    }
  } else if (e.key.toLowerCase() === "backspace") {
    // remove character highlight
    let prevElemIdx = Math.max(0, currCharIdx - 1);
    const prevEl = textBox.children[prevElemIdx];
    if (prevEl) {
      prevEl.classList.remove("correct-char", "wrong-char");
      currCharIdx = prevElemIdx;
    }

    // textbox scroll up mechanism
    if (textBoxBottom - getBottom(prevEl) >= textBoxLineHeight) {
      textBox.scrollTop -= textBoxLineHeight;
    }
  }
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
