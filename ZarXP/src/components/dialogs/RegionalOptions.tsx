import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

export default function RegionalOptions({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const { lang, setLang } = useLangStore();

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 11, background: "#ECE9D8", userSelect: "none", overflow: "hidden" }}>
      <div style={{ padding: "6px 8px 0", flexShrink: 0 }}>
        <button style={{ padding: "3px 10px", fontSize: 11, background: "#ECE9D8", borderTop: "1px solid #FFF", borderLeft: "1px solid #FFF", borderRight: "1px solid #ACA899", borderBottom: "1px solid #ECE9D8", borderRadius: "3px 3px 0 0", marginBottom: -1, position: "relative", zIndex: 2 }}>
          Regional Options
        </button>
      </div>
      <div style={{ flex: 1, margin: "0 8px", border: "1px solid #ACA899", padding: 12, overflow: "auto" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 14 }}>
          <img src={assetUrl("assets/icons/RegionalSettings.png")} alt="" style={{ width: 32, height: 32 }} />
          <div>
            <div style={{ fontWeight: "bold" }}>Language for the interface:</div>
            <div style={{ color: "#555" }}>Select the language to display menus and dialogs.</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
          <span>Display language:</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as "en" | "es")}
            style={{ width: 220, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}
          >
            <option value="en">English (United States)</option>
            <option value="es">Espanol (Espana)</option>
          </select>
        </div>
        <div style={{ borderTop: "1px solid #C9C7B4", paddingTop: 10, color: "#555" }}>
          The change takes effect immediately for the Start menu, the desktop and system dialogs.
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 6, padding: "6px 10px 10px", flexShrink: 0 }}>
        <button onClick={() => closeWindow(id)} style={{ minWidth: 72, height: 23, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>OK</button>
        <button onClick={() => closeWindow(id)} style={{ minWidth: 72, height: 23, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Cancel</button>
        <button style={{ minWidth: 72, height: 23, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>Apply</button>
      </div>
    </div>
  );
}
