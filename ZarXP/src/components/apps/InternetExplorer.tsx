import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

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

const GOOGLE_COLORS = [["G", "#3369E8"], ["o", "#D50F25"], ["o", "#EEB211"], ["g", "#3369E8"], ["l", "#009925"], ["e", "#D50F25"]] as const;

function GoogleLogo({ sub }: { sub?: string }) {
  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ display: "inline-flex", fontSize: 74, fontWeight: "bold", fontFamily: "Georgia, 'Times New Roman', serif", letterSpacing: -3, lineHeight: 1 }}>
        {GOOGLE_COLORS.map(([ch, color], i) => <span key={i} style={{ color }}>{ch}</span>)}
        <span style={{ fontSize: 13, alignSelf: "flex-end", color: "#666", marginBottom: 10, marginLeft: 2 }}>TM</span>
      </div>
      {sub && <div style={{ fontSize: 24, fontWeight: "bold", color: "#111", marginTop: -6, fontFamily: "Arial, sans-serif" }}>{sub}</div>}
    </div>
  );
}

function GoogleNav({ active, onNav }: { active: string; onNav: (page: string) => void }) {
  const link = { color: "#0000CC", textDecoration: "underline", cursor: "pointer" } as React.CSSProperties;
  const tabs = ["Web", "Images", "Maps", "News", "Shopping", "Gmail"];
  return (
    <div style={{ display: "flex", gap: 14, padding: "8px 14px", fontSize: 13, fontFamily: "Arial, sans-serif", alignItems: "center" }}>
      {tabs.map((l) => (
        <span key={l} style={active === l ? { fontWeight: "bold", textDecoration: "underline", cursor: "pointer" } : link} onClick={() => l !== active && onNav(l)}>{l}</span>
      ))}
      <span style={link}>more &#9662;</span>
      <span style={{ marginLeft: "auto", display: "flex", gap: 12 }}>
        {active !== "Gmail" && <span style={link} onClick={() => onNav("Gmail")}>iGoogle</span>}
        <span style={link}>Sign in</span>
      </span>
    </div>
  );
}

function SearchBox({ placeholder, buttonLabel, onSearch, extraButton }: { placeholder: string; buttonLabel: string; onSearch: (q: string) => void; extraButton?: string }) {
  const [q, setQ] = useState("");
  const btn = { fontSize: 13, padding: "3px 12px", background: "linear-gradient(180deg,#F5F5F5,#DCDCDC)", border: "1px solid #9A9A9A", borderRadius: 2, whiteSpace: "nowrap" } as React.CSSProperties;
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12, fontFamily: "Arial, sans-serif" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && q.trim()) onSearch(q.trim()); }}
          style={{ width: 460, maxWidth: "60vw", height: 24, border: "1px solid #5B5B5B", fontSize: 14, padding: "0 6px", outline: "none" }}
          placeholder={placeholder}
        />
        <button onClick={() => q.trim() && onSearch(q.trim())} style={btn}>{buttonLabel}</button>
        {extraButton && <button style={btn}>{extraButton}</button>}
      </div>
    </div>
  );
}

function GooglePage({ page, query, onSearch }: { page: string; query: string; onSearch: (q: string) => void }) {
  const link = { color: "#0000CC", textDecoration: "underline", cursor: "pointer" } as React.CSSProperties;
  const arial = { fontFamily: "Arial, sans-serif" } as React.CSSProperties;

  if (page === "results") {
    const results = [
      { title: query + " - Wikipedia", url: "en.wikipedia.org/wiki/" + query.replace(/ /g, "_"), desc: `${query} is a topic covered extensively in the free encyclopedia that anyone can edit. History, background and related information.` },
      { title: query + " - Official Site", url: "www." + query.toLowerCase().replace(/ /g, "") + ".com", desc: "The official website with the latest news, products and contact information. Available in multiple languages." },
      { title: query + " News and Updates", url: "news.google.com/topics/" + query.toLowerCase().replace(/ /g, "-"), desc: "Breaking stories and in-depth coverage about " + query + " from thousands of news sources around the web." },
      { title: "All about " + query, url: "www.about" + query.toLowerCase().replace(/ /g, "") + ".org", desc: "A complete guide: what it is, how it works, frequently asked questions and community forums." },
      { title: query + " images and videos", url: "images.google.com", desc: "Browse photo galleries, diagrams and video playlists related to " + query + "." },
    ];
    return (
      <div style={{ ...arial, padding: "10px 18px", fontSize: 13 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 18, borderBottom: "1px solid #E5E5E5", paddingBottom: 8 }}>
          <div style={{ display: "inline-flex", fontSize: 28, fontWeight: "bold", fontFamily: "Georgia, serif", letterSpacing: -1 }}>
            {GOOGLE_COLORS.map(([ch, color], i) => <span key={i} style={{ color }}>{ch}</span>)}
          </div>
          <div style={{ flex: 1, maxWidth: 480 }}><SearchBox placeholder="" buttonLabel="Google Search" onSearch={onSearch} /></div>
        </div>
        <div style={{ color: "#666", margin: "10px 0", fontSize: 12 }}>Results 1 - 10 of about {(query.length * 128407).toLocaleString()} for <b>{query}</b>. (0.{query.length * 7} seconds)</div>
        {results.map((r, i) => (
          <div key={i} style={{ marginBottom: 16, maxWidth: 620 }}>
            <div style={link}>{r.title}</div>
            <div style={{ color: "#000", margin: "1px 0" }}>{r.desc}</div>
            <div style={{ color: "#008000", fontSize: 12 }}>{r.url} - {8 + i}k - <span style={link}>Cached</span> - <span style={link}>Similar pages</span></div>
          </div>
        ))}
        <div style={{ color: "#0000CC", display: "flex", gap: 10, justifyContent: "center", fontSize: 13 }}>
          <span>1</span><span style={link}>2</span><span style={link}>3</span><span style={link}>4</span><span style={link}>5</span><span style={link}>Next</span>
        </div>
      </div>
    );
  }

  if (page === "images") {
    return (
      <div style={{ ...arial, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 46 }}>
        <GoogleLogo sub="Image Search" />
        <div style={{ marginTop: 26, display: "flex", alignItems: "center", gap: 8 }}>
          <SearchBox placeholder="" buttonLabel="Search Images" onSearch={onSearch} />
        </div>
        <div style={{ marginTop: 22, color: "#1A5C8A", fontWeight: "bold", fontSize: 15 }}>The most comprehensive image search on the web.</div>
        <div style={{ marginTop: 24, fontSize: 13 }}>
          <span style={{ color: "#D50F25", fontWeight: "bold" }}>New!</span> Search the newly digitized <span style={link}>LIFE photo archive</span>.
        </div>
        <div style={{ marginTop: 18, display: "flex", gap: 26 }}>
          {["World's Fair", "Academy Awards", "Apollo 11", "Marilyn Monroe"].map((l) => (
            <div key={l} style={{ textAlign: "center" }}>
              <div style={{ width: 76, height: 76, border: "1px solid #0000CC", background: "#F4F4F4", cursor: "pointer" }} onClick={() => onSearch(l)} />
              <div style={{ marginTop: 4, fontSize: 13 }}><span style={link} onClick={() => onSearch(l)}>{l}</span></div>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 40, fontSize: 13, display: "flex", gap: 6 }}>
          <span style={link}>Business Solutions</span> - <span style={link}>All About Google</span>
        </div>
        <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>&copy;2008 Google</div>
      </div>
    );
  }

  if (page === "maps") {
    return (
      <div style={{ ...arial, display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px" }}>
          <span style={{ fontSize: 22, fontWeight: "bold" }}><span style={{ color: "#3369E8" }}>G</span><span style={{ color: "#D50F25" }}>o</span><span style={{ color: "#EEB211" }}>o</span><span style={{ color: "#3369E8" }}>g</span><span style={{ color: "#009925" }}>l</span><span style={{ color: "#D50F25" }}>e</span> <span style={{ color: "#333" }}>Maps</span></span>
          <SearchBox placeholder="Search the map" buttonLabel="Search Maps" onSearch={onSearch} />
        </div>
        <div style={{ flex: 1, margin: "0 12px 10px", border: "1px solid #B0B0B0", position: "relative", background: "linear-gradient(135deg,#E8F0D8 0%,#F2EFE4 40%,#DEEBD2 100%)", overflow: "hidden" }}>
          {[
            { l: "18%", t: "30%", w: 120, h: 46, c: "#D8E8C8" },
            { l: "55%", t: "55%", w: 160, h: 70, c: "#D0E4C4" },
            { l: "30%", t: "62%", w: 90, h: 40, c: "#C8E4F0" },
          ].map((b, i) => <div key={i} style={{ position: "absolute", left: b.l, top: b.t, width: b.w, height: b.h, background: b.c, border: "1px solid #B8CCB0" }} />)}
          {[20, 45, 70].map((p) => <div key={p} style={{ position: "absolute", left: 0, right: 0, top: p + "%", height: 6, background: "#FFF", borderTop: "1px solid #D8D8C8" }} />)}
          {[30, 62].map((p) => <div key={p} style={{ position: "absolute", top: 0, bottom: 0, left: p + "%", width: 6, background: "#FFF", borderLeft: "1px solid #D8D8C8" }} />)}
          <div style={{ position: "absolute", left: "46%", top: "42%", width: 14, height: 20, background: "#D50F25", borderRadius: "50% 50% 50% 0", transform: "rotate(-45deg)", border: "1px solid #8A0F18" }} />
          <div style={{ position: "absolute", left: 8, bottom: 8, background: "rgba(255,255,255,0.9)", border: "1px solid #B0B0B0", padding: "3px 8px", fontSize: 12 }}>Map | Satellite | Terrain</div>
          <div style={{ position: "absolute", right: 8, top: 8, background: "rgba(255,255,255,0.9)", border: "1px solid #B0B0B0", padding: "2px 6px", fontSize: 14 }}>+ -</div>
        </div>
      </div>
    );
  }

  if (page === "news") {
    return (
      <div style={{ ...arial, padding: "10px 20px" }}>
        <GoogleLogo sub="News" />
        <div style={{ marginTop: 20, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, maxWidth: 760, margin: "20px auto 0" }}>
          {[
            { s: "Top Stories", items: ["Markets rally as quarterly earnings beat expectations", "New space probe sends first images from orbit", "Championship finals draw record audience"] },
            { s: "World", items: ["Leaders meet to discuss climate agreement", "Historic peace talks enter second day", "Archaeologists uncover ancient city ruins"] },
            { s: "Technology", items: ["Next-generation processors double battery life", "Social networks reach one billion users", "Open source project celebrates milestone"] },
            { s: "Sports", items: ["Underdog team stuns league leaders", "Marathon record broken in dramatic finish", "Transfer season: biggest moves so far"] },
          ].map((sec) => (
            <div key={sec.s}>
              <div style={{ fontWeight: "bold", borderBottom: "1px solid #1A5C8A", color: "#1A5C8A", marginBottom: 6 }}>{sec.s}</div>
              {sec.items.map((it) => (
                <div key={it} style={{ marginBottom: 6 }}>
                  <span style={link}>{it}</span>
                  <div style={{ color: "#008000", fontSize: 11 }}>news.google.com - 2 hours ago</div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (page === "shopping") {
    return (
      <div style={{ ...arial, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
        <GoogleLogo sub="Product Search" />
        <div style={{ marginTop: 24 }}><SearchBox placeholder="Search products" buttonLabel="Search" onSearch={onSearch} /></div>
        <div style={{ marginTop: 30, display: "flex", gap: 24, fontSize: 13 }}>
          {["Electronics", "Computers", "Books", "Clothing", "Toys", "Home & Garden"].map((c) => <span key={c} style={link} onClick={() => onSearch(c)}>{c}</span>)}
        </div>
        <div style={{ marginTop: 34, fontSize: 12, color: "#666" }}>&copy;2008 Google</div>
      </div>
    );
  }

  if (page === "gmail") {
    return (
      <div style={{ ...arial, display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 50 }}>
        <div style={{ fontSize: 40, fontWeight: "bold" }}>
          <span style={{ color: "#3369E8" }}>G</span><span style={{ color: "#D50F25" }}>m</span><span style={{ color: "#EEB211" }}>a</span><span style={{ color: "#3369E8" }}>i</span><span style={{ color: "#009925" }}>l</span>
        </div>
        <div style={{ marginTop: 8, fontSize: 15, color: "#333" }}>New to Gmail? Create an account to get started.</div>
        <div style={{ marginTop: 24, border: "1px solid #C6C6C6", padding: "22px 30px", borderRadius: 4, background: "#F7F7F7", display: "flex", flexDirection: "column", gap: 10, width: 300 }}>
          <input placeholder="Username" style={{ height: 26, border: "1px solid #9A9A9A", padding: "0 6px", fontSize: 13 }} />
          <input placeholder="Password" type="password" style={{ height: 26, border: "1px solid #9A9A9A", padding: "0 6px", fontSize: 13 }} />
          <button style={{ alignSelf: "flex-start", fontSize: 13, padding: "4px 16px", background: "linear-gradient(180deg,#4D90FE,#3A78D8)", color: "#FFF", border: "1px solid #2E5CB8", borderRadius: 2 }}>Sign in</button>
          <label style={{ fontSize: 12, color: "#333", display: "flex", alignItems: "center", gap: 6 }}><input type="checkbox" />Stay signed in</label>
        </div>
        <div style={{ marginTop: 26, fontSize: 12, color: "#666" }}>&copy;2008 Google - <span style={link}>Privacy</span> - <span style={link}>Help</span></div>
      </div>
    );
  }

  return null;
}

export default function InternetExplorer(_: { id: string }) {
  const [page, setPage] = useState<{ kind: "google"; name: string } | { kind: "web"; url: string }>({ kind: "google", name: "Web" });
  const [query, setQuery] = useState("");
  const [displayUrl, setDisplayUrl] = useState("http://www.google.com");
  const [history, setHistory] = useState<({ kind: "google"; name: string } | { kind: "web"; url: string })[]>([{ kind: "google", name: "Web" }]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const urlOf = (p: typeof page) => (p.kind === "web" ? p.url : p.name === "results" ? "http://www.google.com" : "http://www.google.com/intl/en/" + p.name.toLowerCase() + "/");

  const go = (p: typeof page) => {
    const next = [...history.slice(0, historyIdx + 1), p];
    setHistory(next);
    setHistoryIdx(next.length - 1);
    setPage(p);
    setDisplayUrl(urlOf(p));
    setLoading(true);
    setError(false);
    setTimeout(() => setLoading(false), 900);
  };

  const jump = (idx: number) => {
    setHistoryIdx(idx);
    setPage(history[idx]);
    setDisplayUrl(urlOf(history[idx]));
  };

  const navigateAddress = () => {
    const u = displayUrl.trim();
    if (!u) return;
    if (/google\.com\/search/.test(u)) { go({ kind: "google", name: "results" }); return; }
    if (/google\.com/.test(u) && !/search/.test(u)) { go({ kind: "google", name: "Web" }); return; }
    go({ kind: "web", url: u });
  };

  const search = (q: string) => {
    const next = [...history.slice(0, historyIdx + 1), { kind: "google" as const, name: "results" }];
    setHistory(next);
    setHistoryIdx(next.length - 1);
    setPage({ kind: "google", name: "results" });
    setQuery(q);
    setDisplayUrl("http://www.google.com/search?q=" + encodeURIComponent(q));
    setLoading(true);
    setTimeout(() => setLoading(false), 700);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", fontSize: 11, background: "#ECE9D8", overflow: "hidden" }}>
      <div className="xp-menubar" style={{ background: "#ECE9D8" }}>
        {["File", "Edit", "View", "Favorites", "Tools", "Help"].map((m) => (
          <div className="list" key={m}>
            <button className="button">{m}</button>
            <ul className="dropdown">
              <li>{m} option</li>
              <li className="separator" />
              <li>Close</li>
            </ul>
          </div>
        ))}
        <div style={{ marginLeft: "auto", background: "#FFF", height: 22, padding: "0 10px", display: "flex", alignItems: "center" }}>
          <img src={`${OL}/logo/flag.png`} alt="" style={{ height: 16 }} />
        </div>
      </div>
      <div className="xp-toolbar" style={{ background: "linear-gradient(180deg,#FDFDFB,#F1EFE2)", padding: "3px 6px" }}>
        <button style={{ ...toolBtn, opacity: historyIdx > 0 ? 1 : 0.45 }} onClick={() => jump(historyIdx - 1)} disabled={historyIdx <= 0}>
          <img src={`${IC}/Back.png`} width={24} height={22} alt="" />
          <span>Back</span>
        </button>
        <button style={{ ...toolBtn, opacity: historyIdx < history.length - 1 ? 1 : 0.45 }} onClick={() => jump(historyIdx + 1)} disabled={historyIdx >= history.length - 1}>
          <img src={`${IC}/Forward.png`} width={24} height={22} alt="" />
        </button>
        <button style={toolBtn} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 700); }} title="Stop">
          <img src={`${IC}/IEStop.png`} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} onClick={() => { setLoading(true); setTimeout(() => setLoading(false), 700); }} title="Refresh">
          <img src={`${IC}/IERefresh.png`} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} onClick={() => go({ kind: "google", name: "Web" })} title="Home">
          <img src={`${IC}/IEHome.png`} width={22} height={20} alt="" />
        </button>
        <span className="separator" />
        <button style={toolBtn} onClick={() => go({ kind: "google", name: "Web" })}>
          <img src={`${IC}/Search.png`} width={22} height={20} alt="" />
          <span>Search</span>
        </button>
        <button style={toolBtn}>
          <img src={`${IC}/Favorites.png`} width={22} height={20} alt="" />
          <span>Favorites</span>
        </button>
        <button style={toolBtn}>
          <img src={`${IC}/IEHistory.png`} width={22} height={20} alt="" />
        </button>
        <span className="separator" />
        <button style={toolBtn} onClick={() => go({ kind: "google", name: "Gmail" })} title="Mail">
          <img src={`${IC}/OECreateMail.png`} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} title="Print" onClick={() => window.print()}>
          <img src={`${IC}/Printer.png`} width={22} height={20} alt="" />
        </button>
        <button style={toolBtn} onClick={() => go({ kind: "web", url: "about:blank" })} title="Messenger">
          <img src={`${IC}/MSNMessenger.png`} width={22} height={20} alt="" />
        </button>
      </div>
      <div className="xp-address" style={{ background: "linear-gradient(180deg,#FDFDFB,#F1EFE2)" }}>
        <span className="addr-label">Address</span>
        <input
          value={displayUrl}
          onChange={(e) => setDisplayUrl(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter") navigateAddress(); }}
        />
        <button className="go" onClick={navigateAddress}>
          <img src={`${IC}/Go.png`} alt="" style={{ height: 17 }} />
          Go
        </button>
      </div>
      <div style={{ flex: 1, background: "#FFF", overflow: "auto", position: "relative" }}>
        {page.kind === "google" ? (
          <div>
            <GoogleNav active={page.name === "results" ? "Web" : page.name} onNav={(name) => go({ kind: "google", name })} />
            <div style={{ borderTop: "1px solid #E5E5E5" }} />
            {page.name === "Web" ? (
              <div style={{ fontFamily: "Arial, sans-serif", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 46 }}>
                <GoogleLogo />
                <div style={{ marginTop: 26, display: "flex", alignItems: "flex-start", gap: 8 }}>
                  <div style={{ width: 460 }}>
                    <SearchBox placeholder="" buttonLabel="Google Search" onSearch={search} extraButton="I'm Feeling Lucky" />
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", fontSize: 11, gap: 1 }}>
                    <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Advanced Search</span>
                    <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Preferences</span>
                    <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Language Tools</span>
                  </div>
                </div>
                <div style={{ marginTop: 44, fontSize: 13, display: "flex", gap: 6 }}>
                  <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }} onClick={() => go({ kind: "google", name: "Gmail" })}>Advertising Programs</span> - <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Business Solutions</span> - <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>About Google</span>
                </div>
                <div style={{ marginTop: 14, fontSize: 12, color: "#666" }}>&copy;2008 - <span style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>Privacy</span></div>
              </div>
            ) : (
              <GooglePage page={page.name.toLowerCase()} query={query} onSearch={search} />
            )}
          </div>
        ) : page.kind === "web" && page.url === "about:blank" ? (
          <div style={{ padding: 16, fontFamily: "Tahoma, sans-serif" }}>
            <div style={{ fontSize: 26, fontWeight: "bold", color: "#003399" }}>Internet Explorer</div>
            <div style={{ marginTop: 6 }}>About: Blank</div>
          </div>
        ) : (
          <iframe
            key={displayUrl}
            src={page.kind === "web" ? page.url : undefined}
            title="browser"
            style={{ width: "100%", height: "100%", border: "none" }}
            onLoad={() => setLoading(false)}
            onError={() => { setLoading(false); setError(true); }}
          />
        )}
        {loading && page.kind === "web" && (
          <div style={{ position: "absolute", top: 4, left: 8, fontSize: 11, color: "#666", background: "rgba(255,255,255,0.85)", padding: "1px 6px", border: "1px solid #ACA899" }}>Opening page...</div>
        )}
        {error && (
          <div style={{ position: "absolute", inset: 0, background: "#FFF", padding: 20, fontFamily: "Tahoma, sans-serif" }}>
            <div style={{ fontSize: 13, fontWeight: "bold", color: "#000" }}>The page cannot be displayed</div>
            <div style={{ marginTop: 8, fontSize: 11, color: "#333" }}>The site refused to connect or blocked embedding.</div>
            <button style={{ ...toolBtn, border: "1px solid #ACA899", background: "#ECE9D8", marginTop: 12 }} onClick={() => { setError(false); go({ kind: "google", name: "Web" }); }}>Go back</button>
          </div>
        )}
      </div>
      <div style={{ borderTop: "1px solid #DADAD8", padding: "2px 6px", fontSize: 10, background: "#ECE9D8", color: "#444", display: "flex", alignItems: "center", gap: 8, minHeight: 20 }}>
        <span style={{ width: 60 }}>{loading ? "Opening page..." : "Done"}</span>
        {loading && (
          <div style={{ width: 120, height: 12, border: "1px solid #9A9A9A", background: "#FFF", display: "flex", alignItems: "center", gap: 2, padding: "0 2px", overflow: "hidden" }}>
            <div className="ie-progress" style={{ display: "flex", gap: 2 }}>
              <div style={{ width: 8, height: 8, background: "#3BA63B" }} />
              <div style={{ width: 8, height: 8, background: "#3BA63B" }} />
              <div style={{ width: 8, height: 8, background: "#3BA63B" }} />
            </div>
          </div>
        )}
        <span style={{ marginLeft: "auto" }}>Internet</span>
      </div>
    </div>
  );
}
