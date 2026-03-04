document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  const root = document.documentElement;

  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const themeLabel = document.getElementById("theme-label");

  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);

    if (themeToggle) themeToggle.checked = theme === "dark";

    // Label language-aware
    const isNo = root.lang === "no";
    if (themeLabel) {
      if (isNo) themeLabel.textContent = theme === "dark" ? "Mørk modus" : "Lys modus";
      else themeLabel.textContent = theme === "dark" ? "Dark mode" : "Light mode";
    }
  }

  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
  } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    setTheme("dark");
  } else {
    setTheme("light");
  }

  if (themeToggle) {
    themeToggle.addEventListener("change", () => {
      setTheme(themeToggle.checked ? "dark" : "light");
    });
  }

  // Language Toggle
  const langToggle = document.getElementById("lang-toggle");
  if (langToggle) {
    langToggle.addEventListener("change", () => {
      const isNorwegian = root.lang === "no";
      window.location.href = isNorwegian ? "index.html" : "index-no.html";
    });
  }
});