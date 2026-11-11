import { useWindowStore } from "../../store/windowStore";
import { useLangStore } from "../../store/langStore";
import { assetUrl } from "../../utils/assets";

const choiceStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  gap: 8,
  width: 92,
  minHeight: 80,
  padding: "10px 4px",
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.28), inset 1px 1px 0 rgba(255, 255, 255, 0.85)",
  borderRadius: 4,
  cursor: "pointer",
};

export default function ShutdownDialog({ id }: { id: string }) {
  const closeWindow = useWindowStore((state) => state.closeWindow);
  const t = useLangStore((state) => state.t);
  const power = (action: "stand-by" | "shut-down" | "restart") =>
    window.dispatchEvent(new CustomEvent("zarxp-power", { detail: { action } }));

  const choices = [
    { action: "stand-by" as const, label: t("standBy"), icon: "Standby.png" },
    { action: "shut-down" as const, label: t("turnOffButton"), icon: "Power.png" },
    { action: "restart" as const, label: t("restart"), icon: "Restart.png" },
  ];

  return (
    <div className="xp-dialog-surface" style={{ display: "flex", flexDirection: "column", height: "100%", userSelect: "none" }}>
      <div
        style={{
          background: "linear-gradient(to right, #002D96 0%, #2B79EE 100%)",
          borderBottom: "1px solid #001D6E",
          padding: "10px 14px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            color: "#FFFFFF",
            fontSize: 15,
            fontWeight: "bold",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.65)",
            letterSpacing: "0.2px",
          }}
        >
          {t("turnOffComputer")}
        </span>
        <img
          src={assetUrl("assets/icons/WindowsFlag.png")}
          alt=""
          style={{ width: 22, height: 22, filter: "drop-shadow(1px 1px 2px rgba(0,0,0,0.5))" }}
        />
      </div>

      <div
        className="xp-dialog-body"
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: 16,
          padding: "16px 14px",
        }}
      >
        {choices.map((choice) => (
          <button
            key={choice.action}
            className="xp-button"
            style={choiceStyle}
            onClick={() => power(choice.action)}
            aria-label={choice.label}
          >
            <img
              src={assetUrl(`assets/icons/${choice.icon}`)}
              alt=""
              style={{ width: 32, height: 32, filter: "drop-shadow(0 2px 3px rgba(0, 0, 0, 0.35))" }}
            />
            <span style={{ fontSize: 11, textAlign: "center" }}>{choice.label}</span>
          </button>
        ))}
      </div>

      <div className="xp-dialog-footer" style={{ padding: "8px 14px", display: "flex", justifyContent: "flex-end" }}>
        <button className="xp-button" onClick={() => closeWindow(id)} style={{ minWidth: 75 }}>
          {t("cancel")}
        </button>
      </div>
    </div>
  );
}
