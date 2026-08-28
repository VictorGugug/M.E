import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");

export default function SearchDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<string[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [roverPose, setRoverPose] = useState<"idle" | "read" | "think">("idle");
  const [wagFrame, setWagFrame] = useState(0);
  const t = useLangStore((s) => s.t);

  useEffect(() => {
    const iv = setInterval(() => {
      setWagFrame((f) => (f + 1) % 4);
    }, 450);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    if (searching) {
      setRoverPose("read");
      const t = setTimeout(() => {
        setSearching(false);
        setRoverPose("idle");
      }, 1200);
      return () => clearTimeout(t);
    }
  }, [searching]);

  const searchTypes = [
    { value: "pictures", label: t("picturesAndPhotos"), icon: `${OL}/icon/folder/pictures.png` },
    { value: "documents", label: t("documentsSearch"), icon: `${OL}/icon/folder/documents.png` },
    { value: "music", label: t("musicAndSound"), icon: `${OL}/icon/folder/music.png` },
    { value: "all", label: t("allFilesFolders"), icon: `${OL}/icon/folder/closed.png` },
    { value: "computers", label: t("computersOrPeople"), icon: `${OL}/icon/computer.png` },
    { value: "internet", label: t("infoOnInternet"), icon: `${OL}/icon/internet.png` },
  ];

  const run = () => {
    if (!query.trim()) return;
    setSearching(true);
    setRoverPose("read");
    setTimeout(() => {
      setResults([
        t("searchResults"),
        "There are no matching items in this directory.",
        `${t("searchBtn")}: "${query}"`,
      ]);
    }, 1000);
  };

  const getRoverImg = () => {
    if (roverPose === "read") return `${OL}/search/rover_read.png`;
    if (roverPose === "think") return `${OL}/search/rover_think.png`;
    return `${OL}/search/rover.png`;
  };

  return (
    <div style={{ display: "flex", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 11, userSelect: "none", overflow: "hidden" }}>
      <div style={{ width: 190, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", display: "flex", flexDirection: "column", padding: 6 }}>
        <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: "4px 4px 0 0", flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}>
          <div style={{ padding: "4px 8px", color: "#215DC6", fontWeight: "bold", background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)", fontSize: 11 }}>
            {t("searchCompanion")}
          </div>
          <div style={{ padding: "4px 8px", flex: 1, overflowY: "auto" }}>
            {type === null && (
              <>
                <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>{t("whatSearchFor")}</div>
                {searchTypes.map((st) => (
                  <div
                    key={st.value}
                    onClick={() => { setType(st.value); setRoverPose("think"); }}
                    style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 2px", color: "#215DC6", cursor: "pointer", fontSize: 11 }}
                    onMouseEnter={(e) => { e.currentTarget.style.textDecoration = "underline"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.textDecoration = "none"; }}
                  >
                    <img src={st.icon} alt="" style={{ width: 16, height: 16, flexShrink: 0 }} />
                    <span>{st.label}</span>
                  </div>
                ))}
              </>
            )}
            {type !== null && (
              <>
                <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>{searchTypes.find((s) => s.value === type)?.label}</div>
                <div style={{ marginBottom: 3, fontSize: 10 }}>{t("partOfFileName")}</div>
                <input
                  value={query}
                  onChange={(e) => { setQuery(e.target.value); if (roverPose === "idle") setRoverPose("think"); }}
                  onKeyDown={(e) => { if (e.key === "Enter") run(); }}
                  style={{ width: "100%", border: "1px solid #7F9DB9", padding: "2px 4px", fontSize: 11, marginBottom: 6, outline: "none", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", gap: 4, marginBottom: 8 }}>
                  <button onClick={run} style={{ minWidth: 54, height: 21, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>{t("searchBtn")}</button>
                  <button onClick={() => { setType(null); setResults(null); setQuery(""); setRoverPose("idle"); }} style={{ minWidth: 54, height: 21, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>{t("cancelBtn")}</button>
                </div>
                {searching && (
                  <div style={{ fontSize: 10, color: "#215DC6", fontStyle: "italic", marginBottom: 4 }}>Searching...</div>
                )}
                {results && (
                  <div style={{ borderTop: "1px solid #B8CFEC", paddingTop: 4 }}>
                    {results.map((r, i) => <div key={i} style={{ marginBottom: 2, color: i === 0 ? "#215DC6" : "#333", fontSize: 10 }}>{r}</div>)}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        <div style={{ position: "relative", height: 86, flexShrink: 0 }}>
          <div style={{ position: "absolute", bottom: 78, left: 6, right: 2, background: "#FFFFE1", border: "1px solid #000", borderRadius: 5, padding: "4px 6px", fontSize: 10, fontWeight: "bold", filter: "drop-shadow(rgba(0,0,0,0.3) 1px 1px 2px)" }}>
            {searching ? "Searching files..." : t("whatFind")}
            <div style={{ position: "absolute", bottom: -7, left: 20, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "7px solid #000" }} />
            <div style={{ position: "absolute", bottom: -6, left: 20, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid #FFFFE1" }} />
          </div>

          <div
            onClick={() => setRoverPose((p) => (p === "idle" ? "read" : p === "read" ? "think" : "idle"))}
            title="Rover"
            style={{
              position: "absolute",
              bottom: 0,
              left: 10,
              cursor: "pointer",
              transform: roverPose === "idle"
                ? `scale(${1 + (wagFrame % 2) * 0.03}) rotate(${(wagFrame - 1.5) * 1.5}deg)`
                : "none",
              transition: "transform 0.3s ease-in-out"
            }}
          >
            <img
              src={getRoverImg()}
              alt="Rover"
              style={{
                height: 72,
                width: "auto",
                filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.35))",
                imageRendering: "crisp-edges"
              }}
            />
          </div>
        </div>
      </div>

      <div style={{ flex: 1, background: "#FFF", borderLeft: "4px solid #ECE9D8", padding: 8, overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ fontWeight: "bold", color: "#215DC6", borderBottom: "1px solid #C9C7B4", paddingBottom: 2, marginBottom: 6, fontSize: 11 }}>
          {t("searchResults")}
        </div>
        {results ? (
          <div style={{ fontSize: 11, color: "#333", lineHeight: 1.5 }}>{results.slice(1).map((r, i) => <div key={i}>{r}</div>)}</div>
        ) : (
          <div style={{ color: "#888", display: "flex", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: 16, fontSize: 11 }}>
            {t("toStartSearch")}
          </div>
        )}
        <div style={{ marginTop: "auto", paddingTop: 6 }}>
          <button onClick={() => closeWindow(id)} style={{ minWidth: 58, height: 21, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}>{t("closeBtn")}</button>
        </div>
      </div>
    </div>
  );
}
