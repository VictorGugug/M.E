# win32.run

**Windows XP in the browser** — with a virtual file system, XP-style programs, Open/Save dialogs, third-party app support, and more.

[![Live](https://img.shields.io/badge/live-win32.run-blue?style=flat-square)](https://win32.run)
[![License MIT](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)
[![Svelte 5](https://img.shields.io/badge/svelte-5-orange?style=flat-square)](https://svelte.dev)
[![Cloudflare Pages](https://img.shields.io/badge/deployed-Cloudflare%20Pages-f38020?style=flat-square)](https://pages.cloudflare.com)

> This is a refactored rewrite of the [original win32.run](https://github.com/ducbao414/win32.run), migrated to **Svelte 5** and deployed on **Cloudflare Pages** instead of a VPS. The entire refactor — migration, new features, and bug fixes — was done by [Claude Code](https://claude.ai/claude-code), Anthropic's AI coding assistant, with no manual code changes.



https://github.com/user-attachments/assets/26cbd93d-b784-407b-bc0a-12e32afcb5e9



---

## What is this?

win32.run is a nostalgia project — a faithful Windows XP simulation that runs entirely in your browser. No server-side processing, no file uploads. Every user gets their own isolated OS session backed by IndexedDB.

*Microsoft, Windows XP, and all program names/logos (WinRAR, Internet Explorer, Foxit, etc.) are trademarks of their respective owners. win32.run is purely for nostalgia and is not monetized.*

*Some games in the Games folder are embedded from [CrazyGames](https://www.crazygames.com). These are third-party embeds — CrazyGames may display ads within their games. I have no affiliation with CrazyGames and receive no monetary compensation of any kind from them.*

---

## Getting Started

```bash
git clone https://github.com/ducbao414/win32.run.cf.git
cd win32.run.cf
npm install
```

### Dev server

```bash
npm run dev
```

Runs at `http://localhost:3000`.

### Build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Deploy to Cloudflare Pages

The easiest way is directly through the Cloudflare dashboard — no CLI needed:

1. Push your fork to GitHub
2. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → **Workers & Pages** → **Create** → **Pages** → **Connect to Git**
3. Select your repository
4. Under **Build settings**, choose **SvelteKit** as the framework preset — it will fill in the build command and output directory automatically
5. Click **Save and Deploy**

Cloudflare will build and deploy on every push to your main branch from that point on.

---

## Documentation

For adding programs, working with the virtual file system, and extending win32.run:

[![docs.win32.run](https://img.shields.io/badge/view-Documentation-blue?style=for-the-badge)](https://docs.win32.run)
