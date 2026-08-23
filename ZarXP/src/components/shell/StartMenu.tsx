import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";

const LEFT_ITEMS: { id: AppId; label: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet Explorer", icon: "InternetExplorer6.png" },
  { id: "notepad", label: "Notepad", icon: "Notepad.png" },
  { id: "paint", label: "Paint", icon: "Paint.png" },
  { id: "calculator", label: "Calculator", icon: "Calculator.png" },
  { id: "media-player", label: "Windows Media Player", icon: "WindowsMediaPlayer10.png" },
  { id: "terminal", label: "Command Prompt", icon: "CommandPrompt.png" },
  { id: "solitaire", label: "Solitaire", icon: "Solitaire.png" },
  { id: "minesweeper", label: "Minesweeper", icon: "Minesweeper.png" },
];

const RIGHT_ITEMS: { id: AppId; label: string; icon: string }[] = [
  { id: "my-documents", label: "My Documents", icon: "MyDocuments.png" },
  { id: "my-computer", label: "My Computer", icon: "MyComputer.png" },
  { id: "network-places", label: "My Network Places", icon: "MyNetworkPlaces.png" },
  { id: "control-panel", label: "Control Panel", icon: "ControlPanel.png" },
  { id: "search", label: "Search", icon: "Search.png" },
  { id: "run", label: "Run...", icon: "Run.png" },
];

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const handleOpen = (id: AppId) => { playSound("Windows XP Menu Command.wav", 0.15); onOpen(id); };
  return (
    <div 
      className="start-menu" 
      onClick={(e) => e.stopPropagation()}
      style={{
        position: "fixed",
        bottom: 30,
        left: 0,
        width: 380,
        background: "#ECE9D8",
        border: "2px solid #0A246A",
        borderTop: "none",
        zIndex: 999,
        boxShadow: "2px -2px 5px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column"
      }}
    >
      <div style={{ height: 3, background: "linear-gradient(90deg, #0A246A, #1E4DB5, #3A72F0, #4A82F5, #2B6EEA, #0A4FC6, #063BA4)", flexShrink: 0 }} />
      <div style={{ height: 63, background: "linear-gradient(180deg,#1868CE 0%,#4791EB 50%,#2777DD 100%)", display: "flex", alignItems: "center", gap: 10, padding: "0 12px" }}>
        <img src="/assets/images/user.png" alt="" style={{ width: 48, height: 48, borderRadius: 4 }} />
        <span style={{ fontSize: 16, color: "#FFF", fontFamily: "'XP Font Bold',Tahoma,sans-serif" }}>XP User</span>
      </div>
      <div style={{ height: 2, background: "linear-gradient(to right,transparent,#DA884A,transparent)", flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "row", flex: 1, minHeight: 300 }}>
        <div style={{ width: "50%", display: "flex", flexDirection: "column", padding: 4, background: "#FFF" }}>
          {LEFT_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="start-item" 
              onClick={() => handleOpen(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "4px 8px",
                fontSize: 12,
                cursor: "pointer",
                borderRadius: 2
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1E4DB5"; e.currentTarget.style.color = "#FFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "initial"; }}
            >
              <img src={`/assets/icons/${item.icon}`} alt="" style={{ width: 24, height: 24 }} />
              <span className="start-item-text">{item.label}</span>
            </div>
          ))}
        </div>
        <div style={{ width: "50%", display: "flex", flexDirection: "column", padding: "4px 0", background: "#D4D0C8" }}>
          {RIGHT_ITEMS.map((item) => (
            <div 
              key={item.id} 
              className="start-right-item" 
              onClick={() => handleOpen(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 8px",
                fontSize: 11,
                cursor: "pointer"
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#1E4DB5"; e.currentTarget.style.color = "#FFF"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "initial"; }}
            >
              <img src={`/assets/icons/${item.icon}`} alt="" style={{ width: 20, height: 20 }} />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ height: 40, background: "linear-gradient(180deg,#0D4FC6 0%,#197AE0 30%,#1D7DE8 60%,#1576D8 100%)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 8px", gap: 4, flexShrink: 0 }}>
        <button 
          className="start-footer-btn" 
          onClick={() => handleOpen("shutdown")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            background: "none",
            border: "none",
            color: "#FFF",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'XP Font', Tahoma, sans-serif",
            borderRadius: 2
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <img src="/assets/icons/LogOff.png" alt="" style={{ width: 16, height: 16 }} />
          <span>Log Off</span>
        </button>
        <button 
          className="start-footer-btn" 
          onClick={() => handleOpen("shutdown")}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            padding: "2px 8px",
            background: "none",
            border: "none",
            color: "#FFF",
            fontSize: 11,
            cursor: "pointer",
            fontFamily: "'XP Font', Tahoma, sans-serif",
            borderRadius: 2
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <img src="/assets/icons/Power.png" alt="" style={{ width: 16, height: 16 }} />
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
}
