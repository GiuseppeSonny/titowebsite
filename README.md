# Studio Portfolio UI

Modern React + Vite single-page site with a decorated hero, portfolio highlights, and contact panel. Styled with SCSS modules and React Router v7 for navigation.

## Preview
- Home: expressive hero with CTAs, metrics, and stacked cards
- Works: portfolio grid with badges and tags
- Contacts: info cards and call-to-action panel

## Tech stack
- React 18
- Vite 6
- React Router 7
- SCSS modules
- ESLint 9

## Getting started
Requirements: Node 18+ and npm.

Install dependencies:
```bash
npm install
```

Run in dev mode (with HMR):
```bash
npm run dev
```

Create production build:
```bash
npm run build
```

Preview the production build locally:
```bash
npm run preview
```

Lint the project:
```bash
npm run lint
```

## Project structure
```
src/
  App.jsx             # Router + layout
  App.css             # Global theme variables/layout
  index.css           # Base reset
  main.jsx            # Entry
  componets/
    Header/           # Header and footer components
  pages/
    home/             # Hero + highlights
    works/            # Portfolio cards
    contacts/         # Contact panel
    aboutUs/          # About page copy
```

## Customization tips
- Update copy/links in `src/pages/*` to match your content.
- Adjust theme colors/spacing in `src/App.css`.
- Add or remove portfolio cards via the `projects` array in `src/pages/works/Works.jsx`.
