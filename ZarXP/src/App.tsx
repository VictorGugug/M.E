import "./styles/xp-theme.css";
import { useState, useEffect } from "react";
import { useWindowStore } from "./store/windowStore";
import Desktop from "./components/shell/Desktop";
import { playSound } from "./utils/sound";
import { assetUrl } from "./utils/assets"

const VALID_STEPS = ["loading", "login", "welcome", "desktop"] as const;
type Step = (typeof VALID_STEPS)[number];
type PowerAction = "shut-down" | "restart" | "stand-by";

function initialStep(): Step {
  const param = new URLSearchParams(window.location.search).get("step");
  return (VALID_STEPS as readonly string[]).includes(param ?? "") ? (param as Step) : "loading";
}

export default function App() {
  const { setBootPhase } = useWindowStore();
  const [step, setStep] = useState<Step>(initialStep);
  const [power, setPower] = useState<null | "shutting-down" | "standby" | "off">(null);

  useEffect(() => {
    if (step !== "loading") return;
    const t = setTimeout(() => setStep("login"), 1200);
    return () => clearTimeout(t);
  }, [step]);

  useEffect(() => {
    const handler = (e: Event) => {
      const action = (e as CustomEvent).detail.action as PowerAction;
      if (action === "stand-by") { setPower("standby"); return; }
      setPower("shutting-down");
      playSound("Windows XP Shutdown.wav", 0.5);
      setTimeout(() => {
        if (action === "restart") { window.location.href = window.location.pathname; }
        else { setPower("off"); }
      }, 2600);
    };
    window.addEventListener("zarxp-power", handler);
    return () => window.removeEventListener("zarxp-power", handler);
  }, []);

  useEffect(() => {
    if (power !== "standby") return;
    const wake = () => setPower(null);
    window.addEventListener("mousedown", wake);
    window.addEventListener("keydown", wake);
    return () => { window.removeEventListener("mousedown", wake); window.removeEventListener("keydown", wake); };
  }, [power]);

  const doLogin = () => {
    playSound("Windows XP Logon Sound.wav", 0.4);
    setStep("welcome");
    setTimeout(() => {
      setStep("desktop");
      setBootPhase("desktop");
    }, 900);
  };

  if (power === "standby") {
    return <div style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99999 }} />;
  }

  if (power === "off") {
    return (
      <div onClick={() => { setPower(null); setStep("loading"); }} style={{ position: "fixed", inset: 0, background: "#000", zIndex: 99999, display: "flex", alignItems: "flex-end", justifyContent: "center", cursor: "pointer" }}>
        <span style={{ color: "#333", fontSize: 12, fontFamily: "Tahoma, sans-serif", marginBottom: 26, opacity: 0.7 }}>It is now safe to turn off your computer. Click to power on.</span>
      </div>
    );
  }

  if (power === "shutting-down") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "linear-gradient(180deg,#5A7EDC 0%,#3F63C8 100%)", zIndex: 99999, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: "34%", minHeight: 90, background: "linear-gradient(180deg,#0A246A 0%,#0831D9 60%,#4A82F5 100%)", borderBottom: "2px solid #C7DDFF", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 22 }}>
          <img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 130, filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.26))" }} />
          <span style={{ fontSize: 24, color: "#FFF", fontFamily: "Tahoma, sans-serif" }}>Windows is shutting down...</span>
        </div>
        <div style={{ height: "34%", minHeight: 90, background: "linear-gradient(90deg,#3833AC,#00309C)", borderTop: "2px solid #F7963C", flexShrink: 0 }} />
      </div>
    );
  }

  if (step === "loading") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#000", color: "#F4F4F4", fontFamily: "Arial,Helvetica,sans-serif", zIndex: 9999, display: "flex", flexDirection: "column" }}>
        <div style={{ position: "absolute", left: "50%", top: "50%", transform: "translate(-50%,-50%)", width: "min(420px,78vw)", textAlign: "center" }}>
          <img src={assetUrl("assets/images/xp-loading-logo.jpg")} alt="" style={{ width: "100%", maxWidth: 400 }} />
          <div className="xp-loader"><div /><div /><div /></div>
        </div>
        <div style={{ position: "absolute", left: 24, right: 24, bottom: 22, display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <p style={{ margin: 0, fontSize: 14, color: "#F4F4F4" }}>Copyright &copy; Microsoft Corporation</p>
          <img src={assetUrl("assets/images/xp-loading-mslogo.jpg")} alt="" style={{ width: 120 }} />
        </div>
      </div>
    );
  }

  if (step === "login") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#5A7EDC", color: "#FFF", zIndex: 9998, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: "18%", minHeight: 90, background: "linear-gradient(180deg,#0A246A 0%,#0831D9 55%,#4A82F5 100%)", borderBottom: "2px solid #C7DDFF", flexShrink: 0 }} />
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 34, padding: "22px 52px", background: "radial-gradient(circle at 7% 5%,#91B1EF 0,#7698E6 6%,#5A7EDC 13%,transparent 14%)" }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", paddingRight: 36, borderRight: "1px solid rgba(255,255,255,0.72)" }}>
            <img src={assetUrl("assets/images/xp-logo.png")} alt="Windows XP" style={{ width: "min(430px,100%)", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.26))" }} />
            <p style={{ margin: "14px 10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.9)" }}>To begin, click your user name</p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <button
              onClick={doLogin}
              style={{ background: "transparent", border: "1px solid transparent", padding: "5px 10px 5px 5px", borderRadius: 4, color: "#FFF", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", minWidth: 340, fontFamily: "inherit", fontSize: 15 }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
            >
              <div style={{ width: 64, height: 64, border: "2px solid rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden", background: "#2a3a4a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <img src={assetUrl("assets/images/user.png")} alt="" style={{ width: 64, height: 64 }} />
              </div>
              <span style={{ fontWeight: 700 }}>XP User</span>
            </button>
          </div>
        </div>
        <div style={{ height: 2, background: "linear-gradient(90deg,#00309C,#F7963C,#00309C)", flexShrink: 0 }} />
        <div style={{ height: "18%", minHeight: 90, background: "linear-gradient(90deg,#3833ac,#00309c)", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
          <button onClick={doLogin} style={{ display: "flex", alignItems: "center", gap: 8, color: "#FFF", background: "none", border: "none", cursor: "pointer", fontSize: 12, fontFamily: "inherit" }}>
            <img src={assetUrl("assets/icons/Power.png")} alt="" style={{ width: 16, height: 16 }} />
            Turn Off Computer
          </button>
        </div>
      </div>
    );
  }

  if (step === "welcome") {
    return (
      <div style={{ position: "fixed", inset: 0, background: "#5A7EDC", zIndex: 9998, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        <div style={{ height: 70, background: "#00309C", flexShrink: 0 }} />
        <div style={{ height: 2, background: "linear-gradient(45deg,#466dcd,#c7ddff,#b0c9f7,#5a7edc)", flexShrink: 0 }} />
        <div style={{ flex: 1, background: "radial-gradient(circle at 5% 5%,#91b1ef 0,#7698e6 6%,#5a7edc 12%)", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 42, color: "#FFF", fontStyle: "italic", fontWeight: "bold" }}>Welcome</span>
        </div>
        <div style={{ height: 2, background: "linear-gradient(45deg,#003399,#f99736,#c2814d,#00309c)", flexShrink: 0 }} />
        <div style={{ height: 70, width: "100%", background: "linear-gradient(90deg,#3833ac,#00309c)", flexShrink: 0 }} />
      </div>
    );
  }

  return <Desktop />;
}
