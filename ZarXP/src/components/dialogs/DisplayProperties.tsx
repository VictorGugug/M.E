import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore, type StringKey } from "../../store/langStore";
import { normalizeSettings, useSettingsStore, type ColorScheme, type DesktopSettings, type FontSize, type ScreenSaver, type Wallpaper } from "../../store/settingsStore";

const tabs = ["Themes", "Desktop", "Screen Saver", "Appearance", "Settings"] as const;
type Tab = (typeof tabs)[number];
const tabLabels: Record<Tab, StringKey> = { Themes: "themes", Desktop: "desktop", "Screen Saver": "screenSaver", Appearance: "appearance", Settings: "settingsTab" };

export default function DisplayProperties({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("Themes");
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const settings = useSettingsStore((state) => state.settings);
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const t = useLangStore((state) => state.t);
  const [draft, setDraft] = useState<DesktopSettings>(settings);

  const apply = () => {
    const normalized = normalizeSettings(draft);
    setDraft(normalized);
    updateSettings(normalized);
  };
  const handleOk = () => { apply(); closeWindow(id); };

  return (
    <div className="xp-dialog-surface">
      <div className="xp-tabbar">
        {tabs.map((tab) => <button key={tab} className={`xp-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{t(tabLabels[tab])}</button>)}
      </div>
      <div className="xp-tabpanel" role="tabpanel">
        {activeTab === "Themes" && <div className="xp-group-box"><div className="xp-form-row"><label className="xp-form-label" htmlFor="display-theme">{t("theme")}:</label><select id="display-theme" className="xp-select" disabled><option>Windows XP</option><option>{t("classic")}</option></select></div><div className="xp-group-box" style={{ marginTop: 14, minHeight: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>{t("samplePreview")}</div></div>}
        {activeTab === "Desktop" && <div className="xp-group-box"><div className="xp-form-row"><label className="xp-form-label" htmlFor="display-wallpaper">{t("background")}:</label><select id="display-wallpaper" className="xp-select" value={draft.wallpaper} onChange={(event) => setDraft((current) => ({ ...current, wallpaper: event.target.value as Wallpaper }))}><option value="bliss">Bliss</option><option value="none">{t("none")}</option></select></div><div className="xp-group-box" style={{ marginTop: 14, minHeight: 150, display: "flex", alignItems: "center", justifyContent: "center", background: draft.wallpaper === "bliss" ? "linear-gradient(135deg,#6392C7,#2C5F8A)" : "#3A6EA5" }}>{draft.wallpaper === "bliss" ? t("wallpaperPreview") : t("solidColor")}</div></div>}
        {activeTab === "Screen Saver" && <div className="xp-group-box"><div className="xp-form-row"><label className="xp-form-label" htmlFor="display-saver">{t("screenSaverLabel")}:</label><select id="display-saver" className="xp-select" value={draft.screenSaver} onChange={(event) => setDraft((current) => ({ ...current, screenSaver: event.target.value as ScreenSaver }))}><option value="none">{t("none")}</option><option value="windows-xp">Windows XP</option></select></div><div className="xp-form-row" style={{ marginTop: 10 }}><label className="xp-form-label" htmlFor="display-wait">{t("wait")}:</label><input id="display-wait" className="xp-input" type="number" min="1" max="60" value={draft.screenSaverMinutes} onChange={(event) => setDraft((current) => ({ ...current, screenSaverMinutes: Number(event.target.value) }))} style={{ width: 55 }} /><span>{t("minutes")}</span></div></div>}
        {activeTab === "Appearance" && <div className="xp-group-box"><div className="xp-form-row"><label className="xp-form-label" htmlFor="display-colors">{t("colorScheme")}:</label><select id="display-colors" className="xp-select" value={draft.colorScheme} onChange={(event) => setDraft((current) => ({ ...current, colorScheme: event.target.value as ColorScheme }))}><option value="default">{t("defaultColor")}</option><option value="silver">{t("silver")}</option><option value="olive">{t("oliveGreen")}</option></select></div><div className="xp-form-row" style={{ marginTop: 10 }}><label className="xp-form-label" htmlFor="display-font">{t("fontSize")}:</label><select id="display-font" className="xp-select" value={draft.fontSize} onChange={(event) => setDraft((current) => ({ ...current, fontSize: event.target.value as FontSize }))}><option value="normal">{t("normal")}</option><option value="large">{t("large")}</option><option value="extra-large">{t("extraLarge")}</option></select></div></div>}
        {activeTab === "Settings" && <div className="xp-group-box"><div className="xp-form-row"><span className="xp-form-label">{t("screenResolution")}:</span><span>800 x 600</span></div><input aria-label={t("screenResolution")} type="range" min="800" max="1280" defaultValue={1024} disabled style={{ width: 170, accentColor: "#316AC5", margin: "10px 0" }} /><div className="xp-small">1280 x 1024</div><div className="xp-form-row" style={{ marginTop: 10 }}><label className="xp-form-label" htmlFor="display-quality">{t("colorQuality")}:</label><select id="display-quality" className="xp-select" disabled><option>{t("highestQuality")}</option><option>{t("highQuality")}</option><option>{t("mediumQuality")}</option></select></div></div>}
      </div>
      <div className="xp-dialog-footer"><button className="xp-button" onClick={handleOk}>{t("ok")}</button><button className="xp-button" onClick={() => closeWindow(id)}>{t("cancel")}</button><button className="xp-button" onClick={apply}>{t("apply")}</button></div>
    </div>
  );
}
