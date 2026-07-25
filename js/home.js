const startTestbtn = document.querySelector(".home-screen > .start-test-btn");

startTestbtn.addEventListener("click", () => {
  document.dispatchEvent(new CustomEvent("startTest"));
});
