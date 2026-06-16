const qs = (selector, scope = document) => scope.querySelector(selector);
const qsa = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function make(tag, className, text) {
  const el = document.createElement(tag);
  if (className) el.className = className;
  if (text !== undefined) el.textContent = text;
  return el;
}

function initMenu() {
  const toggle = qs("[data-menu-toggle]");
  const menu = qs("[data-menu]");
  if (!toggle || !menu) return;

  toggle.addEventListener("click", () => {
    const open = toggle.getAttribute("aria-expanded") === "true";
    toggle.setAttribute("aria-expanded", String(!open));
    menu.classList.toggle("is-open", !open);
    document.body.classList.toggle("menu-open", !open);
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      toggle.setAttribute("aria-expanded", "false");
      menu.classList.remove("is-open");
      document.body.classList.remove("menu-open");
    }
  });
}

function initReveal() {
  const items = qsa(".reveal");
  if (!items.length || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    items.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach((item) => observer.observe(item));
}

async function loadJSON(path) {
  const response = await fetch(path);
  if (!response.ok) throw new Error(`Unable to load ${path}`);
  return response.json();
}

function initPublications() {
  const root = qs("[data-publications]");
  if (!root) return;
  const list = qs("[data-publication-list]", root);
  const search = qs("[data-filter-search]", root);
  const type = qs("[data-filter-type]", root);
  const topic = qs("[data-filter-topic]", root);
  const year = qs("[data-filter-year]", root);
  const count = qs("[data-results-count]", root);

  loadJSON("assets/data/publications.json").then((items) => {
    const setOptions = (select, values) => {
      [...new Set(values.filter(Boolean))].sort().forEach((value) => {
        const option = make("option", "", value);
        option.value = value;
        select.append(option);
      });
    };
    setOptions(type, items.map((item) => item.type));
    setOptions(topic, items.map((item) => item.topic));
    setOptions(year, items.map((item) => item.year));

    const render = () => {
      const term = search.value.trim().toLowerCase();
      const filtered = items.filter((item) => {
        const haystack = `${item.title} ${item.authors} ${item.source} ${item.topic}`.toLowerCase();
        return (!term || haystack.includes(term))
          && (!type.value || item.type === type.value)
          && (!topic.value || item.topic === topic.value)
          && (!year.value || item.year === year.value);
      });
      list.replaceChildren(...filtered.map((item) => {
        const card = make("article", "card reveal is-visible");
        card.append(make("p", "eyebrow", item.type));
        card.append(make("h3", "", item.title));
        card.append(make("p", "meta", `${item.authors} | ${item.source} | ${item.year}`));
        card.append(make("p", "", item.abstract));
        if (item.link) {
          const link = make("a", "", "View source");
          link.href = item.link;
          link.target = "_blank";
          link.rel = "noopener noreferrer";
          card.append(link);
        }
        return card;
      }));
      count.textContent = `${filtered.length} selected item${filtered.length === 1 ? "" : "s"} shown`;
    };
    [search, type, topic, year].forEach((control) => control.addEventListener("input", render));
    render();
  }).catch(() => {
    list.textContent = "Publication data could not be loaded.";
  });
}

function initCards(endpoint, rootSelector, listSelector, mapper) {
  const root = qs(rootSelector);
  if (!root) return;
  const list = qs(listSelector, root);
  loadJSON(endpoint).then((items) => {
    list.replaceChildren(...items.map(mapper));
  }).catch(() => {
    list.textContent = "Data could not be loaded.";
  });
}

function initInsights() {
  const root = qs("[data-insights]");
  if (!root) return;
  const list = qs("[data-insight-list]", root);
  const search = qs("[data-filter-search]", root);
  const category = qs("[data-filter-category]", root);
  const count = qs("[data-results-count]", root);

  loadJSON("assets/data/insights.json").then((items) => {
    [...new Set(items.map((item) => item.category))].sort().forEach((value) => {
      const option = make("option", "", value);
      option.value = value;
      category.append(option);
    });
    const render = () => {
      const term = search.value.trim().toLowerCase();
      const filtered = items.filter((item) => {
        const haystack = `${item.title} ${item.summary} ${item.category}`.toLowerCase();
        return (!term || haystack.includes(term)) && (!category.value || item.category === category.value);
      });
      list.replaceChildren(...filtered.map((item) => {
        const card = make("article", "card reveal is-visible");
        card.append(make("p", "eyebrow", item.category));
        card.append(make("h3", "", item.title));
        card.append(make("p", "meta", item.date));
        card.append(make("p", "", item.summary));
        const link = make("a", "", "Read template");
        link.href = item.url;
        card.append(link);
        return card;
      }));
      count.textContent = `${filtered.length} item${filtered.length === 1 ? "" : "s"} shown`;
    };
    [search, category].forEach((control) => control.addEventListener("input", render));
    render();
  });
}

function initGallery() {
  const root = qs("[data-gallery]");
  const lightbox = qs("[data-lightbox]");
  if (!root || !lightbox) return;
  const list = qs("[data-gallery-list]", root);
  const filter = qs("[data-filter-category]", root);
  const title = qs("[data-lightbox-title]", lightbox);
  const img = qs("[data-lightbox-img]", lightbox);
  const caption = qs("[data-lightbox-caption]", lightbox);
  const close = qs("[data-lightbox-close]", lightbox);
  let lastTrigger = null;

  function openLightbox(item, trigger) {
    lastTrigger = trigger;
    title.textContent = item.title;
    img.src = item.src;
    img.alt = item.title;
    caption.textContent = item.caption;
    lightbox.hidden = false;
    close.focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    if (lastTrigger) lastTrigger.focus();
  }

  close.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
  document.addEventListener("keydown", (event) => {
    if (!lightbox.hidden && event.key === "Escape") closeLightbox();
    if (!lightbox.hidden && event.key === "Tab") {
      const focusables = qsa("button, [href], input, select, textarea, [tabindex]:not([tabindex='-1'])", lightbox);
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  });

  loadJSON("assets/data/gallery.json").then((items) => {
    [...new Set(items.map((item) => item.category))].sort().forEach((value) => {
      const option = make("option", "", value);
      option.value = value;
      filter.append(option);
    });
    const render = () => {
      const filtered = items.filter((item) => !filter.value || item.category === filter.value);
      list.replaceChildren(...filtered.map((item) => {
        const card = make("article", "card");
        const button = make("button", "gallery-button");
        button.type = "button";
        const image = document.createElement("img");
        image.src = item.src;
        image.alt = item.title;
        image.loading = "lazy";
        image.width = 1200;
        image.height = 800;
        button.append(image);
        button.append(make("h3", "", item.title));
        button.append(make("p", "meta", item.category));
        button.addEventListener("click", () => openLightbox(item, button));
        card.append(button);
        return card;
      }));
    };
    filter.addEventListener("input", render);
    render();
  });
}

function initForms() {
  qsa("[data-demo-form]").forEach((form) => {
    const status = qs("[data-form-status]", form);
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const botField = qs("[name='website']", form);
      if (botField && botField.value) return;
      if (!form.checkValidity()) {
        status.textContent = "Please complete the required fields.";
        status.className = "status error";
        form.reportValidity();
        return;
      }
      status.textContent = "Demo success: backend integration is pending, so no data was sent.";
      status.className = "status success";
      form.reset();
    });
  });
}

function initReadingTime() {
  qsa("[data-reading-time]").forEach((node) => {
    const words = node.textContent.trim().split(/\s+/).filter(Boolean).length;
    node.textContent = `${Math.max(1, Math.ceil(words / 220))} min read`;
  });
}

function initBreadcrumbs() {
  qsa(".breadcrumbs").forEach((node) => {
    if (qs(".breadcrumbs__current", node)) return;
    const firstLink = qs("a", node);
    if (!firstLink) return;

    const text = node.textContent.replace(/\s+/g, " ").trim();
    const parts = text.split("/").map((part) => part.trim()).filter(Boolean);
    if (parts.length < 2) return;

    const homeLink = firstLink.cloneNode(true);
    const current = make("span", "breadcrumbs__current", parts[parts.length - 1]);
    current.setAttribute("aria-current", "page");
    const sep = make("span", "breadcrumbs__sep", "/");
    sep.setAttribute("aria-hidden", "true");

    node.replaceChildren(homeLink, sep, current);
    node.setAttribute("aria-label", "Breadcrumb");
  });
}

initMenu();
initBreadcrumbs();
initReveal();
initPublications();
initInsights();
initGallery();
initForms();
initReadingTime();

initCards("assets/data/impact-stories.json", "[data-impact]", "[data-impact-list]", (item) => {
  const card = make("article", "card reveal is-visible");
  card.append(make("h3", "", item.title));
  ["context", "role", "action", "partners", "outcome", "evidence"].forEach((key) => {
    const p = make("p", "", "");
    const strong = make("strong", "", `${key[0].toUpperCase()}${key.slice(1)}: `);
    p.append(strong, document.createTextNode(item[key]));
    card.append(p);
  });
  return card;
});

initCards("assets/data/awards.json", "[data-awards]", "[data-awards-list]", (item) => {
  const card = make("article", "card reveal is-visible");
  card.append(make("p", "eyebrow", item.year));
  card.append(make("h3", "", item.name));
  card.append(make("p", "meta", item.body));
  card.append(make("p", "", item.citation));
  return card;
});
