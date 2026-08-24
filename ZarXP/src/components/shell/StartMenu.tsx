import { useState } from "react";
import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"

const PINNED: { id: AppId; label: string; sub: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet", sub: "Internet Explorer", icon: "InternetExplorer6.png" },
  { id: "outlook-express", label: "E-mail", sub: "Outlook Express", icon: "OutlookExpress.png" },
];

const RECENT: { id: AppId; label: string; sub: string; icon: string }[] = [
  { id: "tour-xp", label: "Tour Windows XP", sub: "", icon: "TourXP.png" },
  { id: "msn-messenger", label: "Windows Messenger", sub: "", icon: "WindowsMessenger.png" },
  { id: "media-player", label: "Windows Media Player", sub: "", icon: "WindowsMediaPlayer10.png" },
  { id: "wordpad", label: "Wordpad", sub: "", icon: "Wordpad.png" },
  { id: "paint", label: "Paint", sub: "", icon: "Paint.png" },
];

const RIGHT_PRIMARY: { id: AppId; label: string; icon: string; bold?: boolean }[] = [
  { id: "my-documents", label: "My Documents", icon: "MyDocuments.png", bold: true },
  { id: "my-pictures", label: "My Pictures", icon: "MyPictures.png", bold: true },
  { id: "my-music", label: "My Music", icon: "MyMusic.png", bold: true },
  { id: "my-videos", label: "My Videos", icon: "MyVideos.png", bold: true },
  { id: "my-computer", label: "My Computer", icon: "MyComputer.png", bold: true },
];

const RIGHT_SECONDARY: { id: AppId; label: string; icon: string }[] = [
  { id: "control-panel", label: "Control Panel", icon: "ControlPanel.png" },
  { id: "settings", label: "Set Program Access and Defaults", icon: "DefaultPrograms.png" },
  { id: "system-properties", label: "Help and Support", icon: "HelpandSupport.png" },
  { id: "search", label: "Search", icon: "Search.png" },
  { id: "run", label: "Run...", icon: "Run.png" },
];

const ALL_PROGRAMS: { id: AppId; label: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet Explorer", icon: "InternetExplorer6.png" },
  { id: "outlook-express", label: "Outlook Express", icon: "OutlookExpress.png" },
  { id: "msn-messenger", label: "Windows Messenger", icon: "WindowsMessenger.png" },
  { id: "notepad", label: "Notepad", icon: "Notepad.png" },
  { id: "wordpad", label: "Wordpad", icon: "Wordpad.png" },
  { id: "paint", label: "Paint", icon: "Paint.png" },
  { id: "calculator", label: "Calculator", icon: "Calculator.png" },
  { id: "media-player", label: "Windows Media Player", icon: "WindowsMediaPlayer10.png" },
  { id: "terminal", label: "Command Prompt", icon: "CommandPrompt.png" },
  { id: "explorer", label: "Windows Explorer", icon: "Explorer.png" },
  { id: "task-manager", label: "Windows Task Manager", icon: "TaskManager.png" },
  { id: "tour-xp", label: "Tour Windows XP", icon: "TourXP.png" },
  { id: "solitaire", label: "Solitaire", icon: "Solitaire.png" },
  { id: "minesweeper", label: "Minesweeper", icon: "Minesweeper.png" },
];

function PinnedItem({ item, onOpen, bold }: { item: { id: AppId; label: string; sub: string; icon: string }; onOpen: (id: AppId) => void; bold?: boolean }) {
  return (
    <div
      className="start-pinned-item"
      onClick={() => onOpen(item.id)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", cursor: "pointer", borderRadius: 2 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#2F71CD"; e.currentTarget.style.color = "#FFF"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
    >
      <img src={assetUrl(`assets/icons/${item.icon}`)} alt="" style={{ width: 30, height: 30, flexShrink: 0 }} />
      <div style={{ display: "flex", flexDirection: "column", lineHeight: 1.2, overflow: "hidden" }}>
        <span style={{ fontSize: 12, fontWeight: "bold" }}>{item.label}</span>
        {item.sub && <span style={{ fontSize: 11, opacity: 0.85 }}>{item.sub}</span>}
      </div>
      {bold && null}
    </div>
  );
}

function RightItem({ item, onOpen }: { item: { id: AppId; label: string; icon: string; bold?: boolean }; onOpen: (id: AppId) => void }) {
  return (
    <div
      className="start-right-item"
      onClick={() => onOpen(item.id)}
      style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 10px", cursor: "pointer", borderRadius: 2 }}
      onMouseEnter={(e) => { e.currentTarget.style.background = "#2F71CD"; e.currentTarget.style.color = "#FFF"; }}
      onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#00136B"; }}
    >
      <img src={assetUrl(`assets/icons/${item.icon}`)} alt="" style={{ width: 24, height: 24, flexShrink: 0 }} />
      <span style={{ fontSize: 11, color: "#00136B", fontWeight: item.bold ? "bold" : "normal" }}>{item.label}</span>
    </div>
  );
}

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
        width: 386,
        background: "#ECE9D8",
        borderTop: "none",
        zIndex: 999,
        boxShadow: "2px -2px 6px rgba(0,0,0,0.3)",
        display: "flex",
        flexDirection: "column",
        border: "1px solid #0831D9"
      }}
    >
      <div style={{ height: 66, background: "linear-gradient(180deg,#1F68D6 0%,#3B82E4 40%,#2E71DC 70%,#1C5FC8 100%)", display: "flex", alignItems: "center", gap: 8, padding: "0 10px", flexShrink: 0, borderBottom: "2px solid #EF8B3B" }}>
        <div style={{ width: 46, height: 46, border: "2px solid rgba(255,255,255,0.8)", borderRadius: 4, overflow: "hidden", background: "#FFF", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <img src={assetUrl("assets/images/user.png")} alt="" style={{ width: 44, height: 44 }} />
        </div>
        <span style={{ fontSize: 15, color: "#FFF", fontFamily: "'Franklin Gothic Medium', Tahoma, sans-serif", textShadow: "1px 1px 2px rgba(0,0,0,0.5)" }}>XP User</span>
      </div>
      <div style={{ display: "flex", flexDirection: "row", flex: 1, minHeight: 330 }}>
        <div style={{ width: "49%", display: "flex", flexDirection: "column", padding: 4, background: "#FFF", borderRight: "1px solid #B8B6A4" }}>
          {PINNED.map((item) => <PinnedItem key={item.id} item={item} onOpen={handleOpen} />)}
          <div style={{ borderTop: "1px solid #C9C7B4", margin: "3px 6px" }} />
          {RECENT.map((item) => <PinnedItem key={item.id} item={item} onOpen={handleOpen} />)}
          <div style={{ flex: 1 }} />
          <div style={{ borderTop: "1px solid #C9C7B4", margin: "3px 6px" }} />
          <div
            className="start-item"
            onClick={(e) => { e.stopPropagation(); setAllPrograms((v) => !v); }}
            style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "5px 8px", fontSize: 12, fontWeight: "bold", cursor: "pointer",
              borderRadius: 2, position: "relative"
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = "#2F71CD"; e.currentTarget.style.color = "#FFF"; }}
            onMouseLeave={(e) => { e.currentTarget.style.background = allPrograms ? "#2F71CD" : "transparent"; e.currentTarget.style.color = allPrograms ? "#FFF" : "#000"; }}
          >
            <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={assetUrl("assets/icons/Programs.png")} alt="" style={{ width: 26, height: 26 }} />
              All Programs
            </span>
            <span style={{ display: "inline-flex", width: 16, height: 16, background: "linear-gradient(180deg,#6DD46A 0%,#2E9E2E 100%)", borderRadius: 3, alignItems: "center", justifyContent: "center", color: "#FFF", fontSize: 9, boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)" }}>&#9654;</span>
            {allPrograms && (
              <div
                style={{
                  position: "absolute", left: "100%", bottom: -4, width: 235, maxHeight: 360, overflowY: "auto",
                  background: "#FFF", border: "1px solid #7F9DB9", boxShadow: "3px 3px 6px rgba(0,0,0,0.3)",
                  padding: 3, zIndex: 1001, color: "#000", fontWeight: "normal"
                }}
                onClick={(e) => e.stopPropagation()}
              >
                {ALL_PROGRAMS.map((app) => (
                  <div
                    key={app.id}
                    className="allprog-item"
                    onClick={(e) => { e.stopPropagation(); handleOpen(app.id); }}
                    style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 8px", fontSize: 11, cursor: "pointer", borderRadius: 2 }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "#2F71CD"; e.currentTarget.style.color = "#FFF"; }}
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
        <div style={{ width: "51%", display: "flex", flexDirection: "column", padding: "6px 0", background: "#D3E5FA" }}>
          {RIGHT_PRIMARY.map((item) => <RightItem key={item.id} item={item} onOpen={handleOpen} />)}
          <div style={{ borderTop: "1px solid #B8CFEC", margin: "4px 8px" }} />
          {RIGHT_SECONDARY.map((item) => <RightItem key={item.id} item={item} onOpen={handleOpen} />)}
        </div>
      </div>
      <div style={{ height: 42, background: "linear-gradient(180deg,#2E7DD6 0%,#1F66C8 50%,#1A5CBB 100%)", display: "flex", alignItems: "center", justifyContent: "flex-end", padding: "0 10px", gap: 6, flexShrink: 0 }}>
        <button
          className="start-footer-btn"
          onClick={() => handleOpen("shutdown")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "none", border: "none", color: "#FFF", fontSize: 11, cursor: "pointer", fontFamily: "Tahoma, sans-serif", borderRadius: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <img src={assetUrl("assets/icons/LogOff.png")} alt="" style={{ width: 20, height: 20 }} />
          <span>Log Off</span>
        </button>
        <button
          className="start-footer-btn"
          onClick={() => handleOpen("shutdown")}
          style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 10px", background: "none", border: "none", color: "#FFF", fontSize: 11, cursor: "pointer", fontFamily: "Tahoma, sans-serif", borderRadius: 2 }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "rgba(255,255,255,0.2)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "none"; }}
        >
          <img src={assetUrl("assets/icons/Power.png")} alt="" style={{ width: 20, height: 20 }} />
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
}
