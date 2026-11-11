import { useState } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { findNodeByPath, getFileAppId, normalizeRunCommand } from "../../store/fileSystem";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";
import { playSound, XP_SOUNDS } from "../../utils/sound";

export default function RunDialog({ id }: { id: string }) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const openWindow = useWindowStore((state) => state.openWindow);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const t = useLangStore((state) => state.t);

  const handleRun = () => {
    const trimmed = value.trim();
    if (!trimmed) {
      playSound(XP_SOUNDS.error);
      setError(t("runCannotFind"));
      return;
    }
    const [firstWord, ...rest] = trimmed.split(/\s+/);
    const appId = normalizeRunCommand(trimmed) ?? normalizeRunCommand(firstWord);
    if (appId) {
      const restArg = rest.join(" ").replace(/^["']|["']$/g, "").trim();
      const targetNode = restArg ? findNodeByPath(fileSystem, restArg) : undefined;
      openWindow(appId, targetNode?.id);
      closeWindow(id);
      return;
    }
    const node = findNodeByPath(fileSystem, trimmed);
    if (!node) {
      playSound(XP_SOUNDS.error);
      setError(t("runCannotFind"));
      return;
    }
    openWindow(node.kind === "folder" ? "explorer" : getFileAppId(node), node.id);
    closeWindow(id);
  };

  return (
    <div className="xp-dialog-surface">
      <div className="xp-dialog-body" style={{ padding: "14px 14px 10px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <img src={assetUrl("assets/icons/Run.png")} alt="" style={{ width: 32, height: 32 }} />
           <div style={{ lineHeight: 1.35 }}>{t("runDescription")}</div>
        </div>
        <div className="xp-form-row">
           <label className="xp-form-label" htmlFor="run-open">{t("openLabel")}</label>
          <input id="run-open" className="xp-input" style={{ flex: 1 }} value={value} onChange={(event) => { setValue(event.target.value); setError(""); }} onKeyDown={(event) => { if (event.key === "Enter") handleRun(); }} aria-invalid={Boolean(error)} aria-describedby={error ? "run-error" : undefined} autoFocus />
        </div>
        {error && <div id="run-error" role="alert" style={{ color: "#B00020", marginTop: 6, fontSize: 11 }}>{error}</div>}
      </div>
      <div className="xp-dialog-footer">
        <button className="xp-button" onClick={handleRun}>{t("ok")}</button>
        <button className="xp-button" onClick={() => closeWindow(id)}>{t("cancel")}</button>
        <button className="xp-button" disabled>{t("browse")}</button>
      </div>
    </div>
  );
}
