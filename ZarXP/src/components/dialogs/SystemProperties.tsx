import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore, type StringKey } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";

const tabs = ["general", "computerName", "hardware", "advanced"] as const;
type Tab = (typeof tabs)[number];
const tabLabels: Record<Tab, StringKey> = { general: "tabGeneral", computerName: "tabComputerName", hardware: "tabHardware", advanced: "tabAdvancedSys" };

function TabContent({ tab }: { tab: Tab }) {
  const t = useLangStore((state) => state.t);
  if (tab === "general") return <div className="xp-group-box" style={{ textAlign: "center" }}><img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 64, height: 64 }} /><div style={{ fontWeight: "bold", marginTop: 8 }}>{t("sysWindowsXp")}</div><div>{t("sysProfessional")}</div><div>{t("sysVersion")}</div><div style={{ marginTop: 12, borderTop: "1px solid #C9C7B4", paddingTop: 8 }}>{t("sysProcessor")}<br />{t("sysRam")}</div><div className="xp-small" style={{ marginTop: 12 }}>{t("sysCopyright")}</div></div>;
  if (tab === "computerName") return <div className="xp-group-box"><div className="xp-form-row"><span className="xp-form-label">{t("computerNameLabel")}</span><strong>ZAR-XP</strong></div><div className="xp-form-row"><span className="xp-form-label">{t("fullComputerNameLabel")}</span><span>zar-xp</span></div><div className="xp-form-row"><span className="xp-form-label">{t("workgroupLabel")}</span><span>WORKGROUP</span></div></div>;
  if (tab === "hardware") return <div className="xp-group-box"><div style={{ fontWeight: "bold", color: "#003399", marginBottom: 8 }}>{t("deviceManager")}</div><div>{t("deviceManagerDesc")}</div></div>;
  return <div className="xp-group-box"><div style={{ fontWeight: "bold", color: "#003399", marginBottom: 8 }}>{t("tabAdvancedSys")}</div><div>{t("advancedSectionDesc")}</div></div>;
}

export default function SystemProperties({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const t = useLangStore((state) => state.t);

  return <div className="xp-dialog-surface"><div className="xp-tabbar">{tabs.map((tab) => <button key={tab} className={`xp-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{t(tabLabels[tab])}</button>)}</div><div className="xp-tabpanel"><TabContent tab={activeTab} /></div><div className="xp-dialog-footer"><button className="xp-button" onClick={() => closeWindow(id)}>{t("ok")}</button><button className="xp-button" onClick={() => closeWindow(id)}>{t("cancel")}</button></div></div>;
}
