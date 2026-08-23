import { useState, useRef, useEffect } from "react";

const prompt = "C:\\Documents and Settings\\XP User>";

const fakeDir = [
  { name: "Desktop", type: "<DIR>" },
  { name: "My Documents", type: "<DIR>" },
  { name: "My Music", type: "<DIR>" },
  { name: "My Pictures", type: "<DIR>" },
  { name: "boot.ini", type: "FILE" },
  { name: "ntldr", type: "FILE" },
  { name: "pagefile.sys", type: "FILE" },
  { name: "AUTOEXEC.BAT", type: "FILE" },
];

export default function Terminal(_: { id: string }) {
  const [lines, setLines] = useState<string[]>([
    "Microsoft Windows XP [Version 5.1.2600]",
    "(C) Copyright 1985-2001 Microsoft Corp.",
    "",
    `${prompt}_`,
  ]);
  const [input, setInput] = useState("");
  const [cursor, setCursor] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const i = setInterval(() => setCursor((c) => !c), 500);
    return () => clearInterval(i);
  }, []);

  useEffect(() => { endRef.current?.scrollIntoView(); }, [lines]);

  const processCmd = (cmd: string) => {
    const parts = cmd.trim().split(/\s+/);
    const command = parts[0].toLowerCase();
    const args = parts.slice(1).join(" ");
    let output: string[] = [];

    switch (command) {
      case "help":
        output = ["Available commands:", "  help     - Show this help", "  dir      - List directory contents", "  cls      - Clear the screen", "  echo     - Print a message", "  ver      - Show Windows version", "  date     - Show current date", "  time     - Show current time"];
        break;
      case "dir":
        output = [" Volume in drive C has no label", " Directory of C:\\Documents and Settings\\XP User", "", ...fakeDir.map((f) => `${f.type === "<DIR>" ? "  <DIR>" : "       "}  ${f.name.padEnd(20)}`), "", "        8 File(s)   ... bytes", "        4 Dir(s)   ... bytes free"];
        break;
      case "cls":
        return [""];
      case "echo":
        output = [args || "ECHO is on."];
        break;
      case "ver":
        output = ["", "Microsoft Windows XP [Version 5.1.2600]"];
        break;
      case "date":
        output = ["The current date is: " + new Date().toLocaleDateString()];
        break;
      case "time":
        output = ["The current time is: " + new Date().toLocaleTimeString()];
        break;
      default:
        output = [`'${command}' is not recognized as an internal or external command, operable program or batch file.`];
    }
    return output;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      const cmd = input;
      const output = processCmd(cmd);
      const newLines = [...lines.slice(0, -1), `${prompt}${cmd}`, ...output, `${prompt}_`];
      setLines(newLines);
      setInput("");
    } else if (e.key === "Backspace") {
      setInput((i) => i.slice(0, -1));
      setLines((l) => [...l.slice(0, -1), `${prompt}${input.slice(0, -1)}${cursor ? "_" : " "}`]);
    } else if (e.key.length === 1) {
      setInput((i) => i + e.key);
      setLines((l) => [...l.slice(0, -1), `${prompt}${input + e.key}${cursor ? "_" : " "}`]);
    }
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#000", color: "#C0C0C0", fontFamily: "Consolas, monospace", fontSize: 13, padding: 4, overflow: "auto", whiteSpace: "pre", cursor: "text" }} tabIndex={0} onKeyDown={handleKeyDown}>
      {lines.map((line, i) => (
        <div key={i}>{line.replace("_", cursor ? "█" : " ")}</div>
      ))}
      <div ref={endRef} />
    </div>
  );
}
