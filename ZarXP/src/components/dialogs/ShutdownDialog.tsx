import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  header: { display: "flex", alignItems: "center", gap: 8, padding: "7px 10px", background: "linear-gradient(180deg, #1868CE 0%, #1072D8 8%, #0A5BC4 40%, #0A54BA 88%, #094FAE 100%)", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  headerIcon: { width: 34, height: 34, background: "linear-gradient(180deg,#F28A5E 0%,#E85A3A 40%,#D43B1E 100%)", borderRadius: 4, display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #B22B10", boxShadow: "inset 0 1px 1px rgba(255,255,255,0.5)" },
  body: { flex: 1, padding: "14px 14px 8px", display: "flex", flexDirection: "column", gap: 5, background: "#ECE9D8" },
  radioRow: { display: "flex", alignItems: "center", gap: 7, cursor: "pointer", padding: "2px 0" },
  selectRow: { display: "flex", alignItems: "center", gap: 6, marginTop: 10 },
  select: { width: 190, height: 22, fontSize: 12, fontFamily: "Tahoma, sans-serif" },
  buttons: { display: "flex", justifyContent: "center", gap: 6, padding: "8px 12px 10px", background: "#ECE9D8", flexShrink: 0 },
  btn: { minWidth: 72, height: 24, fontSize: 12, cursor: "pointer", background: "linear-gradient(180deg,#FDFDFB,#F0EFE2 60%,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, fontFamily: "Tahoma, sans-serif" },
};

export default function ShutdownDialog({ id }: { id: string }) {
  const [action, setAction] = useState("shut-down");
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const confirm = () => {
    window.dispatchEvent(new CustomEvent("zarxp-power", { detail: { action } }));
  };

  return (
    <div style={s.container}>
      <div style={s.header}>
        <div style={s.headerIcon}>
          <img src={assetUrl("assets/icons/Power.png")} alt="" style={{ width: 22, height: 22 }} />
        </div>
        <span>Shut Down Windows</span>
      </div>
      <div style={s.body}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <img src={assetUrl("assets/images/xp-logo.png")} alt="" style={{ width: 44, height: 44 }} />
          <span style={{ fontSize: 11, color: "#333" }}>What do you want the computer to do?</span>
        </div>
        {[
          { value: "shut-down", label: "Shut down" },
          { value: "restart", label: "Restart" },
          { value: "stand-by", label: "Stand by" },
        ].map((opt) => (
          <label key={opt.value} style={s.radioRow} onClick={() => setAction(opt.value)}>
            <span className={`xp-radio${action === opt.value ? " xp-radio-checked" : ""}`} />
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
        <button style={s.btn} onClick={confirm}>OK</button>
        <button style={s.btn} onClick={() => closeWindow(id)}>Cancel</button>
        <button style={s.btn}>Help</button>
      </div>
    </div>
  );
}
