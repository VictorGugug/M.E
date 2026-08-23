import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";

const styles: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  header: { display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", background: "linear-gradient(180deg, #0a246a, #3a6ea5)", color: "#fff", fontWeight: 700, fontSize: 13 },
  icon: { width: 24, height: 24 },
  body: { flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: 8 },
  row: { display: "flex", alignItems: "center", gap: 6 },
  label: { whiteSpace: "nowrap" },
  input: { flex: 1, height: 22, border: "1px solid #7f9db9", padding: "0 4px", fontSize: 12, outline: "none" },
  buttons: { display: "flex", justifyContent: "flex-end", gap: 6, padding: "8px 12px", borderTop: "1px solid #d4d0c8" },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
};

export default function RunDialog({ id }: { id: string }) {
  const [value, setValue] = useState("");
  const closeWindow = useWindowStore((s) => s.closeWindow);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <img src="/assets/icons/Run.png" alt="" style={styles.icon} />
        <span>Run</span>
      </div>
      <div style={styles.body}>
        <div style={styles.row}>
          <span style={styles.label}>Open:</span>
          <input style={styles.input} value={value} onChange={(e) => setValue(e.target.value)} autoFocus />
        </div>
      </div>
      <div style={styles.buttons}>
        <button style={styles.btn} onClick={() => closeWindow(id)}>OK</button>
        <button style={styles.btn} onClick={() => closeWindow(id)}>Cancel</button>
        <button style={styles.btn}>Browse...</button>
      </div>
    </div>
  );
}
