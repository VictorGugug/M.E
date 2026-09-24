import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { useSettingsStore } from "../../store/settingsStore";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { getTrashItems } from "../../store/fileSystem";
import type { AppId } from "../../types";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Window from "./Window";
import { assetUrl } from "../../utils/assets";

const Notepad = lazy(() => import("../apps/Notepad"));
const Calculator = lazy(() => import("../apps/Calculator"));
const Paint = lazy(() => import("../apps/Paint"));
const MediaPlayer = lazy(() => import("../apps/MediaPlayer"));
const Terminal = lazy(() => import("../apps/Terminal"));
const InternetExplorer = lazy(() => import("../apps/InternetExplorer"));
const ControlPanel = lazy(() => import("../apps/ControlPanel"));
const TaskManager = lazy(() => import("../apps/TaskManager"));
const RunDialog = lazy(() => import("../dialogs/RunDialog"));
const ShutdownDialog = lazy(() => import("../dialogs/ShutdownDialog"));
const VolumeControl = lazy(() => import("../dialogs/VolumeControl"));
const DisplayProperties = lazy(() => import("../dialogs/DisplayProperties"));
const SystemProperties = lazy(() => import("../dialogs/SystemProperties"));
const DateTimeDialog = lazy(() => import("../dialogs/DateTimeDialog"));
const SearchDialog = lazy(() => import("../dialogs/SearchDialog"));
const AboutXP = lazy(() => import("../dialogs/AboutXP"));
const SecurityCenter = lazy(() => import("../apps/SecurityCenter"));
const UserAccounts = lazy(() => import("../apps/UserAccounts"));
const RegionalOptions = lazy(() => import("../dialogs/RegionalOptions"));
const TourXP = lazy(() => import("../apps/TourXP"));
const Wordpad = lazy(() => import("../apps/Wordpad"));
const OutlookExpress = lazy(() => import("../apps/OutlookExpress"));
const WindowsMessenger = lazy(() => import("../apps/WindowsMessenger"));
const Explorer = lazy(() => import("../apps/Explorer"));
const MyComputer = lazy(() => import("../apps/MyComputer"));
const MyDocuments = lazy(() => import("../apps/MyDocuments"));
const RecycleBin = lazy(() => import("../apps/RecycleBin"));
const FileViewer = lazy(() => import("../apps/FileViewer"));
const Solitaire = lazy(() => import("../games/Solitaire"));
const Minesweeper = lazy(() => import("../games/Minesweeper"));

const APP_COMPONENTS: Record<string, React.FC<{ id: string }>> = {
  "notepad": Notepad,
  "calculator": Calculator,
  "paint": Paint,
  "media-player": MediaPlayer,
  "terminal": Terminal,
  "internet-explorer": InternetExplorer,
  "control-panel": ControlPanel,
  "task-manager": TaskManager,
  "run": RunDialog,
  "shutdown": ShutdownDialog,
  "volume": VolumeControl,
  "display-properties": DisplayProperties,
  "system-properties": SystemProperties,
  "date-time": DateTimeDialog,
  "search": SearchDialog,
  "explorer": Explorer,
  "my-computer": MyComputer,
  "my-documents": MyDocuments,
  "my-pictures": MyDocuments,
  "my-music": MyDocuments,
  "my-videos": MyDocuments,
  "network-places": ControlPanel,
  "outlook-express": OutlookExpress,
  "tour-xp": TourXP,
  "msn-messenger": WindowsMessenger,
  "wordpad": Wordpad,
  "settings": ControlPanel,
  "about-xp": AboutXP,
  "security-center": SecurityCenter,
  "user-accounts": UserAccounts,
  "regional-options": RegionalOptions,
  "recycle-bin": RecycleBin,
  "file-viewer": FileViewer,
  "solitaire": Solitaire,
  "minesweeper": Minesweeper,
};

export default function Desktop() {
  const { windows, openWindow, closeStartMenu, startMenuOpen } = useWindowStore();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const [screensaverActive, setScreensaverActive] = useState(false);
  const screenSaverTimeout = useRef<number | null>(null);
  const t = useLangStore((s) => s.t);
  const settings = useSettingsStore((s) => s.settings);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const hydrated = useFileSystemStore((state) => state.hydrated);
  const trashHasItems = getTrashItems(fileSystem).length > 0;
  const desktopFontSize = settings.fontSize === "extra-large" ? 14 : settings.fontSize === "large" ? 13 : 12;

  const desktopIcons = [
    { id: "my-computer" as AppId, label: t("myComputer"), icon: "MyComputer.png" },
    { id: "my-documents" as AppId, label: t("myDocuments"), icon: "MyDocuments.png" },
    { id: "network-places" as AppId, label: t("myNetworkPlaces"), icon: "MyNetworkPlaces.png" },
    { id: "recycle-bin" as AppId, label: t("recycleBin"), icon: trashHasItems ? "RecycleBinfull.png" : "RecycleBinempty.png" },
    { id: "internet-explorer" as AppId, label: t("internetExplorer"), icon: "InternetExplorer6.png" },
  ];

  useEffect(() => {
    const handler = () => closeStartMenu();
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, [closeStartMenu]);

  useEffect(() => {
    if (!ctxMenu) return;
    const handler = () => setCtxMenu(null);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [ctxMenu]);

  useEffect(() => {
    if (settings.screenSaver !== "windows-xp") {
      setScreensaverActive(false);
      return;
    }
    const events = ["mousemove", "mousedown", "keydown", "touchstart"];
    const resetTimer = () => {
      if (screenSaverTimeout.current !== null) window.clearTimeout(screenSaverTimeout.current);
      screenSaverTimeout.current = window.setTimeout(() => setScreensaverActive(true), settings.screenSaverMinutes * 60_000);
    };
    events.forEach((event) => window.addEventListener(event, resetTimer));
    resetTimer();
    return () => {
      events.forEach((event) => window.removeEventListener(event, resetTimer));
      if (screenSaverTimeout.current !== null) window.clearTimeout(screenSaverTimeout.current);
    };
  }, [settings.screenSaver, settings.screenSaverMinutes]);

  useEffect(() => {
    if (!screensaverActive) return;
    const wake = () => setScreensaverActive(false);
    window.addEventListener("mousemove", wake, { once: true });
    window.addEventListener("mousedown", wake, { once: true });
    window.addEventListener("keydown", wake, { once: true });
    window.addEventListener("touchstart", wake, { once: true });
    return () => {
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("mousedown", wake);
      window.removeEventListener("keydown", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, [screensaverActive]);

  const handleDesktopClick = () => {
    setCtxMenu(null);
    closeStartMenu();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setCtxMenu({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.min(e.clientY, window.innerHeight - 240)
    });
    setActiveSub(null);
  };

  const openApp = (appId: AppId) => {
    openWindow(appId);
    closeStartMenu();
    setCtxMenu(null);
  };

  if (!hydrated) {
    return <div className="desktop" style={{ position: "fixed", inset: 0, display: "grid", placeItems: "center", background: "#3A6EA5", color: "#FFF", fontFamily: "Tahoma, sans-serif" }}>Loading...</div>;
  }

  return (
    <div 
      className={`desktop theme-${settings.colorScheme} font-${settings.fontSize}`}
      ref={desktopRef} 
      onClick={handleDesktopClick} 
      onContextMenu={handleContextMenu}
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: settings.wallpaper === "bliss" ? `url(${assetUrl("assets/wallpapers/bliss.webp")})` : "none",
        backgroundColor: settings.wallpaper === "none" ? "#3A6EA5" : "#4A7EBB",
        backgroundSize: "cover",
        backgroundPosition: "center",
        fontSize: desktopFontSize,
        zIndex: 1,
        overflow: "hidden"
      }}
    >
      <div className="desktop-icons">
        {desktopIcons.map((icon) => (
          <button key={icon.id} className="desktop-icon" onDoubleClick={() => openApp(icon.id)}>
            <img src={assetUrl(`assets/icons/${icon.icon}`)} alt={icon.label} />
            <span>{icon.label}</span>
          </button>
        ))}
      </div>

      {ctxMenu && (
        <div
          className="desktop-context-menu"
          style={{ left: ctxMenu.x, top: ctxMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-item xp-context-with-submenu"
            onMouseEnter={() => setActiveSub("arrange")}
          >
            <span>{t("arrangeIconsBy")}</span>
            <span className="xp-context-arrow">&#9658;</span>
            {activeSub === "arrange" && (
              <div className="xp-context-submenu">
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("byName")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("bySize")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("byType")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("byModified")}</div>
                <div className="context-separator" />
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("autoArrange")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => setCtxMenu(null)}>{t("alignToGrid")}</div>
              </div>
            )}
          </div>
          <div className="context-item xp-context-shortcut" onMouseEnter={() => setActiveSub(null)} onClick={() => setCtxMenu(null)}>{t("refresh")}</div>
          <div className="context-separator" />
          <div className="context-item context-disabled xp-context-shortcut" onMouseEnter={() => setActiveSub(null)}>{t("paste")}</div>
          <div className="context-item context-disabled xp-context-shortcut" onMouseEnter={() => setActiveSub(null)}>{t("pasteShortcut")}</div>
          <div className="context-separator" />
          <div
            className="context-item xp-context-with-submenu"
            onMouseEnter={() => setActiveSub("new")}
          >
            <span>{t("new")}</span>
            <span className="xp-context-arrow">&#9658;</span>
            {activeSub === "new" && (
              <div className="xp-context-submenu">
                <div className="context-item xp-context-shortcut" onClick={() => openApp("explorer")}>{t("folder")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => openApp("notepad")}>{t("textDocument")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => openApp("paint")}>{t("bitmapImage")}</div>
                <div className="context-item xp-context-shortcut" onClick={() => openApp("wordpad")}>{t("wordpadDocument")}</div>
              </div>
            )}
          </div>
          <div className="context-separator" />
          <div className="context-item xp-context-bold xp-context-shortcut" onMouseEnter={() => setActiveSub(null)} onClick={() => openApp("display-properties")}>{t("properties")}</div>
        </div>
      )}

      {windows.map((win) => {
        const AppComp = APP_COMPONENTS[win.appId];
        return (
          <Window key={win.id} config={win}>
            <Suspense fallback={<div style={{ padding: 16, color: "#666" }}>Loading...</div>}>
              {AppComp ? <AppComp id={win.id} /> : <div style={{ padding: 16, color: "#666" }}>App not found: {win.appId}</div>}
            </Suspense>
          </Window>
        );
      })}

      {startMenuOpen && <StartMenu onOpen={openApp} />}
      <Taskbar onOpen={openApp} />
      {screensaverActive && <div onClick={() => setScreensaverActive(false)} style={{ position: "fixed", inset: 0, zIndex: 10000, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 18, background: "#000", color: "#FFF", fontFamily: "Tahoma, sans-serif", cursor: "pointer" }}><img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 180 }} /><span>{t("screenSaverActive")}</span></div>}
    </div>
  );
}
