import { useSecurityStore } from "../../store/securityStore";
import { assetUrl } from "../../utils/assets";

const IC = assetUrl("assets/icons");

export default function SecurityCenter(_: { id: string }) {
  const settings = useSecurityStore((state) => state.settings);
  const setFirewall = useSecurityStore((state) => state.setFirewall);
  const setAutomaticUpdates = useSecurityStore((state) => state.setAutomaticUpdates);
  const setAntivirus = useSecurityStore((state) => state.setAntivirus);
  const sections = [
    { id: "firewall", label: "Firewall", icon: "Security-Ok.png", enabled: settings.firewall, help: "Windows Firewall is helping protect your computer.", setEnabled: setFirewall },
    { id: "updates", label: "Automatic Updates", icon: "Security-Ok.png", enabled: settings.automaticUpdates, help: "Windows can regularly check for important updates and install them for you.", setEnabled: setAutomaticUpdates },
    { id: "virus", label: "Virus Protection", icon: settings.antivirus ? "Security-Ok.png" : "SecurityAlert.png", enabled: settings.antivirus, help: settings.antivirus ? "Antivirus protection is active." : "Antivirus software might not be installed. Click Recommendations to learn more.", setEnabled: setAntivirus },
  ];

  return <div className="xp-app-surface"><div style={{ display: "flex", flex: 1, minHeight: 0 }}><div className="xp-side-panel"><div className="xp-task-pane"><div className="xp-task-pane-title">Resources</div><div className="xp-task-pane-body">{["Windows Firewall settings", "Automatic Updates settings", "Check for the latest updates from Windows Update", "Restore all security settings to recommended levels"].map((resource) => <div className="xp-task-link" key={resource}><img src={`${IC}/Question.png`} alt="" />{resource}</div>)}</div></div></div><div className="xp-content-panel" style={{ padding: 14 }}><div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}><img src={`${IC}/SecurityCenter.png`} alt="" style={{ width: 40, height: 40 }} /><div><div className="xp-panel-title" style={{ margin: 0 }}>Security Center</div><div className="xp-small">Helping to Protect Your PC</div></div></div><div className="xp-group-box" style={{ background: "linear-gradient(180deg,#D6E5F7,#C3D9F2)" }}><div style={{ fontWeight: "bold", color: "#0A246A", marginBottom: 6 }}>Security Essentials</div>{sections.map((section) => <div key={section.id} style={{ display: "flex", alignItems: "flex-start", gap: 10, padding: "8px 4px", borderBottom: "1px solid #B8CFEC" }}><img src={`${IC}/${section.icon}`} alt="" style={{ width: 28, height: 28 }} /><div style={{ flex: 1 }}><div style={{ fontWeight: "bold" }}>{section.label}</div><div>{section.help}</div></div><strong style={{ color: section.enabled ? "#1E7A1E" : "#C43B1E" }}>{section.id === "virus" && !section.enabled ? "NOT FOUND" : section.enabled ? "ON" : "OFF"}</strong><button className="xp-button" style={{ minWidth: 58, height: 21, padding: "1px 6px" }} onClick={() => section.setEnabled(!section.enabled)} aria-pressed={section.enabled}>{section.enabled ? "Disable" : "Enable"}</button></div>)}</div><div className="xp-small" style={{ marginTop: 12 }}>Why should I use a firewall? How can I tell if my computer is infected? What are Automatic Updates?</div></div></div></div>;
}
