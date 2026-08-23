import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none" },
  left: { width: 200, padding: 12, background: "#d4d0c8", borderRight: "1px solid #7f9db9", display: "flex", flexDirection: "column", gap: 8 },
  right: { flex: 1, padding: 12, display: "flex", flexDirection: "column", gap: 8, background: "#fff" },
  title: { fontWeight: 700, fontSize: 11 },
  radioRow: { display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 11 },
  buttons: { display: "flex", gap: 6 },
  btn: { minWidth: 70, height: 24, fontSize: 12, cursor: "pointer", background: "#ece9d8", border: "1px solid #7f9db9", borderTopColor: "#fff", borderLeftColor: "#fff" },
  input: { width: "100%", height: 22, border: "1px solid #7f9db9", padding: "0 4px", fontSize: 12, boxSizing: "border-box" as const },
  resultPlaceholder: { flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#999", fontSize: 11 },
};

const options = [
  { value: "documents", label: "Documents (word processing, spreadsheet, etc.)" },
  { value: "pictures", label: "Pictures and photos" },
  { value: "music", label: "Music" },
  { value: "other", label: "All files and folders" },
];

export default function SearchDialog(_: { id: string }) {
  const [type, setType] = useState("documents");
  const [query, setQuery] = useState("");

  return (
    <div style={s.container}>
      <div style={s.left}>
        <div style={{ alignSelf: "center", textAlign: "center" }}>
          <img src={assetUrl("assets/icons/Search.png")} alt="" style={{ width: 48, height: 48 }} />
        </div>
        <div style={s.title}>What do you want to search for?</div>
        {options.map((o) => (
          <label key={o.value} style={s.radioRow}>
            <span className={`xp-radio${type === o.value ? " xp-radio-checked" : ""}`} />
            <input type="radio" name="searchType" style={{ display: "none" }} checked={type === o.value} onChange={() => setType(o.value)} />
            <span>{o.label}</span>
          </label>
        ))}
        <input style={s.input} placeholder="Search..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <div style={s.buttons}>
          <button style={s.btn}>Search</button>
          <button style={s.btn}>Stop</button>
        </div>
      </div>
      <div style={s.right}>
        <div style={s.resultPlaceholder}>
          {query ? "Searching..." : "Type a search term and click Search."}
        </div>
      </div>
    </div>
  );
}
