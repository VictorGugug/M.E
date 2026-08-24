import { useState, useRef, useEffect, lazy, Suspense } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { DesktopIcon, AppId } from "../../types";
import Taskbar from "./Taskbar";
import StartMenu from "./StartMenu";
import Window from "./Window";
import { assetUrl } from "../../utils/assets"

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

const DESKTOP_ICONS: DesktopIcon[] = [
  { id: "my-computer", label: "My Computer", icon: "MyComputer.png", defaultPosition: { x: 10, y: 10 } },
  { id: "my-documents", label: "My Documents", icon: "MyDocuments.png", defaultPosition: { x: 10, y: 90 } },
  { id: "network-places", label: "My Network Places", icon: "MyNetworkPlaces.png", defaultPosition: { x: 10, y: 170 } },
  { id: "recycle-bin", label: "Recycle Bin", icon: "RecycleBinempty.png", defaultPosition: { x: 10, y: 250 } },
  { id: "internet-explorer", label: "Internet Explorer", icon: "InternetExplorer6.png", defaultPosition: { x: 10, y: 330 } },
];

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
  "recycle-bin": RecycleBin,
  "solitaire": Solitaire,
  "minesweeper": Minesweeper,
};

export default function Desktop() {
  const { windows, openWindow, closeStartMenu, startMenuOpen } = useWindowStore();
  const desktopRef = useRef<HTMLDivElement>(null);
  const [ctxMenu, setCtxMenu] = useState<{ x: number; y: number } | null>(null);

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
    setCtxMenu({ x: e.clientX, y: e.clientY });
  };

  const openApp = (appId: AppId) => {
    openWindow(appId);
    closeStartMenu();
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
        {DESKTOP_ICONS.map((icon) => (
          <button key={icon.id} className="desktop-icon" onDoubleClick={() => openApp(icon.id)}>
            <img src={assetUrl(`assets/icons/${icon.icon}`)} alt={icon.label} />
            <span>{icon.label}</span>
          </button>
        ))}
      </div>

      {ctxMenu && (
        <div className="desktop-context-menu" style={{ left: ctxMenu.x, top: ctxMenu.y }}>
          <div className="context-item" onClick={() => { openApp("my-computer"); setCtxMenu(null); }}>My Computer</div>
          <div className="context-item" onClick={() => { openApp("explorer"); setCtxMenu(null); }}>Open</div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp("display-properties"); setCtxMenu(null); }}>Properties</div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp("control-panel"); setCtxMenu(null); }}>Control Panel</div>
          <div className="context-separator" />
          <div className="context-item context-disabled">Arrange Icons By</div>
          <div className="context-item context-disabled">Refresh</div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => { openApp("shutdown"); setCtxMenu(null); }}>Shut Down...</div>
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
