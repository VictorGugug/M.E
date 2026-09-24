import { create } from "zustand";

const KEY = "zarxp-display-settings";

function reportStorageError(operation: string, error: unknown): void {
  const message = error instanceof Error ? error.message : String(error);
  console.warn(`ZarXP settings: ${operation}: ${message}`);
}

export type Wallpaper = "bliss" | "none";
export type ColorScheme = "default" | "silver" | "olive";
export type FontSize = "normal" | "large" | "extra-large";
export type ScreenSaver = "none" | "windows-xp";

export interface DesktopSettings {
  wallpaper: Wallpaper;
  colorScheme: ColorScheme;
  fontSize: FontSize;
  screenSaver: ScreenSaver;
  screenSaverMinutes: number;
}

export const DEFAULT_SETTINGS: DesktopSettings = {
  wallpaper: "bliss",
  colorScheme: "default",
  fontSize: "normal",
  screenSaver: "none",
  screenSaverMinutes: 10,
};

function isSettings(value: unknown): value is Partial<DesktopSettings> {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}

export function normalizeSettings(value: unknown): DesktopSettings {
  if (!isSettings(value)) return { ...DEFAULT_SETTINGS };
  const storedMinutes = (value as { screenSaverMinutes?: unknown }).screenSaverMinutes;
  const minutes = typeof storedMinutes === "number" || (typeof storedMinutes === "string" && storedMinutes.trim() !== "") ? Number(storedMinutes) : Number.NaN;
  return {
    wallpaper: value.wallpaper === "none" ? "none" : DEFAULT_SETTINGS.wallpaper,
    colorScheme: value.colorScheme === "silver" || value.colorScheme === "olive" ? value.colorScheme : DEFAULT_SETTINGS.colorScheme,
    fontSize: value.fontSize === "large" || value.fontSize === "extra-large" ? value.fontSize : DEFAULT_SETTINGS.fontSize,
    screenSaver: value.screenSaver === "windows-xp" ? "windows-xp" : DEFAULT_SETTINGS.screenSaver,
    screenSaverMinutes: Number.isFinite(minutes) ? Math.max(1, Math.min(60, Math.round(minutes))) : DEFAULT_SETTINGS.screenSaverMinutes,
  };
}

export function loadSettings(): DesktopSettings {
  if (typeof localStorage === "undefined") return { ...DEFAULT_SETTINGS };

  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_SETTINGS };
    const parsed: unknown = JSON.parse(raw);
    return normalizeSettings(parsed);
  } catch (error) {
    reportStorageError("load", error);
    return { ...DEFAULT_SETTINGS };
  }
}

function saveSettings(settings: DesktopSettings): void {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(KEY, JSON.stringify(settings));
  } catch (error) {
    reportStorageError("save", error);
  }
}

interface SettingsStore {
  settings: DesktopSettings;
  updateSettings: (next: Partial<DesktopSettings>) => void;
  setWallpaper: (wallpaper: Wallpaper) => void;
  setColorScheme: (colorScheme: ColorScheme) => void;
  setFontSize: (fontSize: FontSize) => void;
  setScreenSaver: (screenSaver: ScreenSaver) => void;
  setScreenSaverMinutes: (minutes: number) => void;
}

export const useSettingsStore = create<SettingsStore>((set, get) => {
  const update = (next: Partial<DesktopSettings>) => {
    const settings = normalizeSettings({ ...get().settings, ...next });
    set({ settings });
    saveSettings(settings);
  };

  return {
    settings: loadSettings(),
    updateSettings: update,
    setWallpaper: (wallpaper) => update({ wallpaper }),
    setColorScheme: (colorScheme) => update({ colorScheme }),
    setFontSize: (fontSize) => update({ fontSize }),
    setScreenSaver: (screenSaver) => update({ screenSaver }),
    setScreenSaverMinutes: (screenSaverMinutes) => update({ screenSaverMinutes: Math.max(1, Math.min(60, screenSaverMinutes)) }),
  };
});
