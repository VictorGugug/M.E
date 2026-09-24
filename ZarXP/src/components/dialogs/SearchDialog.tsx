import { useState, useEffect, useRef } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { getFileAppId, getNodePath, searchByCategory, type VirtualFileNode } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");

export default function SearchDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const openWindow = useWindowStore((state) => state.openWindow);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const [type, setType] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<VirtualFileNode[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [roverPose, setRoverPose] = useState<"idle" | "read" | "think">("idle");
  const [wagFrame, setWagFrame] = useState(0);
  const t = useLangStore((state) => state.t);
  const searchTimeoutRef = useRef<number | null>(null);

  useEffect(() => () => {
    if (searchTimeoutRef.current !== null) window.clearTimeout(searchTimeoutRef.current);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => setWagFrame((frame) => (frame + 1) % 4), 450);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!searching) return;
    setRoverPose("read");
    const timeout = setTimeout(() => {
      setSearching(false);
      setRoverPose("idle");
    }, 1200);
    return () => clearTimeout(timeout);
  }, [searching]);

  const searchTypes = [
    { value: "pictures", label: t("picturesAndPhotos"), icon: `${OL}/icon/folder/pictures.png` },
    { value: "documents", label: t("documentsSearch"), icon: `${OL}/icon/folder/documents.png` },
    { value: "music", label: t("musicAndSound"), icon: `${OL}/icon/folder/music.png` },
    { value: "all", label: t("allFilesFolders"), icon: `${OL}/icon/folder/closed.png` },
    { value: "computers", label: t("computersOrPeople"), icon: `${OL}/icon/computer.png` },
    { value: "internet", label: t("infoOnInternet"), icon: `${OL}/icon/internet.png` },
  ];

  const clearSearchTimeout = () => {
    if (searchTimeoutRef.current !== null) {
      window.clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
  };

  const resetSearch = () => {
    clearSearchTimeout();
    setType(null);
    setResults(null);
    setQuery("");
    setSearching(false);
    setRoverPose("idle");
  };

  const selectType = (nextType: string) => {
    clearSearchTimeout();
    setType(nextType);
    setQuery("");
    setResults(null);
    setSearching(false);
    setRoverPose("think");
  };

  const run = () => {
    if (!query.trim()) return;
    setSearching(true);
    setRoverPose("read");
    clearSearchTimeout();
    searchTimeoutRef.current = window.setTimeout(() => {
      setResults(searchByCategory(fileSystem, type ?? "all", query));
      searchTimeoutRef.current = null;
    }, 1000);
  };

  const getRoverImg = () => {
    if (roverPose === "read") return `${OL}/search/rover_read.png`;
    if (roverPose === "think") return `${OL}/search/rover_think.png`;
    return `${OL}/search/rover.png`;
  };

  const openResult = (result: VirtualFileNode) => {
    openWindow(result.kind === "folder" ? "explorer" : getFileAppId(result), result.id);
    closeWindow(id);
  };

  return (
    <div className="xp-app-surface" style={{ flexDirection: "row" }}>
      <div className="xp-search-side">
        <div className="xp-search-pane">
          <div className="xp-task-pane-title">{t("searchCompanion")}</div>
          <div className="xp-search-pane-body">
            {type === null ? <>
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>{t("whatSearchFor")}</div>
              {searchTypes.map((item) => <button key={item.value} className="xp-search-choice" onClick={() => selectType(item.value)}><img src={item.icon} alt="" />{item.label}</button>)}
            </> : <>
              <div style={{ fontWeight: "bold", marginBottom: 6 }}>{searchTypes.find((item) => item.value === type)?.label}</div>
              <div className="xp-small" style={{ marginBottom: 3 }}>{t("partOfFileName")}</div>
               <input aria-label={t("partOfFileName")} className="xp-input" style={{ width: "100%", marginBottom: 6 }} value={query} onChange={(event) => { clearSearchTimeout(); setSearching(false); setResults(null); setQuery(event.target.value); setRoverPose("think"); }} onKeyDown={(event) => { if (event.key === "Enter") run(); }} />
              <div style={{ display: "flex", gap: 4, marginBottom: 8 }}><button className="xp-button" style={{ minWidth: 54 }} onClick={run}>{t("searchBtn")}</button><button className="xp-button" style={{ minWidth: 54 }} onClick={resetSearch}>{t("cancelBtn")}</button></div>
              {searching && <div style={{ color: "#215DC6", fontStyle: "italic", marginBottom: 4 }}>{t("searching")}</div>}
              {results && <div style={{ borderTop: "1px solid #B8CFEC", paddingTop: 4 }}>{results.length === 0 ? <div>{t("noMatching")}</div> : results.map((result) => <div key={result.id} className="xp-search-result" role="button" tabIndex={0} onDoubleClick={() => openResult(result)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openResult(result); }}><div>{result.name}</div><div className="xp-search-result-path">{getNodePath(fileSystem, result.id)}</div></div>)}</div>}
            </>}
          </div>
        </div>
        <div className="xp-search-rover">
           <div className="xp-search-bubble">{searching ? t("searchingFiles") : t("whatFind")}</div>
          <div className="xp-search-rover-image" onClick={() => setRoverPose((pose) => pose === "idle" ? "read" : pose === "read" ? "think" : "idle")} title="Rover" style={{ transform: roverPose === "idle" ? `scale(${1 + (wagFrame % 2) * .03}) rotate(${(wagFrame - 1.5) * 1.5}deg)` : "none", transition: "transform .3s ease-in-out" }}><img src={getRoverImg()} alt="Rover" style={{ height: 74, imageRendering: "crisp-edges", filter: "drop-shadow(1px 2px 2px rgba(0,0,0,.35))" }} /></div>
        </div>
      </div>
      <div className="xp-search-results">
        <div className="xp-folder-group-title">{t("searchResults")}</div>
        {results ? results.length === 0 ? <div style={{ padding: 12, color: "#333" }}>{t("noMatching")}</div> : results.map((result) => <div key={result.id} className="xp-search-result" role="button" tabIndex={0} onDoubleClick={() => openResult(result)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openResult(result); }}><div>{result.name}</div><div className="xp-search-result-path">{getNodePath(fileSystem, result.id)}</div></div>) : <div style={{ color: "#888", display: "flex", alignItems: "center", justifyContent: "center", flex: 1, textAlign: "center", padding: 16 }}>{t("toStartSearch")}</div>}
        <div style={{ marginTop: "auto", paddingTop: 8 }}><button className="xp-button" onClick={() => closeWindow(id)}>{t("closeBtn")}</button></div>
      </div>
    </div>
  );
}
