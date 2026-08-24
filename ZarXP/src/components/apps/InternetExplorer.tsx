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

const GOOGLE_COLORS = [["G", "#3369E8"], ["o", "#D50F25"], ["o", "#EEB211"], ["g", "#3369E8"], ["l", "#009925"], ["e", "#D50F25"]] as const;

function GoogleHome({ onSearch, onNavigate }: { onSearch: (q: string) => void; onNavigate: () => void }) {
  const [q, setQ] = useState("");
  const link = { color: "#0000CC", textDecoration: "underline", cursor: "pointer" } as React.CSSProperties;
  return (
    <div style={{ fontFamily: "Arial, sans-serif", background: "#FFF", minHeight: "100%", display: "flex", flexDirection: "column" }}>
      <div style={{ display: "flex", gap: 14, padding: "8px 14px", fontSize: 13 }}>
        {["Web", "Images", "Maps", "News", "Shopping", "Gmail"].map((l) => <span key={l} style={link}>{l}</span>)}
        <span style={link}>more &#9662;</span>
        <span style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
          <span style={link} onClick={onNavigate}>iGoogle</span>
          <span style={link}>Sign in</span>
        </span>
      </div>
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 60 }}>
        <div style={{ display: "flex", fontSize: 82, fontWeight: "bold", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: -4, marginBottom: 24 }}>
          {GOOGLE_COLORS.map(([ch, color], i) => <span key={i} style={{ color }}>{ch}</span>)}
          <span style={{ fontSize: 14, alignSelf: "flex-end", color: "#666", marginBottom: 14, marginLeft: 2 }}>TM</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) onSearch(q.trim()); }}
            style={{ width: 480, maxWidth: "70vw", height: 26, border: "1px solid #5B5B5B", fontSize: 15, padding: "0 6px", outline: "none" }}
          />
          <div style={{ display: "flex", flexDirection: "column", fontSize: 11 }}>
            <span style={link}>Advanced Search</span>
            <span style={link}>Preferences</span>
            <span style={link}>Language Tools</span>
          </div>
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <button onClick={() => q.trim() && onSearch(q.trim())} style={{ fontSize: 13, padding: "3px 12px", background: "linear-gradient(180deg,#F5F5F5,#DCDCDC)", border: "1px solid #9A9A9A", borderRadius: 2, fontFamily: "Arial, sans-serif" }}>Google Search</button>
          <button style={{ fontSize: 13, padding: "3px 12px", background: "linear-gradient(180deg,#F5F5F5,#DCDCDC)", border: "1px solid #9A9A9A", borderRadius: 2, fontFamily: "Arial, sans-serif" }}>I'm Feeling Lucky</button>
        </div>
        <div style={{ marginTop: 46, fontSize: 13, display: "flex", gap: 6 }}>
          <span style={link}>Advertising Programs</span> - <span style={link}>Business Solutions</span> - <span style={link}>About Google</span>
        </div>
        <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>&copy;2008 - <span style={link}>Privacy</span></div>
      </div>
    </div>
  );
}

export default function InternetExplorer(_: { id: string }) {
  const [url, setUrl] = useState("http://www.google.com");
  const [displayUrl, setDisplayUrl] = useState("http://www.google.com");
  const [history, setHistory] = useState<string[]>(["http://www.google.com"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const isGoogleHome = url === "http://www.google.com" || url === "https://www.google.com";

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
        <button style={toolBtn} onClick={() => navigate("http://www.google.com")} title="Home">
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
        {isGoogleHome ? (
          <GoogleHome
            onSearch={(q) => navigate("https://www.google.com/search?q=" + encodeURIComponent(q))}
            onNavigate={() => navigate("http://www.google.com")}
          />
        ) : url === "about:blank" ? (
          <div style={homePage}>
            <div style={{ fontSize: 26, fontWeight: "bold", color: "#003399" }}>Internet Explorer</div>
            <div style={{ marginTop: 6, color: "#000" }}>About: Blank</div>
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
        {loading && !isGoogleHome && url !== "about:blank" && (
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
