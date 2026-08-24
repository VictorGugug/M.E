import { useState } from "react";
import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"
import { useUserStore } from "../../store/userStore"
import { useLangStore } from "../../store/langStore"

const OL = assetUrl("assets/xpui");

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [allPrograms, setAllPrograms] = useState(false);
  const userName = useUserStore((s) => s.userName);
  const userPicture = useUserStore((s) => s.userPicture);
  const t = useLangStore((s) => s.t);
  const handleOpen = (id: AppId) => { playSound("Windows XP Menu Command.wav", 0.15); onOpen(id); };

  const pinned = [
    { id: "internet-explorer" as AppId, label: t("internet"), sub: t("internetExplorer"), icon: `${OL}/icon/internet.png` },
    { id: "outlook-express" as AppId, label: t("email"), sub: "Outlook Express", icon: `${OL}/icon/outlook.png` },
  ];
  const recent = [
    { id: "tour-xp" as AppId, label: t("tour"), sub: "", icon: `${OL}/icon/tour.png` },
    { id: "msn-messenger" as AppId, label: t("messenger"), sub: "", icon: `${OL}/icon/messenger.png` },
    { id: "media-player" as AppId, label: t("mediaPlayer"), sub: "", icon: `${OL}/icon/player.png` },
    { id: "internet-explorer" as AppId, label: t("publicForum"), sub: "", icon: `${OL}/icon/forum.png` },
    { id: "wordpad" as AppId, label: t("wordpad"), sub: "", icon: `${OL}/icon/wordpad.png` },
    { id: "paint" as AppId, label: t("paint"), sub: "", icon: `${OL}/icon/paint.png` },
  ];
  const rightPrimary = [
    { id: "my-documents" as AppId, label: t("myDocuments"), icon: `${OL}/icon/folder/documents.png`, bold: true },
    { id: "my-pictures" as AppId, label: t("myPictures"), icon: `${OL}/icon/folder/pictures.png`, bold: true },
    { id: "my-music" as AppId, label: t("myMusic"), icon: `${OL}/icon/folder/music.png`, bold: true },
    { id: "my-videos" as AppId, label: t("myVideos"), icon: `${OL}/icon/folder/videos.png`, bold: true },
    { id: "my-computer" as AppId, label: t("myComputer"), icon: `${OL}/icon/computer.png`, bold: true },
  ];
  const rightSecondary = [
    { id: "control-panel" as AppId, label: t("controlPanel"), icon: `${OL}/icon/folder/control.png` },
    { id: "regional-options" as AppId, label: t("regionalOptions"), icon: `${assetUrl("assets/icons/RegionalSettings.png")}` },
    { id: "settings" as AppId, label: t("setProgramAccess"), icon: `${OL}/interface/programs/defaults.png` },
    { id: "system-properties" as AppId, label: t("helpAndSupport"), icon: `${OL}/icon/help.png` },
    { id: "search" as AppId, label: t("search"), icon: `${OL}/icon/search.png` },
    { id: "run" as AppId, label: t("run"), icon: `${OL}/icon/run.png` },
  ];
  const allProgramsList = [
    { id: "internet-explorer" as AppId, label: t("internetExplorer"), icon: `${OL}/icon/internet.png` },
    { id: "outlook-express" as AppId, label: "Outlook Express", icon: `${OL}/icon/outlook.png` },
    { id: "msn-messenger" as AppId, label: t("messenger"), icon: `${OL}/icon/messenger.png` },
    { id: "notepad" as AppId, label: "Notepad", icon: `${OL}/icon/notepad.png` },
    { id: "wordpad" as AppId, label: t("wordpad"), icon: `${OL}/icon/wordpad.png` },
    { id: "paint" as AppId, label: t("paint"), icon: `${OL}/icon/paint.png` },
    { id: "calculator" as AppId, label: "Calculator", icon: `${OL}/icon/calculator.png` },
    { id: "media-player" as AppId, label: t("mediaPlayer"), icon: `${OL}/icon/player.png` },
    { id: "terminal" as AppId, label: "Command Prompt", icon: `${OL}/icon/command.png` },
    { id: "explorer" as AppId, label: "Windows Explorer", icon: `${OL}/icon/folder/closed.png` },
    { id: "task-manager" as AppId, label: "Windows Task Manager", icon: `${OL}/icon/about.png` },
    { id: "tour-xp" as AppId, label: t("tour"), icon: `${OL}/icon/tour.png` },
    { id: "user-accounts" as AppId, label: "User Accounts", icon: `${assetUrl("assets/icons/UserAccounts.png")}` },
    { id: "regional-options" as AppId, label: t("regionalOptions"), icon: `${assetUrl("assets/icons/RegionalSettings.png")}` },
    { id: "solitaire" as AppId, label: "Solitaire", icon: `${OL}/icon/solitaire.png` },
    { id: "minesweeper" as AppId, label: "Minesweeper", icon: `${OL}/icon/minesweeper.png` },
  ];

  const SmButton = ({ item, size }: { item: { id: AppId; label: string; sub: string; icon: string }; size: 32 | 24 }) => (
    <button className="sm-button" onClick={() => handleOpen(item.id)}>
      <img className={size === 32 ? "image32" : "image24"} src={item.icon} alt="" />
      <span className="textcol">
        <span className="label">{item.label}</span>
        {item.sub && <span className="sublabel">{item.sub}</span>}
      </span>
    </button>
  );

  return (
    <div className="xp-startmenu" onClick={(e) => e.stopPropagation()}>
      <div className="sm-top sm-top-click" onClick={() => handleOpen("user-accounts")} title={userName}>
        <img className="user-picture" src={`${OL}/user/${userPicture}`} alt="" />
        <span className="user-name">{userName}</span>
      </div>
      <div className="sm-middle">
        <div className="sm-left">
          <div className="holder">
            {pinned.map((item) => <SmButton key={item.label} item={item} size={32} />)}
            <div className="sm-sep" />
            {recent.map((item) => <SmButton key={item.label} item={item} size={32} />)}
            <div style={{ flex: 1 }} />
            <div className="sm-sep" />
            <div className="sm-programs">
              <button
                className="sm-button"
                onClick={(e) => { e.stopPropagation(); setAllPrograms((v) => !v); }}
                onMouseEnter={() => setAllPrograms(true)}
              >
                <img className="image32" src={`${OL}/icon/programs.png`} alt="" />
                <span className="textcol"><span className="label">{t("allPrograms")}</span></span>
                <span className="arrow" />
              </button>
              {allPrograms && (
                <ul className="menu" onMouseLeave={() => setAllPrograms(false)}>
                  {allProgramsList.map((app) => (
                    <li key={app.label} onClick={(e) => { e.stopPropagation(); handleOpen(app.id); }}>
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
            {rightPrimary.map((item) => (
              <button key={item.id + item.label} className="sm-button" onClick={() => handleOpen(item.id)}>
                <img className="image24" src={item.icon} alt="" />
                <span className="textcol"><span className="label" style={item.bold ? { fontWeight: "bold" } : undefined}>{item.label}</span></span>
              </button>
            ))}
            <div className="sm-sep" />
            {rightSecondary.map((item) => (
              <button key={item.id + item.label} className="sm-button" onClick={() => handleOpen(item.id)}>
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
          <span>{t("logOff")}</span>
        </button>
        <button className="sm-bottom-btn" onClick={() => handleOpen("shutdown")}>
          <img src={`${OL}/icon/recovery.png`} alt="" />
          <span>{t("turnOff")}</span>
        </button>
      </div>
    </div>
  );
}
