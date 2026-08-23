import { useState } from "react";

const numBtn: React.CSSProperties = {
  color: "#000080",
  background: "linear-gradient(180deg,#fcfcfe 0%,#f0efe2 60%,#e4e2d0 100%)",
  border: "1px solid #aca899",
  borderRadius: 3,
  fontSize: 13,
  fontWeight: "bold",
  cursor: "pointer",
  fontFamily: "Tahoma, sans-serif",
  height: 28,
};

const fnBtn: React.CSSProperties = {
  ...numBtn,
  color: "#a80000",
};

const clearBtn: React.CSSProperties = {
  ...numBtn,
  color: "#a80000",
  fontSize: 12,
};

const memBtn: React.CSSProperties = {
  ...numBtn,
  color: "#a80000",
  fontSize: 11,
};

const menuStyle: React.CSSProperties = {
  padding: "2px 7px",
  fontSize: 11,
  cursor: "pointer",
  borderRadius: 2,
};

function B({ style, children, onClick, title }: { style?: React.CSSProperties; children: React.ReactNode; onClick: () => void; title?: string }) {
  return (
    <button style={{ ...numBtn, ...style }} onClick={onClick} title={title}>{children}</button>
  );
}

export default function Calculator(_: { id: string }) {
  const [display, setDisplay] = useState("0.");
  const [prev, setPrev] = useState<number | null>(null);
  const [op, setOp] = useState<string | null>(null);
  const [fresh, setFresh] = useState(true);
  const [memory, setMemory] = useState(0);

  const show = (v: number) => {
    const s = Number.isInteger(v) ? v + "." : String(v);
    setDisplay(s.length > 18 ? v.toExponential(12) : s);
  };

  const digit = (d: string) => {
    if (fresh) { setDisplay(d === "." ? "0." : d + "."); setFresh(false); return; }
    if (d === ".") { if (!display.includes(".")) setDisplay(display + "."); return; }
    setDisplay((cur) => {
      const hadDot = cur.includes(".");
      const base = cur.replace(/\.$/, "");
      return base + d + (hadDot ? "" : ".");
    });
  };

  const compute = (a: number, b: number, o: string): number => {
    switch (o) {
      case "+": return a + b;
      case "-": return a - b;
      case "*": return a * b;
      case "/": return b === 0 ? NaN : a / b;
      default: return b;
    }
  };

  const setOperator = (o: string) => {
    const cur = parseFloat(display);
    if (prev !== null && op && !fresh) {
      const r = compute(prev, cur, op);
      show(r);
      setPrev(r);
    } else {
      setPrev(cur);
    }
    setOp(o);
    setFresh(true);
  };

  const equals = () => {
    const cur = parseFloat(display);
    if (prev !== null && op) {
      const r = compute(prev, cur, op);
      if (Number.isNaN(r)) { setDisplay("Cannot divide by zero."); } else { show(r); }
      setPrev(null);
      setOp(null);
      setFresh(true);
    }
  };

  const clearAll = () => { setDisplay("0."); setPrev(null); setOp(null); setFresh(true); };
  const clearEntry = () => { setDisplay("0."); setFresh(true); };
  const backspace = () => {
    if (fresh) return;
    const s = display.replace(/\.$/, "");
    setDisplay(s.length <= 1 ? "0." : s.slice(0, -1) + (s.slice(0, -1).includes(".") ? "" : "."));
  };
  const negate = () => show(-parseFloat(display));
  const sqrt = () => { const v = parseFloat(display); if (v >= 0) show(Math.sqrt(v)); };
  const percent = () => { const v = parseFloat(display); show(prev !== null ? (prev * v) / 100 : v / 100); };
  const reciprocal = () => { const v = parseFloat(display); if (v !== 0) show(1 / v); };

  const memClear = () => setMemory(0);
  const memRecall = () => { show(memory); setFresh(true); };
  const memStore = () => setMemory(parseFloat(display));
  const memPlus = () => setMemory((m) => m + parseFloat(display));

  return (
    <div style={{ width: "100%", height: "100%", background: "#ECE9D8", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", userSelect: "none", padding: 2 }}>
      <div style={{ display: "flex", gap: 2, padding: "1px 2px 3px", borderBottom: "1px solid #C0BBA1" }}>
        <span style={menuStyle}>View</span>
        <span style={menuStyle}>Edit</span>
        <span style={menuStyle}>Help</span>
      </div>
      <div style={{ margin: "6px 4px 4px", background: "#FFF", border: "2px inset #ACA899", padding: "1px 4px", textAlign: "right", fontSize: 16, fontWeight: "bold", fontFamily: "Tahoma, sans-serif", overflow: "hidden", height: 22, lineHeight: "20px", color: "#000" }}>
        {display}
      </div>
      <div style={{ display: "flex", gap: 4, padding: "2px 4px 6px", alignItems: "center" }}>
        <div style={{ width: 28, height: 20, border: "1px solid #ACA899", background: "#ECE9D8", fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", color: "#000" }}>{memory !== 0 ? "M" : ""}</div>
        <div style={{ flex: 1 }} />
        <button style={{ ...clearBtn, width: 62 }} onClick={backspace}>Backspace</button>
        <button style={{ ...clearBtn, width: 44 }} onClick={clearEntry}>CE</button>
        <button style={{ ...clearBtn, width: 44 }} onClick={clearAll}>C</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 4, padding: "0 4px 4px", flex: 1 }}>
        <B style={memBtn} onClick={memClear}>MC</B>
        <B style={{ ...numBtn, gridColumn: "span 1" }} onClick={() => digit("7")}>7</B>
        <B style={numBtn} onClick={() => digit("8")}>8</B>
        <B style={numBtn} onClick={() => digit("9")}>9</B>
        <B style={fnBtn} onClick={() => setOperator("/")}>/</B>
        <B style={fnBtn} onClick={sqrt}>sqrt</B>

        <B style={memBtn} onClick={memRecall}>MR</B>
        <B style={numBtn} onClick={() => digit("4")}>4</B>
        <B style={numBtn} onClick={() => digit("5")}>5</B>
        <B style={numBtn} onClick={() => digit("6")}>6</B>
        <B style={fnBtn} onClick={() => setOperator("*")}>*</B>
        <B style={fnBtn} onClick={percent}>%</B>

        <B style={memBtn} onClick={memStore}>MS</B>
        <B style={numBtn} onClick={() => digit("1")}>1</B>
        <B style={numBtn} onClick={() => digit("2")}>2</B>
        <B style={numBtn} onClick={() => digit("3")}>3</B>
        <B style={fnBtn} onClick={() => setOperator("-")}>-</B>
        <B style={fnBtn} onClick={reciprocal}>1/x</B>

        <B style={memBtn} onClick={memPlus}>M+</B>
        <B style={numBtn} onClick={() => digit("0")}>0</B>
        <B style={fnBtn} onClick={negate}>+/-</B>
        <B style={numBtn} onClick={() => digit(".")}>.</B>
        <B style={fnBtn} onClick={() => setOperator("+")}>+</B>
        <B style={fnBtn} onClick={equals}>=</B>
      </div>
    </div>
  );
}
