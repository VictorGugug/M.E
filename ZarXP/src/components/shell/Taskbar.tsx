import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { AppId } from "../../types";
import { assetUrl } from "../../utils/assets"

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

export default function Taskbar({ onOpen }: { onOpen: (id: AppId) => void }) {
  const { windows, toggleStartMenu, focusWindow, minimizeWindow, restoreWindow } = useWindowStore();
  const [clock, setClock] = useState("");
  const [balloon, setBalloon] = useState<null | "tour" | "remove">(null);
  const [volOpen, setVolOpen] = useState(false);
  const [volume, setVolume] = useState(72);
  const [volMute, setVolMute] = useState(false);
  const zMax = Math.max(0, ...windows.map((w) => w.zIndex));

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setClock(now.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", hour12: true }));
    };
    update();
    const iv = setInterval(update, 1000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (!volOpen) return;
    const close = () => setVolOpen(false);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [volOpen]);

  useEffect(() => {
    const t = setTimeout(() => setBalloon("tour"), 2500);
    return () => clearTimeout(t);
  }, []);

  const handleAppClick = (win: typeof windows[0]) => {
    if (win.state === "minimized") restoreWindow(win.id);
    else if (win.zIndex === zMax) minimizeWindow(win.id);
    focusWindow(win.id);
  };

  return (
    <div className="xp-taskbar">
      <button className="xp-start-btn" onClick={(e) => { e.stopPropagation(); toggleStartMenu(); }} aria-label="Start">
        <img src={`${OL}/interface/start.png`} alt="start" />
      </button>
      <div className="xp-taskband">
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("internet-explorer"); }} title="Internet Explorer">
          <img src={`${OL}/icon/internet.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("explorer"); }} title="Windows Explorer">
          <img src={`${OL}/icon/folder/closed.png`} alt="" />
        </button>
        <div className="xp-taskbar-divider" />
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("media-player"); }} title="Windows Media Player">
          <img src={`${OL}/icon/player.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("tour-xp"); }} title="Tour Windows XP">
          <img src={`${OL}/icon/tour.png`} alt="" />
        </button>
        <button className="xp-ql-btn" onClick={(e) => { e.stopPropagation(); onOpen("volume"); }} title="Volume">
          <img src={`${OL}/icon/speaker.png`} alt="" />
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
      <div className="xp-tray">
        <img src={`${OL}/icon/messenger.png`} alt="" className="xp-tray-icon" title="Windows Messenger" onClick={(e) => { e.stopPropagation(); onOpen("msn-messenger"); }} />
        <img src={`${IC}/SecurityCenter.png`} alt="" className="xp-tray-icon" title="Windows Security Center" onClick={(e) => { e.stopPropagation(); onOpen("security-center"); }} />
        <img src={`${OL}/icon/speaker.png`} alt="" className="xp-tray-icon" title="Volume" onClick={(e) => { e.stopPropagation(); setVolOpen((v) => !v); }} />
        <img src={`${IC}/SafelyRemoveHardware.png`} alt="" className="xp-tray-icon" title="Safely Remove Hardware" onClick={(e) => { e.stopPropagation(); setBalloon((b) => (b === "remove" ? null : "remove")); }} />
        <span className="xp-tray-clock" onClick={(e) => { e.stopPropagation(); onOpen("date-time"); }}>{clock}</span>
        {volOpen && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{ position: "absolute", bottom: 30, right: 60, width: 68, background: "#ECE9D8", border: "1px solid #0831D9", boxShadow: "2px 2px 4px rgba(0,0,0,0.35)", padding: "6px 4px 8px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, zIndex: 870 }}
          >
            <span style={{ fontSize: 11 }}>Volume</span>
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
              Mute
            </label>
          </div>
        )}
        {balloon && (
          <div className="xp-balloon" onClick={(e) => e.stopPropagation()}>
            <button className="balloon-close" onClick={() => setBalloon(null)} aria-label="Close">
              <img src={`${OL}/interface/balloon/close.png`} alt="" />
            </button>
            {balloon === "tour" ? (
              <>
                <div className="balloon-title">
                  <img className="balloon-icon" src={`${OL}/icon/tour.png`} alt="" />
                  Take a tour of Windows XP
                </div>
                <span className="balloon-text" style={{ cursor: "url('/assets/cursors/pointer.cur'), pointer" }} onClick={() => { setBalloon(null); onOpen("tour-xp"); }}>
                  To learn about the fun features Windows XP has to offer, <span style={{ color: "#0000CC", textDecoration: "underline" }}>click here</span>. To find this info later, click Help and Support on the Start menu.
                </span>
              </>
            ) : (
              <>
                <div className="balloon-title">
                  <img className="balloon-icon" src={`${IC}/SafelyRemoveHardware.png`} alt="" />
                  Safely Remove Hardware
                </div>
                <span className="balloon-text">No removable devices are connected.</span>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
