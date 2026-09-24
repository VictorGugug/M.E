import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAY_HEADERS = ["S", "M", "T", "W", "T", "F", "S"];
const ZONES = ["(GMT-08:00) Pacific Time (US & Canada)", "(GMT-06:00) Central Time (US & Canada)", "(GMT-05:00) Eastern Time (US & Canada)", "(GMT+00:00) Greenwich Mean Time", "(GMT+01:00) Madrid, Paris, Rome"];

function AnalogClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => { const interval = setInterval(() => setNow(new Date()), 1000); return () => clearInterval(interval); }, []);
  const seconds = now.getSeconds();
  const minutes = now.getMinutes();
  const hours = now.getHours() % 12;
  const hand = (angle: number, length: number, width: number, color: string) => { const radians = ((angle - 90) * Math.PI) / 180; return <line x1="50" y1="50" x2={50 + length * Math.cos(radians)} y2={50 + length * Math.sin(radians)} stroke={color} strokeWidth={width} strokeLinecap="round" />; };
  return <svg viewBox="0 0 100 100" style={{ width: 130, height: 130 }}>{Array.from({ length: 12 }, (_, index) => { const angle = ((index * 30 - 90) * Math.PI) / 180; return <rect key={index} x={50 + 42 * Math.cos(angle) - 2.5} y={50 + 42 * Math.sin(angle) - 2.5} width="5" height="5" fill="#3A6EA5" />; })}{hand(hours * 30 + minutes * .5, 24, 4, "#1E5C3A")}{hand(minutes * 6, 36, 3, "#1E5C3A")}{hand(seconds * 6, 38, 1, "#C43B3B")}<circle cx="50" cy="50" r="2.5" fill="#7A1F1F" /></svg>;
}

export default function DateTimeDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [tab, setTab] = useState("date");
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());
  const [zone, setZone] = useState(ZONES[1]);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  return <div className="xp-dialog-surface"><div className="xp-tabbar"><button className={`xp-tab ${tab === "date" ? "active" : ""}`} onClick={() => setTab("date")}>Date & Time</button><button className={`xp-tab ${tab === "zone" ? "active" : ""}`} onClick={() => setTab("zone")}>Time Zone</button></div><div className="xp-tabpanel">{tab === "date" ? <div style={{ display: "flex", gap: 14 }}><div className="xp-group-box" style={{ minWidth: 220 }}><div className="xp-folder-group-title">Date</div><div style={{ display: "flex", gap: 4 }}><select className="xp-select" style={{ flex: 1 }} value={month} onChange={(event) => setMonth(Number(event.target.value))}>{MONTHS.map((item, index) => <option key={item} value={index}>{item}</option>)}</select><select className="xp-select" style={{ width: 68 }} value={year} onChange={(event) => setYear(Number(event.target.value))}>{Array.from({ length: 40 }, (_, index) => now.getFullYear() - 20 + index).map((item) => <option key={item} value={item}>{item}</option>)}</select></div><div style={{ display: "grid", gridTemplateColumns: "repeat(7, 26px)", gap: 1, marginTop: 8 }}>{DAY_HEADERS.map((day, index) => <div key={index} style={{ textAlign: "center", fontWeight: "bold", color: "#666" }}>{day}</div>)}{Array.from({ length: firstDay }, (_, index) => <div key={`empty-${index}`} />)}{Array.from({ length: daysInMonth }, (_, index) => <button key={index + 1} className="xp-icon-button" style={{ width: 26, height: 24, background: index + 1 === selected ? "#316AC5" : "transparent", color: index + 1 === selected ? "#FFF" : "#000", borderRadius: 0 }} onClick={() => setSelected(index + 1)}>{index + 1}</button>)}</div></div><div className="xp-group-box" style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}><div className="xp-folder-group-title" style={{ alignSelf: "stretch" }}>Time</div><div style={{ background: "#FFF", border: "1px solid #7F9DB9", padding: 6 }}><AnalogClock /></div><div style={{ display: "flex", alignItems: "center", gap: 5, border: "1px solid #7F9DB9", background: "#FFF", padding: "3px 6px" }}><span style={{ fontFamily: "Tahoma, sans-serif", fontSize: 14 }}>{now.toLocaleTimeString("en-US", { hour12: false })}</span><img src={assetUrl("assets/icons/DateandTime.png")} alt="" style={{ width: 16, height: 16 }} /></div></div></div> : <div className="xp-group-box"><div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}><img src={assetUrl("assets/icons/DateandTime.png")} alt="" style={{ width: 32, height: 32 }} /><select className="xp-select" style={{ flex: 1 }} value={zone} onChange={(event) => setZone(event.target.value)}>{ZONES.map((item) => <option key={item}>{item}</option>)}</select></div><label className="xp-form-row"><input className="xp-native-checkbox" type="checkbox" defaultChecked />Automatically adjust clock for daylight saving changes</label></div>}</div><div className="xp-status-strip"><span>Current time zone: {zone.includes("Central") ? "Central Standard Time" : zone.includes("Pacific") ? "Pacific Standard Time" : zone.includes("Eastern") ? "Eastern Standard Time" : zone.includes("Madrid") ? "Romance Standard Time" : "Greenwich Mean Time"}</span></div><div className="xp-dialog-footer center"><button className="xp-button" onClick={() => closeWindow(id)}>OK</button><button className="xp-button" onClick={() => closeWindow(id)}>Cancel</button><button className="xp-button">Apply</button></div></div>;
}
