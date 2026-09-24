import { useState } from "react";
import { assetUrl } from "../../utils/assets";

const IC = assetUrl("assets/icons");

function ToolBtn({ img, label, onClick }: { img?: string; label?: string; onClick?: () => void }) {
  return <button className="xp-toolbar-button" onClick={onClick} title={label}>{img && <img src={img} alt="" style={{ width: 16, height: 16 }} />}{label && <span>{label}</span>}</button>;
}

export default function Wordpad(_: { id: string }) {
  const [text, setText] = useState("");
  const [font, setFont] = useState("Arial");
  const [size, setSize] = useState("12");
  const [bold, setBold] = useState(false);
  const [italic, setItalic] = useState(false);
  const [underline, setUnderline] = useState(false);
  const save = () => { const blob = new Blob([text], { type: "text/plain" }); const anchor = document.createElement("a"); anchor.href = URL.createObjectURL(blob); anchor.download = "Document.rtf"; anchor.click(); URL.revokeObjectURL(anchor.href); };

  return <div className="xp-app-surface"><div className="xp-toolbar"><ToolBtn img={`${IC}/NewFolder.png`} label="New" /><ToolBtn img={`${IC}/Open.png`} label="Open" /><ToolBtn img={`${IC}/Save.png`} label="Save" onClick={save} /><ToolBtn img={`${IC}/Printer.png`} label="Print" onClick={() => window.print()} /><div className="xp-toolbar-separator" /><ToolBtn img={`${IC}/Cut.png`} label="Cut" onClick={() => document.execCommand("cut")} /><ToolBtn img={`${IC}/Copy.png`} label="Copy" onClick={() => document.execCommand("copy")} /><ToolBtn img={`${IC}/Paste.png`} label="Paste" onClick={() => document.execCommand("paste")} /><div className="xp-toolbar-separator" /><ToolBtn img={`${IC}/Undo.png`} onClick={() => document.execCommand("undo")} /><ToolBtn img={`${IC}/Redo.png`} onClick={() => document.execCommand("redo")} /></div><div className="xp-toolbar"><select className="xp-select" value={font} onChange={(event) => setFont(event.target.value)} style={{ width: 115 }}><option>Arial</option><option>Calibri</option><option>Courier New</option><option>Georgia</option><option>Times New Roman</option><option>Verdana</option></select><select className="xp-select" value={size} onChange={(event) => setSize(event.target.value)} style={{ width: 48 }}>{["8", "9", "10", "11", "12", "14", "16", "18", "20", "24", "28", "36"].map((item) => <option key={item}>{item}</option>)}</select><button className="xp-icon-button" onClick={() => setBold(!bold)} title="Bold" style={{ fontWeight: "bold", background: bold ? "#C1D2EE" : "transparent" }}>B</button><button className="xp-icon-button" onClick={() => setItalic(!italic)} title="Italic" style={{ fontStyle: "italic", background: italic ? "#C1D2EE" : "transparent" }}>I</button><button className="xp-icon-button" onClick={() => setUnderline(!underline)} title="Underline" style={{ textDecoration: "underline", background: underline ? "#C1D2EE" : "transparent" }}>U</button><div className="xp-toolbar-separator" /><button className="xp-icon-button" onClick={() => document.execCommand("justifyLeft")} title="Align Left">≡</button><button className="xp-icon-button" onClick={() => document.execCommand("justifyCenter")} title="Center">≡</button><button className="xp-icon-button" onClick={() => document.execCommand("justifyRight")} title="Align Right">≡</button><div className="xp-toolbar-separator" /><button className="xp-icon-button" onClick={() => document.execCommand("insertUnorderedList")} title="Bullets">•</button></div><textarea value={text} onChange={(event) => setText(event.target.value)} spellCheck={false} style={{ flex: 1, margin: 0, border: "1px solid #ACA899", background: "#FFF", resize: "none", padding: 6, fontSize: Number(size), fontFamily: font, fontWeight: bold ? "bold" : "normal", fontStyle: italic ? "italic" : "normal", textDecoration: underline ? "underline" : "none", outline: "none" }} /><div className="xp-status-strip"><span>For Help, click Help Topics on the Help Menu.</span><span>{text.length} chars</span></div></div>;
}
