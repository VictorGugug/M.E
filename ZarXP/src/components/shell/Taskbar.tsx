import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { AppId } from "../../types";
import { assetUrl } from "../../utils/assets"

function StartFlag() {
  return (
    <svg className="xp-start-flag" viewBox="0 0 24 24">
      <defs>
        <linearGradient id="wv" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#FFF" stopOpacity="0.35" />
          <stop offset="1" stopColor="#000" stopOpacity="0.12" />
        </linearGradient>
      </defs>
      <g transform="rotate(-8 12 12)">
        <path d="M3 6.2 Q6.5 4.4 11 5.6 L11 11.4 Q6.5 10.2 3 12 Z" fill="#F65314" />
        <path d="M12.6 5.8 Q16.5 6.8 21 5.4 L21 11 Q16.5 12.4 12.6 11.4 Z" fill="#7CBB00" />
        <path d="M3 13.6 Q6.5 11.8 11 13 L11 18.8 Q6.5 17.6 3 19.4 Z" fill="#00A1F1" />
        <path d="M12.6 13.2 Q16.5 14.2 21 12.8 L21 18.4 Q16.5 19.8 12.6 18.8 Z" fill="#FFBB00" />
        <path d="M3 6.2 Q6.5 4.4 11 5.6 L11 11.4 Q6.5 10.2 3 12 Z" fill="url(#wv)" />
        <path d="M12.6 5.8 Q16.5 6.8 21 5.4 L21 11 Q16.5 12.4 12.6 11.4 Z" fill="url(#wv)" />
        <path d="M3 13.6 Q6.5 11.8 11 13 L11 18.8 Q6.5 17.6 3 19.4 Z" fill="url(#wv)" />
        <path d="M12.6 13.2 Q16.5 14.2 21 12.8 L21 18.4 Q16.5 19.8 12.6 18.8 Z" fill="url(#wv)" />
      </g>
    </svg>
  );
}

export default function Taskbar({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { windows, toggleStartMenu, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const [clock, setClock] = useState("");
  const [balloon, setBalloon] = useState(false);

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "numeric", hour12: true }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  const handleAppClick = (win: typeof windows[0]) => {
    if (win.state === "minimized") restoreWindow(win.id);
    else if (win.state === "normal") minimizeWindow(win.id);
    focusWindow(win.id);
  };

  const running = windows;

  return (
    <div className="xp-taskbar">
      <button className="xp-start-btn" onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }}>
        <StartFlag />
        <span>start</span>
      </button>
      <div className="xp-taskband">
        <button className="xp-ql-btn" onClick={() => onOpen("internet-explorer")} title="Internet Explorer">
          <img src={assetUrl("assets/icons/InternetExplorer6.png")} width="16" height="16" alt="" />
        </button>
        <button className="xp-ql-btn" onClick={() => onOpen("explorer")} title="Windows Explorer">
          <img src={assetUrl("assets/icons/Explorer.png")} width="16" height="16" alt="" />
        </button>
        <div className="xp-taskbar-divider" />
        <button className="xp-ql-btn" onClick={() => onOpen("media-player")} title="Windows Media Player">
          <img src={assetUrl("assets/icons/WindowsMediaPlayer10.png")} width="16" height="16" alt="" />
        </button>
      </div>
      <div className="xp-taskbar-tasks">
        {running.map((win) => (
          <button
            key={win.id}
            onClick={() => handleAppClick(win)}
            className={win.state === "normal" ? "xp-task-btn xp-task-btn-active" : "xp-task-btn xp-task-btn-inactive"}
          >
            {win.icon && <img src={assetUrl(`assets/icons/${win.icon}`)} alt="" width="14" height="14" style={{ flexShrink: 0 }} />}
            <span style={{ overflow: "hidden", textOverflow: "ellipsis" }}>{win.title}</span>
          </button>
        ))}
      </div>
      <div className="xp-tray">
        <img src={assetUrl("assets/icons/SafelyRemoveHardware.png")} alt="" className="xp-tray-icon" title="Safely Remove Hardware" onClick={(e) => { e.stopPropagation(); setBalloon((b) => !b); }} />
        <img src={assetUrl("assets/icons/NetworkConnection.png")} alt="" className="xp-tray-icon" title="Network Status" onClick={(e) => { e.stopPropagation(); onOpen("network-places"); }} />
        <img src={assetUrl("assets/icons/Volume.png")} alt="" className="xp-tray-icon" onClick={(e) => { e.stopPropagation(); onOpen("volume"); }} title="Volume" />
        <img src={assetUrl("assets/icons/TaskManager.png")} alt="" className="xp-tray-icon" title="Windows Task Manager" onClick={(e) => { e.stopPropagation(); onOpen("task-manager"); }} />
        <span className="xp-tray-clock" onClick={(e) => { e.stopPropagation(); onOpen("date-time"); }}>{clock}</span>
        {balloon && (
          <div className="xp-balloon" onClick={(e) => { e.stopPropagation(); setBalloon(false); }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "bold" }}>
              <img src={assetUrl("assets/icons/SafelyRemoveHardware.png")} width={16} height={16} alt="" />
              Safely Remove Hardware
            </div>
            <div style={{ marginTop: 4 }}>No removable devices are connected.</div>
          </div>
        )}
      </div>
    </div>
  );
}
