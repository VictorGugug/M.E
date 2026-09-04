# ZarXP

Windows XP recreated for the web. Pixel-perfect interface and functional components built with React and Vite.

## Tech Stack

React 19, TypeScript, Vite 8, Zustand, Oxlint

## Commands

```bash
npm install
npm run dev
npm run build
npm run preview
npm run lint
```

## GitHub Pages

Base path is set to `/M.E/` in `vite.config.ts`. Build output is generated in `dist/` with `404.html` and `.nojekyll` for single-page application routing.

The `.github/workflows/deploy-zarxp.yml` workflow builds `ZarXP` on pushes to `main` and publishes `ZarXP/dist` through GitHub Pages.

Build for Pages:

```bash
npm run build:pages
```

## Structure

- `src/components/shell`: Desktop, taskbar, Start menu, and window manager.
- `src/components/apps`: Built-in applications (Explorer, Notepad, Paint, Calculator, etc.).
- `src/components/games`: Minesweeper and Solitaire.
- `public/assets`: Authentic Windows XP icons, sounds, cursors, and wallpapers.
