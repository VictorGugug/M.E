import { useWindowStore } from "../../store/windowStore";

const categories = [
  { label: "System", icon: "SystemProperties.png", app: "system-properties" as const },
  { label: "Display", icon: "DisplayProperties.png", app: "display-properties" as const },
  { label: "Taskbar and Start Menu", icon: "TaskbarandStartMenu.png", app: "settings" as const },
  { label: "Date and Time", icon: "DateandTime.png", app: "date-time" as const },
  { label: "Sounds and Audio", icon: "Volume.png", app: "volume" as const },
  { label: "Network Connections", icon: "MicrosoftWindowsNetwork.png", app: "network-places" as const },
  { label: "User Accounts", icon: "UserAccounts.png", app: "settings" as const },
  { label: "Add or Remove Programs", icon: "ChangeorRemovePrograms.png", app: "settings" as const },
];

export default function ControlPanel(_: { id: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);

  return (
    <div style={{ width: "100%", height: "100%", background: "#ECE9D8", fontFamily: "Tahoma, sans-serif", display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ background: "#004E98", color: "#FFF", padding: "6px 12px", fontSize: 16, fontWeight: "bold" }}>Control Panel</div>
      <div style={{ padding: "8px 12px", fontSize: 14, fontWeight: "bold", color: "#004E98", borderBottom: "1px solid #ACA899" }}>Pick a category</div>
      <div style={{ flex: 1, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, padding: 12, alignContent: "start" }}>
        {categories.map((cat) => (
          <div key={cat.label} style={{ display: "flex", alignItems: "center", gap: 8, padding: 6, cursor: "pointer", borderRadius: 4 }} onClick={() => openWindow(cat.app)}>
            <img src={`/assets/icons/${cat.icon}`} alt="" style={{ width: 28, height: 28 }} />
            <span style={{ fontSize: 11, color: "#000" }}>{cat.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
