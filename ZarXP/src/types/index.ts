export type AppId = "my-computer" | "my-documents" | "my-pictures" | "my-music" | "my-videos" | "recycle-bin" | "internet-explorer" | "outlook-express" | "tour-xp" | "msn-messenger" | "wordpad" | "security-center" | "user-accounts" | "regional-options" | "notepad" | "paint" | "calculator" | "media-player" | "terminal" | "control-panel" | "task-manager" | "run" | "search" | "shutdown" | "system-properties" | "display-properties" | "volume" | "date-time" | "about-xp" | "explorer" | "solitaire" | "minesweeper" | "settings" | "network-places";

export type WindowState = "normal" | "minimized" | "maximized";

export interface WindowConfig {
  id: string;
  appId: AppId;
  title: string;
  x: number;
  y: number;
  width: number;
  height: number;
  state: WindowState;
  zIndex: number;
  icon?: string;
  minWidth?: number;
  minHeight?: number;
  menuBar?: boolean;
  statusBar?: boolean;
  resizable?: boolean;
}

export interface DesktopIcon {
  id: AppId;
  label: string;
  icon: string;
  defaultPosition: { x: number; y: number };
}

export interface AppDefinition {
  id: AppId;
  title: string;
  icon: string;
  defaultWidth: number;
  defaultHeight: number;
  minWidth?: number;
  minHeight?: number;
  menuBar?: boolean;
  statusBar?: boolean;
  resizable?: boolean;
}

export interface SoundEntry {
  name: string;
  path: string;
  category: "system" | "ui" | "notification";
}

export interface DateInfo {
  year: number;
  month: number;
  day: number;
  weekday: number;
  hours: number;
  minutes: number;
  seconds: number;
}
