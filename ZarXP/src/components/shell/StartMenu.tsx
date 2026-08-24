import { useState } from "react";
import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"
import { useUserStore } from "../../store/userStore"

const OL = assetUrl("assets/xpui");

const PINNED: { id: AppId; label: string; sub: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet", sub: "Internet Explorer", icon: `${OL}/icon/internet.png` },
  { id: "outlook-express", label: "E-mail", sub: "Outlook Express", icon: `${OL}/icon/outlook.png` },
];

const RECENT: { id: AppId; label: string; sub: string; icon: string }[] = [
  { id: "tour-xp", label: "Tour Windows XP", sub: "", icon: `${OL}/icon/tour.png` },
  { id: "msn-messenger", label: "Windows Messenger", sub: "", icon: `${OL}/icon/messenger.png` },
  { id: "media-player", label: "Windows Media Player", sub: "", icon: `${OL}/icon/player.png` },
  { id: "internet-explorer", label: "Public Forum", sub: "", icon: `${OL}/icon/forum.png` },
  { id: "wordpad", label: "Wordpad", sub: "", icon: `${OL}/icon/wordpad.png` },
  { id: "paint", label: "Paint", sub: "", icon: `${OL}/icon/paint.png` },
];

const RIGHT_PRIMARY: { id: AppId; label: string; icon: string; bold?: boolean }[] = [
  { id: "my-documents", label: "My Documents", icon: `${OL}/icon/folder/documents.png`, bold: true },
  { id: "my-pictures", label: "My Pictures", icon: `${OL}/icon/folder/pictures.png`, bold: true },
  { id: "my-music", label: "My Music", icon: `${OL}/icon/folder/music.png`, bold: true },
  { id: "my-videos", label: "My Videos", icon: `${OL}/icon/folder/videos.png`, bold: true },
  { id: "my-computer", label: "My Computer", icon: `${OL}/icon/computer.png`, bold: true },
];

const RIGHT_SECONDARY: { id: AppId; label: string; icon: string }[] = [
  { id: "control-panel", label: "Control Panel", icon: `${OL}/icon/folder/control.png` },
  { id: "settings", label: "Set Program Access and Defaults", icon: `${OL}/interface/programs/defaults.png` },
  { id: "system-properties", label: "Help And Support", icon: `${OL}/icon/help.png` },
  { id: "search", label: "Search", icon: `${OL}/icon/search.png` },
  { id: "run", label: "Run...", icon: `${OL}/icon/run.png` },
];

const ALL_PROGRAMS: { id: AppId; label: string; icon: string }[] = [
  { id: "internet-explorer", label: "Internet Explorer", icon: `${OL}/icon/internet.png` },
  { id: "outlook-express", label: "Outlook Express", icon: `${OL}/icon/outlook.png` },
  { id: "msn-messenger", label: "Windows Messenger", icon: `${OL}/icon/messenger.png` },
  { id: "notepad", label: "Notepad", icon: `${OL}/icon/notepad.png` },
  { id: "wordpad", label: "Wordpad", icon: `${OL}/icon/wordpad.png` },
  { id: "paint", label: "Paint", icon: `${OL}/icon/paint.png` },
  { id: "calculator", label: "Calculator", icon: `${OL}/icon/calculator.png` },
  { id: "media-player", label: "Windows Media Player", icon: `${OL}/icon/player.png` },
  { id: "terminal", label: "Command Prompt", icon: `${OL}/icon/command.png` },
  { id: "explorer", label: "Windows Explorer", icon: `${OL}/icon/folder/closed.png` },
  { id: "task-manager", label: "Windows Task Manager", icon: `${OL}/icon/about.png` },
  { id: "tour-xp", label: "Tour Windows XP", icon: `${OL}/icon/tour.png` },
  { id: "solitaire", label: "Solitaire", icon: `${OL}/icon/solitaire.png` },
  { id: "minesweeper", label: "Minesweeper", icon: `${OL}/icon/minesweeper.png` },
];

function SmButton({ item, onOpen, size }: { item: { id: AppId; label: string; sub: string; icon: string }; onOpen: (id: AppId) => void; size: 32 | 24 }) {
  return (
    <button className="sm-button" onClick={() => onOpen(item.id)}>
      <img className={size === 32 ? "image32" : "image24"} src={item.icon} alt="" />
      <span className="textcol">
        <span className="label">{item.label}</span>
        {item.sub && <span className="sublabel">{item.sub}</span>}
      </span>
    </button>
  );
}

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [allPrograms, setAllPrograms] = useState(false);
  const userName = useUserStore((s) => s.userName);
  const userPicture = useUserStore((s) => s.userPicture);
  const handleOpen = (id: AppId) => { playSound("Windows XP Menu Command.wav", 0.15); onOpen(id); };

  return (
    <div className="xp-startmenu" onClick={(e) => e.stopPropagation()}>
      <div className="sm-top">
        <img className="user-picture" src={`${OL}/user/${userPicture}`} alt="" />
        <span className="user-name">{userName}</span>
      </div>
      <div className="sm-middle">
        <div className="sm-left">
          <div className="holder">
            {PINNED.map((item) => <SmButton key={item.id} item={item} onOpen={handleOpen} size={32} />)}
            <div className="sm-sep" />
            {RECENT.map((item) => <SmButton key={item.id} item={item} onOpen={handleOpen} size={32} />)}
            <div style={{ flex: 1 }} />
            <div className="sm-sep" />
            <div className="sm-programs">
              <button
                className="sm-button"
                onClick={(e) => { e.stopPropagation(); setAllPrograms((v) => !v); }}
                onMouseEnter={() => setAllPrograms(true)}
              >
                <img className="image32" src={`${OL}/icon/programs.png`} alt="" />
                <span className="textcol"><span className="label">All Programs</span></span>
                <span className="arrow">&#9654;</span>
              </button>
              {allPrograms && (
                <ul className="menu" onMouseLeave={() => setAllPrograms(false)}>
                  {ALL_PROGRAMS.map((app) => (
                    <li key={app.id} onClick={(e) => { e.stopPropagation(); handleOpen(app.id); }}>
                      <img src={app.icon} alt="" />
                      {app.label}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
        <div className="sm-right">
          <div className="holder">
            {RIGHT_PRIMARY.map((item) => (
              <button key={item.id} className="sm-button" onClick={() => handleOpen(item.id)}>
                <img className="image24" src={item.icon} alt="" />
                <span className="textcol"><span className="label" style={item.bold ? { fontWeight: "bold" } : undefined}>{item.label}</span></span>
              </button>
            ))}
            <div className="sm-sep" />
            {RIGHT_SECONDARY.map((item) => (
              <button key={item.id} className="sm-button" onClick={() => handleOpen(item.id)}>
                <img className="image24" src={item.icon} alt="" />
                <span className="textcol"><span className="label">{item.label}</span></span>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="sm-bottom">
        <button className="sm-bottom-btn" onClick={() => handleOpen("shutdown")}>
          <img src={`${OL}/icon/logoff.png`} alt="" />
          <span>Log Off</span>
        </button>
        <button className="sm-bottom-btn" onClick={() => handleOpen("shutdown")}>
          <img src={`${OL}/icon/recovery.png`} alt="" />
          <span>Turn Off Computer</span>
        </button>
      </div>
    </div>
  );
}
