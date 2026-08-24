import { assetUrl } from "../../utils/assets"

export default function AboutXP(_: { id: string }) {
  return (
    <div style={{ width: "100%", height: "100%", background: "#FFF", fontFamily: "Tahoma, sans-serif", display: "flex", flexDirection: "column", padding: 14, userSelect: "none" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <img src={assetUrl("assets/xpui/logo/flag.png")} alt="" style={{ width: 48, height: 48 }} />
        <div style={{ display: "flex", flexDirection: "column", gap: 2, paddingTop: 2 }}>
          <span style={{ fontSize: 20, fontWeight: "bold", color: "#0A246A" }}>Microsoft Windows</span>
          <span style={{ fontSize: 13, color: "#0A246A" }}>XP Professional</span>
          <span style={{ fontSize: 11, color: "#444", marginTop: 6 }}>Version 2002<br />Service Pack 3</span>
        </div>
      </div>
      <div style={{ borderTop: "1px solid #D4D0C8", margin: "12px 0" }} />
      <div style={{ fontSize: 11, color: "#000", lineHeight: 1.5 }}>
        This product is licensed under the Microsoft Software License Terms to:<br />
        <b>XP User</b><br />
        A web recreation built for nostalgia purposes.
      </div>
      <div style={{ borderTop: "1px solid #D4D0C8", margin: "12px 0" }} />
      <div style={{ fontSize: 11, color: "#444" }}>Physical memory available to Windows: 523,760 KB</div>
      <div style={{ marginTop: "auto", display: "flex", justifyContent: "flex-end" }}>
        <button
          onClick={() => document.querySelector<HTMLElement>('.xp-win button[aria-label="Close"]')?.click()}
          style={{ minWidth: 75, padding: "3px 10px", fontSize: 11, fontFamily: "Tahoma, sans-serif", background: "linear-gradient(180deg,#FDFDFB 0%,#F0EFE2 60%,#E4E2D0 100%)", border: "1px solid #ACA899", borderRadius: 3 }}
        >
          OK
        </button>
      </div>
    </div>
  );
}
