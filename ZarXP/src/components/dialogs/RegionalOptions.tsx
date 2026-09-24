import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

export default function RegionalOptions({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const { lang, setLang } = useLangStore();

  return <div className="xp-dialog-surface"><div className="xp-tabbar"><button className="xp-tab active">Regional Options</button></div><div className="xp-tabpanel"><div className="xp-group-box"><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><img src={assetUrl("assets/icons/RegionalSettings.png")} alt="" style={{ width: 32, height: 32 }} /><div><div style={{ fontWeight: "bold" }}>Language for the interface:</div><div className="xp-small">Select the language to display menus and dialogs.</div></div></div><div className="xp-form-row"><label className="xp-form-label" htmlFor="regional-language">Display language:</label><select id="regional-language" className="xp-select" style={{ width: 230 }} value={lang} onChange={(event) => setLang(event.target.value as "en" | "es")}><option value="en">English (United States)</option><option value="es">Espanol (Espana)</option></select></div><div className="xp-small" style={{ borderTop: "1px solid #C9C7B4", marginTop: 16, paddingTop: 10 }}>The change takes effect immediately for the Start menu, the desktop and system dialogs.</div></div></div><div className="xp-dialog-footer center"><button className="xp-button" onClick={() => closeWindow(id)}>OK</button><button className="xp-button" onClick={() => closeWindow(id)}>Cancel</button><button className="xp-button">Apply</button></div></div>;
}
