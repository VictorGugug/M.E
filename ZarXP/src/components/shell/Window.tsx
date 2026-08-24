import type { ReactNode } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { WindowConfig } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"

const UI = assetUrl("assets/xpui/interface");

export default function Window({ config, children }: { config: WindowConfig; children: ReactNode }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, updatePosition, updateSize } = useWindowStore();
  const zMax = Math.max(...useWindowStore.getState().windows.map((w) => w.zIndex));
  const isActive = config.zIndex === zMax;

  const doFocus = () => focusWindow(config.id);

  const doMinimize = (e: React.MouseEvent) => { e.stopPropagation(); minimizeWindow(config.id); playSound("Windows XP Minimize.wav"); };
  const doMaxRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (config.state === "maximized") { restoreWindow(config.id); playSound("Windows XP Restore.wav"); }
    else { maximizeWindow(config.id); playSound("Windows XP Minimize.wav"); }
  };
  const doClose = (e: React.MouseEvent) => { e.stopPropagation(); closeWindow(config.id); };

  const startDrag = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest(".xp-win-buttons")) return;
    doFocus();
    if (config.state === "maximized") return;
    const wrapper = (e.currentTarget.closest(".xp-win") as HTMLElement);
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const ox = e.clientX - rect.left;
    const oy = e.clientY - rect.top;
    const moveHandler = (ev: MouseEvent) => {
      updatePosition(config.id, Math.max(0, ev.clientX - ox), Math.max(0, ev.clientY - oy));
    };
    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
    };
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
  };

  const startResize = (e: React.MouseEvent, corner: string) => {
    e.preventDefault();
    e.stopPropagation();
    doFocus();
    const wrapper = (e.currentTarget.closest(".xp-win") as HTMLElement);
    if (!wrapper) return;
    const rect = wrapper.getBoundingClientRect();
    const sx = e.clientX;
    const sy = e.clientY;
    const sw = rect.width;
    const sh = rect.height;
    const sl = rect.left;
    const st = rect.top;
    const moveHandler = (ev: MouseEvent) => {
      let w = sw, h = sh, l = sl, t = st;
      if (corner.includes("e")) { w = Math.max(200, sw + ev.clientX - sx); }
      if (corner.includes("s")) { h = Math.max(100, sh + ev.clientY - sy); }
      if (corner.includes("w")) { const d = ev.clientX - sx; w = Math.max(200, sw - d); l = sl + (sw - w); }
      if (corner.includes("n")) { const d = ev.clientY - sy; h = Math.max(100, sh - d); t = st + (sh - h); }
      updateSize(config.id, w, h);
      updatePosition(config.id, l, t);
    };
    const upHandler = () => {
      window.removeEventListener("mousemove", moveHandler);
      window.removeEventListener("mouseup", upHandler);
    };
    window.addEventListener("mousemove", moveHandler);
    window.addEventListener("mouseup", upHandler);
  };

  const maxd = config.state === "maximized";
  const style: React.CSSProperties = {
    position: "absolute",
    left: maxd ? 0 : config.x,
    top: maxd ? 0 : config.y,
    width: maxd ? "100%" : config.width,
    height: maxd ? "calc(100% - 30px)" : config.height,
    zIndex: config.zIndex,
    display: config.state === "minimized" ? "none" : "flex",
    flexDirection: "column",
    minWidth: config.minWidth || 200,
    minHeight: config.minHeight || 100,
  };

  return (
    <div className={isActive ? "xp-win active" : "xp-win"} style={style} onMouseDown={doFocus}>
      <div className="xp-titlebar" onMouseDown={startDrag}>
        <div className="xp-win-title">
          {config.icon && <img src={assetUrl(`assets/icons/${config.icon}`)} alt="" />}
          <span className="label">{config.title}</span>
        </div>
        <div className="xp-win-buttons">
          <button onClick={doMinimize} aria-label="Minimize" tabIndex={-1}>
            <img src={`${UI}/minimize.png`} alt="" />
          </button>
          <button onClick={doMaxRestore} aria-label={maxd ? "Restore" : "Maximize"} tabIndex={-1}>
            <img src={`${UI}/maximize.png`} alt="" />
          </button>
          <button onClick={doClose} aria-label="Close" tabIndex={-1}>
            <img src={`${UI}/close.png`} alt="" />
          </button>
        </div>
      </div>
      <div className="xp-win-inner">
        {config.menuBar && (
          <div className="window-menu">
            <span className="window-menu-item">File</span>
            <span className="window-menu-item">Edit</span>
            <span className="window-menu-item">View</span>
            <span className="window-menu-item">Help</span>
          </div>
        )}
        <div className="window-body">
          {children}
        </div>
        {config.statusBar && (
          <div className="window-statusbar">
            <span>Ready</span>
          </div>
        )}
      </div>
      {config.resizable && (
        <>
          <div onMouseDown={(e) => startResize(e, "n")} style={{ position: "absolute", top: -3, left: 4, right: 4, height: 5, cursor: "n-resize", zIndex: 10 }} />
          <div onMouseDown={(e) => startResize(e, "s")} style={{ position: "absolute", bottom: -3, left: 4, right: 4, height: 5, cursor: "s-resize", zIndex: 10 }} />
          <div onMouseDown={(e) => startResize(e, "w")} style={{ position: "absolute", left: -3, top: 4, bottom: 4, width: 5, cursor: "w-resize", zIndex: 10 }} />
          <div onMouseDown={(e) => startResize(e, "e")} style={{ position: "absolute", right: -3, top: 4, bottom: 4, width: 5, cursor: "e-resize", zIndex: 10 }} />
          <div onMouseDown={(e) => startResize(e, "nw")} style={{ position: "absolute", top: -3, left: -3, width: 8, height: 8, cursor: "nw-resize", zIndex: 11 }} />
          <div onMouseDown={(e) => startResize(e, "ne")} style={{ position: "absolute", top: -3, right: -3, width: 8, height: 8, cursor: "ne-resize", zIndex: 11 }} />
          <div onMouseDown={(e) => startResize(e, "sw")} style={{ position: "absolute", bottom: -3, left: -3, width: 8, height: 8, cursor: "sw-resize", zIndex: 11 }} />
          <div onMouseDown={(e) => startResize(e, "se")} style={{ position: "absolute", bottom: -3, right: -3, width: 8, height: 8, cursor: "se-resize", zIndex: 11 }} />
          <img src={assetUrl("assets/taskbar/resizegrip2.png")} alt="" style={{ position: "absolute", bottom: 6, right: 6, width: 16, height: 14, pointerEvents: "none", imageRendering: "pixelated", zIndex: 12 }} />
        </>
      )}
    </div>
  );
}
