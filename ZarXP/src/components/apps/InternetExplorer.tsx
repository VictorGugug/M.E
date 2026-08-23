import { useState } from "react";
import { assetUrl } from "../../utils/assets"
import { playSound, XP_SOUNDS } from "../../utils/sound";

const toolBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "none",
  border: "1px solid transparent",
  borderRadius: 3,
  padding: "2px 5px",
  cursor: "pointer",
  fontSize: 11,
  fontFamily: "Tahoma, sans-serif",
  color: "#000",
};

const homePage: React.CSSProperties = {
  fontFamily: "Tahoma, sans-serif",
  fontSize: 12,
  color: "#000",
  padding: 16,
};

export default function InternetExplorer(_: { id: string }) {
  const [url, setUrl] = useState("about:blank");
  const [displayUrl, setDisplayUrl] = useState("http://");
  const [history, setHistory] = useState<string[]>(["about:blank"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const navigate = (raw: string) => {
    let u = raw.trim();
    if (!u || u === "http://") return;
    if (!/^https?:\/\//.test(u) && !u.startsWith("about:")) u = "https://" + u;
    const next = [...history.slice(0, historyIdx + 1), u];
    setHistory(next);
    setHistoryIdx(next.length - 1);
    setUrl(u);
    setDisplayUrl(u);
    setLoading(true);
    setError(false);
  };

  const jump = (idx: number) => {
    setHistoryIdx(idx);
    setUrl(history[idx]);
    setDisplayUrl(history[idx]);
  };

  const refresh = () => {
    setLoading(true);
    setUrl((u) => u);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", fontSize: 11, background: "#ECE9D8" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 1, padding: "2px 4px", borderBottom: "1px solid #ACA899", background: "linear-gradient(180deg,#FDFDFB 0%,#F1EFE2 40%,#ECE9D8 100%)" }}>
        <button style={{ ...toolBtn, opacity: historyIdx > 0 ? 1 : 0.4 }} onClick={() => jump(historyIdx - 1)} disabled={historyIdx <= 0} title="Back">
          <img src={assetUrl("assets/icons/Back.png")} width={22} height={20} alt="" />
          <span>Back</span>
        </button>
        <button style={{ ...toolBtn, opacity: historyIdx < history.length - 1 ? 1 : 0.4 }} onClick={() => jump(historyIdx + 1)} disabled={historyIdx >= history.length - 1} title="Forward">
          <img src={assetUrl("assets/icons/Forward.png")} width={22} height={20} alt="" />
        </button>
        <span style={{ width: 1, height: 20, background: "#ACA899", margin: "0 3px" }} />
        <button style={toolBtn} onClick={refresh} title="Refresh">
          <img src={assetUrl("assets/icons/IERefresh.png")} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} onClick={() => { setLoading(false); playSound(XP_SOUNDS.menuCommand, 0.1); }} title="Stop">
          <img src={assetUrl("assets/icons/IEStop.png")} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} onClick={() => navigate("about:blank")} title="Home">
          <img src={assetUrl("assets/icons/IEHome.png")} width={22} height={20} alt="" />
        </button>
        <span style={{ width: 1, height: 20, background: "#ACA899", margin: "0 3px" }} />
        <span style={{ color: "#444", margin: "0 4px 0 6px" }}>Address</span>
        <div style={{ flex: 1, display: "flex", alignItems: "center", background: "#FFF", border: "1px solid #7F9DB9", height: 20 }}>
          <img src={assetUrl("assets/icons/InternetExplorer6.png")} width={15} height={15} alt="" style={{ margin: "0 2px" }} />
          <input
            style={{ flex: 1, border: "none", outline: "none", fontSize: 11, fontFamily: "Tahoma, sans-serif", background: "transparent" }}
            value={displayUrl}
            onChange={(e) => setDisplayUrl(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigate(displayUrl); }}
          />
          <button style={{ background: "none", border: "none", cursor: "pointer", padding: "0 3px", display: "flex" }} onClick={() => navigate(displayUrl)} title="Go">
            <img src={assetUrl("assets/icons/Go.png")} width={17} height={17} alt="" />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, background: "#FFF", borderRight: "1px solid #ACA899", overflow: "auto", position: "relative" }}>
        {url === "about:blank" ? (
          <div style={homePage}>
            <div style={{ fontSize: 26, fontWeight: "bold", color: "#003399" }}>Internet Explorer</div>
            <div style={{ marginTop: 6, color: "#000" }}>About: Blank</div>
            <div style={{ marginTop: 18, display: "flex", gap: 8, flexWrap: "wrap" }}>
              {[
                ["https://www.google.com", "Google"],
                ["https://www.wikipedia.org", "Wikipedia"],
                ["https://example.com", "Example"],
              ].map(([u, label]) => (
                <button key={u} style={{ ...toolBtn, border: "1px solid #ACA899", background: "#ECE9D8" }} onClick={() => navigate(u)}>{label}</button>
              ))}
            </div>
            <div style={{ marginTop: 18, color: "#666", fontSize: 11 }}>
              Many modern sites block embedding. If a page stays blank, the site refused the connection.
            </div>
          </div>
        ) : (
          <iframe
            key={url + String(loading)}
            src={url}
            title="browser"
            style={{ width: "100%", height: "100%", border: "none" }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
        {loading && url !== "about:blank" && (
          <div style={{ position: "absolute", top: 4, left: 8, fontSize: 11, color: "#666", background: "rgba(255,255,255,0.85)", padding: "1px 6px", border: "1px solid #ACA899" }}>Opening page...</div>
        )}
        {error && (
          <div style={{ position: "absolute", inset: 0, background: "#FFF", padding: 20, fontFamily: "Tahoma, sans-serif" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#000" }}>The page cannot be displayed</div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#333" }}>The site refused to connect or blocked embedding.</div>
            <button style={{ ...toolBtn, border: "1px solid #ACA899", background: "#ECE9D8", marginTop: 12 }} onClick={() => { setError(false); setUrl("about:blank"); setDisplayUrl("http://"); }}>Go back</button>
          </div>
        )}
      </div>
      <div style={{ borderTop: "1px solid #ACA899", padding: "2px 6px", fontSize: 10, background: "#ECE9D8", color: "#444", display: "flex", justifyContent: "space-between" }}>
        <span>{loading ? "Opening page..." : "Done"}</span>
        <span>Internet</span>
      </div>
    </div>
  );
}
