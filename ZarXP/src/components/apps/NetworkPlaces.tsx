import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import { playSound, XP_SOUNDS } from "../../utils/sound";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";
import type { AppId } from "../../types";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

export interface NetworkItem {
  id: string;
  name: string;
  sub?: string;
  icon: string;
  kind: "shortcut" | "directory" | "workgroup" | "computer" | "share" | "printer" | "file";
  targetLocation?: string;
  action?: "wizard" | "open-app";
  appId?: AppId;
  resourceId?: string;
  comment?: string;
}

const HIERARCHY: Record<string, { title: string; path: string; items: NetworkItem[] }> = {
  root: {
    title: "My Network Places",
    path: "My Network Places",
    items: [
      { id: "add-place", name: "Add a network place", sub: "Network Shortcut", icon: `${IC}/AddNetworkPlace.png`, kind: "shortcut", action: "wizard", comment: "Sets up a shortcut to a Web folder or FTP site." },
      { id: "entire-network", name: "Entire Network", sub: "Directory", icon: `${IC}/EntireNetwork.png`, kind: "directory", targetLocation: "entire-network", comment: "Displays all computers and resources on your local and corporate networks." },
      { id: "share-docs", name: "SharedDocs on ZarXP-PC (ZarXP-PC)", sub: "\\\\ZARXP-PC\\SharedDocs", icon: `${IC}/SharedFolder.png`, kind: "share", targetLocation: "share-docs", comment: "Shared public documents on workstation ZarXP-PC." },
      { id: "share-music", name: "SharedMusic on Media-Server (Media-Server)", sub: "\\\\MEDIA-SERVER\\Music", icon: `${IC}/SharedFolderAlt.png`, kind: "share", targetLocation: "share-music", comment: "Media streaming and shared audio files." },
      { id: "workgroup", name: "ZarXP Workgroup (WORKGROUP)", sub: "Workgroup", icon: `${IC}/Workgroup.png`, kind: "workgroup", targetLocation: "workgroup", comment: "Local peer-to-peer workgroup." },
      { id: "printers", name: "Printers on ZarXP-PC", sub: "\\\\ZARXP-PC\\Printers", icon: `${IC}/Networkprinter.png`, kind: "printer", comment: "Shared network printers and print queues." },
    ],
  },
  "entire-network": {
    title: "Entire Network",
    path: "Entire Network",
    items: [
      { id: "ms-network", name: "Microsoft Windows Network", sub: "Directory", icon: `${IC}/MicrosoftWindowsNetwork.png`, kind: "directory", targetLocation: "ms-network", comment: "Microsoft Windows networking provider." },
    ],
  },
  "ms-network": {
    title: "Microsoft Windows Network",
    path: "Entire Network\\Microsoft Windows Network",
    items: [
      { id: "workgroup-item", name: "WORKGROUP", sub: "Workgroup", icon: `${IC}/Workgroup.png`, kind: "workgroup", targetLocation: "workgroup", comment: "Local peer workgroup." },
      { id: "mshome-item", name: "MSHOME", sub: "Workgroup", icon: `${IC}/Workgroup.png`, kind: "workgroup", targetLocation: "workgroup", comment: "Home network workgroup." },
    ],
  },
  workgroup: {
    title: "WORKGROUP",
    path: "Entire Network\\Microsoft Windows Network\\WORKGROUP",
    items: [
      { id: "comp-zarxp", name: "ZARXP-PC", sub: "ZarXP Workstation", icon: `${OL}/icon/computer.png`, kind: "computer", targetLocation: "comp-zarxp", comment: "Local Windows XP Professional station." },
      { id: "comp-office", name: "OFFICE-PC", sub: "Windows XP Professional", icon: `${OL}/icon/computer.png`, kind: "computer", targetLocation: "comp-office", comment: "Remote office workstation." },
      { id: "comp-media", name: "MEDIA-SERVER", sub: "Windows XP Media Center", icon: `${OL}/icon/computer.png`, kind: "computer", targetLocation: "comp-media", comment: "Home media streaming server." },
    ],
  },
  "comp-zarxp": {
    title: "\\\\ZARXP-PC",
    path: "\\\\ZARXP-PC",
    items: [
      { id: "comp-zarxp-docs", name: "SharedDocs", sub: "Shared Folder", icon: `${IC}/SharedFolder.png`, kind: "share", targetLocation: "share-docs", comment: "Public document share." },
      { id: "comp-zarxp-printers", name: "Printers and Faxes", sub: "Network Printers", icon: `${IC}/Networkprinter.png`, kind: "printer", comment: "Connected LaserJet printer." },
    ],
  },
  "comp-office": {
    title: "\\\\OFFICE-PC",
    path: "\\\\OFFICE-PC",
    items: [
      { id: "comp-office-share", name: "PublicShare", sub: "Shared Folder", icon: `${IC}/SharedFolder.png`, kind: "share", targetLocation: "share-docs", comment: "Office public share." },
    ],
  },
  "comp-media": {
    title: "\\\\MEDIA-SERVER",
    path: "\\\\MEDIA-SERVER",
    items: [
      { id: "comp-media-music", name: "Music", sub: "Shared Audio", icon: `${IC}/SharedFolderAlt.png`, kind: "share", targetLocation: "share-music", comment: "Public MP3 audio repository." },
    ],
  },
  "share-docs": {
    title: "\\\\ZARXP-PC\\SharedDocs",
    path: "\\\\ZARXP-PC\\SharedDocs",
    items: [
      { id: "file-welcome", name: "Welcome to the Network.txt", sub: "Text Document (1 KB)", icon: `${IC}/TXT.png`, kind: "file", action: "open-app", appId: "notepad", resourceId: "readme", comment: "Welcome document for network users." },
      { id: "file-policy", name: "Network Policy.doc", sub: "WordPad Document (12 KB)", icon: `${IC}/DOC.png`, kind: "file", action: "open-app", appId: "wordpad", comment: "Company network usage policies." },
    ],
  },
  "share-music": {
    title: "\\\\MEDIA-SERVER\\Music",
    path: "\\\\MEDIA-SERVER\\Music",
    items: [
      { id: "file-music", name: "XP Soundscapes.mp3", sub: "Audio File (3.2 MB)", icon: `${IC}/GenericDocument.png`, kind: "file", action: "open-app", appId: "media-player", comment: "Ambient audio track." },
    ],
  },
};

const PARENT_MAP: Record<string, string> = {
  "entire-network": "root",
  "ms-network": "entire-network",
  workgroup: "ms-network",
  "comp-zarxp": "workgroup",
  "comp-office": "workgroup",
  "comp-media": "workgroup",
  "share-docs": "comp-zarxp",
  "share-music": "comp-media",
};

export default function NetworkPlaces({ id }: { id: string }) {
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const t = useLangStore((s) => s.t);

  const [history, setHistory] = useState<string[]>(["root"]);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [customPlaces, setCustomPlaces] = useState<NetworkItem[]>([]);
  const [viewMode, setViewMode] = useState<"tiles" | "icons" | "list" | "details">("tiles");
  const [showFolders, setShowFolders] = useState(false);
  const [addressInput, setAddressInput] = useState<string>("My Network Places");

  // Add Network Place Wizard state
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(1);
  const [wizardAddress, setWizardAddress] = useState("\\\\SERVER\\Share");
  const [wizardName, setWizardName] = useState("New Network Place");

  const currentLocation = history[historyIndex] ?? "root";
  const currentDef = HIERARCHY[currentLocation] ?? HIERARCHY.root;
  const currentItems = currentLocation === "root" ? [...currentDef.items, ...customPlaces] : currentDef.items;
  const selectedItem = currentItems.find((item) => item.id === selectedId);

  const navigateTo = (target: string) => {
    if (!HIERARCHY[target]) return;
    const nextHistory = [...history.slice(0, historyIndex + 1), target];
    setHistory(nextHistory);
    setHistoryIndex(nextHistory.length - 1);
    setSelectedId(null);
    setAddressInput(HIERARCHY[target].path);
    playSound(XP_SOUNDS.navigationStart);
  };

  const goBack = () => {
    if (historyIndex > 0) {
      const nextIndex = historyIndex - 1;
      setHistoryIndex(nextIndex);
      setSelectedId(null);
      const loc = history[nextIndex] ?? "root";
      setAddressInput(HIERARCHY[loc]?.path ?? "My Network Places");
      playSound(XP_SOUNDS.navigationStart);
    }
  };

  const goForward = () => {
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      setHistoryIndex(nextIndex);
      setSelectedId(null);
      const loc = history[nextIndex] ?? "root";
      setAddressInput(HIERARCHY[loc]?.path ?? "My Network Places");
      playSound(XP_SOUNDS.navigationStart);
    }
  };

  const goUp = () => {
    const parent = PARENT_MAP[currentLocation];
    if (parent) navigateTo(parent);
  };

  const handleGo = () => {
    const raw = addressInput.trim().toLowerCase();
    if (!raw) return;

    if (raw === "my network places" || raw === "network places" || raw === "root") {
      navigateTo("root");
      return;
    }
    if (raw === "entire network") {
      navigateTo("entire-network");
      return;
    }
    if (raw === "workgroup" || raw.includes("workgroup")) {
      navigateTo("workgroup");
      return;
    }
    if (raw === "my computer" || raw === "c:" || raw === "c:\\") {
      openWindow("my-computer");
      return;
    }
    if (raw === "my documents") {
      openWindow("my-documents");
      return;
    }

    // Match path in hierarchy
    const foundEntry = Object.entries(HIERARCHY).find(([, val]) => val.path.toLowerCase() === raw || val.title.toLowerCase() === raw);
    if (foundEntry) {
      navigateTo(foundEntry[0]);
    } else {
      playSound(XP_SOUNDS.error);
      setAddressInput(currentDef.path);
    }
  };

  const handleItemClick = (item: NetworkItem) => {
    setSelectedId(item.id);
  };

  const handleItemDoubleClick = (item: NetworkItem) => {
    if (item.action === "wizard") {
      setShowWizard(true);
      setWizardStep(1);
    } else if (item.action === "open-app" && item.appId) {
      openWindow(item.appId, item.resourceId);
    } else if (item.targetLocation) {
      navigateTo(item.targetLocation);
    }
  };

  const finishWizard = () => {
    if (wizardName.trim()) {
      const newItem: NetworkItem = {
        id: `custom-${Date.now()}`,
        name: wizardName.trim(),
        sub: wizardAddress.trim(),
        icon: `${IC}/NetworkFolder.png`,
        kind: "shortcut",
        targetLocation: "share-docs",
        comment: `Shortcut to ${wizardAddress.trim()}`,
      };
      setCustomPlaces((prev) => [...prev, newItem]);
      playSound(XP_SOUNDS.start);
    }
    setShowWizard(false);
  };

  return (
    <div className="xp-app-surface">
      {/* Explorer Head */}
      <div className="xp-explorer-head">
        <MenuBar
          trailing={<img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18 }} />}
          menus={[
            {
              label: `&${t("file")}`,
              entries: [
                cmd("New &Shortcut", () => { setShowWizard(true); setWizardStep(1); }),
                sep,
                cmd(t("closeWindow"), () => closeWindow(id)),
              ],
            },
            {
              label: `&${t("edit")}`,
              entries: [cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll"))],
            },
            {
              label: `&${t("view")}`,
              entries: [
                cmd("Tiles", () => setViewMode("tiles"), { checked: viewMode === "tiles" }),
                cmd("Icons", () => setViewMode("icons"), { checked: viewMode === "icons" }),
                cmd("List", () => setViewMode("list"), { checked: viewMode === "list" }),
                cmd("Details", () => setViewMode("details"), { checked: viewMode === "details" }),
                sep,
                cmd(t("refresh"), () => setSelectedId(null)),
              ],
            },
            {
              label: `&${t("favorites")}`,
              entries: [cmd(t("addToFavorites")), cmd(t("organizeFavorites"))],
            },
            {
              label: `&${t("tools")}`,
              entries: [
                cmd(t("mapNetworkDrive")),
                cmd(t("disconnectNetworkDrive")),
                sep,
                cmd(t("folderOptions")),
              ],
            },
            {
              label: `&${t("help")}`,
              entries: [
                cmd(t("helpAndSupportCenter"), () => openWindow("system-properties")),
                sep,
                cmd(t("aboutWindows"), () => openWindow("about-xp")),
              ],
            },
          ]}
        />
        {/* Standard Buttons Toolbar */}
        <div className="xp-toolbar">
          <button className={`xp-toolbar-button ${historyIndex === 0 ? "disabled" : ""}`} disabled={historyIndex === 0} onClick={goBack} title={t("back")}>
            <img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />
            {t("back")}
          </button>
          <button className={`xp-toolbar-button ${historyIndex >= history.length - 1 ? "disabled" : ""}`} disabled={historyIndex >= history.length - 1} onClick={goForward} title={t("forward")}>
            <img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} />
          </button>
          <button className={`xp-toolbar-button ${!PARENT_MAP[currentLocation] ? "disabled" : ""}`} disabled={!PARENT_MAP[currentLocation]} onClick={goUp} title={t("up") || "Up"}>
            <img src={`${OL}/interface/explorer/up.png`} alt="" style={{ height: 22 }} />
            {t("up") || "Up"}
          </button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button" onClick={() => openWindow("search")}>
            <img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />
            {t("search")}
          </button>
          <button className="xp-toolbar-button" onClick={() => setShowFolders(!showFolders)}>
            <img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />
            {t("folders")}
          </button>
          <div className="xp-toolbar-separator" />
          <button
            className="xp-toolbar-button"
            onClick={() => {
              const modes: Array<"tiles" | "icons" | "list" | "details"> = ["tiles", "icons", "list", "details"];
              const next = modes[(modes.indexOf(viewMode) + 1) % modes.length];
              setViewMode(next);
            }}
            title={t("views") || "Views"}
          >
            <img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />
            {t("views")}
          </button>
        </div>
        {/* Address Bar */}
        <div className="xp-address">
          <span className="addr-label">{t("address")}</span>
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 6, flex: 1, minHeight: 22, padding: "1px 4px" }}>
            <img src={`${IC}/MyNetworkPlaces.png`} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleGo(); }}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "11px Tahoma, sans-serif" }}
            />
          </div>
          <button className="xp-toolbar-button" onClick={handleGo}>
            <img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />
            {t("go")}
          </button>
        </div>
      </div>

      {/* Explorer Middle */}
      <div className="xp-explorer-middle">
        {/* Left Panel */}
        <div className="xp-side-panel">
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">Network Tasks</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={() => { setShowWizard(true); setWizardStep(1); }}>
                <img src={`${IC}/AddNetworkPlace.png`} alt="" />
                Add a network place
              </button>
              <button className="xp-task-link" onClick={() => navigateTo("entire-network")}>
                <img src={`${IC}/EntireNetwork.png`} alt="" />
                View entire network
              </button>
              <button className="xp-task-link" onClick={() => navigateTo("workgroup")}>
                <img src={`${IC}/Workgroup.png`} alt="" />
                View workgroup computers
              </button>
              <button className="xp-task-link" onClick={() => alert("Local Area Connection: Connected (100.0 Mbps)")}>
                <img src={`${IC}/NetworkConnections.png`} alt="" />
                View network connections
              </button>
              <button className="xp-task-link" onClick={() => alert("Network Setup Wizard: ZarXP is configured for workgroup networking.")}>
                <img src={`${IC}/NetworkSetup.png`} alt="" />
                Set up a home or small office network
              </button>
            </div>
          </div>

          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("otherPlaces")}</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={() => openWindow("my-computer")}>
                <img src={`${OL}/icon/computer.png`} alt="" />
                {t("myComputer")}
              </button>
              <button className="xp-task-link" onClick={() => openWindow("my-documents")}>
                <img src={`${OL}/icon/folder/documents.png`} alt="" />
                {t("myDocuments")}
              </button>
              <button className="xp-task-link" onClick={() => navigateTo("share-docs")}>
                <img src={`${IC}/SharedFolder.png`} alt="" />
                Shared Documents
              </button>
            </div>
          </div>

          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("details")}</div>
            <div className="xp-task-pane-body" style={{ fontSize: 11, lineHeight: 1.35 }}>
              {selectedItem ? (
                <>
                  <strong>{selectedItem.name}</strong>
                  <br />
                  <span className="xp-small" style={{ color: "#555" }}>{selectedItem.sub || selectedItem.kind}</span>
                  {selectedItem.comment && (
                    <div style={{ marginTop: 4, color: "#333" }}>{selectedItem.comment}</div>
                  )}
                </>
              ) : (
                <>
                  <strong>{currentDef.title}</strong>
                  <br />
                  <span className="xp-small" style={{ color: "#555" }}>System Folder</span>
                  <div style={{ marginTop: 4, color: "#333" }}>Shortcuts to computers and shared folders on your local network.</div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="xp-content-panel" onClick={() => setSelectedId(null)} style={{ flex: 1, display: "flex", flexDirection: "column", background: "#FFF", overflowY: "auto" }}>
          <div className="xp-folder-group" style={{ padding: 10 }}>
            <div className="xp-group-header" style={{ marginBottom: 8, display: "flex", alignItems: "center", gap: 8, borderBottom: "1px solid #0055EA" }}>
              <span style={{ fontWeight: "bold", color: "#003399" }}>{currentDef.title}</span>
            </div>

            {/* View Grid */}
            {viewMode === "tiles" && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 6 }}>
                {currentItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      className="xp-tile"
                      style={{
                        background: isSelected ? "#316AC5" : "transparent",
                        color: isSelected ? "#FFF" : "#000",
                        border: isSelected ? "1px dotted #FFF" : "1px solid transparent",
                        borderRadius: 2,
                        padding: 4,
                        textAlign: "left",
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        cursor: "pointer",
                      }}
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                      onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleItemDoubleClick(item); }}
                    >
                      <img src={item.icon} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
                      <span className="tile-text" style={{ display: "flex", flexDirection: "column", minWidth: 0, overflow: "hidden" }}>
                        <span className="tile-label" style={{ fontWeight: isSelected ? "bold" : "normal", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{item.name}</span>
                        {item.sub && <span className="tile-sub" style={{ fontSize: 10, color: isSelected ? "#DCE9F9" : "#666", textOverflow: "ellipsis", whiteSpace: "nowrap", overflow: "hidden" }}>{item.sub}</span>}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === "icons" && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                {currentItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <button
                      key={item.id}
                      style={{
                        width: 80,
                        background: isSelected ? "#316AC5" : "transparent",
                        color: isSelected ? "#FFF" : "#000",
                        border: isSelected ? "1px dotted #FFF" : "1px solid transparent",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        textAlign: "center",
                        padding: 6,
                        cursor: "pointer",
                        gap: 4,
                      }}
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                      onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                      onKeyDown={(e) => { if (e.key === "Enter") handleItemDoubleClick(item); }}
                    >
                      <img src={item.icon} alt="" style={{ width: 32, height: 32, objectFit: "contain" }} />
                      <span style={{ fontSize: 11, wordBreak: "break-word" }}>{item.name}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {viewMode === "list" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {currentItems.map((item) => {
                  const isSelected = selectedId === item.id;
                  return (
                    <div
                      key={item.id}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        padding: "3px 6px",
                        background: isSelected ? "#316AC5" : "transparent",
                        color: isSelected ? "#FFF" : "#000",
                        cursor: "pointer",
                      }}
                      onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                      onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                    >
                      <img src={item.icon} alt="" style={{ width: 16, height: 16 }} />
                      <span style={{ fontSize: 11 }}>{item.name}</span>
                    </div>
                  );
                })}
              </div>
            )}

            {viewMode === "details" && (
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                <thead>
                  <tr style={{ background: "#ECE9D8", borderBottom: "1px solid #ACA899", textAlign: "left" }}>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899" }}>Name</th>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899" }}>Type</th>
                    <th style={{ padding: "3px 6px", borderRight: "1px solid #ACA899" }}>Location</th>
                    <th style={{ padding: "3px 6px" }}>Comments</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((item) => {
                    const isSelected = selectedId === item.id;
                    return (
                      <tr
                        key={item.id}
                        style={{
                          background: isSelected ? "#316AC5" : "transparent",
                          color: isSelected ? "#FFF" : "#000",
                          cursor: "pointer",
                        }}
                        onClick={(e) => { e.stopPropagation(); handleItemClick(item); }}
                        onDoubleClick={(e) => { e.stopPropagation(); handleItemDoubleClick(item); }}
                      >
                        <td style={{ padding: "3px 6px", display: "flex", alignItems: "center", gap: 6 }}>
                          <img src={item.icon} alt="" style={{ width: 16, height: 16 }} />
                          {item.name}
                        </td>
                        <td style={{ padding: "3px 6px" }}>{item.kind}</td>
                        <td style={{ padding: "3px 6px" }}>{item.sub || ""}</td>
                        <td style={{ padding: "3px 6px" }}>{item.comment || ""}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Explorer Status Bar */}
      <div style={{ height: 20, background: "#ECE9D8", borderTop: "1px solid #ACA899", display: "flex", alignItems: "center", padding: "0 6px", fontSize: 11, gap: 10 }}>
        <div style={{ flex: 1 }}>{selectedItem ? `1 object selected` : `${currentItems.length} objects`}</div>
        <div style={{ display: "flex", alignItems: "center", gap: 4, borderLeft: "1px solid #ACA899", paddingLeft: 8 }}>
          <img src={`${IC}/MicrosoftWindowsNetwork.png`} alt="" style={{ width: 14, height: 14 }} />
          <span>Local intranet</span>
        </div>
      </div>

      {/* Add Network Place Wizard Modal */}
      {showWizard && (
        <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="xp-dialog-surface" style={{ width: 440, borderRadius: 4, boxShadow: "2px 2px 10px rgba(0,0,0,0.5)", border: "2px solid #0055EA" }}>
            <div style={{ background: "linear-gradient(90deg, #0A246A 0%, #A6CAF0 100%)", color: "#FFF", padding: "4px 8px", fontWeight: "bold", fontSize: 12 }}>
              Add Network Place Wizard
            </div>
            <div className="xp-dialog-body" style={{ padding: 14 }}>
              {wizardStep === 1 ? (
                <>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <img src={`${IC}/AddNetworkPlace.png`} alt="" style={{ width: 48, height: 48 }} />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>Where do you want to create this network place?</div>
                      <div style={{ fontSize: 11, color: "#333" }}>Enter the network or Web address of the shared folder, FTP site, or Web site.</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>Internet or network address:</label>
                    <input
                      className="xp-input"
                      value={wizardAddress}
                      onChange={(e) => setWizardAddress(e.target.value)}
                      style={{ width: "100%", padding: "3px 6px" }}
                    />
                  </div>
                </>
              ) : (
                <>
                  <div style={{ display: "flex", gap: 12, marginBottom: 12 }}>
                    <img src={`${IC}/NetworkFolder.png`} alt="" style={{ width: 48, height: 48 }} />
                    <div>
                      <div style={{ fontWeight: "bold", fontSize: 12, marginBottom: 4 }}>What do you want to name this network place?</div>
                      <div style={{ fontSize: 11, color: "#333" }}>Type a name for this network shortcut to easily recognize it in My Network Places.</div>
                    </div>
                  </div>
                  <div style={{ marginTop: 10 }}>
                    <label style={{ display: "block", marginBottom: 4 }}>Network place name:</label>
                    <input
                      className="xp-input"
                      value={wizardName}
                      onChange={(e) => setWizardName(e.target.value)}
                      style={{ width: "100%", padding: "3px 6px" }}
                    />
                  </div>
                </>
              )}
            </div>
            <div className="xp-dialog-footer">
              {wizardStep === 1 ? (
                <>
                  <button className="xp-button" onClick={() => setWizardStep(2)}>Next &gt;</button>
                  <button className="xp-button" onClick={() => setShowWizard(false)}>{t("cancel")}</button>
                </>
              ) : (
                <>
                  <button className="xp-button" onClick={() => setWizardStep(1)}>&lt; Back</button>
                  <button className="xp-button" onClick={finishWizard}>Finish</button>
                  <button className="xp-button" onClick={() => setShowWizard(false)}>{t("cancel")}</button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
