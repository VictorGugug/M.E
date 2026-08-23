import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { playSound } from "../../utils/sound";
import { assetUrl } from "../../utils/assets"

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  header: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "linear-gradient(180deg, #0a246a, #3a6ea5)", color: "#fff", fontWeight: 700, fontSize: 13 },
  logo: { width: 32, height: 32 },
  body: { flex: 1, padding: "16px 16px 8px", display: "flex", flexDirection: "column", gap: 6 },
  radioRow: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer" },
  selectRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 8 },
  select: { width: 180, height: 22, fontSize: 12 },
  buttons: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "6px 12px", borderTop: "1px solid #d4d0c8" },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
};

export default function ShutdownDialog({ id }: { id: string }) {
  const [action, setAction] = useState("shut-down");
  const closeWindow = useWindowStore((s) => s.closeWindow);
  playSound("Windows XP Shutdown.wav");

  return (
    <div style={s.container}>
      <div style={s.header}>
        <img src={assetUrl("assets/icons/Power.png")} alt="" style={s.logo} />
        <span>Shut Down Windows</span>
      </div>
      <div style={s.body}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          <img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 48, height: 48 }} />
          <span style={{ fontSize: 11, color: "#333" }}>What do you want the computer to do?</span>
        </div>
        {[
          { value: "shut-down", label: "Shut down" },
          { value: "restart", label: "Restart" },
          { value: "stand-by", label: "Stand by" },
        ].map((opt) => (
          <label key={opt.value} style={s.radioRow}>
            <span className={`xp-radio${action === opt.value ? " xp-radio-checked" : ""}`} />
            <input type="radio" name="action" style={{ display: "none" }} checked={action === opt.value} onChange={() => setAction(opt.value)} />
            <span>{opt.label}</span>
          </label>
        ))}
        <div style={s.selectRow}>
          <span>Option:</span>
          <select style={s.select} value={action} onChange={(e) => setAction(e.target.value)}>
            <option value="shut-down">Shut down</option>
            <option value="restart">Restart</option>
            <option value="stand-by">Stand by</option>
          </select>
        </div>
      </div>
      <div style={s.buttons}>
        <button style={s.btn}>OK</button>
        <button style={s.btn} onClick={() => closeWindow(id)}>Cancel</button>
        <button style={s.btn}>Help</button>
      </div>
    </div>
  );
}
