import { assetUrl } from "../../utils/assets"

const IC = assetUrl("assets/icons");

const SECTIONS = [
  { id: "firewall", label: "Firewall", icon: "Security-Ok.png", on: true, good: "ON", help: "Windows Firewall is helping protect your computer." },
  { id: "updates", label: "Automatic Updates", icon: "Security-Ok.png", on: true, good: "ON", help: "Windows can regularly check for important updates and install them for you." },
  { id: "virus", label: "Virus Protection", icon: "SecurityAlert.png", on: false, good: "NOT FOUND", help: "Antivirus software might not be installed. Click Recommendations to learn more." },
];

export default function SecurityCenter(_: { id: string }) {
  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF", fontFamily: "Tahoma, sans-serif", fontSize: 11, overflow: "hidden" }}>
      <div style={{ display: "flex", flex: 1, minHeight: 0 }}>
        <div style={{ width: 200, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", padding: 8 }}>
          <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "4px 4px 0 0" }}>
            <div style={{ padding: "4px 8px", color: "#215DC6", fontWeight: "bold", background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)" }}>Resources</div>
            <div style={{ padding: "4px 10px 10px" }}>
              {["Windows Firewall settings", "Automatic Updates settings", "Check for the latest updates from Windows Update", "Restore all security settings to recommended levels"].map((r) => (
                <div key={r} style={{ color: "#215DC6", padding: "3px 0" }}>&#8226; {r}</div>
              ))}
            </div>
          </div>
        </div>
        <div style={{ flex: 1, padding: 12, overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <img src={`${IC}/SecurityCenter.png`} alt="" style={{ width: 40, height: 40 }} />
            <div>
              <div style={{ fontSize: 15, color: "#0A246A", fontWeight: "bold" }}>Security Center</div>
              <div style={{ color: "#555" }}>Helping to Protect Your PC</div>
            </div>
          </div>
          <div style={{ background: "linear-gradient(180deg,#D6E5F7,#C3D9F2)", border: "1px solid #B0C4E0", borderRadius: 4, padding: 12 }}>
            <div style={{ fontWeight: "bold", color: "#0A246A", marginBottom: 8 }}>Security Essentials</div>
            {SECTIONS.map((sec) => (
              <div key={sec.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "7px 4px", borderBottom: "1px solid #B8CFEC" }}>
                <img src={`${IC}/${sec.icon}`} alt="" style={{ width: 28, height: 28, flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>{sec.label}</div>
                  <div style={{ color: "#333" }}>{sec.help}</div>
                </div>
                <span style={{ fontWeight: "bold", color: sec.on ? "#1E7A1E" : "#C43B1E", flexShrink: 0 }}>{sec.good}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 10, color: "#555" }}>
            Quick links: Why should I use a firewall? - How can I tell if my computer is infected? - What are Automatic Updates?
          </div>
        </div>
      </div>
    </div>
  );
}
