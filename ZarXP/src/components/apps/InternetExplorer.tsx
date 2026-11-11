import { useEffect, useRef, useState } from "react";
import { assetUrl } from "../../utils/assets";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

const IC = assetUrl("assets/icons");
const OL = assetUrl("assets/xpui");

export default function InternetExplorer({ id }: { id: string }) {
  const t = useLangStore((state) => state.t);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const [currentUrl, setCurrentUrl] = useState("http://www.google.com");
  const [addressInput, setAddressInput] = useState("http://www.google.com");
  const [history, setHistory] = useState<string[]>(["http://www.google.com"]);
  const [historyIdx, setHistoryIdx] = useState(0);
  const [pageState, setPageState] = useState<"google" | "msn" | "yahoo" | "wikipedia" | "spacejam" | "error">("google");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const loadingTimer = useRef<number | null>(null);

  useEffect(() => () => { if (loadingTimer.current) window.clearTimeout(loadingTimer.current); }, []);

  const beginLoad = () => {
    setLoading(true);
    if (loadingTimer.current) window.clearTimeout(loadingTimer.current);
    loadingTimer.current = window.setTimeout(() => setLoading(false), 700);
  };

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
    beginLoad();
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
      beginLoad();
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
      beginLoad();
    }
  };

  const stopLoad = () => {
    if (loadingTimer.current) window.clearTimeout(loadingTimer.current);
    setLoading(false);
    setPageState("error");
  };

  return (
    <div className="xp-app-surface">
      <MenuBar
        trailing={<img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18 }} />}
        menus={[
          { label: `&${t("file")}`, entries: [
            cmd(t("newWindow"), () => navigateTo("http://www.google.com")),
            cmd(t("openDots")),
            cmd(t("saveAs")),
            sep,
            cmd(t("print"), () => window.print()),
            sep,
            cmd(t("closeWindow"), () => closeWindow(id)),
          ] },
          { label: `&${t("edit")}`, entries: [
            cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll")),
          ] },
          { label: `&${t("view")}`, entries: [
            cmd(t("toolbars")),
            cmd(t("statusBar"), undefined, { checked: true }),
            sep,
            cmd(t("stop"), stopLoad),
            cmd(t("refresh"), () => navigateTo(currentUrl)),
            sep,
            cmd(t("textSize")),
          ] },
          { label: `&${t("favorites")}`, entries: [
            cmd(t("addToFavorites")),
            cmd(t("organizeFavorites")),
            sep,
            cmd(t("ieLinkWikipedia"), () => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")),
            cmd(t("ieLinkSpaceJam"), () => navigateTo("https://www.spacejam.com/1996/")),
            cmd(t("ieLinkMsn"), () => navigateTo("http://www.msn.com")),
            cmd(t("ieLinkYahoo"), () => navigateTo("http://www.yahoo.com")),
          ] },
          { label: `&${t("tools")}`, entries: [
            cmd(t("mailAndNews")),
            cmd(t("popupBlocker")),
            sep,
            cmd(t("internetOptions")),
          ] },
          { label: `&${t("help")}`, entries: [
            cmd(t("contentsAndIndex")),
            sep,
            cmd(t("aboutInternetExplorer")),
          ] },
        ]}
      />

      <div className="xp-toolbar">
        <button
          className="xp-toolbar-button" style={{ opacity: historyIdx > 0 ? 1 : .4 }}
          onClick={goBack}
          disabled={historyIdx === 0}
          title={t("back")}
          onMouseEnter={(e) => { if (historyIdx > 0) e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Back.png`} alt={t("back")} style={{ width: 22, height: 22 }} />
          <span>{t("back")}</span>
        </button>
        <button
          className="xp-toolbar-button" style={{ opacity: historyIdx < history.length - 1 ? 1 : .4 }}
          onClick={goForward}
          disabled={historyIdx >= history.length - 1}
          title={t("forward")}
          onMouseEnter={(e) => { if (historyIdx < history.length - 1) e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Forward.png`} alt={t("forward")} style={{ width: 22, height: 22 }} />
        </button>
        <button
          className="xp-toolbar-button"
          onClick={stopLoad}
          title={t("stop")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IEStop.png`} alt={t("stop")} style={{ width: 20, height: 20 }} />
        </button>
        <button
          className="xp-toolbar-button"
          onClick={() => navigateTo(currentUrl)}
          title={t("refresh")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IERefresh.png`} alt={t("refresh")} style={{ width: 20, height: 20 }} />
        </button>
        <button
          className="xp-toolbar-button"
          onClick={() => navigateTo("http://www.google.com")}
          title={t("home")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/IEHome.png`} alt={t("home")} style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ width: 1, height: 22, background: "#D4D0C8", margin: "0 2px" }} />
        <button
          className="xp-toolbar-button"
          onClick={() => navigateTo("http://www.google.com")}
          title={t("search")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${OL}/icon/search.png`} alt={t("search")} style={{ width: 20, height: 20 }} />
          <span>{t("search")}</span>
        </button>
        <button
          className="xp-toolbar-button"
          onClick={() => navigateTo("http://www.google.com")}
          title={t("favorites")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Favorites.png`} alt={t("favorites")} style={{ width: 20, height: 20 }} />
          <span>{t("favorites")}</span>
        </button>
        <button
          className="xp-toolbar-button"
          disabled
          title={t("history")}
        >
          <img src={`${IC}/IEHistory.png`} alt={t("history")} style={{ width: 20, height: 20 }} />
        </button>
        <div style={{ width: 1, height: 22, background: "#D4D0C8", margin: "0 2px" }} />
        <button
          className="xp-toolbar-button"
          onClick={() => navigateTo("http://www.msn.com")}
          title={t("mail")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Email.png`} alt={t("mail")} style={{ width: 20, height: 20 }} />
        </button>
        <button
          className="xp-toolbar-button"
          onClick={() => window.print()}
          title={t("print")}
          onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #B8D6FB"; }}
          onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; }}
        >
          <img src={`${IC}/Printer.png`} alt={t("print")} style={{ width: 20, height: 20 }} />
        </button>
        <button
          className="xp-toolbar-button"
          disabled
          title={t("messenger")}
        >
          <img src={`${IC}/WindowsMessenger.png`} alt={t("messenger")} style={{ width: 20, height: 20 }} />
        </button>
      </div>

      <div className="xp-address">
        <span style={{ color: "#444", fontSize: 11 }}>{t("address")}</span>
        <div className="xp-input" style={{ flex: 1, display: "flex", alignItems: "center" }}>
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
          className="xp-toolbar-button"
        >
          <img src={`${IC}/Go.png`} alt={t("go")} style={{ width: 14, height: 14 }} />
          <span>{t("go")}</span>
        </button>
      </div>

      <div style={{ flex: 1, background: "#FFF", overflow: "auto", position: "relative" }}>
        {pageState === "google" && (
          <div style={{ display: "flex", flexDirection: "column", height: "100%", boxSizing: "border-box" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 12px", borderBottom: "1px solid #E5E5E5", fontSize: 11 }}>
              <div style={{ display: "flex", gap: 10, fontWeight: "bold" }}>
                <span style={{ color: "#000", borderBottom: "2px solid #000", paddingBottom: 2 }}>{t("ieGoogleWeb")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>{t("ieGoogleImages")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>{t("ieGoogleMaps")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>{t("ieGoogleNews")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>{t("ieGoogleShopping")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }} onClick={() => navigateTo("http://www.google.com")}>{t("ieGoogleGmail")}</span>
                <span style={{ color: "#0000CC", cursor: "pointer" }}>{t("ieGoogleMore")}</span>
              </div>
              <div style={{ display: "flex", gap: 10, color: "#0000CC" }}>
                <span style={{ cursor: "pointer" }}>{t("ieGoogleIGoogle")}</span>
                <span>|</span>
                <span style={{ cursor: "pointer" }}>{t("ieGoogleSignIn")}</span>
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
                  <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}>{t("ieGoogleAdvancedSearch")}</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>{t("ieGooglePreferences")}</span>
                  <span style={{ textDecoration: "underline", cursor: "pointer" }}>{t("ieGoogleLanguageTools")}</span>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 8, marginTop: 14 }}>
                <button
                  onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}
                  style={{ padding: "4px 12px", background: "#ECE9D8", border: "1px solid #ACA899", cursor: "pointer", fontSize: 11 }}
                >
                  {t("ieGoogleSearchBtn")}
                </button>
                <button
                  onClick={() => navigateTo("https://www.spacejam.com/1996/")}
                  style={{ padding: "4px 12px", background: "#ECE9D8", border: "1px solid #ACA899", cursor: "pointer", fontSize: 11 }}
                >
                  {t("ieGoogleLucky")}
                </button>
              </div>

              <div style={{ marginTop: 20, display: "flex", gap: 10, fontSize: 11, color: "#0000CC" }}>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://en.wikipedia.org/wiki/Windows_XP")}>{t("ieLinkWikipedia")}</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("https://www.spacejam.com/1996/")}>{t("ieLinkSpaceJam")}</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://www.msn.com")}>{t("ieLinkMsn")}</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }} onClick={() => navigateTo("http://www.yahoo.com")}>{t("ieLinkYahoo")}</span>
              </div>
            </div>

            <div style={{ marginTop: "auto", textAlign: "center", paddingBottom: 16, fontSize: 11 }}>
              <div style={{ display: "flex", justifyContent: "center", gap: 12, color: "#0000CC", marginBottom: 6 }}>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>{t("ieGoogleAdvertising")}</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>{t("ieGoogleBusiness")}</span>
                <span>-</span>
                <span style={{ textDecoration: "underline", cursor: "pointer" }}>{t("ieGoogleAbout")}</span>
              </div>
              <div style={{ color: "#666", fontSize: 10 }}>{t("ieGoogleCopyright")}</div>
            </div>
          </div>
        )}

        {pageState === "msn" && (
          <div style={{ padding: 16, maxWidth: 640, margin: "0 auto" }}>
            <div style={{ borderBottom: "2px solid #003399", paddingBottom: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontSize: 24, fontWeight: "bold", color: "#003399", fontStyle: "italic" }}>msn</div>
              <div style={{ fontSize: 11, color: "#666" }}>{t("ieMsnWelcome")}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 16, marginTop: 12 }}>
              <div>
                <div style={{ background: "#E8EEF7", padding: 8, borderLeft: "4px solid #003399", marginBottom: 12 }}>
                  <div style={{ fontWeight: "bold", color: "#003399" }}>{t("ieMsnToday")}</div>
                  <div style={{ fontSize: 11, marginTop: 4 }}>{t("ieMsnHeadline")}</div>
                </div>
                <div style={{ fontWeight: "bold", color: "#003399", marginBottom: 6 }}>{t("ieMsnFeatured")}</div>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6, fontSize: 11 }}>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieMsnNews")}</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieMsnMoney")}</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieMsnSports")}</div>
                  <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieMsnEntertainment")}</div>
                </div>
              </div>
              <div style={{ background: "#F5F5F5", border: "1px solid #DDD", padding: 8 }}>
                <div style={{ fontWeight: "bold", marginBottom: 6, fontSize: 11 }}>{t("ieMsnServices")}</div>
                <ul style={{ paddingLeft: 16, margin: 0, fontSize: 11, lineHeight: 1.6 }}>
                  <li>{t("ieMsnHotmail")}</li>
                  <li>{t("ieMsnMessenger")}</li>
                  <li>{t("ieMsnMediaPlayer")}</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {pageState === "yahoo" && (
          <div style={{ padding: 20, textAlign: "center" }}>
            <div style={{ fontSize: 32, fontWeight: "bold", color: "#CC0000", marginBottom: 4 }}>YAHOO!</div>
            <div style={{ fontSize: 10, color: "#666", marginBottom: 16 }}>{t("ieYahooTagline")}</div>
            <div style={{ maxWidth: 420, margin: "0 auto 20px" }}>
              <input style={{ width: "70%", padding: "3px 6px", border: "1px solid #7F9DB9" }} />
              <button style={{ padding: "3px 8px", marginLeft: 4, background: "#ECE9D8", border: "1px solid #ACA899" }}>{t("ieYahooSearch")}</button>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, maxWidth: 500, margin: "0 auto", textAlign: "left", fontSize: 11 }}>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooArts")}</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooBusiness")}</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooComputers")}</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooEducation")}</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooEntertainment")}</div>
              <div style={{ color: "#0000CC", textDecoration: "underline", cursor: "pointer" }}>{t("ieYahooGovernment")}</div>
            </div>
          </div>
        )}

        {pageState === "wikipedia" && (
          <div style={{ padding: 20, maxWidth: 680, margin: "0 auto", lineHeight: 1.6 }}>
            <div style={{ fontSize: 24, borderBottom: "1px solid #AAA", paddingBottom: 4, marginBottom: 8, fontFamily: "Georgia, serif" }}>
              {t("ieWikiTitle")}
            </div>
            <div style={{ fontSize: 11, color: "#555", marginBottom: 12 }}>{t("ieWikiSubtitle")}</div>
            <div style={{ fontSize: 12 }}>
              <p>{t("ieWikiPara1")}</p>
              <p>{t("ieWikiPara2")}</p>
            </div>
          </div>
        )}

        {pageState === "spacejam" && (
          <iframe src="https://www.spacejam.com/1996/" style={{ width: "100%", height: "100%", border: "none" }} title="Space Jam 1996" />
        )}

        {pageState === "error" && (
          <div style={{ padding: 30, maxWidth: 560, margin: "0 auto" }}>
            <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
              <img src={`${IC}/Alert.png`} alt="" style={{ width: 32, height: 32 }} />
              <div>
                <div style={{ fontSize: 16, fontWeight: "bold", color: "#000", marginBottom: 8 }}>{t("ieErrorTitle")}</div>
                <div style={{ fontSize: 11, color: "#333", lineHeight: 1.5, marginBottom: 14 }}>
                  {t("ieErrorBody")}
                </div>
                <button
                  onClick={() => window.open(currentUrl, "_blank")}
                  style={{ padding: "4px 14px", background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3, cursor: "pointer", fontSize: 11 }}
                >
                  {t("ieOpenNewTab")}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="xp-status-strip">
        <span>{loading ? t("openingPage") : t("done")}</span>
        {loading && (
          <div style={{ width: 120, height: 8, border: "1px solid #ACA899", background: "#FFF", overflow: "hidden", margin: "0 6px" }}>
            <div className="ie-progress" style={{ width: 40, height: "100%", background: "#3C7FD4" }} />
          </div>
        )}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <img src={`${IC}/InternetExplorer6.png`} alt="" style={{ width: 12, height: 12 }} />
          <span>{t("internet")}</span>
        </div>
      </div>
    </div>
  );
}
