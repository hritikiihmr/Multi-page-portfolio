const THEME_KEY = "pr-sodani-theme";
const DEFAULT_THEME = "presidential-burgundy";
const THEMES = [
  {
    id: "presidential-burgundy",
    name: "Presidential Burgundy",
    swatches: ["#7f1d2d", "#102a43", "#b78a34"]
  },
  {
    id: "global-academic-blue",
    name: "Global Academic Blue",
    swatches: ["#002d72", "#4d8fc5", "#c7a44a"]
  },
  {
    id: "heritage-emerald",
    name: "Heritage Emerald",
    swatches: ["#0d463b", "#263238", "#b6874b"]
  }
];

function isValidTheme(theme) {
  return THEMES.some((item) => item.id === theme);
}

function getCurrentTheme() {
  const current = document.documentElement.getAttribute("data-theme");
  return isValidTheme(current) ? current : DEFAULT_THEME;
}

function setTheme(theme, announce = false) {
  const nextTheme = isValidTheme(theme) ? theme : DEFAULT_THEME;
  document.documentElement.setAttribute("data-theme", nextTheme);
  try {
    localStorage.setItem(THEME_KEY, nextTheme);
  } catch (error) {
    // Ignore storage failures and keep the active in-memory theme.
  }

  document.querySelectorAll("[data-theme-option]").forEach((button) => {
    const active = button.getAttribute("data-theme-option") === nextTheme;
    button.setAttribute("aria-pressed", String(active));
    button.classList.toggle("is-active", active);
    const indicator = button.querySelector("[data-theme-active]");
    if (indicator) indicator.hidden = !active;
  });

  if (announce) {
    const match = THEMES.find((item) => item.id === nextTheme);
    const live = document.querySelector("[data-theme-live]");
    if (live && match) live.textContent = `${match.name} theme selected`;
  }
}

function buildThemeSwitcher() {
  if (!document.body || document.querySelector(".theme-switcher")) return;

  const shell = document.createElement("div");
  shell.className = "theme-switcher";
  shell.innerHTML = `
    <div class="theme-switcher__live sr-only" aria-live="polite" data-theme-live></div>
    <button class="theme-switcher__toggle" type="button" aria-expanded="false" aria-controls="theme-switcher-panel" aria-label="Open theme switcher">
      <span class="theme-switcher__toggle-icon" aria-hidden="true"></span>
      <span class="sr-only">Theme switcher</span>
    </button>
    <section class="theme-switcher__panel" id="theme-switcher-panel" hidden aria-label="Theme switcher panel">
      <div class="theme-switcher__panel-top">
        <div>
          <p class="theme-switcher__eyebrow">Theme Preview</p>
          <h2 class="theme-switcher__title">Choose a theme</h2>
        </div>
        <button class="theme-switcher__close" type="button" aria-label="Close theme switcher">Close</button>
      </div>
      <div class="theme-switcher__options" role="group" aria-label="Theme options"></div>
    </section>
  `;

  const panel = shell.querySelector(".theme-switcher__panel");
  const toggle = shell.querySelector(".theme-switcher__toggle");
  const close = shell.querySelector(".theme-switcher__close");
  const options = shell.querySelector(".theme-switcher__options");

  THEMES.forEach((theme) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "theme-switcher__option";
    button.setAttribute("data-theme-option", theme.id);
    button.setAttribute("aria-pressed", "false");
    button.innerHTML = `
      <span class="theme-switcher__swatches" aria-hidden="true">
        ${theme.swatches.map((color) => `<span class="theme-switcher__swatch" style="--swatch:${color}"></span>`).join("")}
      </span>
      <span class="theme-switcher__option-text">
        <span class="theme-switcher__name">${theme.name}</span>
        <span class="theme-switcher__active" data-theme-active hidden>Active</span>
      </span>
    `;
    button.addEventListener("click", () => setTheme(theme.id, true));
    options.append(button);
  });

  function openPanel() {
    panel.hidden = false;
    shell.classList.add("is-open");
    toggle.setAttribute("aria-expanded", "true");
    const first = panel.querySelector("[data-theme-option]");
    if (first) first.focus();
  }

  function closePanel() {
    panel.hidden = true;
    shell.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    toggle.focus();
  }

  toggle.addEventListener("click", () => {
    if (panel.hidden) {
      openPanel();
    } else {
      closePanel();
    }
  });
  close.addEventListener("click", closePanel);

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && !panel.hidden) closePanel();
  });

  document.addEventListener("click", (event) => {
    if (!shell.contains(event.target) && !panel.hidden) {
      panel.hidden = true;
      shell.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    }
  });

  document.body.append(shell);
  setTheme(getCurrentTheme(), false);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", buildThemeSwitcher, { once: true });
} else {
  buildThemeSwitcher();
}
