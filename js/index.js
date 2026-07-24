const homeScreen = document.querySelector(".home-screen");
const testScreen = document.querySelector(".test-screen");
const statsScreen = document.querySelector(".stats-screen");
const screens = [homeScreen, testScreen, statsScreen];

function activateScreen(screenClass) {
  for (const screen of screens) {
    screen.classList.toggle("active", screen.classList.contains(screenClass));
  }
}

document.addEventListener("testOver", () => {
  activateScreen("stats-screen");
});
