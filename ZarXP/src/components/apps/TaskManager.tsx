import { useState, useEffect, useRef, useCallback } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { useUserStore } from "../../store/userStore";
import { assetUrl } from "../../utils/assets";

type Tab = "Applications" | "Processes" | "Performance" | "Networking" | "Users";

interface ProcessItem {
  name: string;
  user: string;
  cpu: number;
  mem: number;
}

const INITIAL_PROCESSES: ProcessItem[] = [
  { name: "System Idle Process", user: "SYSTEM", cpu: 94, mem: 16 },
  { name: "System", user: "SYSTEM", cpu: 1, mem: 216 },
  { name: "smss.exe", user: "SYSTEM", cpu: 0, mem: 348 },
  { name: "csrss.exe", user: "SYSTEM", cpu: 1, mem: 3120 },
  { name: "winlogon.exe", user: "SYSTEM", cpu: 0, mem: 2450 },
  { name: "services.exe", user: "SYSTEM", cpu: 1, mem: 3820 },
  { name: "lsass.exe", user: "SYSTEM", cpu: 0, mem: 1640 },
  { name: "svchost.exe", user: "SYSTEM", cpu: 1, mem: 4890 },
  { name: "svchost.exe", user: "NETWORK SERVICE", cpu: 0, mem: 3420 },
  { name: "svchost.exe", user: "LOCAL SERVICE", cpu: 0, mem: 2980 },
  { name: "explorer.exe", user: "XP User", cpu: 2, mem: 14280 },
  { name: "taskmgr.exe", user: "XP User", cpu: 1, mem: 2460 },
  { name: "msmsgs.exe", user: "XP User", cpu: 0, mem: 3100 },
  { name: "wmplayer.exe", user: "XP User", cpu: 0, mem: 8400 },
  { name: "alg.exe", user: "LOCAL SERVICE", cpu: 0, mem: 1450 },
  { name: "spoolsv.exe", user: "SYSTEM", cpu: 0, mem: 3620 },
];

export default function TaskManager(_: { id: string }) {
  const [tab, setTab] = useState<Tab>("Applications");
  const [selectedTask, setSelectedTask] = useState<string | null>(null);
  const [selectedProc, setSelectedProc] = useState<string>("taskmgr.exe");
  const [processes, setProcesses] = useState<ProcessItem[]>(INITIAL_PROCESSES);
  const [cpuHistory, setCpuHistory] = useState<number[]>(Array(30).fill(4));
  const [memHistory, setMemHistory] = useState<number[]>(Array(30).fill(184));
  const [cpuCurrent, setCpuCurrent] = useState(4);

  const windows = useWindowStore((s) => s.windows);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const focusWindow = useWindowStore((s) => s.focusWindow);
  const openWindow = useWindowStore((s) => s.openWindow);
  const userName = useUserStore((s) => s.userName);
  const t = useLangStore((s) => s.t);

  const canvasCpuRef = useRef<HTMLCanvasElement>(null);
  const canvasMemRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const iv = setInterval(() => {
      const cpu = Math.floor(Math.random() * 12) + 2;
      setCpuCurrent(cpu);
      setCpuHistory((prev) => [...prev.slice(1), cpu]);
      setMemHistory((prev) => [...prev.slice(1), 180 + Math.floor(Math.random() * 10)]);

      setProcesses((prev) =>
        prev.map((p) => {
          if (p.name === "System Idle Process") return { ...p, cpu: 100 - cpu };
          if (p.name === "taskmgr.exe") return { ...p, cpu: Math.min(cpu, 3) };
          if (p.name === "explorer.exe") return { ...p, cpu: Math.floor(Math.random() * 2) };
          return p;
        })
      );
    }, 1000);
    return () => clearInterval(iv);
  }, []);

  const drawGrid = useCallback((canvas: HTMLCanvasElement, history: number[], maxVal: number) => {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    ctx.strokeStyle = "#003300";
    ctx.lineWidth = 1;
    for (let x = 0; x < w; x += 12) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, h);
      ctx.stroke();
    }
    for (let y = 0; y < h; y += 12) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }

    ctx.strokeStyle = "#00FF00";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    const step = w / (history.length - 1);
    history.forEach((val, i) => {
      const norm = Math.min(1, Math.max(0, val / maxVal));
      const px = i * step;
      const py = h - norm * (h - 4) - 2;
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();
  }, []);

  useEffect(() => {
    if (tab === "Performance") {
      if (canvasCpuRef.current) drawGrid(canvasCpuRef.current, cpuHistory, 100);
      if (canvasMemRef.current) drawGrid(canvasMemRef.current, memHistory, 300);
    }
  }, [tab, cpuHistory, memHistory, drawGrid]);

  const endSelectedTask = () => {
    if (selectedTask) {
      closeWindow(selectedTask);
      setSelectedTask(null);
    }
  };

  const switchSelectedTask = () => {
    if (selectedTask) {
      focusWindow(selectedTask);
    }
  };

  const endSelectedProc = () => {
    if (selectedProc && selectedProc !== "System Idle Process" && selectedProc !== "System") {
      setProcesses((prev) => prev.filter((p) => p.name !== selectedProc));
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#ECE9D8", fontFamily: "Tahoma, sans-serif", fontSize: 11, display: "flex", flexDirection: "column", userSelect: "none", overflow: "hidden" }}>
      <div style={{ display: "flex", padding: "4px 6px 0", gap: 2, background: "#ECE9D8", borderBottom: "1px solid #ACA899" }}>
        {(["Applications", "Processes", "Performance", "Networking", "Users"] as Tab[]).map((tabName) => (
          <button
            key={tabName}
            onClick={() => setTab(tabName)}
            style={{
              padding: "3px 10px",
              fontSize: 11,
              fontFamily: "Tahoma, sans-serif",
              border: "1px solid #ACA899",
              borderBottom: tab === tabName ? "1px solid #ECE9D8" : "1px solid #ACA899",
              background: tab === tabName ? "#ECE9D8" : "#E0DCC8",
              marginBottom: tab === tabName ? -1 : 0,
              borderRadius: "3px 3px 0 0",
              cursor: "pointer",
              fontWeight: tab === tabName ? "bold" : "normal",
              zIndex: tab === tabName ? 2 : 1,
            }}
          >
            {tabName === "Applications" ? t("applications") :
             tabName === "Processes" ? t("processes") :
             tabName === "Performance" ? t("performance") :
             tabName === "Networking" ? t("networking") :
             t("users")}
          </button>
        ))}
      </div>

      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: 8, overflow: "hidden" }}>
        {tab === "Applications" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
            <div style={{ flex: 1, background: "#FFF", border: "1px solid #7F9DB9", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#ECE9D8", borderBottom: "1px solid #ACA899", textAlign: "left" }}>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899", width: "70%" }}>{t("task")}</th>
                    <th style={{ padding: "3px 6px" }}>{t("status")}</th>
                  </tr>
                </thead>
                <tbody>
                  {windows.filter((w) => w.state !== "minimized").map((w) => (
                    <tr
                      key={w.id}
                      onClick={() => setSelectedTask(w.id)}
                      onDoubleClick={() => focusWindow(w.id)}
                      style={{
                        background: selectedTask === w.id ? "#0A246A" : "transparent",
                        color: selectedTask === w.id ? "#FFF" : "#000",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "3px 6px", display: "flex", alignItems: "center", gap: 6 }}>
                        {w.icon && <img src={assetUrl(`assets/icons/${w.icon}`)} alt="" style={{ width: 16, height: 16 }} />}
                        <span>{w.title}</span>
                      </td>
                      <td style={{ padding: "3px 6px" }}>{t("running")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
              <button
                disabled={!selectedTask}
                onClick={endSelectedTask}
                style={{ padding: "3px 12px", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: selectedTask ? "pointer" : "default" }}
              >
                {t("endTask")}
              </button>
              <button
                disabled={!selectedTask}
                onClick={switchSelectedTask}
                style={{ padding: "3px 12px", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: selectedTask ? "pointer" : "default" }}
              >
                {t("switchTo")}
              </button>
              <button
                onClick={() => openWindow("run")}
                style={{ padding: "3px 12px", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}
              >
                {t("newTask")}
              </button>
            </div>
          </div>
        )}

        {tab === "Processes" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflow: "hidden" }}>
            <div style={{ flex: 1, background: "#FFF", border: "1px solid #7F9DB9", overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#ECE9D8", borderBottom: "1px solid #ACA899", textAlign: "left" }}>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899" }}>{t("imageName")}</th>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899" }}>User Name</th>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899", textAlign: "right" }}>{t("cpu")}</th>
                    <th style={{ padding: "3px 6px", textAlign: "right" }}>{t("memUsage")}</th>
                  </tr>
                </thead>
                <tbody>
                  {processes.map((p, idx) => (
                    <tr
                      key={p.name + idx}
                      onClick={() => setSelectedProc(p.name)}
                      style={{
                        background: selectedProc === p.name ? "#0A246A" : "transparent",
                        color: selectedProc === p.name ? "#FFF" : "#000",
                        cursor: "pointer"
                      }}
                    >
                      <td style={{ padding: "2px 6px" }}>{p.name}</td>
                      <td style={{ padding: "2px 6px" }}>{p.user}</td>
                      <td style={{ padding: "2px 6px", textAlign: "right" }}>{String(p.cpu).padStart(2, "0")}</td>
                      <td style={{ padding: "2px 6px", textAlign: "right" }}>{p.mem.toLocaleString()} K</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11 }}>
                <input type="checkbox" defaultChecked />
                Show processes from all users
              </label>
              <button
                onClick={endSelectedProc}
                style={{ padding: "3px 14px", background: "linear-gradient(180deg,#FFF,#ECE9D8)", border: "1px solid #7F9DB9", borderRadius: 3, cursor: "pointer" }}
              >
                {t("endProcess")}
              </button>
            </div>
          </div>
        )}

        {tab === "Performance" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10 }}>
              <div style={{ border: "1px solid #ACA899", padding: 6, background: "#ECE9D8" }}>
                <div style={{ fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>{t("cpuUsage")}</div>
                <div style={{ height: 60, background: "#000", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 2 }}>
                  <div style={{ width: 36, height: `${cpuCurrent}%`, background: "linear-gradient(to top,#00CC00,#00FF00)", transition: "height 0.3s" }} />
                </div>
                <div style={{ textAlign: "center", fontWeight: "bold", marginTop: 4, fontSize: 12, color: "#006600" }}>{cpuCurrent}%</div>
              </div>
              <div style={{ border: "1px solid #ACA899", padding: 6, background: "#ECE9D8" }}>
                <div style={{ fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>{t("cpuUsageHistory")}</div>
                <canvas ref={canvasCpuRef} width={280} height={76} style={{ width: "100%", height: 76, display: "block" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "100px 1fr", gap: 10 }}>
              <div style={{ border: "1px solid #ACA899", padding: 6, background: "#ECE9D8" }}>
                <div style={{ fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>{t("memUsageHistory")}</div>
                <div style={{ height: 60, background: "#000", display: "flex", alignItems: "flex-end", justifyContent: "center", padding: 2 }}>
                  <div style={{ width: 36, height: "35%", background: "linear-gradient(to top,#00CC00,#00FF00)" }} />
                </div>
                <div style={{ textAlign: "center", fontWeight: "bold", marginTop: 4, fontSize: 11 }}>184 MB</div>
              </div>
              <div style={{ border: "1px solid #ACA899", padding: 6, background: "#ECE9D8" }}>
                <div style={{ fontWeight: "bold", fontSize: 10, marginBottom: 4 }}>Page File Usage History</div>
                <canvas ref={canvasMemRef} width={280} height={76} style={{ width: "100%", height: 76, display: "block" }} />
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, fontSize: 10 }}>
              <div style={{ border: "1px solid #ACA899", padding: 6 }}>
                <div style={{ fontWeight: "bold", color: "#003399", marginBottom: 2 }}>{t("totals")}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>{t("handles")}</span><span>8,420</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>{t("threads")}</span><span>412</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Processes</span><span>{processes.length}</span></div>
              </div>
              <div style={{ border: "1px solid #ACA899", padding: 6 }}>
                <div style={{ fontWeight: "bold", color: "#003399", marginBottom: 2 }}>{t("physicalMemory")}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Total</span><span>523,764</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>Available</span><span>284,520</span></div>
                <div style={{ display: "flex", justifyContent: "space-between" }}><span>System Cache</span><span>198,412</span></div>
              </div>
            </div>
          </div>
        )}

        {tab === "Networking" && (
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8, background: "#FFF", border: "1px solid #7F9DB9", padding: 10 }}>
            <div style={{ fontWeight: "bold", color: "#003399" }}>Local Area Connection</div>
            <div style={{ height: 100, background: "#000", border: "1px solid #003300", position: "relative" }}>
              <div style={{ position: "absolute", bottom: 4, left: 8, color: "#00FF00", fontSize: 10 }}>100 Mbps (1.2% Network Utilization)</div>
            </div>
          </div>
        )}

        {tab === "Users" && (
          <div style={{ flex: 1, background: "#FFF", border: "1px solid #7F9DB9", overflowY: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
              <thead>
                <tr style={{ background: "#ECE9D8", borderBottom: "1px solid #ACA899", textAlign: "left" }}>
                  <th style={{ padding: "3px 6px" }}>User</th>
                  <th style={{ padding: "3px 6px" }}>ID</th>
                  <th style={{ padding: "3px 6px" }}>Status</th>
                  <th style={{ padding: "3px 6px" }}>Client Name</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ background: "#0A246A", color: "#FFF" }}>
                  <td style={{ padding: "3px 6px" }}>{userName}</td>
                  <td style={{ padding: "3px 6px" }}>0</td>
                  <td style={{ padding: "3px 6px" }}>Active</td>
                  <td style={{ padding: "3px 6px" }}>Console</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div style={{ display: "flex", borderTop: "1px solid #ACA899", background: "#ECE9D8", padding: "2px 8px", fontSize: 10, color: "#333", gap: 16 }}>
        <span>Processes: {processes.length}</span>
        <span>CPU Usage: {cpuCurrent}%</span>
        <span>Commit Charge: 184M / 1258M</span>
      </div>
    </div>
  );
}
