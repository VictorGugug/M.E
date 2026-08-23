import type { ReactNode } from "react";
import { useWindowStore } from "../../store/windowStore";
import type { WindowConfig } from "../../types";
import { playSound } from "../../utils/sound";

const WIN_SVG = "/assets/icons/win";

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
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    boxShadow: isActive
      ? "inset -1px -1px #00138c, inset 1px 1px #0831d9, inset -2px -2px #001ea0, inset 2px 2px #166aee, inset -3px -3px #003bda, inset 3px 3px #0855dd"
      : "inset -1px -1px #7B9FDF, inset 1px 1px #B0C9F7, inset -2px -2px #7B9FDF, inset 2px 2px #B0C9F7",
    minWidth: config.minWidth || 200,
    minHeight: config.minHeight || 100,
  };

  const tbBg = isActive
    ? "linear-gradient(180deg, rgba(9,151,255,1) 0%, rgba(0,83,238,1) 8%, rgba(0,80,238,1) 40%, rgba(0,102,255,1) 88%, rgba(0,102,255,1) 93%, rgba(0,91,255,1) 95%, rgba(0,61,215,1) 96%, rgba(0,61,215,1) 100%)"
    : "linear-gradient(180deg, rgb(118,151,231) 0%, rgb(126,158,227) 3%, rgb(148,175,232) 6%, rgb(151,180,233) 8%, rgb(130,165,228) 14%, rgb(124,159,226) 17%, rgb(121,150,222) 25%, rgb(123,153,225) 56%, rgb(130,169,233) 81%, rgb(128,165,231) 89%, rgb(123,150,225) 94%, rgb(122,147,223) 97%, rgb(171,186,227) 100%)";

  return (
    <div className="xp-win" style={style} onMouseDown={doFocus}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: "3px 5px 3px 3px",
          background: tbBg,
          borderTopLeftRadius: 8,
          borderTopRightRadius: 7,
          height: 28,
          flexShrink: 0,
          borderTop: "1px solid #0831d9",
          borderLeft: "1px solid #0831d9",
          borderRight: "1px solid #001ea0",
          fontSize: 13,
          textShadow: "1px 1px #0f1089",
        }}
        onMouseDown={startDrag}
      >
        {config.icon && <img src={`/assets/icons/${config.icon}`} alt="" style={{ width: 20, height: 20, marginRight: 4 }} />}
        <span style={{ flex: 1, color: "#FFF", fontWeight: 600, fontSize: 12, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {config.title}
        </span>
        <div style={{ display: "flex", marginRight: 0, flexShrink: 0, gap: 2 }}>
          <button
            onClick={doMinimize}
            aria-label="Minimize"
            style={{
              width: 21, height: 21, border: "none", cursor: "pointer", background: "#0050ee",
              backgroundImage: `url(${WIN_SVG}/minimize.svg)`, backgroundRepeat: "no-repeat",
              backgroundPosition: "center", borderRadius: 0, flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/minimize-hover.svg)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/minimize.svg)`; }}
          />
          <button
            onClick={doMaxRestore}
            aria-label={maxd ? "Restore" : "Maximize"}
            style={{
              width: 21, height: 21, border: "none", cursor: "pointer", background: "#0050ee",
              backgroundImage: `url(${WIN_SVG}/${maxd ? "restore" : "maximize"}.svg)`,
              backgroundRepeat: "no-repeat", backgroundPosition: "center", borderRadius: 0, flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/${maxd ? "restore-hover" : "maximize-hover"}.svg)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/${maxd ? "restore" : "maximize"}.svg)`; }}
          />
          <button
            onClick={doClose}
            aria-label="Close"
            style={{
              width: 21, height: 21, border: "none", cursor: "pointer", background: "#0050ee",
              backgroundImage: `url(${WIN_SVG}/close.svg)`, backgroundRepeat: "no-repeat",
              backgroundPosition: "center", borderRadius: 0, flexShrink: 0,
            }}
            onMouseEnter={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/close-hover.svg)`; }}
            onMouseLeave={(e) => { e.currentTarget.style.backgroundImage = `url(${WIN_SVG}/close.svg)`; }}
          />
        </div>
      </div>
      {config.menuBar && (
        <div className="window-menu">
          <span className="window-menu-item">File</span>
          <span className="window-menu-item">Edit</span>
          <span className="window-menu-item">View</span>
          <span className="window-menu-item">Help</span>
        </div>
      )}
      <div className="window-body" style={{ flex: 1, background: "#FFF", overflow: "auto", position: "relative" }}>
        {children}
      </div>
      {config.statusBar && (
        <div className="window-statusbar" style={{ margin: "0 3px", boxShadow: "inset 0px 1px 2px #808080", padding: "2px 1px", display: "flex", height: 20, flexShrink: 0, background: "#ECE9D8" }}>
          <span style={{ fontSize: 11, padding: "1px 4px" }}>Ready</span>
        </div>
      )}
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
          <img src="/assets/taskbar/resizegrip2.png" alt="" style={{ position: "absolute", bottom: 1, right: 1, width: 32, height: 17, pointerEvents: "none", imageRendering: "pixelated", zIndex: 12 }} />
        </>
      )}
    </div>
  );
}
