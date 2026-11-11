import { useState, useEffect, useCallback } from "react";
import { getChildren, getFileAppId, getNodePath, resolveAddressPath, type VirtualFileNode } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import { playSound, XP_SOUNDS } from "../../utils/sound";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

function iconFor(item: VirtualFileNode): string {
  if (item.kind === "folder") {
    if (item.id === "pictures") return `${OL}/icon/folder/pictures.png`;
    if (item.id === "music") return `${OL}/icon/folder/music.png`;
    if (item.id === "videos") return `${OL}/icon/folder/videos.png`;
    if (item.id === "documents") return `${OL}/icon/folder/documents.png`;
    return `${OL}/icon/folder/closed.png`;
  }
  const extension = item.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return `${IC}/TXT.png`;
  if (extension === "doc") return `${IC}/DOC.png`;
  if (extension === "xls") return `${IC}/GenericDocument.png`;
  if (extension === "jpg" || extension === "jpeg") return `${IC}/JPG.png`;
  if (extension === "png") return `${IC}/Bitmap.png`;
  return `${IC}/GenericDocument.png`;
}

function Pane({ title, links }: { title: string; links: { label: string; icon: string; onClick?: () => void }[] }) {
  return (
    <div className="xp-pane">
      <div className="pane-title">{title}</div>
      <div className="pane-links">
        {links.map((l) => (
          <a key={l.label} onClick={l.onClick}>
            <img src={l.icon} alt="" />
            {l.label}
          </a>
        ))}
      </div>
    </div>
  );
}

function Tile({ icon, label, sub, onClick, onDoubleClick }: { icon: string; label: string; sub?: string; onClick?: () => void; onDoubleClick?: () => void }) {
  return (
    <button className="xp-tile" onClick={onClick} onDoubleClick={onDoubleClick}>
      <img src={icon} alt="" />
      <span className="tile-text">
        <span className="tile-label">{label}</span>
        {sub && <span className="tile-sub">{sub}</span>}
      </span>
    </button>
  );
}

function Group({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <>
      <div className="xp-group-header">
        <span>{title}</span>
        <div className="line" />
      </div>
      {children}
    </>
  );
}

export default function MyComputer({ id }: { id: string }) {
  const fileSystem = useFileSystemStore((s) => s.fileSystem);
  const openWindow = useWindowStore((s) => s.openWindow);
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const t = useLangStore((s) => s.t);

  const [currentFolderId, setCurrentFolderId] = useState<string>("my-computer");
  const [backStack, setBackStack] = useState<string[]>([]);
  const [forwardStack, setForwardStack] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState<string>("My Computer");
  const [find, setFind] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const formatPath = useCallback((folderId: string): string => {
    if (folderId === "my-computer") return t("myComputer") || "My Computer";
    if (folderId === "root") return "C:\\";
    return getNodePath(fileSystem, folderId);
  }, [fileSystem, t]);

  useEffect(() => {
    setAddressInput(formatPath(currentFolderId));
  }, [currentFolderId, formatPath]);

  const isDrivesView = currentFolderId === "my-computer";
  const currentFolder = currentFolderId === "my-computer" ? null : fileSystem[currentFolderId];
  const folderItems = !isDrivesView ? getChildren(fileSystem, currentFolderId) : [];

  const canGoBack = backStack.length > 0;
  const canGoForward = forwardStack.length > 0;
  const canGoUp = currentFolderId !== "my-computer";

  const navigateTo = (targetFolderId: string) => {
    if (targetFolderId === currentFolderId) return;
    playSound(XP_SOUNDS.navigationStart);
    setBackStack((prev) => [...prev, currentFolderId]);
    setForwardStack([]);
    setCurrentFolderId(targetFolderId);
    setSelectedId(null);
  };

  const goBack = () => {
    if (backStack.length === 0) return;
    playSound(XP_SOUNDS.navigationStart);
    const prevFolderId = backStack[backStack.length - 1];
    setBackStack((prev) => prev.slice(0, -1));
    setForwardStack((prev) => [currentFolderId, ...prev]);
    setCurrentFolderId(prevFolderId);
    setSelectedId(null);
  };

  const goForward = () => {
    if (forwardStack.length === 0) return;
    playSound(XP_SOUNDS.navigationStart);
    const nextFolderId = forwardStack[0];
    setForwardStack((prev) => prev.slice(1));
    setBackStack((prev) => [...prev, currentFolderId]);
    setCurrentFolderId(nextFolderId);
    setSelectedId(null);
  };

  const goUp = () => {
    if (currentFolderId === "my-computer") return;
    if (currentFolderId === "root") {
      navigateTo("my-computer");
      return;
    }
    const parentId = fileSystem[currentFolderId]?.parentId;
    if (parentId === "root") {
      navigateTo("root");
    } else if (parentId && fileSystem[parentId]) {
      navigateTo(parentId);
    } else {
      navigateTo("my-computer");
    }
  };

  const handleGo = () => {
    const raw = addressInput.trim();
    if (!raw) {
      setAddressInput(formatPath(currentFolderId));
      return;
    }

    const res = resolveAddressPath(fileSystem, raw, currentFolderId === "my-computer" ? "root" : currentFolderId);
    if (res.kind === "folder" && res.targetId) {
      if (res.targetId === "root" && raw.toLowerCase().includes("computer")) {
        navigateTo("my-computer");
      } else {
        navigateTo(res.targetId);
      }
    } else if (res.kind === "file" && res.targetId) {
      playSound(XP_SOUNDS.navigationStart);
      const targetNode = fileSystem[res.targetId];
      openWindow(res.appId ?? (targetNode ? getFileAppId(targetNode) : "file-viewer"), res.targetId);
      setAddressInput(formatPath(currentFolderId));
    } else if (res.kind === "app" && res.appId) {
      playSound(XP_SOUNDS.navigationStart);
      openWindow(res.appId);
      setAddressInput(formatPath(currentFolderId));
    } else {
      playSound(XP_SOUNDS.error);
      setErrorMessage(res.error ?? `Windows cannot find '${raw}'. Check the spelling and try again.`);
      setAddressInput(formatPath(currentFolderId));
    }
  };

  const handleItemDoubleClick = (item: VirtualFileNode) => {
    if (item.kind === "folder") {
      navigateTo(item.id);
    } else {
      playSound(XP_SOUNDS.navigationStart);
      openWindow(getFileAppId(item), item.id);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF", fontFamily: "Tahoma, sans-serif", overflow: "hidden", position: "relative" }}>
      <div className="xp-explorer-head">
        <MenuBar
          trailing={<img src={`${OL}/logo/flag.png`} alt="" style={{ height: 16 }} />}
          menus={[
            { label: `&${t("file")}`, entries: [cmd(t("createShortcut")), cmd(t("rename")), cmd(t("properties")), sep, cmd(t("closeWindow"), () => closeWindow(id))] },
            { label: `&${t("edit")}`, entries: [cmd(t("undo")), cmd(t("redo")), sep, cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll"))] },
            { label: `&${t("view")}`, entries: [cmd(t("toolbars")), cmd(t("statusBar")), sep, cmd(t("viewTiles")), cmd(t("viewIcons")), cmd(t("viewList")), cmd(t("details")), sep, cmd(t("refresh"))] },
            { label: `&${t("favorites")}`, entries: [cmd(t("addToFavorites")), cmd(t("organizeFavorites"))] },
            { label: `&${t("tools")}`, entries: [cmd(t("mapNetworkDrive")), cmd(t("disconnectNetworkDrive")), sep, cmd(t("folderOptions"))] },
            { label: `&${t("help")}`, entries: [cmd(t("helpAndSupportCenter"), () => openWindow("system-properties")), sep, cmd(t("aboutWindows"))] },
          ]}
        />
        <div className="xp-toolbar">
          <button className={`button ${!canGoBack ? "disabled" : ""}`} disabled={!canGoBack} onClick={goBack} title={t("back")}>
            <img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />
            &nbsp;{t("back")}
          </button>
          <button className={`button ${!canGoForward ? "disabled" : ""}`} disabled={!canGoForward} onClick={goForward} title={t("forward")}>
            <img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} />
          </button>
          <button className={`button ${!canGoUp ? "disabled" : ""}`} disabled={!canGoUp} onClick={goUp} title={t("up")}>
            <img src={`${OL}/interface/explorer/up.png`} alt="" style={{ height: 22 }} />
          </button>
          <div className="separator" />
          <button className="button" onClick={() => openWindow("search")}>
            <img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />
            &nbsp;{t("search")}
          </button>
          <button className="button" onClick={() => openWindow("explorer")}>
            <img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />
            &nbsp;{t("folders")}
          </button>
          <div className="separator" />
          <button className="button" title={t("views")}>
            <img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />
            &#9662;
          </button>
        </div>
        <div className="xp-address">
          <span className="addr-label">{t("address")}</span>
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22, padding: "1px 4px", background: "#FFF", border: "1px solid rgb(166,166,166)" }}>
            <img src={isDrivesView ? `${OL}/icon/computer.png` : `${IC}/FolderOpened.png`} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGo();
                else if (e.key === "Escape") setAddressInput(formatPath(currentFolderId));
              }}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "11px Tahoma, sans-serif", padding: 0 }}
            />
          </div>
          <button className="go" onClick={handleGo} title={t("go")}>
            <img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} /> {t("go")}
          </button>
        </div>
      </div>
      <div className="xp-explorer-middle">
        <div className="xp-explorer-side">
          <div className="xp-explorer-blue">
            <Pane
              title={t("systemTasks")}
              links={[
                { label: "Account Manager", icon: `${IC}/UserAccounts.png`, onClick: () => openWindow("user-accounts") },
                { label: t("controlPanel"), icon: `${OL}/icon/folder/control.png`, onClick: () => openWindow("control-panel") },
              ]}
            />
            <Pane
              title={t("otherPlaces")}
              links={[
                { label: t("myNetworkPlaces") || "My Network Places", icon: `${IC}/MyNetworkPlaces.png`, onClick: () => openWindow("network-places") },
                { label: t("myDocuments"), icon: `${OL}/icon/folder/documents.png`, onClick: () => navigateTo("documents") },
                { label: t("myPictures"), icon: `${OL}/icon/folder/pictures.png`, onClick: () => navigateTo("pictures") },
                { label: t("myMusic"), icon: `${OL}/icon/folder/music.png`, onClick: () => navigateTo("music") },
                { label: t("myComputer"), icon: `${OL}/icon/computer.png`, onClick: () => navigateTo("my-computer") },
              ]}
            />
            <Pane title={t("details")} links={[]} />
            <div style={{ background: "rgba(255,255,255,0.7)", borderBottomLeftRadius: 5, borderBottomRightRadius: 5, padding: "2px 10px 8px", marginTop: -14, fontSize: 11 }}>
              <div style={{ fontWeight: "bold" }}>{isDrivesView ? t("myComputer") : currentFolder?.name}</div>
              <div>{t("systemFolder")}</div>
            </div>
            <div style={{ marginTop: "auto", position: "relative", height: 128, flexShrink: 0 }}>
              <div style={{ position: "absolute", bottom: 118, left: 0, right: 0, background: "#ECE9D8", border: "1px solid #0831D9", borderRadius: 4, padding: "5px 6px", boxShadow: "2px 2px 4px rgba(0,0,0,0.3)" }}>
                <div style={{ fontWeight: "bold", marginBottom: 3 }}>What do you want to find?</div>
                <input
                  value={find}
                  onChange={(e) => setFind(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter" && find.trim()) { openWindow("search"); setFind(""); } }}
                  style={{ width: "100%", border: "1px solid #7F9DB9", fontSize: 11, padding: "1px 3px", outline: "none" }}
                />
                <div style={{ position: "absolute", bottom: -10, left: 30, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "10px solid #0831D9" }} />
                <div style={{ position: "absolute", bottom: -8, left: 30, width: 0, height: 0, borderLeft: "9px solid transparent", borderRight: "9px solid transparent", borderTop: "9px solid #ECE9D8" }} />
              </div>
              <img src={assetUrl("assets/xpui/search/rover.png")} alt="" className="rover-anim" style={{ width: 78, position: "absolute", bottom: -4, left: 12, filter: "drop-shadow(2px 2px 2px rgba(0,0,0,0.3))" }} />
            </div>
          </div>
        </div>
        <div className="xp-explorer-body" style={{ overflowY: "auto" }}>
          {isDrivesView ? (
            <>
              <Group title={`${t("filesStoredIn")} ${t("myComputer")}`}>
                <Tile
                  icon={`${OL}/icon/folder/documents.png`}
                  label="XP User's Documents"
                  onClick={() => setSelectedId("tile-docs")}
                  onDoubleClick={() => navigateTo("documents")}
                />
                <Tile
                  icon={`${OL}/icon/folder/open.png`}
                  label="Shared Documents"
                  onClick={() => setSelectedId("tile-shared")}
                  onDoubleClick={() => navigateTo("documents")}
                />
              </Group>
              <Group title="Hard Disk Drives">
                <Tile
                  icon={`${IC}/LocalDisk.png`}
                  label="Local Disk (C:)"
                  sub="38.2 GB free of 76.2 GB"
                  onClick={() => setSelectedId("tile-c")}
                  onDoubleClick={() => navigateTo("root")}
                />
                <Tile
                  icon={`${IC}/LocalDisk.png`}
                  label="Local Disk (D:)"
                  sub="8.3 GB free of 52.8 GB"
                  onClick={() => setSelectedId("tile-d")}
                  onDoubleClick={() => navigateTo("root")}
                />
              </Group>
              <Group title="Devices with Removable Storage">
                <Tile icon={`${IC}/FloppyDisk.png`} label="3 Floppy (A:)" onClick={() => setSelectedId("tile-a")} />
                <Tile icon={`${IC}/CD-ROM.png`} label="CD Drive (D:)" onClick={() => setSelectedId("tile-cd")} />
                <Tile icon={`${IC}/DVD-ROM.png`} label="DVD Drive (E:)" onClick={() => setSelectedId("tile-dvd")} />
              </Group>
            </>
          ) : (
            <Group title={`${t("filesStoredIn")} ${currentFolder?.name ?? ""}`}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: 8, padding: 8 }}>
                {folderItems.length === 0 ? (
                  <span className="xp-small" style={{ gridColumn: "1 / -1", color: "#666" }}>{t("folderEmpty")}</span>
                ) : (
                  folderItems.map((item) => (
                    <button
                      key={item.id}
                      className={`xp-folder-tile ${selectedId === item.id ? "selected" : ""}`}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleItemDoubleClick(item); }}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 4,
                        background: selectedId === item.id ? "#316AC5" : "transparent",
                        color: selectedId === item.id ? "#FFF" : "#000",
                        border: selectedId === item.id ? "1px dotted #FFF" : "1px solid transparent",
                        padding: 6,
                        cursor: "pointer",
                      }}
                    >
                      <img src={iconFor(item)} alt="" style={{ width: 32, height: 32 }} />
                      <span className="tile-label" style={{ fontSize: 11, textAlign: "center", wordBreak: "break-word" }}>{item.name}</span>
                    </button>
                  ))
                )}
              </div>
            </Group>
          )}
        </div>
      </div>

      {/* Error Dialog for invalid address */}
      {errorMessage && (
        <div style={{
          position: "absolute", inset: 0,
          background: "rgba(0,0,0,0.2)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100
        }}>
          <div style={{ width: 380, background: "#ECE9D8", border: "1px solid #0055EA", boxShadow: "2px 2px 8px rgba(0,0,0,0.4)", borderRadius: 3, overflow: "hidden" }}>
            <div style={{ background: "linear-gradient(180deg, #0A246A 0%, #A6CAF0 100%)", color: "#FFF", fontWeight: "bold", fontSize: 11, padding: "3px 8px", display: "flex", justifyContent: "space-between" }}>
              <span>Address Bar</span>
              <button onClick={() => setErrorMessage(null)} style={{ border: "none", background: "none", color: "#FFF", cursor: "pointer", fontWeight: "bold" }}>×</button>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 15, padding: "16px 16px 12px" }}>
              <img src={`${IC}/Error.png`} alt="" style={{ width: 32, height: 32 }} onError={(e) => { (e.target as HTMLElement).style.display = 'none'; }} />
              <span style={{ fontSize: 11, color: "#000" }}>{errorMessage}</span>
            </div>
            <div style={{ padding: "0 16px 12px", display: "flex", justifyContent: "center" }}>
              <button className="xp-button" onClick={() => setErrorMessage(null)} autoFocus style={{ minWidth: 70, padding: "3px 12px", fontSize: 11 }}>OK</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
