import { useState, useRef, useEffect, useCallback, lazy, Suspense } from "react";
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
const NetworkPlaces = lazy(() => import("../apps/NetworkPlaces"));
const SetProgramAccess = lazy(() => import("../apps/SetProgramAccess"));

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
  "network-places": NetworkPlaces,
  "outlook-express": OutlookExpress,
  "tour-xp": TourXP,
  "msn-messenger": WindowsMessenger,
  "wordpad": Wordpad,
  "settings": SetProgramAccess,
  "set-program-access": SetProgramAccess,
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
  const [selected, setSelected] = useState<string | null>(null);
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


  const handleDesktopClick = () => {
    setCtxMenu(null);
    setSelected(null);
    closeStartMenu();
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelected(null);
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
          <button
            key={icon.id}
            className={selected === icon.id ? "desktop-icon selected" : "desktop-icon"}
            onClick={(e) => { e.stopPropagation(); setSelected(icon.id); setCtxMenu(null); closeStartMenu(); }}
            onDoubleClick={() => openApp(icon.id)}
            onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); openApp(icon.id); } }}
          >
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
      {screensaverActive && <ScreensaverCanvas onDismiss={() => setScreensaverActive(false)} />}
    </div>
  );
}

function ScreensaverCanvas({ onDismiss }: { onDismiss: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDismissing, setIsDismissing] = useState(false);
  const dismissingRef = useRef(false);
  const startPos = useRef<{ x: number; y: number } | null>(null);
  const mousePos = useRef<{ x: number; y: number }>({ x: -1000, y: -1000 });

  const dismissSmoothly = useCallback(() => {
    if (dismissingRef.current) return;
    dismissingRef.current = true;
    setIsDismissing(true);
    window.setTimeout(() => {
      onDismiss();
    }, 280);
  }, [onDismiss]);

  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      if (!startPos.current) {
        startPos.current = { x: e.clientX, y: e.clientY };
        return;
      }
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (Math.hypot(dx, dy) > 6) {
        dismissSmoothly();
      }
    };
    const onKeyDown = () => dismissSmoothly();
    const onMouseDown = () => dismissSmoothly();
    const onTouchStart = () => dismissSmoothly();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("touchstart", onTouchStart);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("touchstart", onTouchStart);
    };
  }, [dismissSmoothly]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const img = new Image();
    img.src = assetUrl("assets/images/xp-logo.png");

    const numStars = 60;
    const stars = Array.from({ length: numStars }, () => ({
      x: (Math.random() - 0.5) * 1600,
      y: (Math.random() - 0.5) * 1200,
      z: Math.random() * 800 + 100,
      vz: Math.random() * 1.5 + 0.8,
      size: Math.random() * 2 + 1,
    }));

    const baseW = 200;
    const baseH = 120;
    let x = width / 2;
    let y = height / 2;
    let z = 0;
    let vx = (Math.random() > 0.5 ? 1 : -1) * (2.2 + Math.random() * 0.8);
    let vy = (Math.random() > 0.5 ? 1 : -1) * (1.8 + Math.random() * 0.8);
    let vz = 1.2;
    let pitch = 0;
    let yaw = 0;
    let roll = 0;
    let dPitch = 0.012;
    let dYaw = 0.016;
    let dRoll = 0.006;

    const render = () => {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      const cx = width / 2;
      const cy = height / 2;
      ctx.fillStyle = "#FFFFFF";
      for (const star of stars) {
        star.z -= star.vz;
        if (star.z <= 10) {
          star.z = 800;
          star.x = (Math.random() - 0.5) * 1600;
          star.y = (Math.random() - 0.5) * 1200;
        }
        const k = 400 / star.z;
        const px = cx + star.x * k;
        const py = cy + star.y * k;
        if (px >= 0 && px <= width && py >= 0 && py <= height) {
          const alpha = Math.min(1, Math.max(0.1, 1 - star.z / 800));
          ctx.globalAlpha = alpha;
          ctx.beginPath();
          ctx.arc(px, py, star.size * Math.min(2.5, k), 0, Math.PI * 2);
          ctx.fill();
        }
      }
      ctx.globalAlpha = 1;

      x += vx;
      y += vy;
      z += vz;
      pitch += dPitch;
      yaw += dYaw;
      roll += dRoll;

      if (z > 220) {
        z = 220;
        vz = -Math.abs(vz);
      } else if (z < -180) {
        z = -180;
        vz = Math.abs(vz);
      }

      const focal = 500;
      const scale = focal / (focal + z);
      const halfW = (baseW * scale) / 2;
      const halfH = (baseH * scale) / 2;

      const mdx = x - mousePos.current.x;
      const mdy = y - mousePos.current.y;
      const dist = Math.hypot(mdx, mdy);
      if (dist < 150 && dist > 1) {
        const force = (150 - dist) * 0.003;
        vx += (mdx / dist) * force;
        vy += (mdy / dist) * force;
      }

      if (x - halfW <= 0) {
        x = halfW;
        vx = Math.abs(vx) * (0.98 + Math.random() * 0.04);
        dYaw = (Math.random() - 0.5) * 0.035;
      } else if (x + halfW >= width) {
        x = width - halfW;
        vx = -Math.abs(vx) * (0.98 + Math.random() * 0.04);
        dYaw = (Math.random() - 0.5) * 0.035;
      }

      if (y - halfH <= 0) {
        y = halfH;
        vy = Math.abs(vy) * (0.98 + Math.random() * 0.04);
        dPitch = (Math.random() - 0.5) * 0.035;
      } else if (y + halfH >= height) {
        y = height - halfH;
        vy = -Math.abs(vy) * (0.98 + Math.random() * 0.04);
        dPitch = (Math.random() - 0.5) * 0.035;
      }

      const speed = Math.hypot(vx, vy);
      if (speed > 5) {
        vx = (vx / speed) * 5;
        vy = (vy / speed) * 5;
      } else if (speed < 1.8) {
        vx = (vx / speed) * 1.8;
        vy = (vy / speed) * 1.8;
      }

      if (img.complete && img.naturalWidth > 0) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(scale, scale);
        ctx.rotate(roll);
        ctx.transform(Math.cos(yaw), Math.sin(pitch) * 0.35, 0, Math.cos(pitch), 0, 0);

        ctx.shadowColor = "rgba(40, 120, 255, 0.45)";
        ctx.shadowBlur = 20;

        ctx.drawImage(img, -baseW / 2, -baseH / 2, baseW, baseH);
        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 10000,
        backgroundColor: "#000",
        opacity: isDismissing ? 0 : 1,
        transition: "opacity 280ms ease-out",
        cursor: "none",
        overflow: "hidden",
      }}
    >
      <canvas ref={canvasRef} style={{ display: "block", width: "100%", height: "100%" }} />
    </div>
  );
}
