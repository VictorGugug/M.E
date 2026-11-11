import { useState, useRef, useCallback } from "react";
import { assetUrl } from "../../utils/assets";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

const IC = assetUrl("assets/icons");

function ToolBtn({
  img,
  label,
  onClick,
  active,
  disabled,
}: {
  img?: string;
  label?: string;
  onClick?: () => void;
  active?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      className="xp-toolbar-button"
      onClick={onClick}
      title={label}
      disabled={disabled}
      style={{
        background: active ? "#D2E0F8" : "transparent",
        borderColor: active ? "#316AC5" : "transparent",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "2px 4px",
        minWidth: 22,
        height: 22,
      }}
    >
      {img && <img src={img} alt="" style={{ width: 16, height: 16 }} />}
      {label && <span style={{ marginLeft: 3 }}>{label}</span>}
    </button>
  );
}

export default function Wordpad({ id }: { id: string }) {
  const t = useLangStore((state) => state.t);
  const lang = useLangStore((state) => state.lang);
  const closeWindow = useWindowStore((state) => state.closeWindow);

  const editorRef = useRef<HTMLDivElement>(null);
  const [font, setFont] = useState("Arial");
  const [size, setSize] = useState("10");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const [align, setAlign] = useState<"left" | "center" | "right">("left");
  const [bullets, setBullets] = useState(false);
  const [charCount, setCharCount] = useState(0);

  const exec = useCallback((command: string, value: string | undefined = undefined) => {
    document.execCommand(command, false, value);
    syncState();
    editorRef.current?.focus();
  }, []);

  const syncState = () => {
    if (typeof document === "undefined") return;
    setBold(document.queryCommandState("bold"));
    setItalic(document.queryCommandState("italic"));
    setUnderline(document.queryCommandState("underline"));
    setBullets(document.queryCommandState("insertUnorderedList"));
    if (document.queryCommandState("justifyCenter")) setAlign("center");
    else if (document.queryCommandState("justifyRight")) setAlign("right");
    else setAlign("left");

    const text = editorRef.current?.innerText || "";
    setCharCount(text.trim().length);
  };

  const handleFontChange = (newFont: string) => {
    setFont(newFont);
    exec("fontName", newFont);
  };

  const handleSizeChange = (newPt: string) => {
    setSize(newPt);
    const pt = parseInt(newPt, 10);
    const htmlSize = pt <= 8 ? "1" : pt <= 10 ? "2" : pt <= 12 ? "3" : pt <= 14 ? "4" : pt <= 18 ? "5" : pt <= 24 ? "6" : "7";
    exec("fontSize", htmlSize);
  };

  const save = () => {
    const content = editorRef.current?.innerHTML || "";
    const blob = new Blob([content], { type: "text/html" });
    const anchor = document.createElement("a");
    anchor.href = URL.createObjectURL(blob);
    anchor.download = "Document.html";
    anchor.click();
    URL.revokeObjectURL(anchor.href);
  };

  const newDoc = () => {
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
      syncState();
    }
  };

  const insertDateTime = () => {
    const now = new Date();
    const str = now.toLocaleDateString() + " " + now.toLocaleTimeString();
    exec("insertText", str);
  };

  const statusHelpText = lang === "es" ? "Para obtener ayuda, presione F1" : "For Help, press F1";

  return (
    <div className="xp-app-surface" style={{ display: "flex", flexDirection: "column", height: "100%", background: "#ECE9D8" }}>
      <MenuBar
        menus={[
          {
            label: `&${t("file")}`,
            entries: [
              cmd(t("newFile"), newDoc),
              cmd(t("openFile")),
              cmd(t("saveFile"), save),
              cmd(t("saveAs"), save),
              sep,
              cmd(t("print"), () => window.print()),
              sep,
              cmd(t("exit"), () => closeWindow(id)),
            ],
          },
          {
            label: `&${t("edit")}`,
            entries: [
              cmd(t("undo"), () => exec("undo")),
              cmd(t("redo"), () => exec("redo")),
              sep,
              cmd(t("cut"), () => exec("cut")),
              cmd(t("copy"), () => exec("copy")),
              cmd(t("paste"), () => exec("paste")),
              sep,
              cmd(t("selectAll"), () => exec("selectAll")),
            ],
          },
          {
            label: `&${t("view")}`,
            entries: [cmd(t("toolbars")), cmd(t("statusBar"))],
          },
          {
            label: `&${t("insert")}`,
            entries: [cmd(t("dateTimeInsert"), insertDateTime), cmd(t("objectInsert"))],
          },
          {
            label: `&${t("format")}`,
            entries: [cmd(t("font"))],
          },
          {
            label: `&${t("help")}`,
            entries: [cmd(t("helpTopics")), sep, cmd(t("aboutWordpad"))],
          },
        ]}
      />

      <div className="xp-toolbar" style={{ display: "flex", gap: 2, padding: "2px 4px", borderBottom: "1px solid #ACA899" }}>
        <ToolBtn img={`${IC}/NewFolder.png`} label={t("newFile")} onClick={newDoc} />
        <ToolBtn img={`${IC}/Open.png`} label={t("openFile")} />
        <ToolBtn img={`${IC}/Save.png`} label={t("saveFile")} onClick={save} />
        <ToolBtn img={`${IC}/Printer.png`} label={t("print")} onClick={() => window.print()} />
        <div className="xp-toolbar-separator" />
        <ToolBtn img={`${IC}/Cut.png`} label={t("cut")} onClick={() => exec("cut")} />
        <ToolBtn img={`${IC}/Copy.png`} label={t("copy")} onClick={() => exec("copy")} />
        <ToolBtn img={`${IC}/Paste.png`} label={t("paste")} onClick={() => exec("paste")} />
        <div className="xp-toolbar-separator" />
        <ToolBtn img={`${IC}/Undo.png`} label={t("undo")} onClick={() => exec("undo")} />
        <ToolBtn img={`${IC}/Redo.png`} label={t("redo")} onClick={() => exec("redo")} />
        <div className="xp-toolbar-separator" />
        <ToolBtn label={t("dateTimeInsert")} onClick={insertDateTime} />
      </div>

      <div className="xp-toolbar" style={{ display: "flex", alignItems: "center", gap: 4, padding: "2px 4px", borderBottom: "1px solid #ACA899" }}>
        <select
          className="xp-select"
          value={font}
          onChange={(e) => handleFontChange(e.target.value)}
          style={{ width: 130, height: 21, fontSize: 11 }}
        >
          <option value="Arial">Arial</option>
          <option value="Calibri">Calibri</option>
          <option value="Courier New">Courier New</option>
          <option value="Georgia">Georgia</option>
          <option value="Tahoma">Tahoma</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Verdana">Verdana</option>
        </select>

        <select
          className="xp-select"
          value={size}
          onChange={(e) => handleSizeChange(e.target.value)}
          style={{ width: 48, height: 21, fontSize: 11 }}
        >
          {["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36", "48", "72"].map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <div className="xp-toolbar-separator" />

        <ToolBtn
          label="B"
          active={bold}
          onClick={() => exec("bold")}
        />
        <ToolBtn
          label="I"
          active={italic}
          onClick={() => exec("italic")}
        />
        <ToolBtn
          label="U"
          active={underline}
          onClick={() => exec("underline")}
        />

        <div className="xp-toolbar-separator" />

        <ToolBtn
          label="≡"
          active={align === "left"}
          onClick={() => exec("justifyLeft")}
        />
        <ToolBtn
          label="≣"
          active={align === "center"}
          onClick={() => exec("justifyCenter")}
        />
        <ToolBtn
          label="⇥"
          active={align === "right"}
          onClick={() => exec("justifyRight")}
        />

        <div className="xp-toolbar-separator" />

        <ToolBtn
          label="•"
          active={bullets}
          onClick={() => exec("insertUnorderedList")}
        />
      </div>

      <div
        style={{
          height: 18,
          background: "#FFFFFF",
          borderBottom: "1px solid #919B9C",
          display: "flex",
          alignItems: "flex-end",
          paddingLeft: 30,
          boxSizing: "border-box",
          position: "relative",
          userSelect: "none",
        }}
      >
        <div style={{ display: "flex", width: "100%", height: 12, position: "relative" }}>
          {[1, 2, 3, 4, 5, 6, 7].map((num) => (
            <div key={num} style={{ width: 72, position: "relative", borderLeft: "1px solid #999", height: 8 }}>
              <span style={{ position: "absolute", top: -8, left: 2, fontSize: 9, color: "#666" }}>{num}</span>
              <div style={{ position: "absolute", left: 18, bottom: 0, width: 1, height: 3, background: "#CCC" }} />
              <div style={{ position: "absolute", left: 36, bottom: 0, width: 1, height: 5, background: "#999" }} />
              <div style={{ position: "absolute", left: 54, bottom: 0, width: 1, height: 3, background: "#CCC" }} />
            </div>
          ))}
        </div>
      </div>

      <div
        style={{
          flex: 1,
          background: "#808080",
          overflow: "auto",
          padding: "16px 20px",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <div
          ref={editorRef}
          contentEditable
          suppressContentEditableWarning
          onKeyUp={syncState}
          onMouseUp={syncState}
          style={{
            width: "100%",
            maxWidth: 680,
            minHeight: 480,
            background: "#FFFFFF",
            boxShadow: "0 2px 8px rgba(0,0,0,0.35)",
            padding: "24px 32px",
            boxSizing: "border-box",
            outline: "none",
            fontFamily: font,
            fontSize: `${size}pt`,
            color: "#000000",
            lineHeight: 1.35,
          }}
        />
      </div>

      <div
        className="xp-status-strip"
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "2px 8px",
          background: "#ECE9D8",
          borderTop: "1px solid #ACA899",
          fontSize: 11,
        }}
      >
        <span>{statusHelpText}</span>
        <span>{charCount} chars</span>
      </div>
    </div>
  );
}
