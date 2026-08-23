import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

const tabs = ["General", "Computer Name", "Hardware", "Advanced"] as const;
type Tab = (typeof tabs)[number];

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  tabBar: { display: "flex", gap: 0, padding: "6px 6px 0", background: "#ece9d8", borderBottom: "1px solid #7f9db9" },
  tab: { padding: "4px 10px", cursor: "pointer", border: "1px solid transparent", borderBottom: "none", borderRadius: "3px 3px 0 0", fontSize: 11, background: "transparent" },
  tabActive: { padding: "4px 10px", cursor: "pointer", border: "1px solid #7f9db9", borderBottom: "1px solid #ece9d8", borderRadius: "3px 3px 0 0", fontSize: 11, background: "#ece9d8", fontWeight: 700 },
  body: { flex: 1, padding: 20, background: "#ece9d8", display: "flex", flexDirection: "column", gap: 14 },
  logo: { width: 64, height: 64, alignSelf: "center" },
  line: { fontSize: 11, color: "#333" },
  title: { fontWeight: 700, fontSize: 12 },
  buttons: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "6px 12px", borderTop: "1px solid #d4d0c8", background: "#ece9d8" },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
};

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "General":
      return (
        <>
          <img src={assetUrl("assets/images/xp-logo.png")} alt="" style={s.logo} />
          <div style={s.title}>System:</div>
          <div style={s.line}>Microsoft Windows XP Professional</div>
          <div style={s.line}>Version 2002</div>
          <div style={{ ...s.title, marginTop: 8 }}>Computer:</div>
          <div style={s.line}>Intel Pentium 4 2.40GHz</div>
          <div style={s.line}>512 MB RAM</div>
          <div style={{ ...s.line, marginTop: 8, fontSize: 10, color: "#999" }}>Copyright 1985-2001 Microsoft Corporation</div>
        </>
      );
    case "Computer Name":
      return (
        <>
          <div style={s.line}>Computer name: ZAR-XP</div>
          <div style={s.line}>Full computer name: zar-xp</div>
          <div style={s.line}>Workgroup: WORKGROUP</div>
        </>
      );
    case "Hardware":
      return <div style={s.line}>Device Manager & Hardware Profiles</div>;
    case "Advanced":
      return <div style={s.line}>Performance, User Profiles, Startup and Recovery</div>;
  }
}

export default function SystemProperties({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("General");
  const closeWindow = useWindowStore((s) => s.closeWindow);

  return (
    <div style={s.container}>
      <div style={s.tabBar}>
        {tabs.map((t) => (
          <div key={t} style={activeTab === t ? s.tabActive : s.tab} onClick={() => setActiveTab(t)}>{t}</div>
        ))}
      </div>
      <div style={s.body}>
        <TabContent tab={activeTab} />
      </div>
      <div style={s.buttons}>
        <button style={s.btn}>OK</button>
        <button style={s.btn} onClick={() => closeWindow(id)}>Cancel</button>
      </div>
    </div>
  );
}
