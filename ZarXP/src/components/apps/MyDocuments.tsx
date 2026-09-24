import { useState } from "react";
import { getChildren, getFileAppId } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

function iconFor(name: string, kind: "folder" | "file"): string {
  if (kind === "folder") return `${OL}/icon/folder/closed.png`;
  const extension = name.split(".").pop()?.toLowerCase();
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
  const t = useLangStore((state) => state.t);
  const appId = useWindowStore((state) => state.windows.find((window) => window.id === id)?.appId);
  const folderId = appId === "my-pictures" ? "pictures" : appId === "my-music" ? "music" : appId === "my-videos" ? "videos" : "documents";
  const folderName = folderId === "pictures" ? t("myPictures") : folderId === "music" ? t("myMusic") : folderId === "videos" ? t("myVideos") : t("myDocuments");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = getChildren(fileSystem, folderId);
  const selected = items.find((item) => item.id === selectedId);

  const handleDelete = () => {
    if (!selected) return;
    deleteItem(selected.id);
    setSelectedId(null);
  };

  return (
    <div className="xp-app-surface">
      <div className="xp-explorer-head">
        <div className="xp-menubar">
          {[t("file"), t("edit"), t("view"), t("favorites"), t("tools"), t("help")].map((item) => <button className="xp-toolbar-button" key={item}>{item}</button>)}
          <img src={`${OL}/logo/flag.png`} alt="" style={{ width: 18, height: 18, marginLeft: "auto" }} />
        </div>
        <div className="xp-toolbar">
          <button className="xp-toolbar-button" disabled><img src={`${OL}/interface/explorer/back.png`} alt="" style={{ height: 22 }} />{t("back")}</button>
          <button className="xp-toolbar-button" disabled><img src={`${OL}/interface/explorer/forward.png`} alt="" style={{ height: 22 }} /></button>
          <button className="xp-toolbar-button" onClick={() => openWindow("search")}><img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />{t("search")}</button>
          <button className="xp-toolbar-button" onClick={() => openWindow("explorer")}><img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />{t("folders")}</button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />{t("views")}</button>
        </div>
        <div className="xp-address">
          <span className="addr-label">{t("address")}</span>
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22 }}><img src={`${IC}/FolderOpened.png`} alt="" style={{ width: 14, height: 14 }} />{folderName}</div>
          <button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />{t("go")}</button>
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
              <button className="xp-task-link" onClick={() => openWindow("my-computer")}><img src={`${OL}/icon/computer.png`} alt="" />{t("myComputer")}</button>
              <button className="xp-task-link" onClick={() => openWindow("my-documents")}><img src={`${OL}/icon/folder/documents.png`} alt="" />{t("myDocuments")}</button>
              <button className="xp-task-link" onClick={() => openWindow("my-pictures")}><img src={`${OL}/icon/folder/pictures.png`} alt="" />{t("myPictures")}</button>
              <button className="xp-task-link" onClick={() => openWindow("my-music")}><img src={`${OL}/icon/folder/music.png`} alt="" />{t("myMusic")}</button>
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
                {items.length === 0 ? <span className="xp-small">{t("folderEmpty")}</span> : items.map((item) => (
                   <button key={item.id} className={`xp-folder-tile ${selectedId === item.id ? "selected" : ""}`} onClick={() => setSelectedId(item.id)} onDoubleClick={() => item.kind === "file" && openWindow(getFileAppId(item), item.id)}>
                    <img src={iconFor(item.name, item.kind)} alt="" />
                    <span title={item.name}>{item.name}</span>
                  </button>
                ))}
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
