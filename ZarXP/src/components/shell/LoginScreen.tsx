import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";

export default function LoginScreen() {
  const { bootPhase, setBootPhase } = useWindowStore();
  const [showWelcome, setShowWelcome] = useState(false);

  useEffect(() => {
    if (bootPhase !== "login") return;
    const audio = new Audio("/assets/sounds/Windows XP Startup.wav");
    audio.volume = 0.5;
    audio.play().catch(() => {});
  }, [bootPhase]);

  const handleLogin = () => {
    setShowWelcome(true);
    setTimeout(() => setBootPhase("desktop"), 3000);
  };

  if (bootPhase !== "login" && bootPhase !== "welcome") return null;

  if (showWelcome || bootPhase === "welcome") {
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

  return (
    <div style={{ position: "fixed", inset: 0, background: "#5A7EDC", color: "#FFF", zIndex: 9998, display: "flex", flexDirection: "column", overflow: "hidden" }}>
      <div style={{ height: 70, background: "#00309C", borderBottom: "2px solid #C7DDFF", flexShrink: 0 }} />
      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 34, padding: "22px 52px", background: "radial-gradient(circle at 7% 5%,#91B1EF 0,#7698E6 6%,#5A7EDC 13%,transparent 14%)" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", justifyContent: "center", paddingRight: 36, borderRight: "1px solid rgba(255,255,255,0.72)" }}>
          <img src="/assets/images/xp-logo.png" alt="Windows XP" style={{ width: "min(430px,100%)", filter: "drop-shadow(0 2px 2px rgba(0,0,0,0.26))" }} />
          <p style={{ margin: "14px 10px 0 0", fontSize: 12, color: "rgba(255,255,255,0.9)" }}>To begin, click your user name</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button
            onClick={handleLogin}
            style={{ background: "transparent", border: "1px solid transparent", padding: "5px 10px 5px 5px", borderRadius: 4, color: "#FFF", display: "flex", alignItems: "center", gap: 12, cursor: "pointer", minWidth: 340 }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.1)"; e.currentTarget.style.borderColor = "rgba(255,255,255,0.28)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
          >
            <div style={{ width: 64, height: 64, border: "2px solid rgba(255,255,255,0.25)", borderRadius: 4, overflow: "hidden", background: "#2a3a4a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <img src="/assets/images/user.png" alt="" style={{ width: 64, height: 64 }} />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700 }}>XP User</span>
          </button>
        </div>
      </div>
      <div style={{ height: 70, background: "linear-gradient(90deg,#3833ac,#00309c)", flexShrink: 0, display: "flex", alignItems: "center", padding: "0 20px", gap: 16 }}>
        <button onClick={handleLogin} style={{ display: "flex", alignItems: "center", gap: 8, color: "#FFF", background: "none", border: "none", cursor: "pointer", fontSize: 12 }}>
          <img src="/assets/icons/Power.png" alt="" style={{ width: 16, height: 16 }} />
          Turn Off Computer
        </button>
      </div>
    </div>
  );
}
