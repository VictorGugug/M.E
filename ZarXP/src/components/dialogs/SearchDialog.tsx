import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

const TYPES = [
  { value: "pictures", label: "Pictures and photos", icon: "assets/xpui/icon/folder/pictures.png" },
  { value: "documents", label: "Documents (word processing, spreadsheet, etc.)", icon: "assets/xpui/icon/folder/documents.png" },
  { value: "music", label: "Music and sound", icon: "assets/xpui/icon/folder/music.png" },
  { value: "all", label: "All files and folders", icon: "assets/xpui/icon/folder/closed.png" },
  { value: "computers", label: "Computers or people", icon: "assets/xpui/icon/computer.png" },
  { value: "internet", label: "Information on the Internet", icon: "assets/xpui/icon/internet.png" },
];

export default function SearchDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[] | null>(null);

  const run = () => {
    if (!query.trim()) return;
    setResults([
      "Search Results",
      "There is nothing to display in this simulation yet.",
      `Searched for "${query}"${type ? ` in ${TYPES.find((t) => t.value === type)?.label}` : ""}.`,
    ]);
  };

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 11, userSelect: "none", overflow: "hidden" }}>
      <div style={{ width: 210, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", display: "flex", flexDirection: "column", padding: 10 }}>
        <div style={{ background: "rgba(255,255,255,0.7)", borderRadius: "4px 4px 0 0", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "5px 10px", color: "#215DC6", fontWeight: "bold", background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)" }}>Search Companion</div>
          <div style={{ padding: "4px 10px", flex: 1, overflowY: "auto" }}>
            {type === null && (
              <>
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>What do you want to search for?</div>
                {TYPES.map((t) => (
                  <div
                    key={t.value}
                    onClick={() => setType(t.value)}
                    style={{ display: "flex", alignItems: "center", gap: 7, padding: "4px 2px", color: "#215DC6", cursor: "pointer" }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  >
                    <img src={assetUrl(t.icon)} alt="" style={{ width: 16, height: 16 }} />
                    <span>{t.label}</span>
                  </div>
                ))}
              </>
            )}
            {type !== null && (
              <>
                <div style={{ fontWeight: "bold", marginBottom: 8 }}>{TYPES.find((t) => t.value === type)?.label}</div>
                <div style={{ marginBottom: 4 }}>All or part of the file name:</div>
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") run(); }}
                  style={{ width: "100%", border: "1px solid #7F9DB9", padding: "2px 4px", fontSize: 11, marginBottom: 8, outline: "none" }}
                />
                <div style={{ display: "flex", gap: 6, marginBottom: 10 }}>
                  <button onClick={run} style={{ minWidth: 62, height: 22, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Search</button>
                  <button onClick={() => { setType(null); setResults(null); setQuery(""); }} style={{ minWidth: 62, height: 22, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Cancel</button>
                </div>
                {results && (
                  <div style={{ borderTop: "1px solid #B8CFEC", paddingTop: 6 }}>
                    {results.map((r, i) => <div key={i} style={{ marginBottom: 3, color: i === 0 ? "#215DC6" : "#333" }}>{r}</div>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
        <div style={{ position: "relative", height: 110, flexShrink: 0 }}>
          <div style={{ position: "absolute", bottom: 104, left: 10, right: 2, background: "#FFFFE1", border: "1px solid #000", borderRadius: 6, padding: "6px 8px", fontSize: 11, fontWeight: "bold", filter: "drop-shadow(rgba(0,0,0,0.4) 2px 2px 2px)" }}>
            What do you want to find?
            <div style={{ position: "absolute", bottom: -9, left: 26, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "9px solid #000" }} />
            <div style={{ position: "absolute", bottom: -8, left: 26, width: 0, height: 0, borderLeft: "8px solid transparent", borderRight: "8px solid transparent", borderTop: "8px solid #FFFFE1" }} />
          </div>
          <img src={assetUrl("assets/xpui/search/rover.png")} alt="Rover" style={{ position: "absolute", bottom: -6, left: 8, width: 92, filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }} />
        </div>
      </div>
      <div style={{ flex: 1, background: "#FFF", borderLeft: "5px solid #ECE9D8", padding: 10, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: "bold", color: "#215DC6", borderBottom: "1px solid #C9C7B4", paddingBottom: 3, marginBottom: 8 }}>Search Results</div>
        {results ? (
          <div style={{ fontSize: 11, color: "#333", lineHeight: 1.6 }}>{results.slice(1).map((r, i) => <div key={i}>{r}</div>)}</div>
        ) : (
          <div style={{ color: "#888", display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
            To start your search, follow the instructions in the left pane.
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: 8 }}>
          <button onClick={() => closeWindow(id)} style={{ minWidth: 62, height: 22, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Close</button>
        </div>
      </div>
    </div>
  );
}
