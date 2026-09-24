import { useState, useEffect, useRef } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import type { AppId } from "../../types";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

export default function Taskbar({ onOpen }: { onOpen: (id: AppId) => void }) {
  const {
    windows, toggleStartMenu, focusWindow, minimizeWindow, restoreWindow,
    minimizeAll, cascadeWindows
  } = useWindowStore();
  const [clock, setClock] = useState("");
  const [balloon, setBalloon] = useState<null | "tour" | "remove">("tour");
  const [volOpen, setVolOpen] = useState(false);
  const [volume, setVolume] = useState(72);
  const [volMute, setVolMute] = useState(false);
  const [taskbarCtx, setTaskbarCtx] = useState<{ x: number; y: number } | null>(null);

  const zMax = Math.max(0, ...windows.map((w) => w.zIndex));
  const t = useLangStore((s) => s.t);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const windowTitle = (win: typeof windows[0]) => win.resourceId ? fileSystem[win.resourceId]?.name ?? win.title : win.title;
  const handleIconKey = (event: React.KeyboardEvent, action: () => void) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    action();
  };

  const tourIconRef = useRef<HTMLImageElement>(null);
  const removeIconRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "P.M." : "A.M.";
      hours = hours % 12;
      hours = hours ? hours : 12;
      const hourStr = hours.toString().padStart(2, "0");
      setClock(`${hourStr}:${minutes} ${ampm}`);
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!volOpen && !taskbarCtx) return;
    const close = () => {
      setVolOpen(false);
      setTaskbarCtx(null);
    };
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [volOpen, taskbarCtx]);

  const handleAppClick = (win: typeof windows[0]) => {
    if (win.state === "minimized") restoreWindow(win.id);
    else if (win.zIndex === zMax) minimizeWindow(win.id);
    focusWindow(win.id);
  };

  const handleTaskbarContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTaskbarCtx({
      x: Math.min(e.clientX, window.innerWidth - 180),
      y: Math.max(10, e.clientY - 210)
    });
  };

  return (
    <div className="xp-taskbar" onContextMenu={handleTaskbarContextMenu}>
      <button className="xp-start-btn" onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }} aria-label={t("start")}>
        <img src={`${OL}/interface/start.png`} alt="start" />
      </button>

      <div className="xp-taskband">
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("internet-explorer"); }} title={t("internetExplorer")} aria-label={t("internetExplorer")}>
          <img src={`${OL}/icon/internet.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); minimizeAll(); }} title={t("showDesktop")} aria-label={t("showDesktop")}>
          <img src={`${OL}/icon/desktop.png`} alt="" />
        </button>
        <div className="xp-taskbar-divider" />
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("media-player"); }} title={t("mediaPlayer")} aria-label={t("mediaPlayer")}>
          <img src={`${OL}/icon/player.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("tour-xp"); }} title={t("tour")} aria-label={t("tour")}>
          <img src={`${OL}/icon/tour.png`} alt="" />
        </button>
      </div>

      <div className="xp-taskbar-tasks">
        {windows.map((win) => (
          <button
            key={win.id}
            onClick={(e) => { e.stopPropagation(); handleAppClick(win); }}
            className={win.state !== "minimized" && win.zIndex === zMax ? "xp-task-btn xp-task-btn-active" : "xp-task-btn"}
          >
            {win.icon && <img src={assetUrl(`assets/icons/${win.icon}`)} alt="" />}
            <span>{windowTitle(win)}</span>
          </button>
        ))}
      </div>

      <div className="xp-tray">
        <img
          src={`${OL}/icon/messenger.png`}
          alt=""
          className="xp-tray-icon"
           title={t("messenger")}
           aria-label={t("messenger")}
           role="button"
           tabIndex={0}
           onKeyDown={(event) => handleIconKey(event, () => onOpen("msn-messenger"))}
           onClick={(e) => { e.stopPropagation(); onOpen("msn-messenger"); }}
        />
        {balloon === "tour" ? (
          <img
            ref={tourIconRef}
            src={`${OL}/icon/tour.png`}
            alt=""
            className="xp-tray-icon"
             title={t("tour")}
             aria-label={t("tour")}
             role="button"
             tabIndex={0}
             onKeyDown={(event) => handleIconKey(event, () => { setBalloon(null); onOpen("tour-xp"); })}
             onClick={(e) => { e.stopPropagation(); setBalloon(null); onOpen("tour-xp"); }}
          />
        ) : (
          <img
            src={`${OL}/icon/security.png`}
            alt=""
            className="xp-tray-icon"
             title={t("securityCenterCat")}
             aria-label={t("securityCenterCat")}
             role="button"
             tabIndex={0}
             onKeyDown={(event) => handleIconKey(event, () => onOpen("security-center"))}
             onClick={(e) => { e.stopPropagation(); onOpen("security-center"); }}
          />
        )}
        <img
          src={`${OL}/icon/speaker.png`}
          alt=""
          className="xp-tray-icon"
           title={t("volume")}
           aria-label={t("volume")}
           role="button"
           tabIndex={0}
           onKeyDown={(event) => handleIconKey(event, () => setVolOpen((v) => !v))}
           onClick={(e) => { e.stopPropagation(); setVolOpen((v) => !v); }}
        />
        <img
          ref={removeIconRef}
          src={`${IC}/SafelyRemoveHardware.png`}
          alt=""
          className="xp-tray-icon"
           title={t("safelyRemoveHardware")}
           aria-label={t("safelyRemoveHardware")}
           role="button"
           tabIndex={0}
           onKeyDown={(event) => handleIconKey(event, () => setBalloon((b) => (b === "remove" ? null : "remove")))}
           onClick={(e) => { e.stopPropagation(); setBalloon((b) => (b === "remove" ? null : "remove")); }}
        />
        <span
          className="xp-tray-clock"
           title={t("dateTimeProperties")}
           aria-label={t("dateTimeProperties")}
           role="button"
           tabIndex={0}
           onKeyDown={(event) => handleIconKey(event, () => onOpen("date-time"))}
           onClick={(e) => { e.stopPropagation(); onOpen("date-time"); }}
        >
          {clock}
        </span>

        {volOpen && (
          <div className="xp-volume-popup" onClick={(e) => e.stopPropagation()}>
            <span className="xp-volume-title">{t("volume")}</span>
            <input className="xp-volume-slider" type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} />
            <label className="xp-volume-label">
              <span className={`xp-checkbox${volMute ? " xp-checkbox-checked" : ""}`} />
              <input type="checkbox" checked={volMute} onChange={() => setVolMute(!volMute)} />
              {t("mute")}
            </label>
          </div>
        )}

        {balloon && (
          <div className="xp-balloon" style={{ right: balloon === "tour" ? 92 : 54 }} onClick={(e) => e.stopPropagation()}>
             <button className="balloon-close" onClick={() => setBalloon(null)} aria-label={t("close")}><img src={assetUrl("assets/xpui/interface/balloon/close.png")} alt="" /></button>

            {balloon === "tour" ? (
              <>
                <div className="balloon-title">
                  <img className="balloon-icon" src={`${OL}/icon/info.png`} alt="" />
                  <span>{t("balloonTourTitle")}</span>
                </div>
                 <div className="xp-balloon-link balloon-text" role="button" tabIndex={0} aria-label={t("tour")} onKeyDown={(event) => handleIconKey(event, () => { setBalloon(null); onOpen("tour-xp"); })} onClick={() => { setBalloon(null); onOpen("tour-xp"); }}>
                  {(() => {
                    const parts = t("balloonTourBody").split("|");
                    return <span>{parts[0]}<span>{parts[1]}</span>{parts[2]}</span>;
                  })()}
                </div>
              </>
            ) : (
              <>
                <div className="balloon-title">
                  <img className="balloon-icon" src={`${IC}/SafelyRemoveHardware.png`} alt="" />
                  <span>{t("balloonRemoveTitle")}</span>
                </div>
                <div className="balloon-text">{t("balloonRemoveBody")}</div>
              </>
            )}
          </div>
        )}
      </div>

      {taskbarCtx && (
        <div
          className="desktop-context-menu xp-taskbar-context"
          style={{ left: taskbarCtx.x, top: taskbarCtx.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="context-item context-disabled">
            {t("toolbars")}
          </div>
          <div className="context-separator" />
          <div
            className="context-item"
            onClick={() => { cascadeWindows(); setTaskbarCtx(null); }}
          >
            {t("cascadeWindows")}
          </div>
          <div className="context-item" onClick={() => setTaskbarCtx(null)}>
            {t("tileHorizontally")}
          </div>
          <div className="context-item" onClick={() => setTaskbarCtx(null)}>
            {t("tileVertically")}
          </div>
          <div
            className="context-item"
            onClick={() => { minimizeAll(); setTaskbarCtx(null); }}
          >
            {t("showDesktop")}
          </div>
          <div className="context-separator" />
          <div
            className="context-item xp-taskbar-bold"
            onClick={() => { onOpen("task-manager"); setTaskbarCtx(null); }}
          >
            {t("taskManager")}
          </div>
          <div className="context-separator" />
          <div className="context-item" onClick={() => setTaskbarCtx(null)}>
            {t("lockTaskbar")}
          </div>
          <div className="context-item" onClick={() => { onOpen("display-properties"); setTaskbarCtx(null); }}>
            {t("taskbarProperties")}
          </div>
        </div>
      )}
    </div>
  );
}
