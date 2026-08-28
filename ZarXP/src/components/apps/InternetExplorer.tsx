import { useState, useRef, useEffect } from "react";
import { assetUrl } from "../../utils/assets";

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

const tbBtn: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 3,
  background: "transparent",
  border: "1px solid transparent",
  borderRadius: 3,
  padding: "2px 5px",
  cursor: "pointer",
  fontSize: 11,
  color: "#000",
  fontFamily: "Tahoma, sans-serif",
};

export default function InternetExplorer(_: { id: string }) {
  const [currentUrl, setCurrentUrl] = useState("http://www.google.com");
  const [addressInput, setAddressInput] = useState("http://www.google.com");
  const [history, setHistory] = useState<string[]>(["http://www.google.com"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [pageState, setPageState] = useState<"google" | "msn" | "yahoo" | "wikipedia" | "spacejam" | "error">("google");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const close = () => setMenuOpen(null);
    window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [menuOpen]);

  const navigateTo = (raw: string) => {
    let url = raw.trim();
    if (!url) return;
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "http://" + url;
    }
    setAddressInput(url);
    setCurrentUrl(url);

    const newHist = history.slice(0, historyIdx + 1);
    newHist.push(url);
    setHistory(newHist);
    setHistoryIdx(newHist.length - 1);

    const lower = url.toLowerCase();
    if (lower.includes("google")) setPageState("google");
    else if (lower.includes("msn")) setPageState("msn");
    else if (lower.includes("yahoo")) setPageState("yahoo");
    else if (lower.includes("wikipedia")) setPageState("wikipedia");
    else if (lower.includes("spacejam")) setPageState("spacejam");
    else setPageState("error");
  };

  const goBack = () => {
    if (historyIdx > 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setAddressInput(url);
      setCurrentUrl(url);
      const lower = url.toLowerCase();
      if (lower.includes("google")) setPageState("google");
      else if (lower.includes("msn")) setPageState("msn");
      else if (lower.includes("yahoo")) setPageState("yahoo");
      else if (lower.includes("wikipedia")) setPageState("wikipedia");
      else if (lower.includes("spacejam")) setPageState("spacejam");
      else setPageState("error");
    }
  };

  const goForward = () => {
    if (historyIdx < history.length - 1) {
      const idx = historyIdx + 1;
      setHistoryIdx(idx);
      const url = history[idx];
      setAddressInput(url);
      setCurrentUrl(url);
      const lower = url.toLowerCase();
      if (lower.includes("google")) setPageState("google");
      else if (lower.includes("msn")) setPageState("msn");
      else if (lower.includes("yahoo")) setPageState("yahoo");
      else if (lower.includes("wikipedia")) setPageState("wikipedia");
      else if (lower.includes("spacejam")) setPageState("spacejam");
      else setPageState("error");
    }
  };

  return (
    <div ref={containerRef} style={{ width: "100%", height: "100%", background: "#ECE9D8", display: "flex", flexDirection: "column", fontFamily: "Tahoma, Arial, sans-serif", fontSize: 11, userSelect: "none", overflow: "hidden" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#ECE9D8", borderBottom: "1px solid #D4D0C8", padding: "1px 4px", position: "relative" }}>
        <div style={{ display: "flex", alignItems: "center" }}>
          {(["File", "Edit", "View", "Favorites", "Tools", "Help"] as const).map((m) => (
            <div
              key={m}
              onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === m ? null : m); }}
              style={{
                padding: "2px 6px",
                cursor: "pointer",
                background: menuOpen === m ? "#316AC5" : "transparent",
                color: menuOpen === m ? "#FFF" : "#000",
                borderRadius: 2
              }}
            >
              {m}
            </div>
          ))}
        </div>
        <img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18, marginRight: 6 }} />

        {menuOpen === "File" && (
          <div style={{ position: "absolute", top: 22, left: 4, background: "#FFF", border: "1px solid #ACA899", padding: 2, minWidth: 140, boxShadow: "2px 2px 4px rgba(0,0,0,0.3)", zIndex: 9999 }}>
            <div style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => { navigateTo("http://www.google.com"); setMenuOpen(null); }}>New Window</div>
            <div style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setMenuOpen(null)}>Open...</div>
            <div style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setMenuOpen(null)}>Save As...</div>
            <div style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
            <div style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setMenuOpen(null)}>Print...</div>
            <div style={{ height: 1, background: "#ACA899", margin: "2px 0" }} />
            <div style={{ padding: "3px 12px", cursor: "pointer" }} onClick={() => setMenuOpen(null)}>Close</div>
          </div>
        )}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 4px", background: "linear-gradient(180deg,#FFFFFF 0%,#ECE9D8 100%)", borderBottom: "1px solid #D4D0C8", flexWrap: "nowrap" }}>
        <button
          style={{ ...tbBtn, opacity: historyIdx > 0 ? 1 : 0.4 }}
          onClick={goBack}
          disabled={historyIdx === 0}
          title="Back"
          onMouseEnter={(e) => { if (historyIdx > 0) e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Back.png`} alt="Back" style={{ width: 22, height: 22 }} />
          <span>Back</span>
        </button>
        <button
          style={{ ...tbBtn, opacity: historyIdx < history.length - 1 ? 1 : 0.4 }}
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
          title="Forward"
          onMouseEnter={(e) => { if (historyIdx < history.length - 1) e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Forward.png`} alt="Forward" style={{ width: 22, height: 22 }} />
        </button>
        <button
          style={tbBtn}
          onClick={() => setPageState("error")}
          title="Stop"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IEStop.png`} alt="Stop" style={{ width: 20, height: 20 }} />
        </button>
        <button
          style={tbBtn}
          onClick={() => navigateTo(currentUrl)}
          title="Refresh"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IERefresh.png`} alt="Refresh" style={{ width: 20, height: 20 }} />
        </button>
        <button
          style={tbBtn}
          onClick={() => navigateTo("http://www.google.com")}
          title="Home"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IEHome.png`} alt="Home" style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ width: 1, height: 22, background: "#D4D0C8", margin: "0 2px" }} />
        <button
          style={tbBtn}
          onClick={() => navigateTo("http://www.google.com")}
          title="Search"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${OL}/icon/search.png`} alt="Search" style={{ width: 20, height: 20 }} />
          <span>Search</span>
        </button>
        <button
          style={tbBtn}
          onClick={() => navigateTo("http://www.google.com")}
          title="Favorites"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Favorites.png`} alt="Favorites" style={{ width: 20, height: 20 }} />
          <span>Favorites</span>
        </button>
        <button
          style={tbBtn}
          onClick={() => {}}
          title="History"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IEHistory.png`} alt="History" style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ width: 1, height: 22, background: "#D4D0C8", margin: "0 2px" }} />
        <button
          style={tbBtn}
          onClick={() => navigateTo("http://www.msn.com")}
          title="Mail"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Email.png`} alt="Mail" style={{ width: 20, height: 20 }} />
        </button>
        <button
          style={tbBtn}
          onClick={() => window.print()}
          title="Print"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Printer.png`} alt="Print" style={{ width: 20, height: 20 }} />
        </button>
        <button
          style={tbBtn}
          onClick={() => {}}
          title="Messenger"
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/WindowsMessenger.png`} alt="Messenger" style={{ width: 20, height: 20 }} />
        </button>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "3px 6px", background: "#ECE9D8", borderBottom: "1px solid #999" }}>
        <span style={{ color: "#444", fontSize: 11 }}>Address</span>
        <div style={{ flex: 1, display: "flex", background: "#FFF", border: "1px solid #7F9DB9", alignItems: "center", padding: "1px 4px" }}>
          <img src={`${IC}/InternetExplorer6.png`} alt="" style={{ width: 14, height: 14, marginRight: 4 }} />
          <input
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") navigateTo(addressInput); }}
            style={{ flex: 1, border: "none", outline: "none", fontSize: 11, fontFamily: "Tahoma, sans-serif" }}
          />
        </div>
        <button
          onClick={() => navigateTo(addressInput)}
          style={{ display: "flex", alignItems: "center", gap: 3, padding: "1px 6px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}
        >
          <img src={`${IC}/Go.png`} alt="Go" style={{ width: 14, height: 14 }} />
          <span>Go</span>
        </button>
      </div>

      <div style={{ flex: 1, background: "#FFF", overflow: "auto", position: "relative" }}>
        {pageState === "google" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", borderBottom: "1px solid #E5E5E5", fontSize: 11 }}>
              <div style={{ display: "flex", gap: 10, fontWeight: "bold" }}>
                <span style={{ color: "#000", borderBottom: "2px solid #000", paddingBottom: 2 }}>Web</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>Images</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>Maps</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>News</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>Shopping</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>Gmail</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }}>more &#9660;</span>
              </div>
              <div style={{ display: "flex", gap: 10, color: "#0000CC" }}>
                <span style={{ cursor: "pointer" }}>iGoogle</span>
                <span>|</span>
                <span style={{ cursor: "pointer" }}>Sign in</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", flex: 1, padding: "20px 0" }}>
              <div style={{ fontSize: 52, fontWeight: "bold", letterSpacing: -2, marginBottom: 16, fontFamily: "Times New Roman, Georgia, serif", textShadow: "1px 1px 1px rgba(0,0,0,0.15)" }}>
                <span style={{ color: "#1756CA" }}>G</span>
                <span style={{ color: "#DC3824" }}>o</span>
                <span style={{ color: "#F7B928" }}>o</span>
                <span style={{ color: "#1756CA" }}>g</span>
                <span style={{ color: "#109D59" }}>l</span>
                <span style={{ color: "#DC3824" }}>e</span>
                <span style={{ fontSize: 13, color: "#555", verticalAlign: "super", letterSpacing: 0, fontWeight: "normal", fontFamily: "Arial, sans-serif" }}>TM</span>
              </div>

              <div style={{ width: "90%", maxWidth: 520, display: "flex", alignItems: "center", gap: 8 }}>
                <input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      if (searchQuery.toLowerCase().includes("wiki")) navigateTo("http://en.wikipedia.org/wiki/Windows_XP");
                      else if (searchQuery.toLowerCase().includes("yahoo")) navigateTo("http://www.yahoo.com");
                      else if (searchQuery.toLowerCase().includes("space")) navigateTo("https://www.spacejam.com/1996/");
                      else navigateTo("http://www.msn.com");
                    }
                  }}
                  style={{ flex: 1, padding: "4px 6px", fontSize: 13, border: "1px solid #7F9DB9", outline: "none", boxSizing: "border-box" }}
                />
                <div style={{ display: "flex", flexDirection: "column", fontSize: 10, color: "#0000CC", lineHeight: 1.3 }}>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}>Advanced Search</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>Preferences</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>Language Tools</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}
                  style={{ padding: "4px 12px", background: "#ECE9D8", border: "1px solid #ACA899", cursor: "pointer", fontSize: 11 }}
                >
                  Google Search
                </button>
                <button
                  onClick={() => navigateTo("https://www.spacejam.com/1996/")}
                  style={{ padding: "4px 12px", background: "#ECE9D8", border: "1px solid #ACA899", cursor: "pointer", fontSize: 11 }}
                >
                  I'm Feeling Lucky
                </button>
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 10, fontSize: 11, color: "#0000CC" }}>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}>Wikipedia (2008)</span>
                <span>•</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("https://www.spacejam.com/1996/")}>Space Jam (1996)</span>
                <span>•</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://www.msn.com")}>MSN Portal (2004)</span>
                <span>•</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://www.yahoo.com")}>Yahoo! (2004)</span>
              </div>
            </div>

            <div style={{ marginTop: "auto", textAlign: "center", paddingBottom: 16, fontSize: 11 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, color: "#0000CC", marginBottom: 6 }}>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>Advertising Programs</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>Business Solutions</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>About Google</span>
              </div>
              <div style={{ color: "#666", fontSize: 10 }}>©2008 - Privacy</div>
            </div>
          </div>
        )}

        {pageState === "msn" && (
          <div style={{ padding: 16, maxWidth: 640, margin: "0 auto" }}>
            <div style={{ borderBottom: "2px solid #003399", paddingBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#003399", fontStyle: "italic" }}>msn</div>
              <div style={{ fontSize: 11, color: "#666" }}>Welcome to MSN.com (2004)</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ background: "#E8EEF7", padding: 8, borderLeft: "4px solid #003399", marginBottom: 12 }}>
                  <div style={{ fontWeight: "bold", color: "#003399" }}>Today on MSN</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>Windows XP Service Pack 2 released with advanced security firewall.</div>
                </div>
                <div style={{ fontWeight: "bold", color: "#003399", marginBottom: 6 }}>Featured Channels</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>MSNBC News</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Money & Investing</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Sports by FOX Sports</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Entertainment & Movies</div>
                </div>
              </div>
              <div style={{ background: "#F5F5F5", border: "1px solid #DDD", padding: 8 }}>
                <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>MSN Services</div>
                <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, lineHeight: 1.6 }}>
                  <li>Check Hotmail inbox</li>
                  <li>MSN Messenger 6.0</li>
                  <li>Windows Media Player</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {pageState === "yahoo" && (
          <div style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#CC0000", marginBottom: 4 }}>YAHOO!</div>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 16 }}>What's New - Check Email - Yahoo! Messenger</div>
            <div style={{ maxWidth: 420, margin: "0 auto 20px" }}>
              <input style={{ width: "70%", padding: "3px 6px", border: "1px solid #7F9DB9" }} />
              <button style={{ padding: "3px 8px", marginLeft: 4, background: "#ECE9D8", border: "1px solid #ACA899" }}>Yahoo! Search</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 500, margin: "0 auto", textAlign: "left", fontSize: 11 }}>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Arts & Humanities</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Business & Economy</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Computers & Internet</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Education</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Entertainment</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Government</div>
            </div>
          </div>
        )}

        {pageState === "wikipedia" && (
          <div style={{ padding: 20, maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            <div style={{ fontSize: 24, borderBottom: "1px solid #AAA", paddingBottom: 4, marginBottom: 8, fontFamily: "Georgia, serif" }}>
              Windows XP
            </div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>From Wikipedia, the free encyclopedia (2008 archive)</div>
            <div style={{ fontSize: 12 }}>
              <p><b>Windows XP</b> is an operating system produced by Microsoft as part of the Windows NT family of operating systems. It was released to manufacturing on August 24, 2001, and broadly released for retail sale on October 25, 2001.</p>
              <p>Development of Windows XP began in the late 1990s as "Neptune", an operating system built on the Windows NT kernel which was intended specifically for mainstream consumer use.</p>
            </div>
          </div>
        )}

        {pageState === "spacejam" && (
          <iframe src="https://www.spacejam.com/1996/" style={{ width: "100%", height: "100%", border: "none" }} title="Space Jam 1996" />
        )}

        {pageState === "error" && (
          <div style={{ padding: 30, maxWidth: 560, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <div style={{ fontSize: 32 }}>⚠️</div>
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>The page cannot be displayed</div>
                <div style={{ fontSize: 11, color: "#333", lineHeight: 1.5, marginBottom: 14 }}>
                  The page you are looking for is currently unavailable. The Web site might be experiencing technical difficulties, or you may need to adjust your browser settings.
                </div>
                <button
                  onClick={() => window.open(currentUrl, "_blank")}
                  style={{ padding: "4px 14px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}
                >
                  Open in New Tab ↗
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div style={{ padding: "2px 8px", background: "#ECE9D8", borderTop: "1px solid #D4D0C8", fontSize: 10, color: "#555", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span>Done</span>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <img src={`${IC}/InternetExplorer6.png`} alt="" style={{ width: 12, height: 12 }} />
          <span>Internet</span>
        </div>
      </div>
    </div>
  );
}
