import { useEffect, useRef, type ReactNode } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import type { WindowConfig } from "../../types";
import { assetUrl } from "../../utils/assets"

const UI = assetUrl("assets/xpui/interface");

export default function Window({ config, children }: { config: WindowConfig; children: ReactNode }) {
  const { focusWindow, closeWindow, minimizeWindow, maximizeWindow, restoreWindow, updatePosition, updateSize } = useWindowStore();
  const resourceName = useFileSystemStore((state) => config.resourceId ? state.fileSystem[config.resourceId]?.name : undefined);
  const t = useLangStore((state) => state.t);
  const zMax = Math.max(...useWindowStore.getState().windows.map((w) => w.zIndex));
  const isActive = config.zIndex === zMax;
  const baseTitle = config.titleKey ? t(config.titleKey) : config.title;
  const title = resourceName
    ? baseTitle.includes(" - ") ? `${resourceName} - ${baseTitle.split(" - ").pop()}` : resourceName
    : baseTitle;

  const winRef = useRef<HTMLDivElement>(null);
  const prevMinimized = useRef(config.state === "minimized");
  const isAnimating = useRef(false);

  const taskbarButtonRect = () =>
    document.querySelector<HTMLElement>(`[data-win-id="${config.id}"]`)?.getBoundingClientRect() ?? null;

  const reducedMotion = () =>
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const animateIntoTaskbar = (target: DOMRect) => {
    const node = winRef.current;
    if (!node || typeof node.animate !== "function" || reducedMotion()) {
      minimizeWindow(config.id);
      return;
    }
    const from = node.getBoundingClientRect();
    const dx = target.left + target.width / 2 - (from.left + from.width / 2);
    const dy = target.top + target.height / 2 - (from.top + from.height / 2);
    const scale = Math.max(0.08, Math.min(1, target.width / Math.max(1, from.width)));
    const animation = node.animate(
      [
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
      ],
      { duration: 200, easing: "ease-in", fill: "forwards" },
    );
    animation.onfinish = () => { animation.cancel(); minimizeWindow(config.id); };
  };

  const animateMaxRestore = (toMaximized: boolean): Promise<void> => {
    if (isAnimating.current) return Promise.resolve();
    const node = winRef.current;
    if (!node || typeof node.animate !== "function" || reducedMotion()) {
      if (toMaximized) maximizeWindow(config.id);
      else restoreWindow(config.id);
      return Promise.resolve();
    }

    isAnimating.current = true;
    return new Promise<void>((resolve) => {
      const sourceRect = node.getBoundingClientRect();
      const taskbarHeight = 30;
      const screenW = typeof window !== "undefined" ? window.innerWidth : 1024;
      const screenH = typeof window !== "undefined" ? window.innerHeight : 768;

      const targetRect = toMaximized
        ? {
            left: 0,
            top: 0,
            width: screenW,
            height: Math.max(100, screenH - taskbarHeight),
          }
        : {
            left: config.x,
            top: config.y,
            width: typeof config.width === "number" ? config.width : sourceRect.width,
            height: typeof config.height === "number" ? config.height : sourceRect.height,
          };

      const dx = targetRect.left - sourceRect.left;
      const dy = targetRect.top - sourceRect.top;
      const sx = Math.max(0.05, targetRect.width / Math.max(1, sourceRect.width));
      const sy = Math.max(0.05, targetRect.height / Math.max(1, sourceRect.height));

      const animation = node.animate(
        [
          { transform: "translate(0, 0) scale(1, 1)", transformOrigin: "top left" },
          { transform: `translate(${dx}px, ${dy}px) scale(${sx}, ${sy})`, transformOrigin: "top left" },
        ],
        { duration: 200, easing: "cubic-bezier(0.1, 0.9, 0.2, 1.0)", fill: "forwards" },
      );

      const finish = () => {
        animation.cancel();
        if (toMaximized) maximizeWindow(config.id);
        else restoreWindow(config.id);
        isAnimating.current = false;
        resolve();
      };

      animation.onfinish = finish;
      animation.oncancel = () => {
        isAnimating.current = false;
        resolve();
      };
    });
  };

  useEffect(() => {
    const wasMinimized = prevMinimized.current;
    prevMinimized.current = config.state === "minimized";
    if (!wasMinimized || config.state === "minimized") return;
    const node = winRef.current;
    const target = document.querySelector<HTMLElement>(`[data-win-id="${config.id}"]`)?.getBoundingClientRect() ?? null;
    const reduce = typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!node || typeof node.animate !== "function" || !target || reduce) return;
    const to = node.getBoundingClientRect();
    const dx = target.left + target.width / 2 - (to.left + to.width / 2);
    const dy = target.top + target.height / 2 - (to.top + to.height / 2);
    const scale = Math.max(0.08, Math.min(1, target.width / Math.max(1, to.width)));
    node.animate(
      [
        { transform: `translate(${dx}px, ${dy}px) scale(${scale})`, opacity: 0 },
        { transform: "translate(0, 0) scale(1)", opacity: 1 },
      ],
      { duration: 200, easing: "ease-out" },
    );
  }, [config.id, config.state]);

  const doFocus = () => focusWindow(config.id);

  const doMinimize = (e: React.MouseEvent) => {
    e.stopPropagation();
    const target = taskbarButtonRect();
    if (target) animateIntoTaskbar(target);
    else minimizeWindow(config.id);
  };
  const doMaxRestore = (e: React.MouseEvent) => {
    e.stopPropagation();
    animateMaxRestore(config.state !== "maximized");
  };
  const doClose = (e: React.MouseEvent) => { e.stopPropagation(); closeWindow(config.id); };
  const doTitleDoubleClick = () => {
    if (!config.resizable) return;
    animateMaxRestore(config.state !== "maximized");
  };

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
    <div ref={winRef} className={isActive ? "xp-win active" : "xp-win"} style={style} onMouseDown={doFocus} onKeyDown={(event) => { if (event.key !== "Escape") return; const target = event.target; if (target instanceof HTMLElement && (target.isContentEditable || ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName))) return; closeWindow(config.id); }} role="dialog" aria-label={title}>
      <div className="xp-titlebar" onMouseDown={startDrag} onDoubleClick={doTitleDoubleClick}>
        <div className="xp-win-title">
          {config.icon && <img src={assetUrl(`assets/icons/${config.icon}`)} alt="" />}
          <span className="label">{title}</span>
        </div>
        <div className="xp-win-buttons">
          {config.resizable && (
            <button onClick={doMinimize} aria-label={t("minimize")} tabIndex={0}>
              <img src={`${UI}/minimize.png`} alt="" />
            </button>
          )}
          {config.resizable && (
            <button onClick={doMaxRestore} aria-label={maxd ? t("restore") : t("maximize")} tabIndex={0}>
              <img src={`${UI}/maximize.png`} alt="" />
            </button>
          )}
          <button onClick={doClose} aria-label={t("close")} tabIndex={0}>
            <img src={`${UI}/close.png`} alt="" />
          </button>
        </div>
      </div>
      <div className="xp-win-inner">
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
