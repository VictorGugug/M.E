import { useState } from "react";

const btnStyle: React.CSSProperties = {
  background: "#ECE9D8",
  border: "1px solid #ACA899",
  borderRadius: 3,
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Tahoma, sans-serif",
};

const opBtnStyle: React.CSSProperties = {
  ...btnStyle,
  background: "#D4D0C8",
};

export default function Calculator(_: { id: string }) {
  const [display, setDisplay] = useState("0");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [reset, setReset] = useState(false);
  const [memory, setMemory] = useState<number | null>(null);
  const [hasMem, setHasMem] = useState(false);

  const input = (v: string) => {
    if (reset) { setDisplay(v); setReset(false); return; }
    setDisplay((d) => d === "0" && v !== "." ? v : d + v);
  };

  const operate = (nextOp: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op) {
      const result = compute(prev, cur, op);
      setDisplay(String(result));
      setPrev(result);
    } else {
      setPrev(cur);
    }
    setOp(nextOp);
    setReset(true);
  };

  const compute = (a: number, b: number, operator: string): number => {
    switch (operator) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (prev !== null && op) {
      const result = compute(prev, cur, op);
      setDisplay(String(result));
      setPrev(null);
      setOp(null);
      setReset(true);
    }
  };

  const clear = () => { setDisplay("0"); setPrev(null); setOp(null); setReset(false); };
  const clearEntry = () => { setDisplay("0"); setReset(true); };
  const negate = () => setDisplay((d) => String(-parseFloat(d)));
  const sqrt = () => setDisplay((d) => String(Math.sqrt(parseFloat(d))));
  const percent = () => setDisplay((d) => String(parseFloat(d) / 100));
  const reciprocal = () => setDisplay((d) => { const v = parseFloat(d); return v !== 0 ? String(1 / v) : "Error"; });

  const memRecall = () => { if (memory !== null) { setDisplay(String(memory)); setReset(true); } };
  const memClear = () => { setMemory(null); setHasMem(false); };
  const memStore = () => { setMemory(parseFloat(display)); setHasMem(true); setReset(true); };
  const memAdd = () => { setMemory((m) => (m ?? 0) + parseFloat(display)); setHasMem(true); setReset(true); };

  const gridBtn = (label: string, onClick: () => void, style?: React.CSSProperties) => (
    <button style={{ ...btnStyle, ...style }} onClick={onClick}>{label}</button>
  );

  return (
    <div style={{ width: "100%", height: "100%", background: "#D4D0C8", display: "flex", flexDirection: "column", padding: 4, fontFamily: "Tahoma, sans-serif", userSelect: "none" }}>
      <div style={{ flex: 1, background: "#FFF", border: "2px inset #ACA899", marginBottom: 4, padding: "2px 4px", textAlign: "right", fontSize: 20, fontWeight: "bold", fontFamily: "Consolas, monospace", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "flex-end" }}>
        {hasMem && <span style={{ fontSize: 10, marginRight: 2, color: "#808080" }}>M</span>}
        {display}
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, flex: 4 }}>
        {gridBtn("MC", memClear, opBtnStyle)}
        {gridBtn("MR", memRecall, opBtnStyle)}
        {gridBtn("MS", memStore, opBtnStyle)}
        {gridBtn("M+", memAdd, opBtnStyle)}
        {gridBtn("√", sqrt, opBtnStyle)}
        {gridBtn("%", percent, opBtnStyle)}
        {gridBtn("1/x", reciprocal, opBtnStyle)}
        {gridBtn("CE", clearEntry, { ...opBtnStyle, color: "#C00" })}
        {gridBtn("C", clear, { ...opBtnStyle, color: "#C00" })}
        {gridBtn("±", negate, opBtnStyle)}
        {gridBtn("÷", () => operate("/"), opBtnStyle)}
        {gridBtn("7", () => input("7"))}
        {gridBtn("8", () => input("8"))}
        {gridBtn("9", () => input("9"))}
        {gridBtn("×", () => operate("*"), opBtnStyle)}
        {gridBtn("4", () => input("4"))}
        {gridBtn("5", () => input("5"))}
        {gridBtn("6", () => input("6"))}
        {gridBtn("−", () => operate("-"), opBtnStyle)}
        {gridBtn("1", () => input("1"))}
        {gridBtn("2", () => input("2"))}
        {gridBtn("3", () => input("3"))}
        {gridBtn("+", () => operate("+"), opBtnStyle)}
        <button style={{ ...btnStyle, gridColumn: "span 2", background: "#ECE9D8" }} onClick={() => input("0")}>0</button>
        {gridBtn(".", () => input("."))}
        {gridBtn("=", equals, { ...opBtnStyle, background: "#C4BDA2" })}
      </div>
    </div>
  );
}
