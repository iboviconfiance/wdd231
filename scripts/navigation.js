const hamburger = document.getElementById("hambtn");
const nav = document.getElementById("main-menu");

function toggleMobileMenu() {
  const expanded = hamburger.getAttribute("aria-expanded") === "true";
  hamburger.setAttribute("aria-expanded", !expanded);
  nav.classList.toggle("open");
  hamburger.innerHTML = expanded ? "&#9776;" : "&#10006;";
}

hamburger.addEventListener("click", e => {
  e.stopPropagation();
  toggleMobileMenu();
});
