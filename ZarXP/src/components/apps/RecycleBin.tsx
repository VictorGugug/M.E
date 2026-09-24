import { useState } from "react";
import { getNodePath, getTrashItems } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

export default function RecycleBin(_: { id: string }) {
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const restoreItem = useFileSystemStore((state) => state.restoreItem);
  const emptyTrash = useFileSystemStore((state) => state.emptyTrash);
  const openWindow = useWindowStore((state) => state.openWindow);
  const t = useLangStore((state) => state.t);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const items = getTrashItems(fileSystem);
  const selected = items.find((item) => item.id === selectedId);

  const handleRestore = () => {
    if (!selected) return;
    restoreItem(selected.id);
    setSelectedId(null);
  };

  const handleEmpty = () => {
    if (items.length === 0 || !window.confirm(t("emptyTrashConfirm"))) return;
    emptyTrash();
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
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22 }}><img src={`${IC}/${items.length ? "RecycleBinfull.png" : "RecycleBinempty.png"}`} alt="" style={{ width: 14, height: 14 }} />{t("recycleBin")}</div>
          <button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />{t("go")}</button>
        </div>
      </div>
      <div className="xp-explorer-middle">
        <div className="xp-side-panel">
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("recycleBinTasks")}</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={handleEmpty} disabled={items.length === 0}><img src={`${IC}/Delete.png`} alt="" />{t("emptyRecycleBin")}</button>
              <button className="xp-task-link" onClick={handleRestore} disabled={!selected}><img src={`${IC}/Default.png`} alt="" />{t("restoreSelectedItem")}</button>
            </div>
          </div>
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("otherPlaces")}</div>
            <div className="xp-task-pane-body">
              <button className="xp-task-link" onClick={() => openWindow("my-computer")}><img src={`${OL}/icon/computer.png`} alt="" />{t("myComputer")}</button>
              <button className="xp-task-link" onClick={() => openWindow("my-documents")}><img src={`${OL}/icon/folder/documents.png`} alt="" />{t("myDocuments")}</button>
              <button className="xp-task-link" onClick={() => openWindow("my-pictures")}><img src={`${OL}/icon/folder/pictures.png`} alt="" />{t("myPictures")}</button>
            </div>
          </div>
          <div className="xp-task-pane">
            <div className="xp-task-pane-title">{t("details")}</div>
            <div className="xp-task-pane-body"><strong>{t("recycleBin")}</strong><br /><span className="xp-small">{t("deletedItems")}</span></div>
          </div>
        </div>
        <div className="xp-content-panel">
          <table className="xp-data-table">
            <thead><tr><th style={{ width: "38%" }}>{t("name")}</th><th style={{ width: "40%" }}>{t("originalLocation")}</th><th>{t("dateDeleted")}</th></tr></thead>
            <tbody>
              {items.length === 0 ? <tr><td colSpan={3} style={{ padding: 16, textAlign: "center" }}>{t("recycleBinEmpty")}</td></tr> : items.map((item) => {
                const extension = item.name.split(".").pop()?.toLowerCase();
                const icon = item.kind === "folder" ? `${OL}/icon/folder/closed.png` : extension === "txt" ? `${IC}/TXT.png` : extension === "doc" ? `${IC}/DOC.png` : extension === "jpg" || extension === "jpeg" ? `${IC}/JPG.png` : extension === "png" ? `${IC}/Bitmap.png` : `${IC}/GenericDocument.png`;
                return <tr key={item.id} className={selectedId === item.id ? "selected" : ""} onClick={() => setSelectedId(item.id)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") setSelectedId(item.id); }} tabIndex={0}><td><img src={icon} alt="" />{item.name}</td><td>{getNodePath(fileSystem, item.originalParentId ?? item.parentId)}</td><td>{item.deletedAt ? new Date(item.deletedAt).toLocaleString() : ""}</td></tr>;
              })}
            </tbody>
          </table>
           <div className="xp-status-strip"><span>{items.length} {t("itemCount")}</span><span>{t("recycleBin")}</span></div>
        </div>
      </div>
    </div>
  );
}
