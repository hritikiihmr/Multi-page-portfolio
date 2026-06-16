# Dr. P. R. Sodani Portfolio Demo

Premium static portfolio demo for Dr. P. R. Sodani, President (Vice-Chancellor), IIHMR University, Jaipur.

## Setup

Serve the folder through a simple local server so JSON files and theme persistence work correctly:

```bash
python -m http.server 8000
```

Open `http://localhost:8000/`.

## Theme System

The project now supports three selectable themes:

- `Presidential Burgundy`
- `Global Academic Blue`
- `Heritage Emerald`

The default theme is `Presidential Burgundy`, which preserves the approved existing look.

### Theme files

- `assets/css/themes.css`: theme definitions and semantic color tokens
- `assets/css/styles.css`: existing shared component and layout styles
- `assets/js/theme-switcher.js`: preview switcher UI, persistence, and live theme updates
- `assets/js/main.js`: existing navigation, filters, forms, lightbox, and reveal behavior

### How theme switching works

- The `<html>` element carries `data-theme`, for example `data-theme="presidential-burgundy"`.
- A small inline script in each page `<head>` reads `localStorage` before paint to avoid theme flash.
- The preview switcher at bottom-right updates the theme without reloading the page.
- The selected theme is stored in `localStorage` under `pr-sodani-theme`.

### Change the default theme

1. Update the `data-theme` value on the `<html>` element in each page.
2. Update `DEFAULT_THEME` inside `assets/js/theme-switcher.js`.
3. Update the inline fallback script in each page if you want a different no-storage default.

### Remove the preview switcher after approval

1. Remove `assets/js/theme-switcher.js` script tags from the HTML pages.
2. Keep `assets/css/themes.css` so the approved theme tokens still work.
3. Optionally remove the switcher-only CSS block from `assets/css/styles.css`.

### Add a future theme safely

1. Add a new `html[data-theme="..."]` block in `assets/css/themes.css`.
2. Provide the same semantic tokens used by the existing themes.
3. Add the new theme entry to `THEMES` in `assets/js/theme-switcher.js`.
4. Verify contrast, focus states, forms, cards, footer, and overlays before approval.

## Structure

- `*.html`: static semantic HTML pages
- `assets/css/styles.css`: shared layout and component styling
- `assets/css/themes.css`: theme tokens and semantic mapping
- `assets/js/main.js`: existing site interactions
- `assets/js/theme-switcher.js`: theme picker behavior
- `assets/data/*.json`: placeholder data for publications, insights, awards, impact stories, and gallery
- `assets/images/*.svg`: non-stock placeholders awaiting approved assets
- `robots.txt` and `sitemap.xml`: SEO support with placeholder canonical domain

## Content Rules

Only content from the project brief has been used as factual content. Missing facts are marked with `[CONTENT REQUIRED]` or `[VERIFICATION REQUIRED]`. The publication section is labeled `Selected Publications` and is not represented as complete.

## Placeholders and Verification Items

- Approved portrait and gallery photographs
- Official biography PDF and CV
- Featured book metadata, cover, publisher, year, ISBN, and source links
- Complete selected publication records with authors, source, year, DOI, and abstracts
- Award names, bodies, years, citations, images, and evidence links
- Impact case studies with context, role, action, partners, outcome, and evidence
- Government committees, advisory roles, global partnerships, and regional network details
- Speaking appearances, videos, interviews, podcasts, press links, and speaker kit
- Approved leadership quote
- Exact current wording for roles and affiliations
- Production canonical domain, favicon, Open Graph image, and contact endpoint

## Accessibility

The demo includes semantic landmarks, skip links, visible focus, keyboard-operable mobile navigation, labeled forms, status messages, reduced-motion support, a focus-managed gallery lightbox, and an accessible theme switcher with live announcements.

## Privacy and Security

The contact and speaking forms are client-side demos only. No data is sent, stored, or transmitted. There are no secrets, private phone numbers, or credentials in the repository.
