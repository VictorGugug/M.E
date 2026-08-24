import { create } from "zustand";
import type { WindowConfig, AppId, AppDefinition } from "../types";

const APPS: Record<AppId, AppDefinition> = {
  "my-computer": { id: "my-computer", title: "My Computer", icon: "MyComputer.png", defaultWidth: 720, defaultHeight: 520, statusBar: true },
  "my-documents": { id: "my-documents", title: "My Documents", icon: "MyDocuments.png", defaultWidth: 640, defaultHeight: 460, menuBar: true, statusBar: true },
  "my-pictures": { id: "my-pictures", title: "My Pictures", icon: "MyPictures.png", defaultWidth: 640, defaultHeight: 460, menuBar: true, statusBar: true },
  "my-music": { id: "my-music", title: "My Music", icon: "MyMusic.png", defaultWidth: 640, defaultHeight: 460, menuBar: true, statusBar: true },
  "my-videos": { id: "my-videos", title: "My Videos", icon: "MyVideos.png", defaultWidth: 640, defaultHeight: 460, menuBar: true, statusBar: true },
  "recycle-bin": { id: "recycle-bin", title: "Recycle Bin", icon: "RecycleBinempty.png", defaultWidth: 500, defaultHeight: 400, menuBar: true, statusBar: true },
  "internet-explorer": { id: "internet-explorer", title: "Internet Explorer", icon: "InternetExplorer6.png", defaultWidth: 800, defaultHeight: 550, menuBar: true, statusBar: true },
  "outlook-express": { id: "outlook-express", title: "Outlook Express", icon: "OutlookExpress.png", defaultWidth: 700, defaultHeight: 480, menuBar: true, statusBar: true },
  "tour-xp": { id: "tour-xp", title: "Tour Windows XP", icon: "TourXP.png", defaultWidth: 560, defaultHeight: 400, menuBar: true },
  "msn-messenger": { id: "msn-messenger", title: "Windows Messenger", icon: "WindowsMessenger.png", defaultWidth: 280, defaultHeight: 420, menuBar: true },
  wordpad: { id: "wordpad", title: "Document - WordPad", icon: "Wordpad.png", defaultWidth: 620, defaultHeight: 450, menuBar: true, statusBar: true, minWidth: 380, minHeight: 280 },
  notepad: { id: "notepad", title: "Untitled - Notepad", icon: "Notepad.png", defaultWidth: 500, defaultHeight: 400, menuBar: true, statusBar: true, minWidth: 300, minHeight: 200 },
  paint: { id: "paint", title: "untitled - Paint", icon: "Paint.png", defaultWidth: 700, defaultHeight: 500, menuBar: true, statusBar: true, minWidth: 400, minHeight: 300 },
  calculator: { id: "calculator", title: "Calculator", icon: "Calculator.png", defaultWidth: 260, defaultHeight: 320, resizable: false },
  "media-player": { id: "media-player", title: "Windows Media Player", icon: "WindowsMediaPlayer10.png", defaultWidth: 650, defaultHeight: 480, menuBar: true, statusBar: true, minWidth: 500, minHeight: 350 },
  terminal: { id: "terminal", title: "Command Prompt", icon: "CommandPrompt.png", defaultWidth: 600, defaultHeight: 400, minWidth: 300, minHeight: 200 },
  "control-panel": { id: "control-panel", title: "Control Panel", icon: "ControlPanel.png", defaultWidth: 550, defaultHeight: 400, menuBar: true, statusBar: true },
  "task-manager": { id: "task-manager", title: "Windows Task Manager", icon: "TaskManager.png", defaultWidth: 500, defaultHeight: 400, resizable: false },
  run: { id: "run", title: "Run", icon: "Run.png", defaultWidth: 380, defaultHeight: 150, resizable: false },
  search: { id: "search", title: "Search Results", icon: "Search.png", defaultWidth: 500, defaultHeight: 400, resizable: false },
  shutdown: { id: "shutdown", title: "Shut Down Windows", icon: "Power.png", defaultWidth: 380, defaultHeight: 300, resizable: false },
  "system-properties": { id: "system-properties", title: "System Properties", icon: "SystemProperties.png", defaultWidth: 480, defaultHeight: 420, resizable: false },
  "display-properties": { id: "display-properties", title: "Display Properties", icon: "DisplayProperties.png", defaultWidth: 450, defaultHeight: 400, resizable: false },
  volume: { id: "volume", title: "Volume Control", icon: "Volume.png", defaultWidth: 300, defaultHeight: 250, resizable: false },
  "date-time": { id: "date-time", title: "Date and Time Properties", icon: "DateandTime.png", defaultWidth: 420, defaultHeight: 360, resizable: false },
  "about-xp": { id: "about-xp", title: "About Windows", icon: "WindowsMediaPlayer10.png", defaultWidth: 400, defaultHeight: 350, resizable: false },
  explorer: { id: "explorer", title: "Windows Explorer", icon: "Explorer.png", defaultWidth: 650, defaultHeight: 450, menuBar: true, statusBar: true },
  solitaire: { id: "solitaire", title: "Solitaire", icon: "Solitaire.png", defaultWidth: 500, defaultHeight: 450, resizable: false },
  minesweeper: { id: "minesweeper", title: "Minesweeper", icon: "Minesweeper.png", defaultWidth: 250, defaultHeight: 320, resizable: false },
  settings: { id: "settings", title: "Settings", icon: "SettingsAlert.png", defaultWidth: 500, defaultHeight: 400, menuBar: true, statusBar: true },
  "network-places": { id: "network-places", title: "My Network Places", icon: "MyNetworkPlaces.png", defaultWidth: 550, defaultHeight: 400, menuBar: true, statusBar: true },
};

interface WindowStore {
  windows: WindowConfig[];
  nextZ: number;
  bootPhase: "loading" | "login" | "welcome" | "desktop" | "bios";
  startMenuOpen: boolean;
  openWindow: (appId: AppId) => void;
  closeWindow: (id: string) => void;
  minimizeWindow: (id: string) => void;
  maximizeWindow: (id: string) => void;
  restoreWindow: (id: string) => void;
  focusWindow: (id: string) => void;
  updatePosition: (id: string, x: number, y: number) => void;
  updateSize: (id: string, width: number, height: number) => void;
  setBootPhase: (phase: WindowStore["bootPhase"]) => void;
  toggleStartMenu: () => void;
  closeStartMenu: () => void;
  getApp: (id: AppId) => AppDefinition;
  minimizeAll: () => void;
  cascadeWindows: () => void;
}

let winCounter = 0;

export const useWindowStore = create<WindowStore>((set, get) => ({
  windows: [],
  nextZ: 1,
  bootPhase: "loading",
  startMenuOpen: false,

  getApp: (id: AppId) => APPS[id],

  openWindow: (appId: AppId) => {
    const app = APPS[appId];
    if (!app) return;
    const existing = get().windows.find((w) => w.appId === appId && w.state !== "minimized");
    if (existing) { get().focusWindow(existing.id); return; }
    const minimized = get().windows.find((w) => w.appId === appId && w.state === "minimized");
    if (minimized) { get().restoreWindow(minimized.id); return; }
    const id = `win-${++winCounter}`;
    const offset = (winCounter % 10) * 25;
    const win: WindowConfig = {
      id, appId, title: app.title, icon: app.icon,
      x: 50 + offset, y: 50 + offset,
      width: app.defaultWidth, height: app.defaultHeight,
      state: "normal", zIndex: get().nextZ,
      minWidth: app.minWidth, minHeight: app.minHeight,
      menuBar: app.menuBar, statusBar: app.statusBar, resizable: app.resizable !== false,
    };
    set((s) => ({ windows: [...s.windows, win], nextZ: s.nextZ + 1 }));
  },

  closeWindow: (id: string) => set((s) => ({ windows: s.windows.filter((w) => w.id !== id) })),
  minimizeWindow: (id: string) => set((s) => ({ windows: s.windows.map((w) => w.id === id ? { ...w, state: "minimized" as const } : w) })),
  maximizeWindow: (id: string) => set((s) => ({
    windows: s.windows.map((w) => w.id === id ? { ...w, state: "maximized" as const, zIndex: s.nextZ } : w),
    nextZ: s.nextZ + 1,
  })),
  restoreWindow: (id: string) => set((s) => ({
    windows: s.windows.map((w) => w.id === id ? { ...w, state: "normal" as const, zIndex: s.nextZ } : w),
    nextZ: s.nextZ + 1,
  })),
  focusWindow: (id: string) => set((s) => ({
    windows: s.windows.map((w) => w.id === id ? { ...w, zIndex: s.nextZ } : w),
    nextZ: s.nextZ + 1,
    startMenuOpen: false,
  })),
  updatePosition: (id: string, x: number, y: number) => set((s) => ({
    windows: s.windows.map((w) => w.id === id ? { ...w, x, y } : w),
  })),
  updateSize: (id: string, width: number, height: number) => set((s) => ({
    windows: s.windows.map((w) => w.id === id ? { ...w, width, height } : w),
  })),
  setBootPhase: (phase) => set({ bootPhase: phase }),
  toggleStartMenu: () => set((s) => ({ startMenuOpen: !s.startMenuOpen })),
  closeStartMenu: () => set({ startMenuOpen: false }),
  minimizeAll: () => set((s) => ({ windows: s.windows.map((w) => w.state === "normal" ? { ...w, state: "minimized" as const } : w) })),
  cascadeWindows: () => {
    set({ windows: get().windows.map((w, i) => w.state !== "minimized" ? { ...w, x: 30 + i * 30, y: 30 + i * 30 } : w) });
  },
}));
