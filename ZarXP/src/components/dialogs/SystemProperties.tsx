import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const tabs = ["General", "Computer Name", "Hardware", "Advanced"] as const;
type Tab = (typeof tabs)[number];

function TabContent({ tab }: { tab: Tab }) {
  if (tab === "General") return <div className="xp-group-box" style={{ textAlign: "center" }}><img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 64, height: 64 }} /><div style={{ fontWeight: "bold", marginTop: 8 }}>Microsoft Windows XP</div><div>Professional</div><div>Version 2002, Service Pack 2</div><div style={{ marginTop: 12, borderTop: "1px solid #C9C7B4", paddingTop: 8 }}>Intel Pentium 4 2.40GHz<br />512 MB RAM</div><div className="xp-small" style={{ marginTop: 12 }}>Copyright 1985-2001 Microsoft Corporation</div></div>;
  if (tab === "Computer Name") return <div className="xp-group-box"><div className="xp-form-row"><span className="xp-form-label">Computer name:</span><strong>ZAR-XP</strong></div><div className="xp-form-row"><span className="xp-form-label">Full computer name:</span><span>zar-xp</span></div><div className="xp-form-row"><span className="xp-form-label">Workgroup:</span><span>WORKGROUP</span></div></div>;
  if (tab === "Hardware") return <div className="xp-group-box"><div style={{ fontWeight: "bold", color: "#003399", marginBottom: 8 }}>Device Manager</div><div>Display adapters, drives, input and sound devices</div></div>;
  return <div className="xp-group-box"><div style={{ fontWeight: "bold", color: "#003399", marginBottom: 8 }}>Advanced</div><div>Performance, user profiles, startup and recovery</div></div>;
}

export default function SystemProperties({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const closeWindow = useWindowStore((state) => state.closeWindow);

  return <div className="xp-dialog-surface"><div className="xp-tabbar">{tabs.map((tab) => <button key={tab} className={`xp-tab ${activeTab === tab ? "active" : ""}`} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{tab}</button>)}</div><div className="xp-tabpanel"><TabContent tab={activeTab} /></div><div className="xp-dialog-footer"><button className="xp-button">OK</button><button className="xp-button" onClick={() => closeWindow(id)}>Cancel</button></div></div>;
}
