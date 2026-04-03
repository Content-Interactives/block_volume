# Block Volume

React activity for rectangular prism dimensions: an isometric-style unit-cube stack illustrates length, width, and height; learners adjust steppers to match the hidden dimensions, then see the computed volume (L × W × H). Vite builds static assets for GitHub Pages.

**Production:** [https://content-interactives.github.io/block_volume/](https://content-interactives.github.io/block_volume/)

---

## Stack

| Layer | Packages / tooling |
|--------|---------------------|
| UI | React 19 (`react`, `react-dom`) |
| Build | Vite 7, `@vitejs/plugin-react` |
| Styling | Tailwind CSS 3, PostCSS, Autoprefixer |
| Feedback | `canvas-confetti` when dimensions are correct |
| Lint | ESLint 9 (flat config), React Hooks / Refresh plugins |
| Deploy | `gh-pages` → `dist` |

Source is **JavaScript** (`.jsx`), not TypeScript. `package.json` sets `"type": "module"`.

---

## Build and base path

`vite.config.js` sets `base: '/block_volume/'` for GitHub Pages under the repo path.

| Script | Command |
|--------|---------|
| Development | `npm run dev` |
| Production bundle | `npm run build` → `dist/` |
| Preview `dist` | `npm run preview` |
| Deploy | `npm run deploy` (`predeploy` → `vite build`, then `gh-pages -d dist`) |

---

## Repository layout

| Path | Role |
|------|------|
| `index.html` | Shell; `#root` |
| `src/main.jsx` | `createRoot`, `StrictMode`, `index.css` |
| `src/App.jsx` | Renders `BlockVolume` |
| `src/components/BlockVolume.jsx` | Random prism dims, `renderBlocks`, user steppers, check / reveal / next round |
| `src/components/ui/reused-ui/Container.jsx` | Chrome (`BlockVolume` enables sound button; add `onSound` if you need audio) |

---

## Application logic (summary)

- **Target dimensions:** `generateRandomDimensions` samples `length`, `width`, and `height` independently from 1–6 (uniform). `volume` is stored as `length * width * height` for the success overlay.
- **Verification:** `checkAnswer` requires `userLength === length && userWidth === width && userHeight === height` (integer match). It does **not** accept a raw volume-only answer; the UI copy refers to multiplying L × W × H, but the coded gate is triple equality on edge lengths.
- **Success path:** Confetti, `isControlsHidden` true → bottom overlay shows `volume`. After 3s, `generateRandomDimensions` runs, `instantShow` toggles to skip fade-in delay when controls return. User stepper state is **not** reset in code; new round may open with stale values until the learner adjusts.
- **Visualization:** `renderBlocks` builds three CSS grids: a **base** face (`length` × `height` cells, `baseCell` 18px), a **top** face (`length` × `width` with `depthCell` 8px rows, `skewX(-45deg)`), and a **side** face (`width` × `height`, `skewY(-45deg)`). Colored faces (orange shades) plus red/green/blue dimension guides (L / W / H). Early `return null` if any dimension ≤ 0.

---

## Product integration

CK-12 and other embeds: pending links tracked in-repo.

- **CK-12 Intent Response** — production / master: pending  
- **CK-12 Flexbooks** — book/lesson link: pending  

Upstream: [github.com/Content-Interactives/block_volume](https://github.com/Content-Interactives/block_volume).

---

## Educational alignment

Subject, topic, and Common Core references are in [`Standards.md`](Standards.md) (e.g. 3.MD.C.5–C.6, 5.MD.C.3–C.4).
