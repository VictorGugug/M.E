import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";

const tabs = ["Themes", "Desktop", "Screen Saver", "Appearance", "Settings"] as const;
type Tab = (typeof tabs)[number];

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  tabBar: { display: "flex", gap: 0, padding: "6px 6px 0", background: "#ece9d8", borderBottom: "1px solid #7f9db9" },
  tab: { padding: "4px 10px", cursor: "pointer", border: "1px solid transparent", borderBottom: "none", borderRadius: "3px 3px 0 0", fontSize: 11, background: "transparent" },
  tabActive: { padding: "4px 10px", cursor: "pointer", border: "1px solid #7f9db9", borderBottom: "1px solid #ece9d8", borderRadius: "3px 3px 0 0", fontSize: 11, background: "#ece9d8", fontWeight: 700 },
  body: { flex: 1, padding: 16, background: "#ece9d8", display: "flex", flexDirection: "column", gap: 10 },
  row: { display: "flex", alignItems: "center", gap: 8 },
  label: { width: 80 },
  select: { height: 22, fontSize: 12, minWidth: 120 },
  preview: { width: 160, height: 100, border: "1px solid #999", background: "#d4d0c8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#666" },
  buttons: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "6px 12px", borderTop: "1px solid #d4d0c8", background: "#ece9d8" },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
  slider: { width: 160, accentColor: "#3a6ea5" },
};

function TabContent({ tab }: { tab: Tab }) {
  switch (tab) {
    case "Themes":
      return (
        <>
          <div style={s.row}><span style={s.label}>Theme:</span><select style={s.select} defaultValue="Windows XP"><option>Windows XP</option><option>Classic</option></select></div>
          <div style={s.preview}>Sample Preview</div>
        </>
      );
    case "Desktop":
      return (
        <>
          <div style={s.row}><span style={s.label}>Background:</span><select style={s.select} defaultValue="Bliss"><option>Bliss</option><option>None</option></select></div>
          <div style={{ ...s.preview, width: "100%", height: 120, background: "linear-gradient(135deg, #6392c7, #2c5f8a)" }}>Wallpaper Preview</div>
        </>
      );
    case "Screen Saver":
      return (
        <>
          <div style={s.row}><span style={s.label}>Screen saver:</span><select style={s.select} defaultValue="None"><option>None</option><option>Windows XP</option></select></div>
          <div style={s.row}><span style={s.label}>Wait:</span><input type="number" defaultValue={10} style={{ width: 50, height: 20, fontSize: 12 }} /><span>minutes</span></div>
        </>
      );
    case "Appearance":
      return (
        <>
          <div style={s.row}><span style={s.label}>Color scheme:</span><select style={s.select} defaultValue="Default"><option>Default</option><option>Silver</option><option>Olive Green</option></select></div>
          <div style={s.row}><span style={s.label}>Font size:</span><select style={s.select} defaultValue="Normal"><option>Normal</option><option>Large</option><option>Extra Large</option></select></div>
        </>
      );
    case "Settings":
      return (
        <>
          <div style={s.row}><span style={s.label}>Screen resolution:</span><span>800 x 600</span></div>
          <input type="range" min="800" max="1280" defaultValue={1024} style={s.slider} /><span style={{ fontSize: 11, color: "#666" }}>1280 x 1024</span>
          <div style={s.row}><span style={s.label}>Color quality:</span><select style={s.select} defaultValue="32"><option>Highest (32 bit)</option><option>High (24 bit)</option><option>Medium (16 bit)</option></select></div>
        </>
      );
  }
}

export default function DisplayProperties({ id }: { id: string }) {
  const [activeTab, setActiveTab] = useState<Tab>("Themes");
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
        <button style={s.btn}>Apply</button>
      </div>
    </div>
  );
}
