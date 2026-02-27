document.addEventListener("DOMContentLoaded", () => {
    // Footer year
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();

    // Theme toggle
    const toggle = document.getElementById("theme-toggle");
    const root = document.documentElement;
    const label = document.querySelector(".theme-toggle-label");

    function setTheme(theme) {
        root.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);

        if (toggle) toggle.checked = theme === "dark";
        if (label) label.textContent = theme === "dark" ? "Dark mode" : "Light mode";
    }

    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
        setTheme("dark");
    } else {
        setTheme("light");
    }

    if (toggle) {
        toggle.addEventListener("change", () => {
            setTheme(toggle.checked ? "dark" : "light");
        });
    }    
})