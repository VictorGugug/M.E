import { useState, useEffect, useRef } from "react";
import { useWindowStore } from "../../store/windowStore";
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
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("internet-explorer"); }} title="Internet Explorer">
          <img src={`${OL}/icon/internet.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); minimizeAll(); }} title="Show Desktop">
          <img src={`${OL}/icon/desktop.png`} alt="" />
        </button>
        <div className="xp-taskbar-divider" />
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("media-player"); }} title="Windows Media Player">
          <img src={`${OL}/icon/player.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("tour-xp"); }} title="Tour Windows XP">
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
            <span>{win.title}</span>
          </button>
        ))}
      </div>

      <div className="xp-tray" style={{ position: "relative", display: "flex", alignItems: "center", gap: 6, padding: "0 8px" }}>
        <img
          src={`${OL}/icon/messenger.png`}
          alt=""
          className="xp-tray-icon"
          title="Windows Messenger"
          onClick={(e) => { e.stopPropagation(); onOpen("msn-messenger"); }}
        />
        {balloon === "tour" ? (
          <img
            ref={tourIconRef}
            src={`${OL}/icon/tour.png`}
            alt=""
            className="xp-tray-icon"
            title="Tour Windows XP"
            onClick={(e) => { e.stopPropagation(); setBalloon(null); onOpen("tour-xp"); }}
          />
        ) : (
          <img
            src={`${OL}/icon/security.png`}
            alt=""
            className="xp-tray-icon"
            title="Windows Security Center"
            onClick={(e) => { e.stopPropagation(); onOpen("security-center"); }}
          />
        )}
        <img
          src={`${OL}/icon/speaker.png`}
          alt=""
          className="xp-tray-icon"
          title="Volume"
          onClick={(e) => { e.stopPropagation(); setVolOpen((v) => !v); }}
        />
        <img
          ref={removeIconRef}
          src={`${IC}/SafelyRemoveHardware.png`}
          alt=""
          className="xp-tray-icon"
          title="Safely Remove Hardware"
          onClick={(e) => { e.stopPropagation(); setBalloon((b) => (b === "remove" ? null : "remove")); }}
        />
        <span
          className="xp-tray-clock"
          title="Date and Time Properties"
          onClick={(e) => { e.stopPropagation(); onOpen("date-time"); }}
        >
          {clock}
        </span>

        {volOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", bottom: 32, right: 60, width: 68, background: "#ECE9D8", border: "1px solid #0831D9", boxShadow: "2px 2px 4px rgba(0,0,0,0.35)", padding: "6px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 870 }}
          >
            <span style={{ fontSize: 11 }}>{t("volume")}</span>
            <input
              type="range"
              min="0"
              max="100"
              value={volume}
              onChange={(e) => setVolume(Number(e.target.value))}
              style={{ writingMode: "vertical-lr" as React.CSSProperties["writingMode"], direction: "rtl", width: 24, height: 90, accentColor: "#2E71DC", cursor: "pointer" }}
            />
            <label style={{ display: "flex", alignItems: "center", gap: 3, fontSize: 11 }}>
              <span className={`xp-checkbox${volMute ? " xp-checkbox-checked" : ""}`} />
              <input type="checkbox" style={{ display: "none" }} checked={volMute} onChange={() => setVolMute(!volMute)} />
              {t("mute")}
            </label>
          </div>
        )}

        {balloon && (
          <div
            className="xp-balloon"
            style={{
              position: "absolute",
              bottom: 34,
              right: balloon === "tour" ? 92 : 54,
              background: "#FFFFE1",
              border: "1px solid #000",
              borderRadius: 6,
              padding: "8px 12px",
              width: 250,
              boxShadow: "2px 2px 5px rgba(0,0,0,0.4)",
              zIndex: 9999,
              fontFamily: "Tahoma, sans-serif",
              fontSize: 11,
              lineHeight: 1.35,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setBalloon(null)}
              aria-label="Close"
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                width: 14,
                height: 14,
                background: "transparent",
                border: "1px solid transparent",
                borderRadius: 2,
                cursor: "pointer",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#666",
                fontSize: 10,
                fontWeight: "bold"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#999"; e.currentTarget.style.background = "#FFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = "transparent"; e.currentTarget.style.background = "transparent"; }}
            >
              ✕
            </button>

            {balloon === "tour" ? (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>
                  <img src={`${OL}/icon/info.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>{t("balloonTourTitle")}</span>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  onClick={() => { setBalloon(null); onOpen("tour-xp"); }}
                >
                  {(() => {
                    const parts = t("balloonTourBody").split("|");
                    return (
                      <span>
                        {parts[0]}
                        <span style={{ color: "#0000CC", textDecoration: "underline" }}>{parts[1]}</span>
                        {parts[2]}
                      </span>
                    );
                  })()}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>
                  <img src={`${IC}/SafelyRemoveHardware.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>{t("balloonRemoveTitle")}</span>
                </div>
                <div>{t("balloonRemoveBody")}</div>
              </>
            )}

            <div
              style={{
                position: "absolute",
                bottom: -8,
                right: 18,
                width: 0,
                height: 0,
                borderLeft: "8px solid transparent",
                borderRight: "8px solid transparent",
                borderTop: "8px solid #000",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: -6,
                right: 19,
                width: 0,
                height: 0,
                borderLeft: "7px solid transparent",
                borderRight: "7px solid transparent",
                borderTop: "7px solid #FFFFE1",
              }}
            />
          </div>
        )}
      </div>

      {taskbarCtx && (
        <div
          className="desktop-context-menu"
          style={{
            left: taskbarCtx.x,
            top: taskbarCtx.y,
            position: "fixed",
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
          <div className="context-item context-disabled" style={{ padding: "3px 18px", color: "#888" }}>
            {t("toolbars")}
          </div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div
            className="context-item"
            style={{ padding: "3px 18px", cursor: "pointer" }}
            onClick={() => { cascadeWindows(); setTaskbarCtx(null); }}
          >
            {t("cascadeWindows")}
          </div>
          <div className="context-item" style={{ padding: "3px 18px", cursor: "pointer" }} onClick={() => setTaskbarCtx(null)}>
            {t("tileHorizontally")}
          </div>
          <div className="context-item" style={{ padding: "3px 18px", cursor: "pointer" }} onClick={() => setTaskbarCtx(null)}>
            {t("tileVertically")}
          </div>
          <div
            className="context-item"
            style={{ padding: "3px 18px", cursor: "pointer" }}
            onClick={() => { minimizeAll(); setTaskbarCtx(null); }}
          >
            {t("showDesktop")}
          </div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div
            className="context-item"
            style={{ padding: "3px 18px", cursor: "pointer", fontWeight: "bold" }}
            onClick={() => { onOpen("task-manager"); setTaskbarCtx(null); }}
          >
            {t("taskManager")}
          </div>
          <div className="context-separator" style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
          <div className="context-item" style={{ padding: "3px 18px", cursor: "pointer" }} onClick={() => setTaskbarCtx(null)}>
            {t("lockTaskbar")}
          </div>
          <div className="context-item" style={{ padding: "3px 18px", cursor: "pointer" }} onClick={() => { onOpen("display-properties"); setTaskbarCtx(null); }}>
            {t("taskbarProperties")}
          </div>
        </div>
      )}
    </div>
  );
}
