const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const themeToggle = document.getElementById("themeToggle");

function updateNavbar() {
  navbar.classList.toggle("scrolled", window.scrollY > 18);
}

function applyTheme(theme) {
  if (theme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☾";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle.textContent = "☼";
  }
}

window.addEventListener("scroll", updateNavbar, { passive: true });
updateNavbar();

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

navLinks.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

applyTheme(localStorage.getItem("personal_site_theme") || "light");

themeToggle.addEventListener("click", () => {
  const next = document.documentElement.getAttribute("data-theme") === "dark" ? "light" : "dark";
  localStorage.setItem("personal_site_theme", next);
  applyTheme(next);
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((node) => observer.observe(node));

function escapeHtml(value) {
  return String(value || "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function renderPerspectives(items) {
  const root = document.getElementById("perspectivesList");
  if (!root || !Array.isArray(items) || items.length === 0) return;

  root.innerHTML = items.map((item) => `
    <a class="post-row" href="${escapeHtml(item.url || "#")}" ${item.url ? 'target="_blank" rel="noopener"' : ""}>
      <time>${escapeHtml(item.date || "")}</time>
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <p>${escapeHtml(item.summary)}</p>
      </div>
      <span>${escapeHtml(item.tag || "Perspective")}</span>
    </a>
  `).join("");
}

function renderCases(items) {
  const root = document.getElementById("casesGrid");
  if (!root || !Array.isArray(items) || items.length === 0) return;

  root.innerHTML = items.map((item, index) => `
    <article class="case-card">
      <time>${escapeHtml(item.label || `Case ${String(index + 1).padStart(2, "0")}`)}</time>
      <h3>${escapeHtml(item.title)}</h3>
      <p>${escapeHtml(item.summary)}</p>
      <ul>
        ${(item.points || []).map((point) => `<li>${escapeHtml(point)}</li>`).join("")}
      </ul>
    </article>
  `).join("");
}

fetch("data/content.json?v=notion-cms-v1")
  .then((response) => response.ok ? response.json() : null)
  .then((content) => {
    if (!content) return;
    renderPerspectives(content.perspectives);
    renderCases(content.cases);
  })
  .catch(() => {
    // Keep the built-in fallback content if the static data file is unavailable.
  });
