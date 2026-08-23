import { useState, useRef } from "react";
import { XP_SOUNDS, playSound } from "../../utils/sound";

export default function Notepad(_: { id: string }) {
  const [text, setText] = useState("");
  const [wordWrap, setWordWrap] = useState(true);
  const [status, setStatus] = useState("Ln 1, Col 1");
  const fileRef = useRef<HTMLInputElement>(null);

  const updateStatus = (value: string, pos?: number) => {
    const cursor = pos ?? value.length;
    const before = value.slice(0, cursor);
    const lines = before.split("\n");
    const ln = lines.length;
    const col = lines[lines.length - 1].length + 1;
    setStatus(`Ln ${ln}, Col ${col}`);
  };

  const handleNew = () => {
    setText("");
    setStatus("Ln 1, Col 1");
    playSound(XP_SOUNDS.menuCommand, 0.2);
  };

  const handleSave = () => {
    const blob = new Blob([text], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "Untitled.txt";
    a.click();
    URL.revokeObjectURL(url);
    playSound(XP_SOUNDS.menuCommand, 0.2);
  };

  const handleOpen = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    file.text().then((content) => {
      setText(content);
      updateStatus(content);
      playSound(XP_SOUNDS.menuCommand, 0.2);
    });
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#FFF", fontFamily: "Tahoma, sans-serif" }}>
      <div style={{ display: "flex", gap: 6, padding: "2px 6px", background: "#ECE9D8", borderBottom: "1px solid #ACA899", fontSize: 11 }}>
        <button onClick={handleNew} style={{ background: "transparent", border: "1px solid transparent", padding: "1px 6px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>New</button>
        <button onClick={() => fileRef.current?.click()} style={{ background: "transparent", border: "1px solid transparent", padding: "1px 6px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>Open</button>
        <button onClick={handleSave} style={{ background: "transparent", border: "1px solid transparent", padding: "1px 6px", cursor: "pointer", fontFamily: "inherit", fontSize: 11 }}>Save</button>
        <span style={{ flex: 1 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 11, cursor: "pointer" }}>
          <input type="checkbox" checked={wordWrap} onChange={(e) => setWordWrap(e.target.checked)} />
          Word Wrap
        </label>
        <input ref={fileRef} type="file" accept=".txt,.log,.ini,.cfg" style={{ display: "none" }} onChange={handleOpen} />
      </div>
      <textarea
        style={{ flex: 1, border: "none", resize: "none", padding: 4, fontFamily: "Consolas, monospace", fontSize: 12, whiteSpace: wordWrap ? "pre-wrap" : "pre", overflowWrap: wordWrap ? "break-word" : "normal", overflowX: wordWrap ? "hidden" : "auto" }}
        value={text}
        onChange={(e) => { setText(e.target.value); updateStatus(e.target.value, e.target.selectionStart ?? undefined); }}
        onSelect={(e) => updateStatus(text, (e.target as HTMLTextAreaElement).selectionStart ?? undefined)}
        onKeyUp={(e) => updateStatus(text, (e.target as HTMLTextAreaElement).selectionStart ?? undefined)}
        spellCheck={false}
      />
      <div style={{ height: 18, display: "flex", alignItems: "center", padding: "0 6px", background: "#ECE9D8", borderTop: "1px solid #ACA899", fontSize: 11, color: "#333" }}>
        <span>{status}</span>
        <span style={{ flex: 1 }} />
        <span>Windows (CRLF)</span>
        <span style={{ marginLeft: 12 }}>UTF-8</span>
      </div>
    </div>
  );
}
