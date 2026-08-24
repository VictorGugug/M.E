import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const ZONES = ["(GMT-08:00) Pacific Time (US & Canada)", "(GMT-06:00) Central Time (US & Canada)", "(GMT-05:00) Eastern Time (US & Canada)", "(GMT+00:00) Greenwich Mean Time", "(GMT+01:00) Madrid, Paris, Rome"];

function AnalogClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const iv = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(iv); }, []);
  const sec = now.getSeconds(), min = now.getMinutes(), hr = now.getHours() % 12;
  const hand = (angle: number, length: number, width: number, color: string) => {
    const rad = ((angle - 90) * Math.PI) / 180;
    return <line x1="50" y1="50" x2={50 + length * Math.cos(rad)} y2={50 + length * Math.sin(rad)} stroke={color} strokeWidth={width} strokeLinecap="round" />;
  };
  return (
    <svg viewBox="0 0 100 100" style={{ width: 130, height: 130 }}>
      {Array.from({ length: 12 }, (_, i) => {
        const a = ((i * 30 - 90) * Math.PI) / 180;
        return <rect key={i} x={50 + 42 * Math.cos(a) - 2.5} y={50 + 42 * Math.sin(a) - 2.5} width="5" height="5" fill="#3A6EA5" />;
      })}
      {hand(hr * 30 + min * 0.5, 24, 4, "#1E5C3A")}
      {hand(min * 6, 36, 3, "#1E5C3A")}
      {hand(sec * 6, 38, 1, "#C43B3B")}
      <circle cx="50" cy="50" r="2.5" fill="#7A1F1F" />
    </svg>
  );
}

export default function DateTimeDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const [tab, setTab] = useState("date");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());
  const [zone, setZone] = useState(ZONES[1]);

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const tabBtn = (tid: string, label: string) => (
    <button
      onClick={() => setTab(tid)}
      style={{ padding: "3px 10px", fontSize: 11, fontFamily: "Tahoma, sans-serif", background: tab === tid ? "#ECE9D8" : "linear-gradient(180deg,#FDFDFB,#E4E2D0)", borderTop: "1px solid #FFF", borderLeft: "1px solid #FFF", borderRight: "1px solid #ACA899", borderBottom: tab === tid ? "1px solid #ECE9D8" : "1px solid #ACA899", borderRadius: "3px 3px 0 0", marginBottom: tab === tid ? -1 : 0, position: "relative", zIndex: tab === tid ? 2 : 1 }}
    >
      {label}
    </button>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 11, userSelect: "none", background: "#ECE9D8", overflow: "hidden" }}>
      <div style={{ padding: "6px 8px 0", flexShrink: 0 }}>
        {tabBtn("date", "Date & Time")}
        {tabBtn("zone", "Time Zone")}
      </div>
      {tab === "date" ? (
        <div style={{ flex: 1, display: "flex", gap: 14, padding: 10, border: "1px solid #ACA899", margin: "0 8px", background: "#ECE9D8", overflow: "auto" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 4, minWidth: 200 }}>
            <div style={{ fontWeight: "bold", color: "#0A246A", borderBottom: "1px solid #C9C7B4", paddingBottom: 2 }}>Date</div>
            <div style={{ display: "flex", gap: 4 }}>
              <select value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ flex: 1, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
                {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
              </select>
              <select value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ width: 66, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
                {Array.from({ length: 40 }, (_, i) => now.getFullYear() - 20 + i).map((y) => <option key={y} value={y}>{y}</option>)}
              </select>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 26px)", gap: 1, fontSize: 11 }}>
              {DAY_HEADERS.map((d, i) => <div key={i} style={{ textAlign: "center", fontWeight: "bold", fontSize: 10, color: "#666", padding: 2 }}>{d}</div>)}
              {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
              {Array.from({ length: daysInMonth }, (_, i) => (
                <div key={i + 1} style={{ textAlign: "center", padding: 2, cursor: "pointer", background: i + 1 === selected ? "#3A6EA5" : "transparent", color: i + 1 === selected ? "#FFF" : "#333", borderRadius: 2 }} onClick={() => setSelected(i + 1)}>{i + 1}</div>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6, alignItems: "center" }}>
            <div style={{ fontWeight: "bold", color: "#0A246A", alignSelf: "stretch", borderBottom: "1px solid #C9C7B4", paddingBottom: 2 }}>Time</div>
            <div style={{ background: "#FFF", border: "1px solid #7F9DB9", padding: 6 }}>
              <AnalogClock />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 4, border: "1px solid #7F9DB9", background: "#FFF", padding: "2px 6px" }}>
              <span style={{ fontFamily: "Consolas, monospace", fontSize: 14 }}>{now.toLocaleTimeString("en-US", { hour12: false })}</span>
              <img src={assetUrl("assets/icons/DateandTime.png")} alt="" style={{ width: 16, height: 16 }} />
            </div>
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, padding: 10, border: "1px solid #ACA899", margin: "0 8px", background: "#ECE9D8", overflow: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, background: "radial-gradient(circle at 35% 35%, #7EA8E0, #2E5CA8 60%, #1A3C7A)", borderRadius: "50%", position: "relative", flexShrink: 0 }}>
              <div style={{ position: "absolute", left: 6, top: 8, width: 14, height: 10, background: "#3A8A3A", borderRadius: 1 }} />
            </div>
            <select value={zone} onChange={(e) => setZone(e.target.value)} style={{ flex: 1, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}>
              {ZONES.map((z) => <option key={z}>{z}</option>)}
            </select>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span className="xp-checkbox xp-checkbox-checked" />
            Automatically adjust clock for daylight saving changes
          </label>
        </div>
      )}
      <div style={{ padding: "5px 10px", fontSize: 11, borderTop: "1px solid #DADAD8", flexShrink: 0 }}>
        Current time zone: {zone.includes("Central") ? "Central Standard Time" : zone.includes("Pacific") ? "Pacific Standard Time" : zone.includes("Eastern") ? "Eastern Standard Time" : zone.includes("Madrid") ? "Romance Standard Time" : "Greenwich Mean Time"}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "4px 10px 10px", flexShrink: 0 }}>
        <button onClick={() => closeWindow(id)} style={{ minWidth: 72, height: 24, fontSize: 11, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, fontFamily: "Tahoma, sans-serif" }}>OK</button>
        <button onClick={() => closeWindow(id)} style={{ minWidth: 72, height: 24, fontSize: 11, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, fontFamily: "Tahoma, sans-serif" }}>Cancel</button>
        <button style={{ minWidth: 72, height: 24, fontSize: 11, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, fontFamily: "Tahoma, sans-serif" }}>Apply</button>
      </div>
    </div>
  );
}

