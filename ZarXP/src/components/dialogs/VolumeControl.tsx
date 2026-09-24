import { useState } from "react";
import { assetUrl } from "../../utils/assets";

export default function VolumeControl(_: { id: string }) {
  const [volume, setVolume] = useState(80);
  const [balance, setBalance] = useState(50);
  const [mute, setMute] = useState(false);
  const [solo, setSolo] = useState(false);

  return <div className="xp-dialog-surface"><div className="xp-dialog-body"><div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}><img src={assetUrl("assets/icons/Volume.png")} alt="" style={{ width: 28, height: 28 }} /><strong>Volume Control</strong></div><div className="xp-form-row"><label className="xp-form-label" htmlFor="volume-device">Device:</label><select id="volume-device" className="xp-select" style={{ flex: 1 }}><option>SoundMAX Digital Audio</option></select></div><div style={{ display: "flex", gap: 20, marginTop: 14 }}><div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 5 }}><span>Volume</span><input type="range" min="0" max="100" value={volume} onChange={(event) => setVolume(Number(event.target.value))} style={{ writingMode: "vertical-lr", direction: "rtl", width: 24, height: 90, accentColor: "#316AC5" }} /></div><div style={{ display: "flex", flexDirection: "column", gap: 6 }}><label className="xp-form-row"><input className="xp-native-checkbox" type="checkbox" checked={mute} onChange={() => setMute(!mute)} />Mute</label><label className="xp-form-row"><input className="xp-native-checkbox" type="checkbox" checked={solo} onChange={() => setSolo(!solo)} />Solo</label><span>Balance</span><input type="range" min="0" max="100" value={balance} onChange={(event) => setBalance(Number(event.target.value))} style={{ width: 130, accentColor: "#316AC5" }} /></div></div></div></div>;
}
