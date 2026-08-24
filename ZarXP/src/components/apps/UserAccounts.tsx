import { useState, useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { useUserStore } from "../../store/userStore";
import { assetUrl } from "../../utils/assets"

const PICS = ["airplane", "ball", "butterfly", "chess", "duck", "fish", "flower", "dog", "guitar", "cat", "bike", "car", "snowflake", "trees"];

export default function UserAccounts({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);
  const { userName, userPicture, setUserName, setUserPicture } = useUserStore();
  const [picked, setPicked] = useState(userPicture);
  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!saved) return;
    const t = setTimeout(() => setSaved(false), 1800);
    return () => clearTimeout(t);
  }, [saved]);

  return (
    <div style={{ width: "100%", height: "100%", display: "flex", fontFamily: "Tahoma, sans-serif", fontSize: 11, background: "#FFF", overflow: "hidden" }}>
      <div style={{ width: 185, flexShrink: 0, background: "linear-gradient(180deg,#7BA2D9 0%,#6D95D6 100%)", padding: 8, display: "flex", flexDirection: "column" }}>
        <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: "4px 4px 0 0" }}>
          <div style={{ padding: "4px 8px", color: "#215DC6", fontWeight: "bold", background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)" }}>Current Account</div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px 10px" }}>
            <img src={assetUrl(`assets/xpui/user/${userPicture}`)} alt="" style={{ width: 48, height: 48, border: "2px solid #FFF", borderRadius: 4 }} />
            <div>
              <div style={{ fontWeight: "bold", color: "#215DC6" }}>{userName}</div>
              <div style={{ color: "#555" }}>User account</div>
            </div>
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.75)", borderRadius: "4px 4px 0 0", marginTop: 10 }}>
          <div style={{ padding: "4px 8px", color: "#215DC6", fontWeight: "bold", background: "linear-gradient(to right,#FFF 0%,#FFF 50%,rgba(255,255,255,0) 100%)" }}>Learn About</div>
          <div style={{ padding: "4px 10px 10px", display: "flex", flexDirection: "column", gap: 5 }}>
            {["User accounts", "User account types", "Switching users"].map((l) => (
              <div key={l} style={{ display: "flex", alignItems: "center", gap: 6, color: "#215DC6" }}>
                <span style={{ display: "inline-flex", width: 15, height: 15, borderRadius: "50%", background: "#2E71DC", color: "#FFF", alignItems: "center", justifyContent: "center", fontSize: 10, fontStyle: "italic", fontWeight: "bold", flexShrink: 0 }}>?</span>
                {l}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div style={{ flex: 1, padding: "14px 18px", overflowY: "auto", display: "flex", flexDirection: "column" }}>
        <div style={{ fontSize: 19, color: "#5A87D6", fontFamily: "'Trebuchet MS', sans-serif", marginBottom: 6 }}>Pick a new picture for your account</div>
        <div style={{ marginBottom: 10 }}>The picture you choose will appear on the welcome screen.</div>
        <div style={{ border: "1px solid #7F9DB9", padding: 6, display: "grid", gridTemplateColumns: "repeat(7, 52px)", gap: 8, width: "fit-content", background: "#ECE9D8" }}>
          {PICS.map((p) => (
            <button
              key={p}
              onClick={() => setPicked(p + ".png")}
              style={{ width: 48, height: 48, padding: 1, background: picked === p + ".png" ? "#2E71DC" : "transparent", border: picked === p + ".png" ? "2px solid #0A246A" : "2px solid transparent", cursor: "pointer" }}
              title={p}
            >
              <img src={assetUrl(`assets/xpui/user/${p}.png`)} alt={p} style={{ width: "100%", height: "100%" }} />
            </button>
          ))}
        </div>
        <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 8 }}>
          <span>Account name:</span>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ border: "1px solid #7F9DB9", padding: "2px 5px", fontSize: 11, width: 160, outline: "none" }}
          />
        </div>
        <div style={{ marginTop: 16, display: "flex", justifyContent: "flex-end", gap: 8 }}>
          {saved && <span style={{ color: "#1E7A1E", alignSelf: "center" }}>Picture saved.</span>}
          <button
            onClick={() => { setUserPicture(picked); if (name.trim()) setUserName(name.trim()); setSaved(true); }}
            style={{ minWidth: 90, height: 23, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}
          >
            Save Picture
          </button>
          <button onClick={() => closeWindow(id)} style={{ minWidth: 70, height: 23, background: "linear-gradient(180deg,#FDFDFB,#E4E2D0)", border: "1px solid #ACA899", borderRadius: 3 }}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
