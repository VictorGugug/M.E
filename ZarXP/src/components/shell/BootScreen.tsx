import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";

const BIOS_LINES = [
  { text: "Award Modular BIOS v6.00PG, An Energy Star Ally", cls: "strong", delay: 0 },
  { text: "Copyright (C) 1984-2003, Award Software, Inc.", cls: "", delay: 200 },
  { text: "", cls: "", delay: 300 },
  { text: "Main Processor : Intel Pentium 4 2.40GHz", cls: "", delay: 500 },
  { text: "Memory Testing : 524288K OK", cls: "", delay: 900 },
  { text: "Memory Frequency : DDR 333MHz", cls: "", delay: 1300 },
  { text: "", cls: "", delay: 1400 },
  { text: "Primary Master : WDC WD800BB-22JHC0  80GB", cls: "", delay: 1600 },
  { text: "Primary Slave  : Not Detected", cls: "", delay: 1900 },
  { text: "Secondary Master: IDE CD-ROM 52x", cls: "", delay: 2200 },
  { text: "Secondary Slave : Not Detected", cls: "", delay: 2500 },
  { text: "", cls: "", delay: 2600 },
  { text: "Verifying DMI Pool Data ......", cls: "", delay: 2800 },
  { text: "Boot from NVMe...", cls: "", delay: 3200 },
  { text: "", cls: "", delay: 3400 },
  { text: "Press DEL to enter Setup, F12 for Boot Menu", cls: "", delay: 3600 },
];

export default function BootScreen() {
  const { bootPhase, setBootPhase } = useWindowStore();
  const [phase, setPhase] = useState<"bios" | "loading">("bios");
  const [lines, setLines] = useState<typeof BIOS_LINES>([]);
  const [showMenu, setShowMenu] = useState(false);
  const [bootOpt, setBootOpt] = useState(0);

  useEffect(() => {
    const arr: typeof BIOS_LINES = [];
    BIOS_LINES.forEach((l, i) => {
      setTimeout(() => {
        arr.push(l);
        setLines([...arr]);
        if (i === BIOS_LINES.length - 1) {
          setTimeout(() => setShowMenu(true), 1200);
        }
      }, l.delay);
    });
  }, []);

  useEffect(() => {
    if (!showMenu) return;
    const autoBoot = setTimeout(() => setPhase("loading"), 3000);
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") { setBootOpt((p) => Math.min(p + 1, 2)); e.preventDefault(); }
      if (e.key === "ArrowUp") { setBootOpt((p) => Math.max(p - 1, 0)); e.preventDefault(); }
      if (e.key === "Enter") { setPhase("loading"); }
    };
    window.addEventListener("keydown", handler);
    return () => { clearTimeout(autoBoot); window.removeEventListener("keydown", handler); };
  }, [showMenu]);

  useEffect(() => {
    if (phase !== "loading" || bootPhase !== "bios") return;
    const t = setTimeout(() => setBootPhase("login"), 4000);
    return () => clearTimeout(t);
  }, [phase, bootPhase, setBootPhase]);

  if (bootPhase !== "bios") return null;

  if (phase === "loading") {
    return (
      <div className="boot-xp" style={{ position: "fixed", inset: 0, background: "#000", zIndex: 9999, display: "flex", flexDirection: "column", color: "#F4F4F4", fontFamily: "Arial,Helvetica,sans-serif" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(420px,78vw)", textAlign: "center" }}>
          <img src="/assets/images/xp-loading-logo.jpg" alt="" style={{ width: "100%", maxWidth: 400 }} />
          <div className="xp-loader">
            <div /><div /><div />
          </div>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#F4F4F4" }}>Copyright &copy; Microsoft Corporation</p>
          <img src="/assets/images/xp-loading-mslogo.jpg" alt="" style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  return (
    <div className="boot-screen" style={{ zIndex: 9999 }}>
      <div className="boot-bios">
        <div className="boot-bios-content">
          {lines.map((l, i) => (
            <div key={i} className={`boot-bios-line ${l.cls}`} style={{ opacity: l.text ? 1 : 0 }}>{l.text || "\u00A0"}</div>
          ))}
          {showMenu && (
            <div className="boot-menu">
              <div className={`boot-menu-option ${bootOpt === 0 ? "selected" : ""}`}>Start Windows XP</div>
              <div className={`boot-menu-option ${bootOpt === 1 ? "selected" : ""}`}>Safe Mode</div>
              <div className={`boot-menu-option ${bootOpt === 2 ? "selected" : ""}`}>Safe Mode with Networking</div>
              <div className="boot-menu-hint">Use the up and down arrow keys to select.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
