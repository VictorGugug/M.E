import { useFileSystemStore } from "../../store/fileSystemStore";
import { useLangStore } from "../../store/langStore";
import { getNodePath, isTextFile } from "../../store/fileSystem";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

const IC = assetUrl("assets/icons");

function iconFor(name: string): string {
  const extension = name.split(".").pop()?.toLowerCase();
  if (extension === "doc") return `${IC}/DOC.png`;
  if (extension === "jpg" || extension === "jpeg") return `${IC}/JPG.png`;
  if (extension === "png") return `${IC}/Bitmap.png`;
  return `${IC}/GenericDocument.png`;
}

export default function FileViewer({ id }: { id: string }) {
  const resourceId = useWindowStore((state) => state.windows.find((window) => window.id === id)?.resourceId);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const t = useLangStore((state) => state.t);
  const node = resourceId ? fileSystem[resourceId] : undefined;
  const content = node?.content ?? "";
  const isImage = node?.name.split(".").pop()?.toLowerCase() === "jpg" || node?.name.split(".").pop()?.toLowerCase() === "jpeg" || node?.name.split(".").pop()?.toLowerCase() === "png";

  if (!node) return <div className="xp-app-surface"><div className="xp-dialog-body">{t("fileNotFound")}</div></div>;

  return (
    <div className="xp-app-surface">
      <div className="xp-toolbar"><button className="xp-toolbar-button">{t("file")}</button><button className="xp-toolbar-button">{t("edit")}</button><button className="xp-toolbar-button">{t("view")}</button><button className="xp-toolbar-button">{t("help")}</button></div>
      <div className="xp-dialog-body" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 12, textAlign: "center" }}>
        <img src={iconFor(node.name)} alt="" style={{ width: 64, height: 64, objectFit: "contain" }} />
        <strong>{node.name}</strong>
        <span className="xp-small">{getNodePath(fileSystem, node.id)}</span>
        {isImage && content.startsWith("data:image/") ? <img src={content} alt={node.name} style={{ maxWidth: "100%", maxHeight: 300, objectFit: "contain" }} /> : content && isTextFile(node) ? <pre style={{ maxWidth: "90%", maxHeight: 220, overflow: "auto", padding: 10, border: "1px solid #ACA899", background: "#FFF", textAlign: "left", whiteSpace: "pre-wrap" }}>{content}</pre> : <span className="xp-small">{t("previewUnavailable")}</span>}
      </div>
      <div className="xp-status-strip"><span>{t("document")}</span><span>{node.name}</span></div>
    </div>
  );
}
