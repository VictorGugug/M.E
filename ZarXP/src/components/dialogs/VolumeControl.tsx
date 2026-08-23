import { useState } from "react";
import { assetUrl } from "../../utils/assets"

const s: Record<string, React.CSSProperties> = {
  container: { display: "flex", flexDirection: "column", height: "100%", fontFamily: "Tahoma, sans-serif", fontSize: 12, userSelect: "none", padding: 12, gap: 10 },
  header: { display: "flex", alignItems: "center", gap: 8 },
  icon: { width: 28, height: 28 },
  title: { fontWeight: 700 },
  row: { display: "flex", alignItems: "center", gap: 8 },
  sliderRow: { display: "flex", alignItems: "center", gap: 10 },
  verticalSlider: { writingMode: "bt-lr" as React.CSSProperties["writingMode"], WebkitAppearance: "none", appearance: "none", width: 100, height: 4, background: "#ccc", borderRadius: 2, outline: "none", accentColor: "#3a6ea5" },
  horizontalSlider: { width: 120, height: 4, background: "#ccc", borderRadius: 2, outline: "none", accentColor: "#3a6ea5" },
  checkbox: { margin: 0 },
  select: { width: 180, height: 22, fontSize: 12 },
};

export default function VolumeControl(_: { id: string }) {
  const [volume, setVolume] = useState(80);
  const [balance, setBalance] = useState(50);
  const [mute, setMute] = useState(false);
  const [solo, setSolo] = useState(false);

  return (
    <div style={s.container}>
      <div style={s.header}>
        <img src={assetUrl("assets/icons/Volume.png")} alt="" style={s.icon} />
        <span style={s.title}>Volume Control</span>
      </div>
      <select style={s.select} value="SoundMAX Digital Audio">
        <option>SoundMAX Digital Audio</option>
      </select>
      <div style={s.sliderRow}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <span>Volume</span>
          <input type="range" min="0" max="100" value={volume} onChange={(e) => setVolume(Number(e.target.value))} style={{ ...s.verticalSlider, height: 80, writingMode: "vertical-lr" }} />
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 4, marginLeft: 12 }}>
          <label style={s.row}><span className={`xp-checkbox${mute ? " xp-checkbox-checked" : ""}`} /><input type="checkbox" style={{ display: "none" }} checked={mute} onChange={() => setMute(!mute)} />Mute</label>
          <label style={s.row}><span className={`xp-checkbox${solo ? " xp-checkbox-checked" : ""}`} /><input type="checkbox" style={{ display: "none" }} checked={solo} onChange={() => setSolo(!solo)} />Solo</label>
          <span>Balance</span>
          <input type="range" min="0" max="100" value={balance} onChange={(e) => setBalance(Number(e.target.value))} style={s.horizontalSlider} />
        </div>
      </div>
    </div>
  );
}
