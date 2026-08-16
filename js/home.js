import { PROMPTS, TIER_ORDER } from "./prompts.js";

const homeScreenEl = document.querySelector(".home-screen");

// ---------- DOM references ----------
const mainEl = homeScreenEl.querySelector("main");
const headerEl = homeScreenEl.querySelector("header");
const selectedTagsEl = homeScreenEl.querySelector("header .selected-tags");
const removeTagTemplateEl = homeScreenEl.querySelector("#remove-tag-template");
const challengeCountEl = homeScreenEl.querySelector("#challenges-found-count");
const tagSelectEl = homeScreenEl.querySelector("#tag-filter-select");
const tierSelectEl = homeScreenEl.querySelector("#tier-filter-select");
const featuredTagsEl = homeScreenEl.querySelector(".featured-tags");
const challengeTileTemplateEl = homeScreenEl.querySelector(
  "#challenge-tile-template",
);

// ---------- State ----------
const tilesByTag = {};
const promptsById = {};
const durationById = {};
const activeTagFilters = new Set();
let activeTierFilter = "";

// ---------- Rendering ----------

function createTagEl(tag, tileEl) {
  const tagEl = document.createElement("span");
  tagEl.textContent = tag;
  tagEl.classList.add("tile-tag");
  (tilesByTag[tag] ??= []).push(tileEl);
  return tagEl;
}

function renderChallengeTiles() {
  const fragment = document.createDocumentFragment();

  for (const prompt of PROMPTS) {
    const clone = challengeTileTemplateEl.content.cloneNode(true);
    const tileEl = clone.querySelector(".challenge-tile");
    const tagContainerEl = tileEl.querySelector(".tile-tag-container");

    tileEl.classList.add("active");
    tileEl.dataset.tier = prompt.tier;
    tileEl.dataset.promptId = prompt.id;
    promptsById[prompt.id] = prompt.text;
    durationById[prompt.id] = prompt.recommendedRoundDurationSeconds;
    tileEl.querySelector("h2").textContent = prompt.title;
    tileEl.querySelector(".challenge-rank > span").textContent = prompt.tier;
    tileEl.querySelector(".challenge-duration > span").textContent =
      prompt.recommendedRoundDurationLabel ?? "\u2013";

    for (const tag of prompt.tags) {
      tagContainerEl.appendChild(createTagEl(tag, tileEl));
    }
    fragment.appendChild(clone);
  }

  mainEl.appendChild(fragment);
  updateChallengeCount();
}

function renderFeaturedTags() {
  const topTags = Object.entries(tilesByTag)
    .map(([tag, tiles]) => [tag, tiles.length])
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  for (const [tag] of topTags) {
    const buttonEl = document.createElement("button");
    buttonEl.type = "button";
    buttonEl.textContent = tag;
    buttonEl.dataset.tag = tag;
    buttonEl.classList.add("filter-control");
    featuredTagsEl.append(buttonEl);
  }
}

function renderFilterDropdowns() {
  for (const tag of Object.keys(tilesByTag)) {
    const optionEl = document.createElement("option");
    optionEl.value = tag;
    optionEl.dataset.label = tag;
    tagSelectEl.appendChild(optionEl);
  }

  for (const tier of TIER_ORDER) {
    const optionEl = document.createElement("option");
    optionEl.value = tier;
    optionEl.textContent = tier;
    tierSelectEl.appendChild(optionEl);
  }

  updateTagOptionLabels();
}

// ---------- Filtering ----------

function updateChallengeCount() {
  challengeCountEl.textContent = mainEl.querySelectorAll(
    ".challenge-tile.active",
  ).length;
}

function filterTiles() {
  mainEl.querySelectorAll(".challenge-tile").forEach((tileEl) => {
    const matchesTags = [...activeTagFilters].every((tag) =>
      tilesByTag[tag].includes(tileEl),
    );
    const matchesTier =
      !activeTierFilter || tileEl.dataset.tier === activeTierFilter;

    tileEl.classList.toggle("active", matchesTags && matchesTier);
  });

  updateChallengeCount();
}

function removeTagFilter(chipEl, tag) {
  activeTagFilters.delete(tag);

  const matchingButton = featuredTagsEl.querySelector(
    `button[data-tag="${tag}"]`,
  );

  if (matchingButton) matchingButton.classList.remove("active");

  chipEl.remove();
  syncTagFilterUI();
}

function updateTagOptionLabels() {
  tagSelectEl.querySelectorAll("option[value]").forEach((optionEl) => {
    if (!optionEl.value) return; // skip placeholder
    const isActive = activeTagFilters.has(optionEl.dataset.label);
    optionEl.textContent = isActive
      ? `✓ ${optionEl.dataset.label}`
      : optionEl.dataset.label;
  });
}

function renderSelectedTags() {
  selectedTagsEl.innerHTML = "";
  for (const tag of activeTagFilters) {
    const chipEl = document.createElement("span");
    chipEl.classList.add("selected-tag-chip");

    const labelEl = document.createElement("span");
    labelEl.textContent = tag;

    const removeBtn = document.createElement("button");
    removeBtn.type = "button";
    removeBtn.dataset.parentTag = tag;
    removeBtn.append(removeTagTemplateEl.content.cloneNode(true));

    chipEl.append(labelEl, removeBtn);
    selectedTagsEl.appendChild(chipEl);
  }
}

function syncTagFilterUI() {
  renderSelectedTags();
  updateTagOptionLabels();
  filterTiles();
}

// ---------- Init ----------
renderChallengeTiles();
renderFeaturedTags();
renderFilterDropdowns();

// ---------- Events ----------

headerEl.addEventListener("click", (e) => {
  const buttonEl = e.target.closest("button[data-tag]");
  if (!buttonEl) return;

  const tag = buttonEl.dataset.tag;
  const isNowActive = !buttonEl.classList.contains("active");
  buttonEl.classList.toggle("active", isNowActive);
  isNowActive ? activeTagFilters.add(tag) : activeTagFilters.delete(tag);

  syncTagFilterUI();
});

mainEl.addEventListener("click", (e) => {
  const buttonSelector = "button[data-btn-function='start-challenge']";
  const buttonEl = e.target.closest(buttonSelector);
  if (!buttonEl) return;

  const tileEl = buttonEl.closest("section.challenge-tile");
  const promptText = promptsById[tileEl.dataset.promptId];
  const duration = durationById[tileEl.dataset.promptId];
  document.dispatchEvent(
    new CustomEvent("startTest", {
      detail: { promptText: promptText, duration: duration },
    }),
  );
});

tagSelectEl.addEventListener("change", () => {
  const tag = tagSelectEl.value;
  if (!tag) return;

  activeTagFilters.add(tag);
  tagSelectEl.value = "";

  const matchingButton = featuredTagsEl.querySelector(
    `button[data-tag="${tag}"]`,
  );
  if (matchingButton) matchingButton.classList.add("active");

  syncTagFilterUI();
});

tierSelectEl.addEventListener("change", () => {
  activeTierFilter = tierSelectEl.value;
  filterTiles();
});

selectedTagsEl.addEventListener("click", (e) => {
  const buttonEl = e.target.closest("button");
  if (!buttonEl) return;
  removeTagFilter(buttonEl.parentElement, buttonEl.dataset.parentTag);
});
