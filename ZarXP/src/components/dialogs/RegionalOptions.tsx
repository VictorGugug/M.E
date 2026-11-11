import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

export default function RegionalOptions({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const { lang, setLang, t } = useLangStore();

  return <div className="xp-dialog-surface"><div className="xp-tabbar"><button className="xp-tab active">{t("regionalOptionsTab")}</button></div><div className="xp-tabpanel"><div className="xp-group-box"><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><img src={assetUrl("assets/icons/RegionalSettings.png")} alt="" style={{ width: 32, height: 32 }} /><div><div style={{ fontWeight: "bold" }}>{t("languageForInterface")}</div><div className="xp-small">{t("languageForInterfaceDesc")}</div></div></div><div className="xp-form-row"><label className="xp-form-label" htmlFor="regional-language">{t("displayLanguage")}</label><select id="regional-language" className="xp-select" style={{ width: 230 }} value={lang} onChange={(event) => setLang(event.target.value as "en" | "es")}><option value="en">{t("englishUnitedStates")}</option><option value="es">{t("spanishSpain")}</option></select></div><div className="xp-small" style={{ borderTop: "1px solid #C9C7B4", marginTop: 16, paddingTop: 10 }}>{t("languageChangeNotice")}</div></div></div><div className="xp-dialog-footer center"><button className="xp-button" onClick={() => closeWindow(id)}>{t("ok")}</button><button className="xp-button" onClick={() => closeWindow(id)}>{t("cancel")}</button><button className="xp-button" onClick={() => closeWindow(id)}>{t("apply")}</button></div></div>;
}
