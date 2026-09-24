import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useUserStore } from "../../store/userStore";
import { assetUrl } from "../../utils/assets";

const PICS = ["airplane", "ball", "butterfly", "chess", "duck", "fish", "flower", "dog", "guitar", "cat", "bike", "car", "snowflake", "trees"];

export default function UserAccounts({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const { userName, userPicture, setUserName, setUserPicture } = useUserStore();
  const [picked, setPicked] = useState(userPicture);
  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const timeout = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(timeout);
  }, [saved]);

  return <div className="xp-app-surface"><div style={{ display: "flex", flex: 1, minHeight: 0 }}><div className="xp-side-panel"><div className="xp-task-pane"><div className="xp-task-pane-title">Current Account</div><div className="xp-task-pane-body" style={{ display: "flex", alignItems: "center", gap: 8 }}><img src={assetUrl(`assets/xpui/user/${userPicture}`)} alt="" style={{ width: 48, height: 48, border: "2px solid #FFF" }} /><div><div style={{ fontWeight: "bold", color: "#215DC6" }}>{userName}</div><div className="xp-small">User account</div></div></div></div><div className="xp-task-pane"><div className="xp-task-pane-title">Learn About</div><div className="xp-task-pane-body">{["User accounts", "User account types", "Switching users"].map((label) => <div className="xp-task-link" key={label}><img src={assetUrl("assets/icons/Question.png")} alt="" />{label}</div>)}</div></div></div><div className="xp-content-panel" style={{ padding: "16px 20px" }}><div className="xp-panel-title">Pick a new picture for your account</div><div style={{ marginBottom: 12 }}>The picture you choose will appear on the welcome screen.</div><div className="xp-group-box" style={{ display: "grid", gridTemplateColumns: "repeat(7, 52px)", gap: 7, width: "fit-content" }}>{PICS.map((picture) => <button key={picture} onClick={() => setPicked(`${picture}.png`)} style={{ width: 48, height: 48, padding: 1, background: picked === `${picture}.png` ? "#2E71DC" : "transparent", border: picked === `${picture}.png` ? "2px solid #0A246A" : "2px solid transparent" }} title={picture}><img src={assetUrl(`assets/xpui/user/${picture}.png`)} alt={picture} style={{ width: "100%", height: "100%" }} /></button>)}</div><div className="xp-form-row" style={{ marginTop: 16 }}><label className="xp-form-label" htmlFor="account-name">Account name:</label><input id="account-name" className="xp-input" style={{ width: 170 }} value={name} onChange={(event) => setName(event.target.value)} /></div><div className="xp-dialog-footer" style={{ margin: "16px -20px -16px" }}>{saved && <span style={{ color: "#1E7A1E", marginRight: "auto", alignSelf: "center" }}>Picture saved.</span>}<button className="xp-button" style={{ minWidth: 90 }} onClick={() => { setUserPicture(picked); if (name.trim()) setUserName(name.trim()); setSaved(true); }}>Save Picture</button><button className="xp-button" onClick={() => closeWindow(id)}>Cancel</button></div></div></div></div>;
}
