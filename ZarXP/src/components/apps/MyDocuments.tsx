import { useState, useEffect } from "react";
import { getChildren, getFileAppId, getNodePath, resolveAddressPath, type VirtualFileNode } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
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

export default function MyDocuments({ id }: { id: string }) {
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const deleteItem = useFileSystemStore((state) => state.deleteItem);
  const openWindow = useWindowStore((state) => state.openWindow);
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const t = useLangStore((state) => state.t);

  const windowConfig = useWindowStore((state) => state.windows.find((window) => window.id === id));
  const appId = windowConfig?.appId;
  const resourceId = windowConfig?.resourceId;

  const initialFolderId = resourceId && fileSystem[resourceId]?.kind === "folder"
    ? resourceId
    : appId === "my-pictures" ? "pictures"
    : appId === "my-music" ? "music"
    : appId === "my-videos" ? "videos"
    : "documents";

  const [currentFolderId, setCurrentFolderId] = useState<string>(initialFolderId);
  const [backStack, setBackStack] = useState<string[]>([]);
  const [forwardStack, setForwardStack] = useState<string[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [addressInput, setAddressInput] = useState<string>("");

  useEffect(() => {
    if (fileSystem[currentFolderId]) {
      setAddressInput(getNodePath(fileSystem, currentFolderId));
    }
  }, [currentFolderId, fileSystem]);

  const currentFolder = fileSystem[currentFolderId] ?? fileSystem.documents ?? fileSystem.root;
  const items = getChildren(fileSystem, currentFolderId);
  const selected = items.find((item) => item.id === selectedId);

  const canGoBack = backStack.length > 0;
  const canGoForward = forwardStack.length > 0;
  const canGoUp = Boolean(currentFolder?.parentId && fileSystem[currentFolder.parentId]);

  const folderName = currentFolderId === "pictures" ? t("myPictures")
    : currentFolderId === "music" ? t("myMusic")
    : currentFolderId === "videos" ? t("myVideos")
    : currentFolderId === "documents" ? t("myDocuments")
    : currentFolderId === "root" ? t("myComputer")
    : currentFolder?.name ?? "";

  const navigateTo = (targetFolderId: string) => {
    if (!fileSystem[targetFolderId] || targetFolderId === currentFolderId) return;
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
    if (!currentFolder?.parentId || !fileSystem[currentFolder.parentId]) return;
    navigateTo(currentFolder.parentId);
  };

  const handleGo = () => {
    const raw = addressInput.trim();
    if (!raw) {
      setAddressInput(getNodePath(fileSystem, currentFolderId));
      return;
    }

    const res = resolveAddressPath(fileSystem, raw, currentFolderId);
    if (res.kind === "folder" && res.targetId) {
      navigateTo(res.targetId);
    } else if (res.kind === "file" && res.targetId) {
      playSound(XP_SOUNDS.navigationStart);
      const targetNode = fileSystem[res.targetId];
      openWindow(res.appId ?? (targetNode ? getFileAppId(targetNode) : "file-viewer"), res.targetId);
      setAddressInput(getNodePath(fileSystem, currentFolderId));
    } else if (res.kind === "app" && res.appId) {
      playSound(XP_SOUNDS.navigationStart);
      openWindow(res.appId);
      setAddressInput(getNodePath(fileSystem, currentFolderId));
    } else {
      playSound(XP_SOUNDS.error);
      setAddressInput(getNodePath(fileSystem, currentFolderId));
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

  const handleDelete = () => {
    if (!selected) return;
    deleteItem(selected.id);
    playSound(XP_SOUNDS.recycle);
    setSelectedId(null);
  };

  return (
    <div className="xp-app-surface">
      <div className="xp-explorer-head">
        <MenuBar
          trailing={<img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18 }} />}
          menus={[
            { label: `&${t("file")}`, entries: [cmd(t("newFile")), cmd(t("createShortcut")), sep, cmd(t("delete"), handleDelete, { disabled: !selected }), cmd(t("rename")), cmd(t("properties")), sep, cmd(t("closeWindow"), () => closeWindow(id))] },
            { label: `&${t("edit")}`, entries: [cmd(t("undo")), cmd(t("redo")), sep, cmd(t("cut")), cmd(t("copy")), cmd(t("paste")), sep, cmd(t("selectAll"))] },
            { label: `&${t("view")}`, entries: [cmd(t("toolbars")), cmd(t("statusBar")), sep, cmd(t("viewTiles")), cmd(t("viewIcons")), cmd(t("viewList")), cmd(t("details")), sep, cmd(t("refresh"))] },
            { label: `&${t("favorites")}`, entries: [cmd(t("addToFavorites")), cmd(t("organizeFavorites"))] },
            { label: `&${t("tools")}`, entries: [cmd(t("mapNetworkDrive")), cmd(t("disconnectNetworkDrive")), sep, cmd(t("folderOptions"))] },
            { label: `&${t("help")}`, entries: [cmd(t("helpAndSupportCenter"), () => openWindow("system-properties")), sep, cmd(t("aboutWindows"))] },
          ]}
        />
        <div className="xp-toolbar">
          <button className={`xp-toolbar-button ${!canGoBack ? "disabled" : ""}`} onClick={goBack} disabled={!canGoBack} title={t("back")}>
            <img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />
            {t("back")}
          </button>
          <button className={`xp-toolbar-button ${!canGoForward ? "disabled" : ""}`} onClick={goForward} disabled={!canGoForward} title={t("forward")}>
            <img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} />
          </button>
          <button className={`xp-toolbar-button ${!canGoUp ? "disabled" : ""}`} onClick={goUp} disabled={!canGoUp} title={t("up")}>
            <img src={`${OL}/interface/explorer/up.png`} alt="" style={{ height: 22 }} />
            {t("up")}
          </button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button" onClick={() => openWindow("search")}>
            <img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />
            {t("search")}
          </button>
          <button className="xp-toolbar-button" onClick={() => openWindow("explorer")}>
            <img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />
            {t("folders")}
          </button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button" title={t("views")}>
            <img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />
            {t("views")}
          </button>
        </div>
        <div className="xp-address">
          <span className="addr-label">{t("address")}</span>
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22, padding: "1px 4px", background: "#FFF", border: "1px solid rgb(166,166,166)" }}>
            <img src={`${IC}/FolderOpened.png`} alt="" style={{ width: 14, height: 14, flexShrink: 0 }} />
            <input
              type="text"
              value={addressInput}
              onChange={(e) => setAddressInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleGo();
                else if (e.key === "Escape") setAddressInput(getNodePath(fileSystem, currentFolderId));
              }}
              style={{ flex: 1, border: "none", outline: "none", background: "transparent", font: "11px Tahoma, sans-serif", padding: 0 }}
            />
          </div>
          <button className="xp-toolbar-button" onClick={handleGo} title={t("go")}>
            <img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />
            {t("go")}
          </button>
        </div>
      </div>
      <div className="xp-explorer-middle">
        <div className="xp-side-panel">
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("systemTasks")}</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={() => openWindow("system-properties")}><img src={`${IC}/Information.png`} alt="" />{t("viewSystemInformation")}</button>
              <button className="xp-task-link" onClick={() => openWindow("settings")}><img src={`${OL}/interface/programs/defaults.png`} alt="" />{t("addOrRemovePrograms")}</button>
              <button className="xp-task-link" onClick={() => openWindow("display-properties")}><img src={`${IC}/DisplayProperties.png`} alt="" />{t("changeASetting")}</button>
            </div>
          </div>
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("otherPlaces")}</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={() => navigateTo("root")}><img src={`${OL}/icon/computer.png`} alt="" />{t("myComputer")}</button>
              <button className="xp-task-link" onClick={() => navigateTo("documents")}><img src={`${OL}/icon/folder/documents.png`} alt="" />{t("myDocuments")}</button>
              <button className="xp-task-link" onClick={() => navigateTo("pictures")}><img src={`${OL}/icon/folder/pictures.png`} alt="" />{t("myPictures")}</button>
              <button className="xp-task-link" onClick={() => navigateTo("music")}><img src={`${OL}/icon/folder/music.png`} alt="" />{t("myMusic")}</button>
            </div>
          </div>
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("details")}</div>
            <div className="xp-task-pane-body"><strong>{folderName}</strong><br /><span className="xp-small">{t("systemFolder")}</span></div>
          </div>
        </div>
        <div className="xp-content-panel">
          <div className="xp-folder-body">
            <div className="xp-folder-group">
              <div className="xp-folder-group-title">{t("filesStoredIn")} {folderName}</div>
              <div className="xp-folder-grid">
                {items.length === 0 ? (
                  <span className="xp-small">{t("folderEmpty")}</span>
                ) : (
                  items.map((item) => (
                    <button
                      key={item.id}
                      className={`xp-folder-tile ${selectedId === item.id ? "selected" : ""}`}
                      onClick={() => setSelectedId(item.id)}
                      onDoubleClick={() => handleItemDoubleClick(item)}
                      onKeyDown={(e) => { if (e.key === "Enter") handleItemDoubleClick(item); }}
                    >
                      <img src={iconFor(item)} alt="" />
                      <span title={item.name}>{item.name}</span>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
          <div className="xp-status-strip">
            <button className="xp-button" onClick={handleDelete} disabled={!selected}>{t("delete")}</button>
            <span>{items.length} {t("objects")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
