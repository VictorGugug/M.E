import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import type { AppId } from "../../types";

const IC = assetUrl("assets/icons");

interface CategoryDef {
  titleKey: "appearanceAndThemes" | "networkAndInternet" | "userAccountsCat" | "dateTimeRegional" | "soundsSpeechAudio" | "performanceMaintenance" | "securityCenterCat" | "administrativeTools";
  descKey: "appearanceAndThemesDesc" | "networkAndInternetDesc" | "userAccountsDesc" | "dateTimeRegionalDesc" | "soundsSpeechAudioDesc" | "performanceMaintenanceDesc" | "securityCenterDesc" | "administrativeToolsDesc";
  icon: string;
  app: AppId;
}

interface ClassicDef {
  titleKey: "dateAndTime" | "displayClassic" | "networkConnectionsClassic" | "regionalOptions" | "securityCenterClassic" | "soundsAudioClassic" | "systemClassic" | "taskManager" | "userAccountsCat";
  descKey: "dateAndTimeDesc" | "displayClassicDesc" | "networkConnectionsClassicDesc" | "regionalOptions" | "securityCenterClassicDesc" | "soundsAudioClassicDesc" | "systemClassicDesc" | "taskManager" | "userAccountsDesc";
  icon: string;
  app: AppId;
}

const CATEGORY_DEFS: CategoryDef[] = [
  { titleKey: "appearanceAndThemes", descKey: "appearanceAndThemesDesc", icon: `${IC}/DisplayProperties.png`, app: "display-properties" },
  { titleKey: "networkAndInternet", descKey: "networkAndInternetDesc", icon: `${IC}/MicrosoftWindowsNetwork.png`, app: "network-places" },
  { titleKey: "userAccountsCat", descKey: "userAccountsDesc", icon: `${IC}/UserAccounts.png`, app: "user-accounts" },
  { titleKey: "dateTimeRegional", descKey: "dateTimeRegionalDesc", icon: `${IC}/RegionalSettings.png`, app: "regional-options" },
  { titleKey: "soundsSpeechAudio", descKey: "soundsSpeechAudioDesc", icon: `${IC}/Volume.png`, app: "volume" },
  { titleKey: "performanceMaintenance", descKey: "performanceMaintenanceDesc", icon: `${IC}/SystemProperties.png`, app: "system-properties" },
  { titleKey: "securityCenterCat", descKey: "securityCenterDesc", icon: `${IC}/SecurityCenter.png`, app: "security-center" },
  { titleKey: "administrativeTools", descKey: "administrativeToolsDesc", icon: `${IC}/CommandPrompt.png`, app: "terminal" },
];

const CLASSIC_DEFS: ClassicDef[] = [
  { titleKey: "dateAndTime", descKey: "dateAndTimeDesc", icon: `${IC}/DateandTime.png`, app: "date-time" },
  { titleKey: "displayClassic", descKey: "displayClassicDesc", icon: `${IC}/DisplayProperties.png`, app: "display-properties" },
  { titleKey: "networkConnectionsClassic", descKey: "networkConnectionsClassicDesc", icon: `${IC}/MicrosoftWindowsNetwork.png`, app: "network-places" },
  { titleKey: "regionalOptions", descKey: "regionalOptions", icon: `${IC}/RegionalSettings.png`, app: "regional-options" },
  { titleKey: "securityCenterClassic", descKey: "securityCenterClassicDesc", icon: `${IC}/SecurityCenter.png`, app: "security-center" },
  { titleKey: "soundsAudioClassic", descKey: "soundsAudioClassicDesc", icon: `${IC}/Volume.png`, app: "volume" },
  { titleKey: "systemClassic", descKey: "systemClassicDesc", icon: `${IC}/SystemProperties.png`, app: "system-properties" },
  { titleKey: "taskManager", descKey: "taskManager", icon: `${IC}/TaskManager.png`, app: "task-manager" },
  { titleKey: "userAccountsCat", descKey: "userAccountsDesc", icon: `${IC}/UserAccounts.png`, app: "user-accounts" },
];

export default function ControlPanel(_: { id: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const [classicView, setClassicView] = useState(false);
  const t = useLangStore((s) => s.t);

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", display: "flex", overflow: "hidden", fontSize: 11 }}>
      <div style={{ width: 180, background: "linear-gradient(180deg,#7BA2E7 0%,#6375D6 100%)", color: "#FFF", padding: "10px 8px", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0, overflowY: "auto" }}>
        <div style={{ background: "#FFF", borderRadius: "4px 4px 0 0", color: "#00136B", padding: "4px 8px", fontWeight: "bold", fontSize: 11 }}>
          {t("controlPanel")}
        </div>
        <div style={{ background: "rgba(255,255,255,0.85)", color: "#00136B", padding: "8px 6px", borderRadius: "0 0 4px 4px", display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            onClick={() => setClassicView(!classicView)}
            style={{ background: "none", border: "none", color: "#0C327D", textDecoration: "underline", cursor: "pointer", textAlign: "left", padding: 0, fontSize: 11 }}
          >
            {classicView ? t("switchToCategory") : t("switchToClassic")}
          </button>
        </div>

        <div style={{ background: "#FFF", borderRadius: "4px 4px 0 0", color: "#00136B", padding: "4px 8px", fontWeight: "bold", fontSize: 11 }}>
          {t("seeAlso")}
        </div>
        <div style={{ background: "rgba(255,255,255,0.85)", color: "#00136B", padding: "8px 6px", borderRadius: "0 0 4px 4px", display: "flex", flexDirection: "column", gap: 6 }}>
          <button
            onClick={() => openWindow("system-properties")}
            style={{ background: "none", border: "none", color: "#0C327D", textDecoration: "underline", cursor: "pointer", textAlign: "left", padding: 0, fontSize: 11 }}
          >
            {t("systemInformation")}
          </button>
          <button
            onClick={() => openWindow("user-accounts")}
            style={{ background: "none", border: "none", color: "#0C327D", textDecoration: "underline", cursor: "pointer", textAlign: "left", padding: 0, fontSize: 11 }}
          >
            {t("userAccountsCat")}
          </button>
          <button
            onClick={() => openWindow("regional-options")}
            style={{ background: "none", border: "none", color: "#0C327D", textDecoration: "underline", cursor: "pointer", textAlign: "left", padding: 0, fontSize: 11 }}
          >
            {t("regionalOptions")}
          </button>
        </div>
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflowY: "auto", background: "#FFF" }}>
        <div style={{ padding: "14px 18px 8px", borderBottom: "1px solid #ECE9D8" }}>
          <div style={{ fontSize: 16, fontWeight: "bold", color: "#003399" }}>
            {classicView ? t("classicView") : t("pickCategory")}
          </div>
        </div>

        {classicView ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(130px, 1fr))", gap: 12, padding: 16 }}>
            {CLASSIC_DEFS.map((applet) => (
              <div
                key={applet.titleKey}
                onClick={() => openWindow(applet.app)}
                style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: 8, cursor: "pointer", borderRadius: 4, border: "1px solid transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF4FC"; e.currentTarget.style.borderColor = "#B8D6FB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <img src={applet.icon} alt="" style={{ width: 36, height: 36, marginBottom: 4 }} />
                <span style={{ fontSize: 11, color: "#000" }}>{t(applet.titleKey)}</span>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, padding: 16 }}>
            {CATEGORY_DEFS.map((cat) => (
              <div
                key={cat.titleKey}
                onClick={() => openWindow(cat.app)}
                style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: 8, cursor: "pointer", borderRadius: 4, border: "1px solid transparent" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#EFF4FC"; e.currentTarget.style.borderColor = "#B8D6FB"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = "transparent"; }}
              >
                <img src={cat.icon} alt="" style={{ width: 32, height: 32, flexShrink: 0, marginTop: 2 }} />
                <div>
                  <div style={{ fontWeight: "bold", color: "#003399", fontSize: 12 }}>{t(cat.titleKey)}</div>
                  <div style={{ color: "#555", fontSize: 11, marginTop: 2 }}>{t(cat.descKey)}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
