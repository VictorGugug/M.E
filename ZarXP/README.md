# ZarXP

Windows XP recreated for the web. Pixel perfect, functional, built with React + Vite.

## Stack

React 19, TypeScript, Vite 8, Zustand, Oxlint

## Commands

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # tsc -b && vite build
npm run preview  # vite preview
npm run lint     # oxlint
```

## GitHub Pages

Base is set to `/M.E/` in `vite.config.ts`. Build output is `dist/` with `404.html` and `.nojekyll` for SPA routing.

Workflow: `.github/workflows/deploy-zarxp.yml` builds `ZarXP` on push to `main` and deploys `ZarXP/dist` via `actions/deploy-pages`.

Manual build for Pages:

```bash
npm run build:pages  # build + copy index.html to 404.html + .nojekyll
```

## Structure

- `src/components/shell` - Desktop, Taskbar, StartMenu, Window
- `src/components/apps` - Explorer, Notepad, Paint, Calculator, etc.
- `src/components/games` - Minesweeper, Solitaire
- `public/assets` - icons, sounds, cursors, wallpapers from real XP
