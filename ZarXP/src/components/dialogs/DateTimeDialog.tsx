import { useState, useEffect, useCallback } from "react";
import { useWindowStore } from "../../store/windowStore";

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none", overflow: "hidden" },
  body: { flex: 1, padding: 12, display: "flex", gap: 16, background: "#ece9d8", overflow: "hidden", flexWrap: "wrap", alignContent: "flex-start" },
  calSection: { display: "flex", flexDirection: "column", gap: 4, minWidth: 190 },
  calHeader: { display: "flex", alignItems: "center", justifyContent: "space-between", fontWeight: 700, fontSize: 12 },
  calNav: { cursor: "pointer", padding: "0 4px", fontSize: 14, userSelect: "none" },
  calGrid: { display: "grid", gridTemplateColumns: "repeat(7, 26px)", gap: 1, fontSize: 11 },
  calDay: { textAlign: "center", padding: 2, color: "#333", cursor: "pointer" },
  calDayHeader: { textAlign: "center", padding: 2, fontWeight: 700, fontSize: 10, color: "#666" },
  today: { background: "#3a6ea5", color: "#fff", borderRadius: 2 },
  clockSection: { display: "flex", flexDirection: "column", alignItems: "center", gap: 8, minWidth: 140 },
  clock: { fontFamily: "Consolas, monospace", fontSize: 28, fontWeight: 700, color: "#0a246a", padding: "8px 16px", border: "1px solid #7f9db9", background: "#fff" },
  dateLabel: { fontSize: 13, fontWeight: 700 },
  row: { display: "flex", alignItems: "center", gap: 6, marginTop: 6 },
  select: { height: 22, fontSize: 12, width: 160 },
  buttons: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "6px 12px", borderTop: "1px solid #d4d0c8", background: "#ece9d8" },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
};

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

function Calendar() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [month, setMonth] = useState(now.getMonth());
  const [selected, setSelected] = useState(now.getDate());

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const prev = useCallback(() => { if (month === 0) { setYear((y) => y - 1); setMonth(11); } else setMonth((m) => m - 1); }, [month]);
  const next = useCallback(() => { if (month === 11) { setYear((y) => y + 1); setMonth(0); } else setMonth((m) => m + 1); }, [month]);

  return (
    <div style={s.calSection}>
      <div style={s.calHeader}>
        <span style={s.calNav} onClick={prev}>&lt;</span>
        <span>{MONTHS[month]} {year}</span>
        <span style={s.calNav} onClick={next}>&gt;</span>
      </div>
      <div style={s.calGrid}>
        {DAYS.map((d) => <div key={d} style={s.calDayHeader}>{d}</div>)}
        {Array.from({ length: firstDay }, (_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }, (_, i) => (
          <div key={i + 1} style={{ ...s.calDay, ...(i + 1 === selected ? s.today : {}) }} onClick={() => setSelected(i + 1)}>{i + 1}</div>
        ))}
      </div>
      <div style={s.row}>
        <span>Time zone:</span>
        <select style={s.select} defaultValue="(GMT-05:00) Eastern Time">
          <option>(GMT-05:00) Eastern Time</option>
          <option>(GMT-08:00) Pacific Time</option>
          <option>(GMT+00:00) UTC</option>
        </select>
      </div>
    </div>
  );
}

function Clock() {
  const [time, setTime] = useState(new Date());
  useEffect(() => { const h = setInterval(() => setTime(new Date()), 1000); return () => clearInterval(h); }, []);
  const fmt = (n: number) => n.toString().padStart(2, "0");
  return (
    <div style={s.clockSection}>
      <div style={s.dateLabel}>{MONTHS[time.getMonth()]} {time.getDate()}, {time.getFullYear()}</div>
      <div style={s.clock}>{fmt(time.getHours())}:{fmt(time.getMinutes())}:{fmt(time.getSeconds())}</div>
    </div>
  );
}

export default function DateTimeDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  return (
    <div style={s.container}>
      <div style={s.body}>
        <Calendar />
        <Clock />
      </div>
      <div style={s.buttons}>
        <button style={s.btn}>OK</button>
        <button style={s.btn} onClick={() => closeWindow(id)}>Cancel</button>
        <button style={s.btn}>Apply</button>
      </div>
    </div>
  );
}
