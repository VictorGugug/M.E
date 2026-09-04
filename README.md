# ZarXP

A functional recreation of Windows XP for the web featuring pixel-perfect design based on the Luna visual style.

## Features

- User interface: Interactive desktop, taskbar with system tray, clock and volume control, two-column Start menu with cascading program navigation, and window management (minimize, maximize, restore, cascade, and tile).
- Power and boot sequence: Animated boot screen, user account selection on logon, welcome screen with original logon sound, standby mode, and clean shutdown handling.
- System applications:
  - Internet Explorer 6 with browsing controls, history, and functional simulated web pages.
  - Windows Media Player 10 with audio playback, playlists, and responsive visualizer.
  - Outlook Express and Windows Messenger.
  - Notepad and WordPad for text editing.
  - Paint with HTML5 Canvas drawing tools and color palette.
  - Calculator with standard operations.
  - Command Prompt (CMD) with interactive terminal interpreter.
  - Windows Explorer, My Computer, My Documents, Recycle Bin, and Search Companion with animated dog.
  - Control Panel, User Accounts, Security Center, and system configuration utilities.
- Games: Fully playable classic Minesweeper and Klondike Solitaire.
- Languages: Dynamic support for English and Spanish across interface and applications.
- Audio: Authentic Windows XP sound scheme played through Web Audio API.

## Tech Stack

- React 19
- TypeScript
- Vite 8
- Zustand
- Oxlint

## Installation and Setup

Run the project locally:

```bash
cd ZarXP
npm install
npm run dev
```

The development server runs at `http://localhost:5173`.

### Available Commands

```bash
npm run dev
npm run build
npm run build:pages
npm run lint
npm run preview
```

## Deployment

Configured for automatic deployment to GitHub Pages at the base path `/M.E/` via GitHub Actions.
