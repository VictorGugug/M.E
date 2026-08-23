import { useState } from "react";

const tracks = [
  "01 - Track 01.mp3",
  "02 - Track 02.mp3",
  "03 - Track 03.mp3",
  "04 - Sample.wma",
  "05 - New Recording.wav",
];

export default function MediaPlayer(_: { id: string }) {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(70);
  const [current, setCurrent] = useState(0);

  const bars = Array.from({ length: 20 }, (_, i) => ({
    h: Math.random() * 60 + 10,
    color: `hsl(${i * 18}, 80%, 60%)`,
  }));

  return (
    <div style={{ width: "100%", height: "100%", background: "#2B2B2B", display: "flex", flexDirection: "column", fontFamily: "Tahoma, sans-serif", color: "#FFF", userSelect: "none" }}>
      <div style={{ flex: 1, margin: 6, background: "#000", borderRadius: 4, display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 2, padding: 8, overflow: "hidden" }}>
        {bars.map((b, i) => (
          <div key={i} style={{ width: 12, height: b.h, background: b.color, borderRadius: "2px 2px 0 0", transition: "height 0.3s" }} />
        ))}
      </div>
      <div style={{ display: "flex", justifyContent: "center", gap: 4, padding: "4px 0" }}>
        <button style={{ background: "#444", color: "#FFF", border: "1px solid #666", borderRadius: 3, padding: "2px 10px", cursor: "pointer", fontSize: 11 }} onClick={() => setPlaying(false)} title="Previous">Prev</button>
        <button style={{ background: "#444", color: "#FFF", border: "1px solid #666", borderRadius: 3, padding: "2px 10px", cursor: "pointer", fontSize: 11 }} onClick={() => setPlaying(!playing)} title={playing ? "Pause" : "Play"}>{playing ? "Pause" : "Play"}</button>
        <button style={{ background: "#444", color: "#FFF", border: "1px solid #666", borderRadius: 3, padding: "2px 10px", cursor: "pointer", fontSize: 11 }} onClick={() => setPlaying(false)} title="Stop">Stop</button>
        <button style={{ background: "#444", color: "#FFF", border: "1px solid #666", borderRadius: 3, padding: "2px 10px", cursor: "pointer", fontSize: 11 }} onClick={() => setPlaying(false)} title="Next">Next</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 6, padding: "0 8px 4px" }}>
        <span style={{ fontSize: 11, color: "#AAA" }}>Volume</span>
        <input type="range" min={0} max={100} value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ flex: 1, accentColor: "#44AA44" }} />
      </div>
      <div style={{ borderTop: "1px solid #555", maxHeight: 120, overflowY: "auto" }}>
        {tracks.map((t, i) => (
          <div key={i} style={{ padding: "3px 8px", fontSize: 11, background: i === current ? "#444" : "transparent", cursor: "pointer", borderBottom: "1px solid #333" }} onClick={() => { setCurrent(i); setPlaying(true); }}>
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
