import { useRef, useState, useEffect } from "react";

const COLORS = [
  "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
  "#FFFFFF","#C0C0C0","#FF0000","#FFFF00","#00FF00","#00FFFF","#0000FF","#FF00FF",
  "#C0DCC0","#A6CAF0","#FFCC99","#FFFFCC","#99CCFF","#CC99FF","#FF99CC","#CCFFFF",
];

const svgIcon = (paths: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${paths}</svg>`)}`

const TOOLS = [
  { id: "pencil", label: "Pencil", icon: svgIcon('<path d="M3 13l1-4 7-7 3 3-7 7-4 1z" fill="#f4c20d" stroke="#000" stroke-width="1"/><path d="M11 2l3 3" stroke="#000" stroke-width="1"/>') },
  { id: "brush", label: "Brush", icon: svgIcon('<path d="M12 2l2 2-6 6-2-2 6-6z" fill="#8b4513" stroke="#000" stroke-width="0.8"/><path d="M6 8l2 2-3 3c-1 1-3 1-3-1 0-1 1-2 2-3l2-1z" fill="#c0c0c0" stroke="#000" stroke-width="0.8"/>') },
  { id: "eraser", label: "Eraser", icon: svgIcon('<rect x="3" y="7" width="8" height="5" fill="#ffb6c1" stroke="#000" stroke-width="1" transform="rotate(-20 7 9)"/><path d="M4 12h9" stroke="#000" stroke-width="1"/>') },
  { id: "fill", label: "Fill", icon: svgIcon('<path d="M5 3l6 6-4 4-6-6 4-4z" fill="#4169e1" stroke="#000" stroke-width="0.8"/><path d="M13 9c1.5 2 1.5 4 0 4s-1.5-2 0-4z" fill="#4169e1" stroke="#000" stroke-width="0.6"/>') },
  { id: "line", label: "Line", icon: svgIcon('<path d="M2 14L14 2" stroke="#000" stroke-width="1.5"/>') },
  { id: "rect", label: "Rectangle", icon: svgIcon('<rect x="2" y="4" width="12" height="8" fill="none" stroke="#000" stroke-width="1.4"/>') },
  { id: "ellipse", label: "Ellipse", icon: svgIcon('<ellipse cx="8" cy="8" rx="6" ry="4.5" fill="none" stroke="#000" stroke-width="1.4"/>') },
  { id: "pick", label: "Pick Color", icon: svgIcon('<circle cx="7" cy="7" r="4" fill="none" stroke="#000" stroke-width="1.4"/><path d="M10 10l4 4" stroke="#000" stroke-width="1.6"/>') },
];

export default function Paint(_: { id: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [color, setColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#FFFFFF");
  const [tool, setTool] = useState("pencil");
  const [drawing, setDrawing] = useState(false);
  const [lineWidth, setLineWidth] = useState(2);
  const lastPos = useRef<{ x: number; y: number } | null>(null);
  const startPos = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = "round";
    ctx.lineWidth = lineWidth;
  }, [lineWidth]);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  const drawAt = (ctx: CanvasRenderingContext2D, from: { x: number; y: number }, to: { x: number; y: number }) => {
    if (tool === "pencil" || tool === "brush") {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === "brush" ? 6 : lineWidth;
      ctx.stroke();
    }
    if (tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(from.x, from.y);
      ctx.lineTo(to.x, to.y);
      ctx.strokeStyle = "#FFFFFF";
      ctx.lineWidth = 20;
      ctx.stroke();
    }
  };

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setDrawing(true);
    const pos = getPos(e);
    lastPos.current = pos;
    startPos.current = pos;
    if (tool === "fill") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvasRef.current!.width, canvasRef.current!.height);
    }
    if (tool === "pick") {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      setColor(`#${p[0].toString(16).padStart(2,"0")}${p[1].toString(16).padStart(2,"0")}${p[2].toString(16).padStart(2,"0")}`);
      setDrawing(false);
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) return;
    const ctx = canvasRef.current?.getContext("2d");
    if (!ctx || !lastPos.current) return;
    const pos = getPos(e);
    drawAt(ctx, lastPos.current, pos);
    lastPos.current = pos;
  };

  const onMouseUp = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing) { setDrawing(false); return; }
    setDrawing(false);
    if (startPos.current && (tool === "rect" || tool === "ellipse" || tool === "line")) {
      const ctx = canvasRef.current?.getContext("2d");
      if (!ctx) return;
      const end = getPos(e);
      const x = Math.min(startPos.current.x, end.x);
      const y = Math.min(startPos.current.y, end.y);
      const w = Math.abs(end.x - startPos.current.x);
      const h = Math.abs(end.y - startPos.current.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      if (tool === "rect") { ctx.strokeRect(x, y, w, h); }
      if (tool === "ellipse") { ctx.beginPath(); ctx.ellipse(x + w/2, y + h/2, w/2, h/2, 0, 0, Math.PI*2); ctx.stroke(); }
      if (tool === "line") { ctx.beginPath(); ctx.moveTo(startPos.current.x, startPos.current.y); ctx.lineTo(end.x, end.y); ctx.stroke(); }
    }
    lastPos.current = null;
    startPos.current = null;
  };

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", background: "#ECE9D8", fontSize: 11 }}>
      <div style={{ display: "flex", gap: 1, padding: "2px 4px", borderBottom: "1px solid #C0BBA1", background: "#ECE9D8" }}>
        {TOOLS.map((t) => (
          <button key={t.id} onClick={() => setTool(t.id)} style={{ width: 24, height: 24, border: tool === t.id ? "2px inset #FFF" : "1px solid #808080", background: "#D4D0C8", cursor: "pointer", padding: 0, display: "flex", alignItems: "center", justifyContent: "center" }} title={t.label}>
            <img src={t.icon} alt="" width="16" height="16" style={{ pointerEvents: "none" }} />
          </button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 2, padding: "2px 4px", borderBottom: "1px solid #C0BBA1", background: "#ECE9D8", alignItems: "center" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(8,1fr)", gap: 1 }}>
          {COLORS.map((c) => (
            <button key={c} onClick={() => setColor(c)} onContextMenu={(e) => { e.preventDefault(); setBgColor(c); }} style={{ width: 12, height: 12, background: c, border: color === c ? "1px inset #FFF" : "1px solid #808080", cursor: "pointer", padding: 0 }} />
          ))}
        </div>
        <div style={{ width: 20, height: 20, border: "1px solid #808080", background: color, marginLeft: 4 }} title="Current Color" />
        <div style={{ width: 16, height: 16, border: "1px solid #808080", background: bgColor }} title="Background Color" />
        <span style={{ flex: 1 }} />
        <span style={{ fontSize: 11 }}>Width:</span>
        <select value={lineWidth} onChange={(e) => setLineWidth(Number(e.target.value))} style={{ fontSize: 11, fontFamily: "inherit", border: "1px solid #7F9DB9" }}>
          <option value={1}>1px</option>
          <option value={2}>2px</option>
          <option value={4}>4px</option>
          <option value={8}>8px</option>
        </select>
      </div>
      <div style={{ flex: 1, position: "relative", margin: 2, border: "1px inset #808080", background: "#FFF" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: "100%", cursor: "crosshair" }} onMouseDown={onMouseDown} onMouseMove={onMouseMove} onMouseUp={onMouseUp} onMouseLeave={() => { if (drawing) { setDrawing(false); lastPos.current = null; } }} />
      </div>
    </div>
  );
}
