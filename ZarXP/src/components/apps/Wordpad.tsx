import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const IC = assetUrl("assets/icons");

function ToolBtn({ img, label, onClick }: { img?: string; label?: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{ display: "flex", alignItems: "center", gap: 3, padding: "3px 5px", background: "none", border: "1px solid transparent", borderRadius: 3, fontSize: 11, fontFamily: "Tahoma, sans-serif" }}
      onMouseEnter={(e) => { e.currentTarget.style.border = "1px solid #D8D2BD"; e.currentTarget.style.background = "linear-gradient(#F9F9F5,#F1F1EA)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.border = "1px solid transparent"; e.currentTarget.style.background = "none"; }}
    >
      {img && <img src={img} alt="" style={{ width: 16, height: 16 }} />}
      {label && <span>{label}</span>}
    </button>
  );
}

export default function Wordpad(_: { id: string }) {
  const [text, setText] = useState("");
  const [font, setFont] = useState("Arial");
  const [size, setSize] = useState("12");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);

  const save = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "Document.rtf";
    a.click();
    URL.revokeObjectURL(a.href);
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ECE9D8", fontFamily: "Tahoma, sans-serif", overflow: "hidden" }}>
      <div style={{ display: "flex", gap: 1, padding: "1px 2px", borderBottom: "1px solid #DADAD8", flexShrink: 0 }}>
        <ToolBtn img={`${IC}/NewFolder.png`} label="New" />
        <ToolBtn img={`${IC}/Open.png`} label="Open" />
        <ToolBtn img={`${IC}/Save.png`} label="Save" onClick={save} />
        <ToolBtn img={`${IC}/Printer.png`} label="Print" onClick={() => window.print()} />
        <div style={{ width: 1, background: "#D5D4CB", margin: "0 4px" }} />
        <ToolBtn img={`${IC}/Cut.png`} label="Cut" onClick={() => document.execCommand("cut")} />
        <ToolBtn img={`${IC}/Copy.png`} label="Copy" onClick={() => document.execCommand("copy")} />
        <ToolBtn img={`${IC}/Paste.png`} label="Paste" onClick={() => document.execCommand("paste")} />
        <div style={{ width: 1, background: "#D5D4CB", margin: "0 4px" }} />
        <ToolBtn img={`${IC}/Undo.png`} onClick={() => document.execCommand("undo")} />
        <ToolBtn img={`${IC}/Redo.png`} onClick={() => document.execCommand("redo")} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 3, padding: "2px 4px", borderBottom: "1px solid #DADAD8", flexShrink: 0 }}>
        <select value={font} onChange={(e) => setFont(e.target.value)} style={{ width: 110, fontSize: 11, fontFamily: "Tahoma, sans-serif", border: "1px solid #7F9DB9" }}>
          <option>Arial</option><option>Calibri</option><option>Courier New</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option>
        </select>
        <select value={size} onChange={(e) => setSize(e.target.value)} style={{ width: 46, fontSize: 11, fontFamily: "Tahoma, sans-serif", border: "1px solid #7F9DB9" }}>
          {["8","9","10","11","12","14","16","18","20","24","28","36"].map((s) => <option key={s}>{s}</option>)}
        </select>
        <button onClick={() => setBold(!bold)} title="Bold" style={{ width: 22, height: 20, fontWeight: "bold", background: bold ? "#C1D2EE" : "none", border: "1px solid " + (bold ? "#7F9DB9" : "transparent"), borderRadius: 3 }}>B</button>
        <button onClick={() => setItalic(!italic)} title="Italic" style={{ width: 22, height: 20, fontStyle: "italic", background: italic ? "#C1D2EE" : "none", border: "1px solid " + (italic ? "#7F9DB9" : "transparent"), borderRadius: 3 }}>I</button>
        <button onClick={() => setUnderline(!underline)} title="Underline" style={{ width: 22, height: 20, textDecoration: "underline", background: underline ? "#C1D2EE" : "none", border: "1px solid " + (underline ? "#7F9DB9" : "transparent"), borderRadius: 3 }}>U</button>
        <div style={{ width: 1, height: 18, background: "#D5D4CB", margin: "0 3px" }} />
        <button onClick={() => document.execCommand("justifyLeft")} title="Align Left" style={{ width: 22, height: 20, background: "none", border: "1px solid transparent", borderRadius: 3 }}>&#8801;</button>
        <button onClick={() => document.execCommand("justifyCenter")} title="Center" style={{ width: 22, height: 20, background: "none", border: "1px solid transparent", borderRadius: 3 }}>&#8803;</button>
        <button onClick={() => document.execCommand("justifyRight")} title="Align Right" style={{ width: 22, height: 20, background: "none", border: "1px solid transparent", borderRadius: 3 }}>&#8802;</button>
        <div style={{ width: 1, height: 18, background: "#D5D4CB", margin: "0 3px" }} />
        <button onClick={() => document.execCommand("insertUnorderedList")} title="Bullets" style={{ width: 22, height: 20, background: "none", border: "1px solid transparent", borderRadius: 3 }}>&#8226;&#8801;</button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        spellCheck={false}
        style={{ flex: 1, margin: 0, border: "1px solid #ACA899", background: "#FFF", resize: "none", padding: 6, fontSize: parseInt(size), fontFamily: font, fontWeight: bold ? "bold" : "normal", fontStyle: italic ? "italic" : "normal", textDecoration: underline ? "underline" : "none", outline: "none" }}
      />
      <div style={{ borderTop: "1px solid #DADAD8", padding: "2px 6px", fontSize: 11, color: "#444", flexShrink: 0, display: "flex" }}>
        <span>For Help, click Help Topics on the Help Menu.</span>
        <span style={{ marginLeft: "auto" }}>{text.length} chars</span>
      </div>
    </div>
  );
}
