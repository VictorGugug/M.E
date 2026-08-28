import { useRef, useState, useEffect, useCallback } from "react";

const COLORS = [
  "#000000","#808080","#800000","#808000","#008000","#008080","#000080","#800080",
  "#FFFFFF","#C0C0C0","#FF0000","#FFFF00","#00FF00","#00FFFF","#0000FF","#FF00FF",
  "#C0DCC0","#A6CAF0","#FFCC99","#FFFFCC","#99CCFF","#CC99FF","#FF99CC","#CCFFFF",
  "#E0E0E0","#8A4B08","#FF8080","#80FF80","#80FFFF","#0080FF","#FF80FF","#FFFF80"
];

const svgIcon = (paths: string) =>
  `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16">${paths}</svg>`)}`;

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
  const snapshotRef = useRef<ImageData | null>(null);
  const [color, setColor] = useState("#000000");
  const [secColor, setSecColor] = useState("#FFFFFF");
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
    if (canvas.width === 0 || canvas.height === 0) {
      canvas.width = 600;
      canvas.height = 400;
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, []);

  const getPos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: Math.round(e.clientX - rect.left),
      y: Math.round(e.clientY - rect.top)
    };
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#FFFFFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const onMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);
    setDrawing(true);
    lastPos.current = pos;
    startPos.current = pos;
    snapshotRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);

    if (tool === "fill") {
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      setDrawing(false);
    } else if (tool === "pick") {
      const p = ctx.getImageData(pos.x, pos.y, 1, 1).data;
      const hex = `#${p[0].toString(16).padStart(2, "0")}${p[1].toString(16).padStart(2, "0")}${p[2].toString(16).padStart(2, "0")}`;
      if (e.button === 2) setSecColor(hex);
      else setColor(hex);
      setDrawing(false);
    } else if (tool === "pencil" || tool === "brush" || tool === "eraser") {
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, tool === "brush" ? 4 : tool === "eraser" ? 8 : 1, 0, Math.PI * 2);
      ctx.fillStyle = tool === "eraser" ? secColor : color;
      ctx.fill();
    }
  };

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawing || !lastPos.current || !startPos.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const pos = getPos(e);

    if (tool === "pencil" || tool === "brush") {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = tool === "brush" ? lineWidth * 3 : lineWidth;
      ctx.lineCap = "round";
      ctx.lineJoin = "round";
      ctx.stroke();
      lastPos.current = pos;
    } else if (tool === "eraser") {
      ctx.beginPath();
      ctx.moveTo(lastPos.current.x, lastPos.current.y);
      ctx.lineTo(pos.x, pos.y);
      ctx.strokeStyle = secColor;
      ctx.lineWidth = lineWidth * 6;
      ctx.lineCap = "square";
      ctx.stroke();
      lastPos.current = pos;
    } else if (snapshotRef.current) {
      ctx.putImageData(snapshotRef.current, 0, 0);
      ctx.strokeStyle = color;
      ctx.lineWidth = lineWidth;
      ctx.fillStyle = secColor;

      if (tool === "line") {
        ctx.beginPath();
        ctx.moveTo(startPos.current.x, startPos.current.y);
        ctx.lineTo(pos.x, pos.y);
        ctx.stroke();
      } else if (tool === "rect") {
        const x = Math.min(startPos.current.x, pos.x);
        const y = Math.min(startPos.current.y, pos.y);
        const w = Math.abs(pos.x - startPos.current.x);
        const h = Math.abs(pos.y - startPos.current.y);
        ctx.strokeRect(x, y, w, h);
      } else if (tool === "ellipse") {
        const cx = (startPos.current.x + pos.x) / 2;
        const cy = (startPos.current.y + pos.y) / 2;
        const rx = Math.abs(pos.x - startPos.current.x) / 2;
        const ry = Math.abs(pos.y - startPos.current.y) / 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  const onMouseUp = () => {
    setDrawing(false);
    lastPos.current = null;
    startPos.current = null;
    snapshotRef.current = null;
  };

  return (
    <div style={{ width: "100%", height: "100%", background: "#ECE9D8", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", fontSize: 11, userSelect: "none" }}>
      <div style={{ display: "flex", gap: 12, padding: "3px 8px", background: "#ECE9D8", borderBottom: "1px solid #ACA899" }}>
        <span style={{ cursor: "pointer" }} onClick={clearCanvas}>File &gt; New</span>
        <span style={{ cursor: "pointer" }} onClick={clearCanvas}>Clear Image</span>
      </div>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>
        <div style={{ width: 56, background: "#ECE9D8", borderRight: "1px solid #ACA899", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, padding: 4, alignContent: "start" }}>
          {TOOLS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTool(t.id)}
              title={t.label}
              style={{
                width: 24, height: 24, padding: 2,
                background: tool === t.id ? "#FFF" : "#ECE9D8",
                border: tool === t.id ? "2px inset #FFF" : "1px outset #FFF",
                display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer"
              }}
            >
              <img src={t.icon} alt={t.label} style={{ width: 16, height: 16 }} />
            </button>
          ))}
          <div style={{ gridColumn: "1 / -1", marginTop: 8, display: "flex", flexDirection: "column", gap: 4, alignItems: "center" }}>
            {[1, 2, 4, 6].map((w) => (
              <div
                key={w}
                onClick={() => setLineWidth(w)}
                style={{
                  width: 38, height: 10, cursor: "pointer",
                  background: lineWidth === w ? "#2B5FC4" : "transparent",
                  display: "flex", alignItems: "center", justifyContent: "center"
                }}
              >
                <div style={{ width: 30, height: w, background: lineWidth === w ? "#FFF" : "#000" }} />
              </div>
            ))}
          </div>
        </div>

        <div style={{ flex: 1, background: "#808080", overflow: "auto", padding: 8, display: "flex" }}>
          <canvas
            ref={canvasRef}
            width={600}
            height={400}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            onMouseLeave={onMouseUp}
            onContextMenu={(e) => e.preventDefault()}
            style={{ background: "#FFF", boxShadow: "2px 2px 4px rgba(0,0,0,0.4)", cursor: "crosshair" }}
          />
        </div>
      </div>

      <div style={{ background: "#ECE9D8", borderTop: "1px solid #ACA899", padding: "4px 8px", display: "flex", alignItems: "center", gap: 10 }}>
        <div style={{ display: "flex", position: "relative", width: 28, height: 28 }}>
          <div style={{ position: "absolute", right: 0, bottom: 0, width: 16, height: 16, background: secColor, border: "1px solid #000" }} />
          <div style={{ position: "absolute", left: 0, top: 0, width: 16, height: 16, background: color, border: "1px solid #000", zIndex: 1 }} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(16, 14px)", gap: 2 }}>
          {COLORS.map((c) => (
            <div
              key={c}
              onClick={() => setColor(c)}
              onContextMenu={(e) => { e.preventDefault(); setSecColor(c); }}
              style={{ width: 14, height: 14, background: c, border: "1px solid #808080", cursor: "pointer" }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
