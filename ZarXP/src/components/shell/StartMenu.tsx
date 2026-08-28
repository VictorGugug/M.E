import { useState } from "react";
import type { AppId } from "../../types";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets";
import { useUserStore } from "../../store/userStore";
import { useLangStore } from "../../store/langStore";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

interface MenuItem {
  id?: AppId;
  label: string;
  icon: string;
  children?: MenuItem[];
}

export default function StartMenu({ onOpen }: { onOpen: (id: AppId) => void }) {
  const [allPrograms, setAllPrograms] = useState(false);
  const [activeSubmenu, setActiveSubmenu] = useState<string | null>(null);
  const userName = useUserStore((s) => s.userName);
  const userPicture = useUserStore((s) => s.userPicture);
  const t = useLangStore((s) => s.t);
  const lang = useLangStore((s) => s.lang);

  const handleOpen = (id: AppId) => {
    playSound("Windows XP Menu Command.wav", 0.15);
    onOpen(id);
  };

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
    { id: "settings" as AppId, label: t("setProgramAccess"), icon: `${OL}/interface/programs/defaults.png` },
    { id: "system-properties" as AppId, label: t("helpAndSupport"), icon: `${OL}/icon/help.png` },
    { id: "search" as AppId, label: t("search"), icon: `${OL}/icon/search.png` },
    { id: "run" as AppId, label: t("run"), icon: `${OL}/icon/run.png` },
  ];

  const programsTree: MenuItem[] = [
    {
      label: lang === "es" ? "Accesorios" : "Accessories",
      icon: `${OL}/icon/folder/closed.png`,
      children: [
        { id: "calculator", label: lang === "es" ? "Calculadora" : "Calculator", icon: `${OL}/icon/calculator.png` },
        { id: "terminal", label: lang === "es" ? "Simbolo del sistema" : "Command Prompt", icon: `${OL}/icon/command.png` },
        { id: "notepad", label: lang === "es" ? "Bloc de notas" : "Notepad", icon: `${OL}/icon/notepad.png` },
        { id: "paint", label: t("paint"), icon: `${OL}/icon/paint.png` },
        { id: "wordpad", label: t("wordpad"), icon: `${OL}/icon/wordpad.png` },
        { id: "explorer", label: lang === "es" ? "Explorador de Windows" : "Windows Explorer", icon: `${OL}/icon/folder/closed.png` },
      ],
    },
    {
      label: lang === "es" ? "Juegos" : "Games",
      icon: `${OL}/icon/folder/closed.png`,
      children: [
        { id: "minesweeper", label: lang === "es" ? "Buscaminas" : "Minesweeper", icon: `${OL}/icon/minesweeper.png` },
        { id: "solitaire", label: lang === "es" ? "Solitario" : "Solitaire", icon: `${OL}/icon/solitaire.png` },
      ],
    },
    {
      label: lang === "es" ? "Inicio" : "Startup",
      icon: `${OL}/icon/folder/closed.png`,
      children: [
        { label: lang === "es" ? "(Vacio)" : "(Empty)", icon: `${OL}/icon/folder/closed.png` },
      ],
    },
    { id: "internet-explorer", label: t("internetExplorer"), icon: `${OL}/icon/internet.png` },
    { id: "outlook-express", label: "Outlook Express", icon: `${OL}/icon/outlook.png` },
    { id: "msn-messenger", label: t("messenger"), icon: `${OL}/icon/messenger.png` },
    { id: "media-player", label: t("mediaPlayer"), icon: `${OL}/icon/player.png` },
    { id: "tour-xp", label: t("tour"), icon: `${OL}/icon/tour.png` },
    { id: "user-accounts", label: t("userAccountsCat"), icon: `${IC}/UserAccounts.png` },
    { id: "security-center", label: t("securityCenterCat"), icon: `${IC}/SecurityCenter.png` },
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
                style={{ padding: "5px 4px", display: "flex", alignItems: "center", justifyContent: "space-between" }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img className="image32" src={`${OL}/icon/programs.png`} alt="" />
                  <span className="label" style={{ fontWeight: "bold", fontSize: 11 }}>{t("allPrograms")}</span>
                </div>
                <span className="arrow" />
              </button>
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

      {allPrograms && (
        <ul
          className="menu"
          style={{
            position: "absolute",
            left: "100%",
            bottom: 40,
            background: "#FFF",
            border: "1px solid rgb(45,124,226)",
            borderLeft: "4px solid rgb(45,124,226)",
            width: 190,
            zIndex: 9999,
            boxShadow: "2px 2px 5px rgba(0,0,0,0.5)",
            listStyle: "none",
            margin: 0,
            padding: "2px 0",
            maxHeight: 420,
            overflowY: "auto"
          }}
          onMouseLeave={() => { setAllPrograms(false); setActiveSubmenu(null); }}
        >
          {programsTree.map((item) => (
            <li
              key={item.label}
              onMouseEnter={() => setActiveSubmenu(item.children ? item.label : null)}
              onClick={(e) => {
                e.stopPropagation();
                if (item.id) {
                  handleOpen(item.id);
                  setAllPrograms(false);
                }
              }}
              style={{
                display: "flex",
                alignItems: "center",
                padding: "3px 8px",
                whiteSpace: "nowrap",
                position: "relative",
                fontSize: 11,
                cursor: "pointer",
                gap: 5
              }}
              onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#FFF"; }}
              onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
            >
              <img src={item.icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.children && <span style={{ fontSize: 9, marginLeft: "auto" }}>&#9658;</span>}

              {item.children && activeSubmenu === item.label && (
                <ul
                  className="menu"
                  style={{
                    position: "absolute",
                    left: "100%",
                    top: -4,
                    minWidth: 165,
                    background: "#FFF",
                    border: "1px solid rgb(45,124,226)",
                    borderLeft: "4px solid rgb(45,124,226)",
                    boxShadow: "2px 2px 5px rgba(0,0,0,0.5)",
                    listStyle: "none",
                    margin: 0,
                    padding: "2px 0",
                    zIndex: 10000
                  }}
                >
                  {item.children.map((child) => (
                    <li
                      key={child.label}
                      onClick={(e) => {
                        e.stopPropagation();
                        if (child.id) {
                          handleOpen(child.id);
                          setAllPrograms(false);
                        }
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "3px 8px",
                        whiteSpace: "nowrap",
                        fontSize: 11,
                        cursor: "pointer",
                        gap: 5,
                        color: "#000"
                      }}
                      onMouseOver={(e: React.MouseEvent<HTMLLIElement>) => { e.currentTarget.style.background = "#316AC5"; e.currentTarget.style.color = "#FFF"; }}
                      onMouseOut={(e: React.MouseEvent<HTMLLIElement>) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#000"; }}
                    >
                      <img src={child.icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
                      <span>{child.label}</span>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
