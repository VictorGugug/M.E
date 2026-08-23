import { useState } from "react";

export default function InternetExplorer(_: { id: string }) {
  const [url, setUrl] = useState("about:blank");
  const [displayUrl, setDisplayUrl] = useState("about:blank");
  const [history, setHistory] = useState<string[]>(["about:blank"]);
  const [historyIdx, setHistoryIdx] = useState(0);

  const navigate = (u: string) => {
    let target = u;
    if (!u.startsWith("http://") && !u.startsWith("https://") && u !== "about:blank") {
      target = "https://" + u;
    }
    const newHistory = history.slice(0, historyIdx + 1);
    newHistory.push(target);
    setHistory(newHistory);
    setHistoryIdx(newHistory.length - 1);
    setUrl(target);
    setDisplayUrl(target);
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setUrl(history[idx]);
      setDisplayUrl(history[idx]);
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      setUrl(history[idx]);
      setDisplayUrl(history[idx]);
    }
  };

  const refresh = () => setUrl((u) => u);
  const stop = () => {};

  const isGoogleSearch = url.includes("google") || url.includes("search");

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", fontSize: 11, background: "#D4D0C8" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 2, padding: 2, borderBottom: "1px solid #808080", background: "#ECE9D8" }}>
        <button style={{ ...navBtnStyle }} onClick={goBack} disabled={historyIdx <= 0} title="Back"><img src="/assets/icons/Back.png" width="16" height="16" alt="" /></button>
        <button style={{ ...navBtnStyle }} onClick={goForward} disabled={historyIdx >= history.length - 1} title="Forward"><img src="/assets/icons/Forward.png" width="16" height="16" alt="" /></button>
        <button style={{ ...navBtnStyle }} onClick={refresh} title="Refresh">Ref</button>
        <button style={{ ...navBtnStyle }} onClick={stop} title="Stop"><img src="/assets/icons/Stop.png" width="16" height="16" alt="" /></button>
        <span style={{ margin: "0 4px", color: "#000" }}>Address</span>
        <input style={{ flex: 1, border: "1px inset #ACA899", padding: "1px 3px", fontSize: 11, fontFamily: "Tahoma, sans-serif" }} value={displayUrl} onChange={(e) => setDisplayUrl(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter") navigate(displayUrl); }} />
        <button style={{ ...navBtnStyle }} onClick={() => navigate(displayUrl)}>Go</button>
      </div>
      <div style={{ flex: 1, background: "#FFF", border: "1px inset #ACA899", margin: 2, overflow: "auto", padding: 8 }}>
        {url === "about:blank" ? (
          <div style={{ textAlign: "center", marginTop: 40, color: "#808080" }}>
            <div style={{ fontSize: 24, fontWeight: "bold", color: "#000080" }}>Internet Explorer</div>
            <div style={{ marginTop: 12 }}>About: Blank</div>
          </div>
        ) : isGoogleSearch ? (
          <iframe src={url} style={{ width: "100%", height: "100%", border: "none" }} title="browser" />
        ) : (
          <iframe src={url} style={{ width: "100%", height: "100%", border: "none" }} title="browser" />
        )}
      </div>
      <div style={{ borderTop: "1px solid #808080", padding: "2px 4px", fontSize: 10, background: "#ECE9D8", color: "#666" }}>Internet</div>
    </div>
  );
}

const navBtnStyle: React.CSSProperties = {
  background: "#ECE9D8",
  border: "1px solid #ACA899",
  borderRadius: 2,
  cursor: "pointer",
  fontSize: 11,
  padding: "1px 4px",
  fontFamily: "Tahoma, sans-serif",
};
