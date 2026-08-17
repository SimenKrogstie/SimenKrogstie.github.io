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

  // Mobile nav toggle (hamburger menu)
  const navToggle = document.getElementById("nav-toggle");
  const topnavLinks = document.getElementById("topnav-links");
  const NAV_ICON_PATHS = {
    // Material Symbols "menu" / "close", filled variant, viewBox 0 -960 960 960
    menu: "M120-240v-80h720v80H120Zm0-200v-80h720v80H120Zm0-200v-80h720v80H120Z",
    close: "m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z",
  };
  function navIconSvg(icon) {
    return `<svg viewBox="0 -960 960 960" width="22" height="22" fill="currentColor" aria-hidden="true"><path d="${NAV_ICON_PATHS[icon]}"/></svg>`;
  }
  if (navToggle && topnavLinks) {
    const isNo = root.lang === "no";
    const setNavOpen = (open) => {
      topnavLinks.classList.toggle("open", open);
      navToggle.setAttribute("aria-expanded", String(open));
      navToggle.innerHTML = navIconSvg(open ? "close" : "menu");
      navToggle.setAttribute("aria-label", open ? (isNo ? "Lukk meny" : "Close menu") : (isNo ? "Åpne meny" : "Open menu"));
    };
    setNavOpen(false);
    navToggle.addEventListener("click", () => {
      setNavOpen(!topnavLinks.classList.contains("open"));
    });
    topnavLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setNavOpen(false));
    });
  }

  // Mobile "On this page" toggle: collapses the sidebar TOC into a
  // dropdown on narrow viewports. Inert on desktop, where CSS keeps the
  // list always visible regardless of the "open" class.
  const tocToggle = document.getElementById("toc-toggle");
  const tocList = document.getElementById("toc-list");
  if (tocToggle && tocList) {
    const setTocOpen = (open) => {
      tocList.classList.toggle("open", open);
      tocToggle.setAttribute("aria-expanded", String(open));
    };
    tocToggle.addEventListener("click", () => {
      setTocOpen(!tocList.classList.contains("open"));
    });
    tocList.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => setTocOpen(false));
    });
  }

  // Sidebar scrollspy: highlights the "On this page" link for the section
  // currently in view. Only runs on pages that have a #toc-list sidebar.
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

    // Marker line just below the sticky topnav: the active section is
    // whichever one's heading last crossed above it.
    const MARKER = 120;

    const updateActive = () => {
      let current = sections[0];
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= MARKER) {
          current = section;
        } else {
          break;
        }
      }
      if (current) setActive(current.id);
    };

    updateActive();
    window.addEventListener("scroll", updateActive, { passive: true });
    window.addEventListener("resize", updateActive);
  }

  // Terminal typing animation on the home page. Only runs on pages that
  // have a #terminal-body element; types the script out character by
  // character once the terminal scrolls into view, then leaves a
  // blinking cursor at the final prompt.
  const terminalBody = document.getElementById("terminal-body");
  if (terminalBody) {
    const isNo = root.lang === "no";
    const TERMINAL_SCRIPT = isNo
      ? [
          { prompt: true, text: "whoami"},
          { prompt: false, text: "simen roko krogstie" },
          { prompt: false, text: "" },
          { prompt: true, text: "cat rolle.txt" },
          { prompt: false, text: "m.sc. data science @ nmbu" },
          { prompt: false, text: "data science intern @ tet digital" },
          { prompt: false, text: "" },
          { prompt: true, text: "ls arbeid/" },
          { prompt: false, text: "urban-mobility/" },
          { prompt: false, text: "" },
          { prompt: true, text: "echo $STATUS" },
          { prompt: false, text: "åpen for muligheter ..." },
        ]
      : [
          { prompt: true, text: "whoami"},
          { prompt: false, text: "simen roko krogstie" },
          { prompt: false, text: "" },
          { prompt: true, text: "cat current_role.txt" },
          { prompt: false, text: "m.sc. data science @ nmbu" },
          { prompt: false, text: "data science intern @ tet digital" },
          { prompt: false, text: "" },
          { prompt: true, text: "ls work/" },
          { prompt: false, text: "urban-mobility/" },
          { prompt: false, text: "" },
          { prompt: true, text: "echo $STATUS" },
          { prompt: false, text: "open to opportunities ..." },
        ];

    const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    // "cd <page>" routing table. Paths are relative to the terminal's own
    // location (index.html / index-no.html at the repo root), matching the
    // topnav links on this same page.
    const PAGES = {
      home: { en: "index.html", no: "index-no.html", aliases: ["home", "~", "index"], noAliases: ["hjem"] },
      about: { en: "about/about.html", no: "about/about-no.html", aliases: ["about"], noAliases: ["om-meg", "om"] },
      work: { en: "projects/projects.html", no: "projects/projects-no.html", aliases: ["work"], noAliases: ["arbeid"] },
      contact: { en: "contact/contact.html", no: "contact/contact-no.html", aliases: ["contact"], noAliases: ["kontakt"] },
      cv: { en: "cv/cv.html", no: "cv/cv-no.html", aliases: ["cv"], noAliases: [] },
    };
    const ALIAS_MAP = {};
    Object.keys(PAGES).forEach((key) => {
      const page = PAGES[key];
      page.aliases.forEach((alias) => { ALIAS_MAP[alias] = key; });
      if (isNo) page.noAliases.forEach((alias) => { ALIAS_MAP[alias] = key; });
    });

    const STR = isNo
      ? {
          missingOperand: "cd: mangler argument",
          hint: "prøv: hjem, om-meg, arbeid, cv, kontakt",
          noSuchPage: (t) => `cd: fant ingen side som heter: ${t}`,
          opening: (p) => `åpner ${p} ...`,
          notFound: (c) => `${c}: kommando ikke funnet`,
          lsPages: "arbeid/  cv  hjem  kontakt/  om-meg/",
          helpLines: [
            "kommandoer:",
            "  cd <side>   — åpne en side (hjem, om-meg, arbeid, cv, kontakt)",
            "  ls          — list tilgjengelige sider",
            "  help        — vis denne meldingen",
          ],
          inputLabel: "Terminalkommando",
        }
      : {
          missingOperand: "cd: missing operand",
          hint: "try: home, about, work, cv, contact",
          noSuchPage: (t) => `cd: no such page: ${t}`,
          opening: (p) => `opening ${p} ...`,
          notFound: (c) => `${c}: command not found`,
          lsPages: "about/  contact/  cv  home  work/",
          helpLines: [
            "commands:",
            "  cd <page>   — open a page (home, about, work, cv, contact)",
            "  ls          — list available pages",
            "  help        — show this message",
          ],
          inputLabel: "Terminal command input",
        };

    function scrollToBottom() {
      terminalBody.scrollTop = terminalBody.scrollHeight;
    }

    function appendCursorLine(promptText) {
      const line = document.createElement("div");
      line.className = "terminal-line";
      if (promptText) {
        const prompt = document.createElement("span");
        prompt.className = "terminal-prompt";
        prompt.textContent = "$ ";
        line.appendChild(prompt);
      }
      const cursor = document.createElement("span");
      cursor.className = "terminal-cursor";
      line.appendChild(cursor);
      terminalBody.appendChild(line);
      return cursor;
    }

    function appendOutputLine(text) {
      const lineEl = document.createElement("div");
      lineEl.className = "terminal-line";
      lineEl.textContent = text;
      terminalBody.appendChild(lineEl);
      scrollToBottom();
    }

    function runCommand(raw) {
      if (raw === "") {
        appendPromptInput();
        return;
      }

      const parts = raw.split(/\s+/);
      const cmd = parts[0].toLowerCase();
      const args = parts.slice(1);

      if (cmd === "cd") {
        if (args.length === 0) {
          appendOutputLine(STR.missingOperand);
          appendOutputLine(STR.hint);
          appendPromptInput();
          return;
        }
        const key = ALIAS_MAP[args[0].toLowerCase()];
        if (!key) {
          appendOutputLine(STR.noSuchPage(args[0]));
          appendOutputLine(STR.hint);
          appendPromptInput();
          return;
        }
        const page = PAGES[key];
        const path = isNo ? page.no : page.en;
        appendOutputLine(STR.opening(path));
        setTimeout(() => {
          window.location.href = path;
        }, 250);
        return;
      }

      if (cmd === "ls") {
        appendOutputLine(STR.lsPages);
        appendPromptInput();
        return;
      }

      if (cmd === "help") {
        STR.helpLines.forEach(appendOutputLine);
        appendPromptInput();
        return;
      }

      appendOutputLine(STR.notFound(parts[0]));
      appendPromptInput();
    }

    function appendPromptInput() {
      const line = document.createElement("div");
      line.className = "terminal-line terminal-line--active";

      const prompt = document.createElement("span");
      prompt.className = "terminal-prompt";
      prompt.textContent = "$ ";
      line.appendChild(prompt);

      // Cursor comes before the input in DOM order so it sits right after
      // the prompt instead of being pushed to the far right by the input's
      // flex-grow; it's only a placeholder shown before the input is
      // focused (the native text caret takes over once typing starts).
      const cursor = document.createElement("span");
      cursor.className = "terminal-cursor";
      line.appendChild(cursor);

      const input = document.createElement("input");
      input.type = "text";
      input.className = "terminal-input";
      input.autocomplete = "off";
      input.autocapitalize = "off";
      input.spellcheck = false;
      input.setAttribute("aria-label", STR.inputLabel);
      line.appendChild(input);

      terminalBody.appendChild(line);
      scrollToBottom();

      if (terminalActive) input.focus();

      input.addEventListener("keydown", (event) => {
        if (event.key !== "Enter") return;
        const raw = input.value.trim();

        const committed = document.createElement("span");
        committed.textContent = raw;
        line.replaceChild(committed, input);
        cursor.remove();
        line.classList.remove("terminal-line--active");

        runCommand(raw);
      });
    }

    function renderFinal() {
      terminalBody.innerHTML = "";
      TERMINAL_SCRIPT.forEach((line) => {
        const lineEl = document.createElement("div");
        lineEl.className = "terminal-line";
        if (line.prompt) {
          const prompt = document.createElement("span");
          prompt.className = "terminal-prompt";
          prompt.textContent = "$ ";
          lineEl.appendChild(prompt);
        }
        lineEl.append(document.createTextNode(line.text));
        terminalBody.appendChild(lineEl);
      });
      appendPromptInput();
    }

    async function typeTerminal() {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (reduceMotion) {
        renderFinal();
        return;
      }

      // Empty terminal with just a blinking cursor before typing starts.
      const introCursor = appendCursorLine(false);
      await sleep(600);
      introCursor.parentElement.remove();

      for (const line of TERMINAL_SCRIPT) {
        const lineEl = document.createElement("div");
        lineEl.className = "terminal-line";
        if (line.prompt) {
          const prompt = document.createElement("span");
          prompt.className = "terminal-prompt";
          prompt.textContent = "$ ";
          lineEl.appendChild(prompt);
        }
        const textSpan = document.createElement("span");
        lineEl.appendChild(textSpan);
        terminalBody.appendChild(lineEl);

        for (const char of line.text) {
          textSpan.textContent += char;
          await sleep(25 + Math.random() * 35);
        }
        await sleep(250);
      }

      appendPromptInput();
    }

    const terminalEl = terminalBody.closest(".terminal");

    // Once the visitor clicks into the terminal, keep auto-focusing each
    // new prompt after a command runs, until they click outside it again.
    let terminalActive = false;
    (terminalEl || terminalBody).addEventListener("click", () => {
      terminalActive = true;
      const activeInput = terminalBody.querySelector(".terminal-input");
      if (activeInput) activeInput.focus();
    });
    document.addEventListener("click", (event) => {
      const container = terminalEl || terminalBody;
      if (!container.contains(event.target)) {
        terminalActive = false;
      }
    });

    let played = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !played) {
            played = true;
            typeTerminal();
            observer.disconnect();
          }
        });
      },
      { threshold: 0.05 }
    );
    observer.observe(terminalEl || terminalBody);
  }
});
