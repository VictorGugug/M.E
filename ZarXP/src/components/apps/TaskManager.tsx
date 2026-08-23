import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
const fakeProcesses = [
  { name: "System Idle Process", cpu: 85, mem: "16K" },
  { name: "System", cpu: 2, mem: "2,048K" },
  { name: "smss.exe", cpu: 0, mem: "340K" },
  { name: "csrss.exe", cpu: 1, mem: "2,852K" },
  { name: "winlogon.exe", cpu: 0, mem: "1,876K" },
  { name: "services.exe", cpu: 1, mem: "3,420K" },
  { name: "lsass.exe", cpu: 0, mem: "1,564K" },
  { name: "svchost.exe", cpu: 2, mem: "4,212K" },
  { name: "explorer.exe", cpu: 3, mem: "12,340K" },
  { name: "taskmgr.exe", cpu: 5, mem: "2,108K" },
  { name: "alg.exe", cpu: 0, mem: "1,872K" },
];

type Tab = "Applications" | "Processes" | "Performance";

export default function TaskManager(_: { id: string }) {
  const [tab, setTab] = useState<Tab>("Applications");
  const windows = useWindowStore((s) => s.windows);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  return (
    <div style={{ width: "100%", height: "100%", background: "#D4D0C8", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", flexDirection: "column", userSelect: "none" }}>
      <div style={{ display: "flex", background: "#ECE9D8", borderBottom: "1px solid #808080" }}>
        {(["Applications", "Processes", "Performance"] as Tab[]).map((t) => (
          <div key={t} style={{ padding: "4px 12px", cursor: "pointer", background: tab === t ? "#D4D0C8" : "#ECE9D8", borderBottom: tab === t ? "1px solid #D4D0C8" : "1px solid #808080", fontWeight: tab === t ? "bold" : "normal" }} onClick={() => setTab(t)}>{t}</div>
        ))}
      </div>
      <div style={{ flex: 1, overflow: "auto", margin: 2 }}>
        {tab === "Applications" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#ECE9D8" }}><th style={thStyle}>Task</th><th style={thStyle}>Status</th></tr></thead>
            <tbody>
              {windows.filter((w) => w.state !== "minimized").map((w) => (
                <tr key={w.id}><td style={tdStyle}>{w.title}</td><td style={tdStyle}>Running</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "Processes" && (
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#ECE9D8" }}><th style={thStyle}>Image Name</th><th style={thStyle}>CPU</th><th style={thStyle}>Mem Usage</th></tr></thead>
            <tbody>
              {fakeProcesses.map((p) => (
                <tr key={p.name}><td style={tdStyle}>{p.name}</td><td style={tdStyle}>{p.cpu}</td><td style={tdStyle}>{p.mem}</td></tr>
              ))}
            </tbody>
          </table>
        )}
        {tab === "Performance" && (
          <div style={{ padding: 8 }}>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>CPU Usage</div>
              <div style={{ height: 18, width: "100%", background: "#FFF", border: "1px solid #808080" }}>
                <div style={{ height: "100%", width: "23%", background: "linear-gradient(90deg, #00AA00, #44DD44)" }} />
              </div>
            </div>
            <div>
              <div style={{ fontWeight: "bold", marginBottom: 4 }}>Memory Usage</div>
              <div style={{ height: 18, width: "100%", background: "#FFF", border: "1px solid #808080" }}>
                <div style={{ height: "100%", width: "54%", background: "linear-gradient(90deg, #0066CC, #44AAFF)" }} />
              </div>
            </div>
            <div style={{ marginTop: 12, fontSize: 10, color: "#555" }}>
              <div>Total Physical Memory: 512 MB</div>
              <div>Available: 236 MB</div>
              <div>System Cache: 187 MB</div>
              <div>Commit Charge: 276M / 1248M</div>
              <div>Kernel Memory: 89M</div>
            </div>
          </div>
        )}
      </div>
      {tab === "Applications" && (
        <div style={{ padding: "4px 6px", borderTop: "1px solid #808080", background: "#ECE9D8" }}>
          <button style={{ background: "#ECE9D8", border: "1px solid #ACA899", padding: "2px 12px", cursor: "pointer", fontSize: 11 }} onClick={() => { const w = windows.find((w) => w.state !== "minimized"); if (w) closeWindow(w.id); }}>End Task</button>
        </div>
      )}
    </div>
  );
}

const thStyle: React.CSSProperties = { borderBottom: "1px solid #808080", padding: "2px 4px", textAlign: "left", fontSize: 11 };
const tdStyle: React.CSSProperties = { padding: "2px 4px", fontSize: 11, borderBottom: "1px solid #C0C0C0" };
