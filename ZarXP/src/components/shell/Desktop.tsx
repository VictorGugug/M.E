import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
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
  "solitaire": Solitaire,
  "minesweeper": Minesweeper,
};

export default function Desktop() {
  const { windows, openWindow, closeStartMenu, startMenuOpen } = useWindowStore();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);
  const [activeSub, setActiveSub] = useState<string | null>(null);
  const t = useLangStore((s) => s.t);

  const desktopIcons = [
    { id: "my-computer" as AppId, label: t("myComputer"), icon: "MyComputer.png" },
    { id: "my-documents" as AppId, label: t("myDocuments"), icon: "MyDocuments.png" },
    { id: "network-places" as AppId, label: t("myNetworkPlaces"), icon: "MyNetworkPlaces.png" },
    { id: "recycle-bin" as AppId, label: t("recycleBin"), icon: "RecycleBinempty.png" },
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

  return (
    <div 
      className="desktop" 
      ref={desktopRef} 
      onClick={handleDesktopClick} 
      onContextMenu={handleContextMenu}
      style={{
        position: "fixed",
        inset: 0,
        backgroundImage: `url(${assetUrl("assets/wallpapers/bliss.webp")})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
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
          style={{
            left: ctxMenu.x,
            top: ctxMenu.y,
            position: "absolute",
            zIndex: 99999,
            background: "#FFF",
            border: "1px solid #ACA899",
            padding: "2px",
            boxShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            fontSize: 11,
            fontFamily: "Tahoma, sans-serif",
            minWidth: 160
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            className="context-item"
            onMouseEnter={() => setActiveSub("arrange")}
            style={{ padding: "3px 18px 3px 22px", position: "relative", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
          >
            <span>{t("arrangeIconsBy")}</span>
            <span style={{ fontSize: 9 }}>&#9658;</span>
            {activeSub === "arrange" && (
              <div style={{ position: "absolute", left: "100%", top: -2, background: "#FFF", border: "1px solid #ACA899", padding: 2, minWidth: 130, boxShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("byName")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("bySize")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("byType")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("byModified")}</div>
                <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("autoArrange")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setCtxMenu(null)}>{t("alignToGrid")}</div>
              </div>
            )}
          </div>
          <div className="context-item" style={{ padding: "3px 18px 3px 22px", cursor: "pointer" }} onMouseEnter={() => setActiveSub(null)} onClick={() => setCtxMenu(null)}>{t("refresh")}</div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div className="context-item context-disabled" style={{ padding: "3px 18px 3px 22px", color: "#888" }} onMouseEnter={() => setActiveSub(null)}>{t("paste")}</div>
          <div className="context-item context-disabled" style={{ padding: "3px 18px 3px 22px", color: "#888" }} onMouseEnter={() => setActiveSub(null)}>{t("pasteShortcut")}</div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div
            className="context-item"
            onMouseEnter={() => setActiveSub("new")}
            style={{ padding: "3px 18px 3px 22px", position: "relative", cursor: "pointer", display: "flex", justifyContent: "space-between" }}
          >
            <span>{t("new")}</span>
            <span style={{ fontSize: 9 }}>&#9658;</span>
            {activeSub === "new" && (
              <div style={{ position: "absolute", left: "100%", top: -2, background: "#FFF", border: "1px solid #ACA899", padding: 2, minWidth: 150, boxShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => openApp("explorer")}>{t("folder")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => openApp("notepad")}>{t("textDocument")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => openApp("paint")}>{t("bitmapImage")}</div>
                <div className="context-item" style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => openApp("wordpad")}>{t("wordpadDocument")}</div>
              </div>
            )}
          </div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div className="context-item" style={{ padding: "3px 18px 3px 22px", cursor: "pointer", fontWeight: "bold" }} onMouseEnter={() => setActiveSub(null)} onClick={() => openApp("display-properties")}>{t("properties")}</div>
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
    </div>
  );
}
