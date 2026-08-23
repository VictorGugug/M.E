import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { AppId } from "../../types";
import { assetUrl } from "../../utils/assets"

export default function Taskbar({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { windows, toggleStartMenu, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const [clock, setClock] = useState("");

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
      <button className="xp-start-btn" onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }} />
      <div className="xp-taskband">
        <button onClick={() => onOpen("internet-explorer")} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img src={assetUrl("assets/icons/InternetExplorer6.png")} width="16" height="16" alt="" />
        </button>
        <button onClick={() => onOpen("explorer")} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          <img src={assetUrl("assets/icons/Explorer.png")} width="16" height="16" alt="" />
        </button>
        <div className="xp-taskbar-divider" />
        <button onClick={() => onOpen("media-player")} style={{ width: 26, height: 26, border: "none", background: "none", cursor: "pointer", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
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
        <img src={assetUrl("assets/icons/SafelyRemoveHardware.png")} alt="" className="xp-tray-icon" title="Safely Remove Hardware" />
        <img src={assetUrl("assets/icons/NetworkConnection.png")} alt="" className="xp-tray-icon" title="Network Status" />
        <img src={assetUrl("assets/icons/Volume.png")} alt="" className="xp-tray-icon" onClick={() => onOpen("volume")} title="Volume" />
        <img src={assetUrl("assets/icons/TaskManager.png")} alt="" className="xp-tray-icon" title="Task Manager" />
        <span className="xp-tray-clock" onClick={() => onOpen("date-time")}>{clock}</span>
      </div>
    </div>
  );
}
