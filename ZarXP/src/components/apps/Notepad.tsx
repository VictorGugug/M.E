import { useEffect, useRef, useState } from "react";
import { useFileSystemStore } from "../../store/fileSystemStore";
import { isTextFile } from "../../store/fileSystem";
import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { XP_SOUNDS, playSound } from "../../utils/sound";

export default function Notepad({ id }: { id: string }) {
  const resourceId = useWindowStore((state) => state.windows.find((window) => window.id === id)?.resourceId);
  const fileSystem = useFileSystemStore((state) => state.fileSystem);
  const updateFile = useFileSystemStore((state) => state.updateFile);
  const setResource = useWindowStore((state) => state.setResource);
  const t = useLangStore((state) => state.t);
  const resourceNode = resourceId ? fileSystem[resourceId] : undefined;
  const editable = !resourceNode || isTextFile(resourceNode);
  const resourceContent = resourceNode?.content ?? "";
  const [localFileName, setLocalFileName] = useState("");
  const fileName = resourceId ? fileSystem[resourceId]?.name ?? t("untitled") : localFileName || t("untitled");
  const [text, setText] = useState(resourceContent);
  const [wordWrap, setWordWrap] = useState(true);
  const [status, setStatus] = useState("Ln 1, Col 1");
  const [error, setError] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  const updateStatus = (value: string, pos?: number) => {
    const cursor = pos ?? value.length;
    const lines = value.slice(0, cursor).split("\n");
    setStatus(`Ln ${lines.length}, Col ${lines[lines.length - 1].length + 1}`);
  };

  useEffect(() => {
    setText(resourceContent);
    updateStatus(resourceContent);
  }, [resourceId, resourceContent]);

  const handleNew = () => {
    setResource(id, undefined);
    setText("");
    setLocalFileName("");
    setError("");
    setStatus("Ln 1, Col 1");
    playSound(XP_SOUNDS.menuCommand, 0.2);
  };

  const handleSave = () => {
    if (!editable) return;
    if (resourceId && resourceNode?.kind === "file") {
      updateFile(resourceId, text);
    } else {
      const blob = new Blob([text], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");
      anchor.href = url;
      anchor.download = localFileName || t("untitled");
      anchor.click();
      URL.revokeObjectURL(url);
    }
    playSound(XP_SOUNDS.menuCommand, 0.2);
  };

  const handleOpen = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setResource(id, undefined);
    setLocalFileName(file.name);
    setError("");
    void file.text().then((content) => {
      setText(content);
      updateStatus(content);
      playSound(XP_SOUNDS.menuCommand, 0.2);
    }).catch(() => {
      setText("");
      setError(t("fileReadError"));
      updateStatus("");
    });
  };

  return (
    <div className="xp-app-surface">
      <div className="xp-toolbar">
        <button className="xp-toolbar-button" onClick={handleNew}>{t("newFile")}</button>
        <button className="xp-toolbar-button" onClick={() => fileRef.current?.click()}>{t("openFile")}</button>
        <button className="xp-toolbar-button" onClick={handleSave} disabled={!editable}>{t("saveFile")}</button>
        <span style={{ flex: 1 }} />
        <label className="xp-form-row"><input className="xp-native-checkbox" type="checkbox" checked={wordWrap} onChange={(event) => setWordWrap(event.target.checked)} />{t("wordWrap")}</label>
        <input ref={fileRef} type="file" accept=".txt,.log,.ini,.cfg,.rtf,.xml,.json,.csv" style={{ display: "none" }} onChange={handleOpen} />
      </div>
      {error && <div role="alert" style={{ padding: "4px 8px", color: "#B00020", background: "#FFF0F0", borderBottom: "1px solid #E0B0B0" }}>{error}</div>}
      {editable ? <textarea aria-label={t("document")} style={{ flex: 1, border: "1px solid #ACA899", resize: "none", padding: 4, fontFamily: "Lucida Console, monospace", fontSize: 12, whiteSpace: wordWrap ? "pre-wrap" : "pre", overflowWrap: wordWrap ? "break-word" : "normal", overflowX: wordWrap ? "hidden" : "auto", outline: "none" }} value={text} onChange={(event) => { setText(event.target.value); updateStatus(event.target.value, event.target.selectionStart ?? undefined); }} onSelect={(event) => updateStatus(text, event.currentTarget.selectionStart ?? undefined)} onKeyUp={(event) => updateStatus(text, event.currentTarget.selectionStart ?? undefined)} spellCheck={false} /> : <div style={{ flex: 1, display: "grid", placeItems: "center", padding: 20, color: "#666", textAlign: "center" }}>{t("notEditable")}</div>}
      <div className="xp-status-strip"><span>{status}</span><span>{fileName}</span><span>{t("windowsCrlf")}</span><span>{t("utf8")}</span></div>
    </div>
  );
}
