import { useEffect, useState } from "react";
import { getChildren, getFileAppId, getNodePath, getTrashItems, type FileSystemState, type VirtualFileNode } from "../../store/fileSystem";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore, type StringKey } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const OL = assetUrl("assets/xpui");
const IC = assetUrl("assets/icons");

function iconFor(node: VirtualFileNode, fileSystem?: FileSystemState): string {
  if (node.id === "recycle-bin") return `${IC}/${fileSystem && getTrashItems(fileSystem).length > 0 ? "RecycleBinfull.png" : "RecycleBinempty.png"}`;
  if (node.kind === "folder") return `${OL}/icon/folder/closed.png`;
  const extension = node.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return `${IC}/TXT.png`;
  if (extension === "doc") return `${IC}/DOC.png`;
  if (extension === "jpg" || extension === "jpeg") return `${IC}/JPG.png`;
  if (extension === "png") return `${IC}/Bitmap.png`;
  return `${IC}/GenericDocument.png`;
}

function typeFor(node: VirtualFileNode, t: (key: StringKey) => string): string {
  if (node.kind === "folder") return t("fileFolder");
  const extension = node.name.split(".").pop()?.toLowerCase();
  if (extension === "txt") return t("textDocumentType");
  if (extension === "doc") return t("microsoftWordDocument");
  if (extension === "jpg" || extension === "jpeg") return t("jpegImage");
  if (extension === "png") return t("pngImage");
  return t("document");
}

export default function Explorer({ id }: { id: string }) {
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const deleteItem = useFileSystemStore((state) => state.deleteItem);
  const openWindow = useWindowStore((state) => state.openWindow);
  const t = useLangStore((state) => state.t);
  const resourceId = useWindowStore((state) => state.windows.find((window) => window.id === id)?.resourceId);
  const resourceIsFolder = Boolean(resourceId && fileSystem[resourceId]?.kind === "folder");
  const initialId = resourceId && resourceIsFolder ? resourceId : "root";
  const [currentId, setCurrentId] = useState(initialId);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(new Set(["root"]));
  useEffect(() => {
    if (resourceId && resourceIsFolder) setCurrentId(resourceId);
  }, [resourceId, resourceIsFolder]);
  const current = fileSystem[currentId] ?? fileSystem.root;
  const listedItems = currentId === "recycle-bin" ? getTrashItems(fileSystem) : getChildren(fileSystem, currentId);
  const selected = listedItems.find((item) => item.id === selectedId);

  const treeChildren = (parentId: string) => {
    if (parentId === "recycle-bin") return getTrashItems(fileSystem);
    return getChildren(fileSystem, parentId);
  };

  const toggleExpand = (id: string) => {
    setExpanded((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const selectNode = (node: VirtualFileNode) => {
    if (node.kind === "folder" || node.id === "recycle-bin") {
      setCurrentId(node.id);
      setSelectedId(null);
      setExpanded((previous) => new Set(previous).add(node.id));
    }
  };

  const openNode = (node: VirtualFileNode) => {
    if (node.kind === "folder" || node.id === "recycle-bin") selectNode(node);
    else openWindow(getFileAppId(node), node.id);
  };

  const renderTree = (nodes: VirtualFileNode[], depth = 0): React.ReactNode[] => nodes.flatMap((node) => {
    const children = treeChildren(node.id);
    const hasChildren = children.length > 0;
    const isExpanded = expanded.has(node.id);
    const isSelected = currentId === node.id;
    return [
       <button key={node.id} className={`xp-tree-item ${isSelected ? "selected" : ""}`} style={{ paddingLeft: depth * 14 + 4 }} onClick={() => selectNode(node)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); if (hasChildren) { setCurrentId(node.id); setSelectedId(null); toggleExpand(node.id); } else selectNode(node); } }} role="treeitem" aria-level={depth + 1} aria-selected={isSelected} aria-expanded={hasChildren ? isExpanded : undefined}>
        <span className="tree-arrow" onClick={(event) => { event.stopPropagation(); if (hasChildren) toggleExpand(node.id); }}>{hasChildren ? (isExpanded ? "\u25be" : "\u25b8") : ""}</span>
        <img src={iconFor(node, fileSystem)} alt="" />
        <span>{node.name}</span>
      </button>,
      ...(isExpanded && hasChildren ? renderTree(children, depth + 1) : []),
    ];
  });

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
          <button className="xp-toolbar-button" onClick={() => { if (current.parentId && fileSystem[current.parentId]) { setCurrentId(current.parentId); setSelectedId(null); } }} disabled={!current.parentId}><img src={`${OL}/interface/explorer/up.png`} alt="" style={{ height: 22 }} />{t("up")}</button>
          <button className="xp-toolbar-button" onClick={handleDelete} disabled={!selected}><img src={`${IC}/Delete.png`} alt="" style={{ height: 20 }} />{t("delete")}</button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button" onClick={() => openWindow("search")}><img src={`${OL}/interface/explorer/search.png`} alt="" style={{ height: 22 }} />{t("search")}</button>
          <button className="xp-toolbar-button" onClick={() => openWindow("explorer")}><img src={`${OL}/interface/explorer/folders.png`} alt="" style={{ height: 22 }} />{t("folders")}</button>
          <div className="xp-toolbar-separator" />
          <button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/views.png`} alt="" style={{ height: 22 }} />{t("views")}</button>
        </div>
        <div className="xp-address">
          <span className="addr-label">{t("address")}</span>
          <div className="xp-input" style={{ display: "flex", alignItems: "center", gap: 5, flex: 1, minHeight: 22 }}><img src={iconFor(current, fileSystem)} alt="" style={{ width: 14, height: 14 }} />{getNodePath(fileSystem, current.id)}</div>
          <button className="xp-toolbar-button"><img src={`${OL}/interface/explorer/go.png`} alt="" style={{ height: 18 }} />{t("go")}</button>
        </div>
      </div>
      <div className="xp-explorer-middle">
        <div className="xp-tree" role="tree">{renderTree(fileSystem.root ? [fileSystem.root] : [])}</div>
        <div className="xp-content-panel">
          <table className="xp-data-table">
            <thead><tr><th style={{ width: "48%" }}>{t("name")}</th><th style={{ width: "30%" }}>{t("typeLabel")}</th><th>{t("sizeLabel")}</th></tr></thead>
            <tbody>
              {listedItems.length === 0 ? <tr><td colSpan={3} style={{ padding: 16, textAlign: "center" }}>{currentId === "recycle-bin" ? t("recycleBinEmpty") : t("folderEmpty")}</td></tr> : listedItems.map((item) => (
                 <tr key={item.id} className={selectedId === item.id ? "selected" : ""} onClick={() => setSelectedId(item.id)} onDoubleClick={() => openNode(item)} onKeyDown={(event) => { if (event.key === "Enter" || event.key === " ") openNode(item); }} tabIndex={0}>
                  <td><img src={iconFor(item, fileSystem)} alt="" />{item.name}</td><td>{typeFor(item, t)}</td><td></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="xp-status-strip"><span>{listedItems.length} {t("objects")}</span><span>{current.name}</span></div>
        </div>
      </div>
    </div>
  );
}
