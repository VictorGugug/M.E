import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";

export default function AboutXP({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const t = useLangStore((state) => state.t);

  return (
    <div className="xp-dialog-surface" style={{ display: "flex", flexDirection: "column", height: "100%", userSelect: "none" }}>
      <div style={{ background: "#FFFFFF", padding: "12px 18px", borderBottom: "1px solid #919B9C" }}>
        <img
          src={assetUrl("assets/images/xp-logo.png")}
          alt="Microsoft Windows XP Professional"
          style={{ height: 46, width: "auto", objectFit: "contain", display: "block" }}
        />
      </div>
      <div style={{ borderBottom: "1px solid #FFFFFF", borderTop: "1px solid #919B9C", height: 0 }} />

      <div className="xp-dialog-body" style={{ flex: 1, padding: "12px 18px", fontSize: 11, color: "#000", fontFamily: "Tahoma, sans-serif", overflowY: "auto" }}>
        <div style={{ marginBottom: 10, lineHeight: 1.45 }}>
          <div style={{ fontWeight: "bold" }}>{t("aboutMicrosoftWindows")}</div>
          <div>{t("aboutBuildNumber")}</div>
          <div>{t("aboutCopyright")}</div>
        </div>

        <div style={{ borderTop: "1px solid #919B9C", borderBottom: "1px solid #FFFFFF", margin: "10px 0" }} />

        <div style={{ marginBottom: 10, lineHeight: 1.45 }}>
          <div>{t("aboutLicensedTo")}</div>
          <div style={{ paddingLeft: 16, marginTop: 4 }}>
            <div style={{ fontWeight: "bold" }}>{t("aboutXpUser")}</div>
            <div>{t("aboutOrganization")}</div>
          </div>
        </div>

        <div style={{ borderTop: "1px solid #919B9C", borderBottom: "1px solid #FFFFFF", margin: "10px 0" }} />

        <div style={{ lineHeight: 1.45 }}>
          <div>{t("aboutPhysicalMemory")}</div>
        </div>
      </div>

      <div className="xp-dialog-footer" style={{ padding: "8px 18px", display: "flex", justifyContent: "flex-end" }}>
        <button className="xp-button" onClick={() => closeWindow(id)} style={{ minWidth: 75 }} autoFocus>
          {t("ok")}
        </button>
      </div>
    </div>
  );
}
