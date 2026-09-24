import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets";

export default function AboutXP({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  return <div className="xp-dialog-surface"><div className="xp-dialog-body" style={{ padding: 16 }}><div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}><img src={assetUrl("assets/xpui/logo/flag.png")} alt="" style={{ width: 48, height: 48 }} /><div><div style={{ fontSize: 20, fontWeight: "bold", color: "#0A246A" }}>Microsoft Windows</div><div style={{ fontSize: 13, color: "#0A246A" }}>XP Professional</div><div className="xp-small" style={{ marginTop: 6 }}>Version 2002<br />Service Pack 3</div></div></div><div className="xp-group-box" style={{ marginTop: 14 }}><div>This product is licensed under the Microsoft Software License Terms to:</div><div style={{ fontWeight: "bold", marginTop: 6 }}>XP User</div><div className="xp-small" style={{ marginTop: 6 }}>A web recreation built for nostalgia purposes.</div></div><div className="xp-small" style={{ marginTop: 12 }}>Physical memory available to Windows: 523,760 KB</div></div><div className="xp-dialog-footer"><button className="xp-button" onClick={() => closeWindow(id)}>OK</button></div></div>;
}
