import { useState } from "react";
import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"

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
  { id: "display-properties", label: "Printers and Faxes", icon: "PrintersandFaxes.png" },
  { id: "system-properties", label: "Help and Support", icon: "HelpandSupport.png" },
  { id: "search", label: "Search", icon: "Search.png" },
  { id: "run", label: "Run...", icon: "Run.png" },
];

const ALL_PROGRAMS: { id: AppId; label: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet Explorer", icon: "InternetExplorer6.png" },
  { id: "notepad", label: "Notepad", icon: "Notepad.png" },
  { id: "paint", label: "Paint", icon: "Paint.png" },
  { id: "calculator", label: "Calculator", icon: "Calculator.png" },
  { id: "media-player", label: "Windows Media Player", icon: "WindowsMediaPlayer10.png" },
  { id: "terminal", label: "Command Prompt", icon: "CommandPrompt.png" },
  { id: "explorer", label: "Windows Explorer", icon: "Explorer.png" },
  { id: "task-manager", label: "Windows Task Manager", icon: "TaskManager.png" },
  { id: "solitaire", label: "Solitaire", icon: "Solitaire.png" },
  { id: "minesweeper", label: "Minesweeper", icon: "Minesweeper.png" },
  { id: "system-properties", label: "System Properties", icon: "SystemProperties.png" },
  { id: "display-properties", label: "Display Properties", icon: "DisplayProperties.png" },
  { id: "date-time", label: "Date and Time", icon: "DateandTime.png" },
  { id: "volume", label: "Volume Control", icon: "Volume.png" },
];

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [allPrograms, setAllPrograms] = useState(false);
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
        <img src={assetUrl("assets/images/user.png")} alt="" style={{ width: 48, height: 48, borderRadius: 4 }} />
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
              <img src={assetUrl(`assets/icons/${item.icon}`)} alt="" style={{ width: 24, height: 24 }} />
              <span className="start-item-text">{item.label}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #C9C7B4", margin: "3px 4px" }} />
          <div
            className="start-item"
            onClick={(e) => { e.stopPropagation(); setAllPrograms((v) => !v); }}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              padding: "5px 8px",
              fontSize: 12,
              fontWeight: "bold",
              cursor: "pointer",
              borderRadius: 2,
              position: "relative"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#1E4DB5"; e.currentTarget.style.color = "#FFF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = allPrograms ? "#1E4DB5" : "transparent"; e.currentTarget.style.color = allPrograms ? "#FFF" : "initial"; }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={assetUrl("assets/icons/Programs.png")} alt="" style={{ width: 24, height: 24 }} />
              All Programs
            </span>
            <span style={{ fontSize: 10 }}>&#9654;</span>
            {allPrograms && (
              <div
                style={{
                  position: "absolute",
                  left: "100%",
                  bottom: -4,
                  width: 230,
                  maxHeight: 340,
                  overflowY: "auto",
                  background: "#FFF",
                  border: "1px solid #7F9DB9",
                  boxShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                  padding: 3,
                  zIndex: 1001,
                  color: "#000",
                  fontWeight: "normal"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {ALL_PROGRAMS.map((app) => (
                  <div
                    key={app.id}
                    className="allprog-item"
                    onClick={(e) => { e.stopPropagation(); handleOpen(app.id); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", fontSize: 11, cursor: "pointer", borderRadius: 2 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#1E4DB5"; e.currentTarget.style.color = "#FFF"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
                  >
                    <img src={assetUrl(`assets/icons/${app.icon}`)} alt="" style={{ width: 20, height: 20 }} />
                    <span>{app.label}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
              <img src={assetUrl(`assets/icons/${item.icon}`)} alt="" style={{ width: 20, height: 20 }} />
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
          <img src={assetUrl("assets/icons/LogOff.png")} alt="" style={{ width: 16, height: 16 }} />
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
          <img src={assetUrl("assets/icons/Power.png")} alt="" style={{ width: 16, height: 16 }} />
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
}
