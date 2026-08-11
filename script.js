/*
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

  // Togglebutton for sidebar
  function toggleSidebar() {
    document.getElementById("sidebar").classList.toggle("closed");
}
*/

// From CLAUDE 
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
 
  // Sidebar scrollspy: highlights the "On this page" link for the section
  // currently in view. Only runs on pages that have a #toc-list sidebar.
  const tocList = document.getElementById("toc-list");
  if (tocList) {
    const tocLinks = Array.from(tocList.querySelectorAll("a"));
    const sections = tocLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
 
    const setActive = (id) => {
      tocLinks.forEach((link) => {
        link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
      });
    };
 
    const observer = new IntersectionObserver(
      (entries) => {
        // Pick the entry closest to the top of the viewport that's intersecting
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible.length > 0) {
          setActive(visible[0].target.id);
        }
      },
      {
        // Counts a section as "current" once it's near the top of the viewport,
        // just below the sticky topnav.
        rootMargin: "-88px 0px -70% 0px",
        threshold: 0,
      }
    );
 
    sections.forEach((section) => observer.observe(section));
  }
});
