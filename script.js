document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
  const root = document.documentElement;
  // Theme toggle
  const themeToggle = document.getElementById("theme-toggle");
  const ICON_PATHS = {
    // Material Symbols "dark_mode" / "light_mode", filled variant, viewBox 0 -960 960 960
    dark_mode: "M480-120q-150 0-255-105T120-480q0-150 105-255t255-105q14 0 27.5 1t26.5 3q-41 29-65.5 75.5T444-660q0 90 63 153t153 63q55 0 101-24.5t75-65.5q2 13 3 26.5t1 27.5q0 150-105 255T480-120Z",
    light_mode: "M480-280q-83 0-141.5-58.5T280-480q0-83 58.5-141.5T480-680q83 0 141.5 58.5T680-480q0 83-58.5 141.5T480-280ZM200-440H40v-80h160v80Zm720 0H760v-80h160v80ZM440-760v-160h80v160h-80Zm0 720v-160h80v160h-80ZM256-650l-101-97 57-59 96 100-52 56Zm492 496-97-101 53-55 101 97-57 59Zm-98-550 97-101 59 57-100 96-56-52ZM154-212l101-97 55 53-97 101-59-57Z",
  };
  function themeIconSvg(icon) {
    return `<span class="icon-circle"><svg viewBox="0 -960 960 960" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="${ICON_PATHS[icon]}"/></svg></span>`;
  }
  function setTheme(theme) {
    root.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
    // Icon + label language-aware: shows the mode a click will switch to
    if (themeToggle) {
      const isNo = root.lang === "no";
      if (theme === "dark") {
        themeToggle.innerHTML = themeIconSvg("light_mode");
        themeToggle.setAttribute("aria-label", isNo ? "Bytt til lys modus" : "Switch to light mode");
      } else {
        themeToggle.innerHTML = themeIconSvg("dark_mode");
        themeToggle.setAttribute("aria-label", isNo ? "Bytt til mørk modus" : "Switch to dark mode");
      }
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
    themeToggle.addEventListener("click", () => {
      setTheme(root.getAttribute("data-theme") === "dark" ? "light" : "dark");
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
