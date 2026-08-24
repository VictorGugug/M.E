import { useEffect } from "react";
import { useWindowStore } from "../../store/windowStore";
import { assetUrl } from "../../utils/assets"

export default function TourXP({ id }: { id: string }) {
  const closeWindow = useWindowStore((s) => s.closeWindow);

  useEffect(() => {
    const handler = () => closeWindow(id);
    window.addEventListener("zarxp-tour-quit", handler);
    return () => window.removeEventListener("zarxp-tour-quit", handler);
  }, [id, closeWindow]);

  const ruffleSrc = assetUrl("ruffle/ruffle.js");
  const swfUrl = assetUrl("assets/xpui/tour/background.swf");
  const swfBase = assetUrl("assets/xpui/tour/");

  const srcdoc = `<!DOCTYPE html>
<html>
<head>
<style>
html, body { height: 100%; width: 100%; margin: 0; padding: 0; overflow: hidden; background-color: #fff; }
#ruffle-container { width: 100%; height: 100%; }
ruffle-player { width: 100% !important; height: 100% !important; }
</style>
</head>
<body>
<div id="ruffle-container"></div>
<script src="${ruffleSrc}"></script>
<script>
window.RufflePlayer = window.RufflePlayer || {};
window.addEventListener("load", function () {
  var ruffle = window.RufflePlayer.newest();
  var player = ruffle.createPlayer();
  var container = document.getElementById("ruffle-container");
  container.appendChild(player);
  player.onFSCommand = function (command, args) {
    if (String(command).toLowerCase() === "quit") {
      parent.dispatchEvent(new CustomEvent("zarxp-tour-quit"));
      return true;
    }
    return false;
  };
  player.load({
    url: "${swfUrl}",
    base: "${swfBase}",
    scale: "showAll",
    allowScriptAccess: true
  });
});
</script>
</body>
</html>`;

  return (
    <iframe
      srcDoc={srcdoc}
      title="Tour Windows XP"
      style={{ width: "100%", height: "100%", border: 0, background: "#FFF" }}
    />
  );
}
