import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import { playSound, XP_SOUNDS } from "../../utils/sound";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

export type SpadConfig = "manufacturer" | "microsoft" | "non-microsoft" | "custom";

interface CustomSettings {
  browser: "ie" | "current";
  browserAccess: boolean;
  email: "oe" | "current";
  emailAccess: boolean;
  media: "wmp" | "current";
  mediaAccess: boolean;
  im: "msn" | "current";
  imAccess: boolean;
  jvm: "current";
}

export default function SetProgramAccess({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const t = useLangStore((s) => s.t);

  const [activeConfig, setActiveConfig] = useState<SpadConfig>(() => {
    try {
      const saved = localStorage.getItem("zarxp-spad-config");
      return (saved as SpadConfig) || "microsoft";
    } catch {
      return "microsoft";
    }
  });

  const [expandedSection, setExpandedSection] = useState<SpadConfig | null>(() => {
    try {
      const saved = localStorage.getItem("zarxp-spad-config");
      return (saved as SpadConfig) || "microsoft";
    } catch {
      return "microsoft";
    }
  });

  const [custom, setCustom] = useState<CustomSettings>(() => {
    try {
      const saved = localStorage.getItem("zarxp-spad-custom");
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return {
      browser: "ie",
      browserAccess: true,
      email: "oe",
      emailAccess: true,
      media: "wmp",
      mediaAccess: true,
      im: "msn",
      imAccess: true,
      jvm: "current",
    };
  });

  const toggleExpand = (config: SpadConfig) => {
    setExpandedSection(expandedSection === config ? null : config);
    setActiveConfig(config);
  };

  const handleSelectRadio = (config: SpadConfig) => {
    setActiveConfig(config);
    setExpandedSection(config);
  };

  const handleSave = () => {
    try {
      localStorage.setItem("zarxp-spad-config", activeConfig);
      localStorage.setItem("zarxp-spad-custom", JSON.stringify(custom));
    } catch {
      // ignore storage failure
    }
    playSound(XP_SOUNDS.navigationStart);
    closeWindow(id);
  };

  return (
    <div className="xp-dialog-surface" style={{ height: "100%", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif" }}>
      {/* Header with description */}
      <div style={{ padding: "12px 14px 8px", display: "flex", gap: 12, alignItems: "flex-start" }}>
        <img src={`${OL}/interface/programs/defaults.png`} alt="" style={{ width: 32, height: 32, flexShrink: 0 }} />
        <div style={{ fontSize: 11, lineHeight: 1.4 }}>
          A program configuration specifies default programs for certain activities, such as Web browsing or sending e-mail, and which programs are accessible from the Start menu, desktop, and other locations.
          <div style={{ fontWeight: "bold", marginTop: 6 }}>Choose a configuration:</div>
        </div>
      </div>

      {/* Main Configurations Accordion Box */}
      <div style={{ flex: 1, margin: "0 14px 10px", background: "#FFF", border: "1px solid #7F9DB9", overflowY: "auto", padding: 6 }}>
        {/* 1. Computer Manufacturer */}
        <div style={{ borderBottom: "1px solid #E0E0E0", paddingBottom: 6, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => handleSelectRadio("manufacturer")}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="spad-config"
                checked={activeConfig === "manufacturer"}
                onChange={() => handleSelectRadio("manufacturer")}
              />
              <span style={{ fontWeight: "bold", fontSize: 11 }}>Computer Manufacturer</span>
            </div>
            <button
              type="button"
              className="xp-button"
              style={{ minWidth: 24, height: 18, padding: 0, fontSize: 10, lineHeight: "14px" }}
              onClick={(e) => { e.stopPropagation(); toggleExpand("manufacturer"); }}
              title="Expand/Collapse"
            >
              {expandedSection === "manufacturer" ? "«" : "»"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#444", marginLeft: 22, marginTop: 2 }}>
            Restore the programs and settings specified by your computer manufacturer.
          </div>
          {expandedSection === "manufacturer" && (
            <div style={{ margin: "6px 0 2px 22px", padding: 8, background: "#F7F6F0", border: "1px solid #D4D0C8", fontSize: 11 }}>
              <div style={{ fontStyle: "italic", marginBottom: 4 }}>Computer Manufacturer Configurations:</div>
              <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
                <li>Default Web Browser: Internet Explorer (OEM Preset)</li>
                <li>Default E-mail: Outlook Express</li>
                <li>Default Media Player: Windows Media Player</li>
                <li>Default Instant Messenger: Windows Messenger</li>
                <li>Java Virtual Machine: Sun / Microsoft JVM</li>
              </ul>
            </div>
          )}
        </div>

        {/* 2. Microsoft Windows */}
        <div style={{ borderBottom: "1px solid #E0E0E0", paddingBottom: 6, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => handleSelectRadio("microsoft")}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="spad-config"
                checked={activeConfig === "microsoft"}
                onChange={() => handleSelectRadio("microsoft")}
              />
              <span style={{ fontWeight: "bold", fontSize: 11 }}>Microsoft Windows</span>
            </div>
            <button
              type="button"
              className="xp-button"
              style={{ minWidth: 24, height: 18, padding: 0, fontSize: 10, lineHeight: "14px" }}
              onClick={(e) => { e.stopPropagation(); toggleExpand("microsoft"); }}
              title="Expand/Collapse"
            >
              {expandedSection === "microsoft" ? "«" : "»"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#444", marginLeft: 22, marginTop: 2 }}>
            Use the current Microsoft programs and enable access to them.
          </div>
          {expandedSection === "microsoft" && (
            <div style={{ margin: "6px 0 2px 22px", padding: 8, background: "#F7F6F0", border: "1px solid #D4D0C8", fontSize: 11 }}>
              <div style={{ marginBottom: 4 }}>The following Microsoft programs will be configured as defaults:</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={`${IC}/InternetExplorer6.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>Internet Explorer (Web Browser)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={`${IC}/OutlookExpress.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>Outlook Express (E-mail Program)</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={`${IC}/WindowsMediaPlayer10.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>Windows Media Player</span>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <img src={`${IC}/WindowsMessenger.png`} alt="" style={{ width: 16, height: 16 }} />
                  <span>Windows Messenger</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 3. Non-Microsoft */}
        <div style={{ borderBottom: "1px solid #E0E0E0", paddingBottom: 6, marginBottom: 6 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => handleSelectRadio("non-microsoft")}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="spad-config"
                checked={activeConfig === "non-microsoft"}
                onChange={() => handleSelectRadio("non-microsoft")}
              />
              <span style={{ fontWeight: "bold", fontSize: 11 }}>Non-Microsoft</span>
            </div>
            <button
              type="button"
              className="xp-button"
              style={{ minWidth: 24, height: 18, padding: 0, fontSize: 10, lineHeight: "14px" }}
              onClick={(e) => { e.stopPropagation(); toggleExpand("non-microsoft"); }}
              title="Expand/Collapse"
            >
              {expandedSection === "non-microsoft" ? "«" : "»"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#444", marginLeft: 22, marginTop: 2 }}>
            Use the current non-Microsoft programs and remove access to the Microsoft programs.
          </div>
          {expandedSection === "non-microsoft" && (
            <div style={{ margin: "6px 0 2px 22px", padding: 8, background: "#F7F6F0", border: "1px solid #D4D0C8", fontSize: 11 }}>
              <div style={{ marginBottom: 4 }}>This option removes shortcuts to Microsoft programs from the Start menu and desktop:</div>
              <ul style={{ margin: "0 0 0 16px", padding: 0 }}>
                <li>Web browser: Use my current Web browser</li>
                <li>E-mail program: Use my current e-mail program</li>
                <li>Media player: Use my current media player</li>
                <li>Instant messaging program: Use my current instant messaging program</li>
              </ul>
            </div>
          )}
        </div>

        {/* 4. Custom */}
        <div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", cursor: "pointer" }} onClick={() => handleSelectRadio("custom")}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <input
                type="radio"
                name="spad-config"
                checked={activeConfig === "custom"}
                onChange={() => handleSelectRadio("custom")}
              />
              <span style={{ fontWeight: "bold", fontSize: 11 }}>Custom</span>
            </div>
            <button
              type="button"
              className="xp-button"
              style={{ minWidth: 24, height: 18, padding: 0, fontSize: 10, lineHeight: "14px" }}
              onClick={(e) => { e.stopPropagation(); toggleExpand("custom"); }}
              title="Expand/Collapse"
            >
              {expandedSection === "custom" ? "«" : "»"}
            </button>
          </div>
          <div style={{ fontSize: 11, color: "#444", marginLeft: 22, marginTop: 2 }}>
            Choose a default program for each activity and specify which programs are accessible.
          </div>
          {expandedSection === "custom" && (
            <div style={{ margin: "6px 0 2px 22px", padding: 8, background: "#F7F6F0", border: "1px solid #D4D0C8", fontSize: 11 }}>
              {/* Category 1: Web browser */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #ACA899", paddingBottom: 2, marginBottom: 4 }}>
                  Choose a default Web browser:
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-browser" checked={custom.browser === "ie"} onChange={() => setCustom({ ...custom, browser: "ie" })} />
                    <img src={`${IC}/InternetExplorer6.png`} alt="" style={{ width: 16, height: 16 }} />
                    Internet Explorer
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" checked={custom.browserAccess} onChange={(e) => setCustom({ ...custom, browserAccess: e.target.checked })} />
                    Enable access to this program
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-browser" checked={custom.browser === "current"} onChange={() => setCustom({ ...custom, browser: "current" })} />
                    Use my current Web browser
                  </label>
                </div>
              </div>

              {/* Category 2: E-mail */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #ACA899", paddingBottom: 2, marginBottom: 4 }}>
                  Choose a default e-mail program:
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-email" checked={custom.email === "oe"} onChange={() => setCustom({ ...custom, email: "oe" })} />
                    <img src={`${IC}/OutlookExpress.png`} alt="" style={{ width: 16, height: 16 }} />
                    Outlook Express
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" checked={custom.emailAccess} onChange={(e) => setCustom({ ...custom, emailAccess: e.target.checked })} />
                    Enable access to this program
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-email" checked={custom.email === "current"} onChange={() => setCustom({ ...custom, email: "current" })} />
                    Use my current e-mail program
                  </label>
                </div>
              </div>

              {/* Category 3: Media player */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #ACA899", paddingBottom: 2, marginBottom: 4 }}>
                  Choose a default media player:
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-media" checked={custom.media === "wmp"} onChange={() => setCustom({ ...custom, media: "wmp" })} />
                    <img src={`${IC}/WindowsMediaPlayer10.png`} alt="" style={{ width: 16, height: 16 }} />
                    Windows Media Player
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" checked={custom.mediaAccess} onChange={(e) => setCustom({ ...custom, mediaAccess: e.target.checked })} />
                    Enable access to this program
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-media" checked={custom.media === "current"} onChange={() => setCustom({ ...custom, media: "current" })} />
                    Use my current media player
                  </label>
                </div>
              </div>

              {/* Category 4: Instant messaging */}
              <div style={{ marginBottom: 10 }}>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #ACA899", paddingBottom: 2, marginBottom: 4 }}>
                  Choose a default instant messaging program:
                </div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 3 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-im" checked={custom.im === "msn"} onChange={() => setCustom({ ...custom, im: "msn" })} />
                    <img src={`${IC}/WindowsMessenger.png`} alt="" style={{ width: 16, height: 16 }} />
                    Windows Messenger
                  </label>
                  <label style={{ display: "flex", alignItems: "center", gap: 4 }}>
                    <input type="checkbox" checked={custom.imAccess} onChange={(e) => setCustom({ ...custom, imAccess: e.target.checked })} />
                    Enable access to this program
                  </label>
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-im" checked={custom.im === "current"} onChange={() => setCustom({ ...custom, im: "current" })} />
                    Use my current instant messaging program
                  </label>
                </div>
              </div>

              {/* Category 5: Java VM */}
              <div>
                <div style={{ fontWeight: "bold", borderBottom: "1px solid #ACA899", paddingBottom: 2, marginBottom: 4 }}>
                  Choose a default virtual machine for Java:
                </div>
                <div>
                  <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <input type="radio" name="custom-jvm" checked={custom.jvm === "current"} onChange={() => setCustom({ ...custom, jvm: "current" })} />
                    Use my current Java virtual machine
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog Footer */}
      <div className="xp-dialog-footer">
        <button className="xp-button" onClick={handleSave}>{t("ok") || "OK"}</button>
        <button className="xp-button" onClick={() => closeWindow(id)}>{t("cancel") || "Cancel"}</button>
      </div>
    </div>
  );
}
