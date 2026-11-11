import { useState, useRef, useEffect, useCallback } from "react";
import { assetUrl } from "../../utils/assets";
import { useLangStore } from "../../store/langStore";
import { useWindowStore } from "../../store/windowStore";
import MenuBar from "../shell/MenuBar";
import { cmd, sep } from "../shell/menuModel";

export interface Track {
  src: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const DEFAULT_TRACKS: Track[] = [
  {
    src: assetUrl("assets/music/134340 Pluto.mp3"),
    title: "134340 Pluto",
    artist: "Cojum Dip",
    album: "Cojum Dip",
    duration: "4:27",
  },
  {
    src: assetUrl("assets/music/Ancient Aliens.mp3"),
    title: "Ancient Aliens",
    artist: "Lemon Demon",
    album: "Spirit Phone",
    duration: "5:17",
  },
  {
    src: assetUrl("assets/music/Down Under (Feat. Colin Hay).mp3"),
    title: "Down Under (Feat. Colin Hay)",
    artist: "Luude, Colin Hay",
    album: "Down Under",
    duration: "3:29",
  },
  {
    src: assetUrl("assets/music/Falling with you.mp3"),
    title: "Falling With You",
    artist: "AJ DiSpirito",
    album: "Murder Drones Vol. 3",
    duration: "2:03",
  },
  {
    src: assetUrl("assets/music/No Eyed Girl.mp3"),
    title: "No Eyed Girl",
    artist: "Lemon Demon",
    album: "Spirit Phone",
    duration: "4:30",
  },
  {
    src: assetUrl("assets/music/The HuMaN Gala.mp3"),
    title: "The HuMaN Gala",
    artist: "AJ DiSpirito",
    album: "Murder Drones Vol. 2",
    duration: "2:11",
  },
  {
    src: assetUrl("assets/music/Variations on a Cloud.mp3"),
    title: "Variations on a Cloud",
    artist: "Miracle Musical",
    album: "Variations on a Cloud",
    duration: "3:40",
  },
  {
    src: assetUrl("assets/music/Waltz in E-Major, Op. 15 \"Moon Waltz\".mp3"),
    title: "Moon Waltz (Op. 15)",
    artist: "Cojum Dip",
    album: "Cojum Dip",
    duration: "5:47",
  },
];

type PlaybackState = "Closed" | "Stopped" | "Playing" | "Paused" | "FastForwarding" | "Rewinding";
type VizMode = "bars" | "oscilloscope" | "firestorm" | "water" | "albumArt";

function fmtTime(s: number): string {
  if (isNaN(s) || s < 0) return "00:00";
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) {
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function MediaPlayer({ id }: { id: string }) {
  const [tracks, setTracks] = useState<Track[]>(DEFAULT_TRACKS);
  const [current, setCurrent] = useState(0);
  const [playbackState, setPlaybackState] = useState<PlaybackState>("Stopped");
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [vizMode, setVizMode] = useState<VizMode>("bars");
  const [isCompact, setIsCompact] = useState(false);

  const t = useLangStore((s) => s.t);
  const closeWindow = useWindowStore((s) => s.closeWindow);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const peaksRef = useRef<{ val: number; speed: number }[]>(Array(36).fill({ val: 0, speed: 0 }));
  const barsRef = useRef<number[]>(Array(36).fill(0));

  const tr = tracks[current] || {
    src: "",
    title: "No Media Loaded",
    artist: "Windows Media Player",
    album: "Windows XP",
    duration: "00:00",
  };
  const trTitle = tr.title;
  const trArtist = tr.artist;
  const trAlbum = tr.album;

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && audioRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (AudioCtx) {
          audioCtxRef.current = new AudioCtx();
          analyserRef.current = audioCtxRef.current.createAnalyser();
          analyserRef.current.fftSize = 256;
          sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
          sourceRef.current.connect(analyserRef.current);
          analyserRef.current.connect(audioCtxRef.current.destination);
        }
      } catch {}
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume().catch(() => {});
    }
  }, []);

  const doPlay = useCallback((idx: number) => {
    initAudio();
    setCurrent(idx);
    setPlaybackState("Playing");
    if (audioRef.current) {
      audioRef.current.src = tracks[idx].src;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [initAudio, tracks]);

  const doPause = useCallback(() => {
    setPlaybackState("Paused");
    audioRef.current?.pause();
  }, []);

  const doStop = useCallback(() => {
    setPlaybackState("Stopped");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setElapsed(0);
  }, []);

  const doPrev = useCallback(() => {
    const idx = (current - 1 + tracks.length) % tracks.length;
    doPlay(idx);
  }, [current, tracks.length, doPlay]);

  const doNext = useCallback(() => {
    if (shuffle) {
      const rnd = Math.floor(Math.random() * tracks.length);
      doPlay(rnd);
    } else {
      const idx = (current + 1) % tracks.length;
      doPlay(idx);
    }
  }, [current, shuffle, tracks.length, doPlay]);

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setElapsed(val);
    if (audioRef.current) {
      audioRef.current.currentTime = val;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const newItems: Track[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newItems.push({
        src: url,
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "User Media",
        album: "Local Storage",
        duration: "00:00",
      });
    }
    setTracks((prev) => [...prev, ...newItems]);
    setShowPlaylist(true);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume / 100;
    }
  }, [volume, muted]);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;
    const isPlaying = playbackState === "Playing";

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    if (vizMode === "albumArt") {
      ctx.save();
      ctx.fillStyle = "#111A24";
      ctx.fillRect(0, 0, w, h);

      const centerX = w / 2;
      const centerY = h / 2 - 10;
      const radius = Math.min(w, h) * 0.35;

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
      ctx.fillStyle = "#0A0D11";
      ctx.fill();
      ctx.strokeStyle = "#384758";
      ctx.lineWidth = 3;
      ctx.stroke();

      for (let r = radius - 10; r > radius * 0.4; r -= 6) {
        ctx.beginPath();
        ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.beginPath();
      ctx.arc(centerX, centerY, radius * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = "#1A569C";
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 6, 0, Math.PI * 2);
      ctx.fillStyle = "#000000";
      ctx.fill();

      ctx.fillStyle = "#FFFFFF";
      ctx.font = "bold 13px Tahoma, Arial";
      ctx.textAlign = "center";
      ctx.fillText(trTitle, w / 2, h - 35);
      ctx.fillStyle = "#8AB8E6";
      ctx.font = "11px Tahoma, Arial";
      ctx.fillText(`${trArtist} - ${trAlbum}`, w / 2, h - 18);
      ctx.restore();
    } else if (vizMode === "oscilloscope") {
      let timeData = new Uint8Array(128);
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteTimeDomainData(timeData);
      } else {
        timeData = new Uint8Array(Array.from({ length: 128 }, (_, i) => 128 + Math.sin(Date.now() / 200 + i * 0.1) * (isPlaying ? 30 : 0)));
      }

      ctx.lineWidth = 2;
      ctx.strokeStyle = "#00FF66";
      ctx.shadowColor = "#00FF66";
      ctx.shadowBlur = 6;
      ctx.beginPath();

      const sliceWidth = w / timeData.length;
      let x = 0;
      for (let i = 0; i < timeData.length; i++) {
        const v = timeData[i] / 128.0;
        const y = (v * h) / 2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
        x += sliceWidth;
      }
      ctx.stroke();
      ctx.shadowBlur = 0;
    } else if (vizMode === "firestorm") {
      const time = Date.now() / 150;
      const numFlames = 24;
      const step = w / numFlames;

      for (let i = 0; i < numFlames; i++) {
        const heat = isPlaying ? Math.sin(time + i * 0.6) * 0.4 + 0.6 : 0.1;
        const flameH = (h * 0.75) * heat;
        const fx = i * step;
        const fy = h - flameH;

        const grad = ctx.createLinearGradient(fx, h, fx, fy);
        grad.addColorStop(0, "rgba(255, 0, 0, 0.9)");
        grad.addColorStop(0.4, "rgba(255, 120, 0, 0.8)");
        grad.addColorStop(0.8, "rgba(255, 240, 0, 0.9)");
        grad.addColorStop(1, "rgba(255, 255, 255, 0.95)");

        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.moveTo(fx, h);
        ctx.quadraticCurveTo(fx + step / 2, fy - 10, fx + step, h);
        ctx.fill();
      }
    } else if (vizMode === "water") {
      const time = Date.now() / 200;
      ctx.fillStyle = "#031428";
      ctx.fillRect(0, 0, w, h);

      for (let layer = 0; layer < 3; layer++) {
        ctx.beginPath();
        ctx.moveTo(0, h);
        for (let x = 0; x <= w; x += 10) {
          const freq = 0.015 + layer * 0.005;
          const amp = isPlaying ? 25 + layer * 15 : 6;
          const y = h * 0.6 + Math.sin(x * freq + time + layer * 2) * amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(w, h);
        ctx.fillStyle = layer === 0 ? "rgba(0, 80, 160, 0.4)" : layer === 1 ? "rgba(0, 130, 220, 0.5)" : "rgba(30, 190, 255, 0.6)";
        ctx.fill();
      }
    } else {
      // Default: Bars / Spectrum
      const numBars = 36;
      const barWidth = Math.max(4, Math.floor((w - (numBars - 1) * 3) / numBars));
      const gap = 3;
      const totalW = numBars * barWidth + (numBars - 1) * gap;
      const startX = Math.floor((w - totalW) / 2);

      let rawData = new Uint8Array(64);
      if (analyserRef.current && isPlaying) {
        analyserRef.current.getByteFrequencyData(rawData);
      }

      const currentBars = barsRef.current;
      const peaks = peaksRef.current;

      for (let i = 0; i < numBars; i++) {
        let targetH = 0;
        if (isPlaying) {
          if (analyserRef.current) {
            const idx = Math.min(rawData.length - 1, Math.floor((i / numBars) * 48));
            targetH = (rawData[idx] / 255) * (h - 20);
          } else {
            targetH = (Math.sin(Date.now() / 150 + i * 0.4) * 0.4 + 0.6) * (h * 0.7) * (1 - i / (numBars * 1.3));
          }
        }

        currentBars[i] = currentBars[i] * 0.75 + targetH * 0.25;
        const barH = Math.max(0, Math.min(h - 10, currentBars[i]));

        if (barH >= peaks[i].val) {
          peaks[i] = { val: barH, speed: 0.2 };
        } else {
          const nextVal = Math.max(0, peaks[i].val - peaks[i].speed);
          peaks[i] = { val: nextVal, speed: peaks[i].speed + 0.15 };
        }

        const bx = startX + i * (barWidth + gap);
        const by = h - barH;

        if (barH > 0) {
          const grad = ctx.createLinearGradient(0, h, 0, by);
          grad.addColorStop(0, "#084C00");
          grad.addColorStop(0.3, "#22B500");
          grad.addColorStop(0.65, "#66FF00");
          grad.addColorStop(0.85, "#CCFF00");
          grad.addColorStop(1, "#FFFF00");

          ctx.fillStyle = grad;
          ctx.fillRect(bx, by, barWidth, barH);
        }

        if (peaks[i].val > 2) {
          const peakY = Math.max(4, h - peaks[i].val - 3);
          ctx.fillStyle = "#6699CC";
          ctx.fillRect(bx, peakY, barWidth, 2);
        }
      }
    }

    rafRef.current = requestAnimationFrame(drawVisualizer);
  }, [playbackState, vizMode, trTitle, trArtist, trAlbum]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawVisualizer);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawVisualizer]);

  const VIZ_LABELS: Record<VizMode, string> = {
    bars: "Bars and Waves: Spectrum",
    oscilloscope: "Bars and Waves: Oscilloscope",
    firestorm: "Ambience: Firestorm",
    water: "Ambience: Water",
    albumArt: "Album Art / CD",
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#0C121B",
        display: "flex",
        flexDirection: "column",
        fontFamily: "Tahoma, Arial, sans-serif",
        userSelect: "none",
        overflow: "hidden",
      }}
    >
      <MenuBar
        menus={[
          {
            label: `&${t("file")}`,
            entries: [
              cmd(`${t("openDots")} \tCtrl+O`, () => fileInputRef.current?.click()),
              cmd("Open &URL... \tCtrl+U"),
              cmd(`&${t("closeWindow")} \tCtrl+W`, doStop),
              sep,
              cmd(`${t("saveAs")}...`),
              sep,
              cmd(t("properties")),
              sep,
              cmd(`E&${t("exit")} \tAlt+F4`, () => closeWindow(id)),
            ],
          },
          {
            label: `&${t("view")}`,
            entries: [
              cmd(`&Compact Mode \tCtrl+M`, () => setIsCompact((c) => !c), { checked: isCompact }),
              sep,
              cmd("Bars and Waves: Spectrum", () => setVizMode("bars"), { checked: vizMode === "bars" }),
              cmd("Bars and Waves: Oscilloscope", () => setVizMode("oscilloscope"), { checked: vizMode === "oscilloscope" }),
              cmd("Ambience: Firestorm", () => setVizMode("firestorm"), { checked: vizMode === "firestorm" }),
              cmd("Ambience: Water", () => setVizMode("water"), { checked: vizMode === "water" }),
              cmd("Album Art / CD", () => setVizMode("albumArt"), { checked: vizMode === "albumArt" }),
              sep,
              cmd(`${t("playlist")} \tCtrl+L`, () => setShowPlaylist((p) => !p), { checked: showPlaylist }),
              cmd(t("statusBar")),
            ],
          },
          {
            label: `&${t("play")}`,
            entries: [
              cmd(playbackState === "Playing" ? `${t("pause")} \tCtrl+P` : `${t("play")} \tCtrl+P`, () =>
                playbackState === "Playing" ? doPause() : doPlay(current)
              ),
              cmd(`${t("stop")} \tCtrl+S`, doStop),
              sep,
              cmd(`${t("prev")} \tCtrl+B`, doPrev),
              cmd(`${t("next")} \tCtrl+F`, doNext),
              sep,
              cmd(`${t("shuffle")} \tCtrl+H`, () => setShuffle((s) => !s), { checked: shuffle }),
              cmd(`${t("repeat")} \tCtrl+T`, () => setRepeat((r) => !r), { checked: repeat }),
              sep,
              cmd("Mute \tCtrl+M", () => setMuted((m) => !m), { checked: muted }),
            ],
          },
          {
            label: `&${t("favorites")}`,
            entries: [cmd(t("addToFavorites")), cmd(t("organizeFavorites"))],
          },
          {
            label: `&${t("tools")}`,
            entries: [cmd(t("options"))],
          },
          {
            label: `&${t("help")}`,
            entries: [cmd(t("helpTopics")), sep, cmd(t("aboutMediaPlayer"))],
          },
        ]}
      />

      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept="audio/*"
        multiple
        style={{ display: "none" }}
      />

      <audio
        ref={audioRef}
        src={tr.src}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setElapsed(audioRef.current.currentTime);
            setDuration(audioRef.current.duration || 0);
          }
        }}
        onEnded={() => {
          if (repeat) {
            if (audioRef.current) {
              audioRef.current.currentTime = 0;
              audioRef.current.play().catch(() => {});
            }
          } else {
            doNext();
          }
        }}
      />

      {!isCompact && (
        <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000000" }}>
          <canvas
            ref={canvasRef}
            width={580}
            height={300}
            style={{ width: "100%", height: "100%", display: "block" }}
          />

          <div
            style={{
              position: "absolute",
              top: 6,
              left: 8,
              fontSize: 10,
              color: "rgba(255, 255, 255, 0.4)",
              pointerEvents: "none",
            }}
          >
            {VIZ_LABELS[vizMode]}
          </div>

          {showPlaylist && (
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 240,
                bottom: 0,
                background: "rgba(12, 18, 27, 0.94)",
                borderLeft: "1px solid #3A5575",
                display: "flex",
                flexDirection: "column",
                zIndex: 10,
                backdropFilter: "blur(4px)",
              }}
            >
              <div
                style={{
                  padding: "6px 10px",
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#8AB8E6",
                  borderBottom: "1px solid #2A3C50",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <span>{t("playlist")} ({tracks.length})</span>
                <button
                  onClick={() => setShowPlaylist(false)}
                  style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 11 }}
                >
                  ✕
                </button>
              </div>
              <div style={{ flex: 1, overflowY: "auto" }}>
                {tracks.map((track, i) => (
                  <div
                    key={i}
                    onDoubleClick={() => doPlay(i)}
                    style={{
                      padding: "5px 8px",
                      fontSize: 11,
                      cursor: "pointer",
                      background: i === current ? "#1C4880" : "transparent",
                      color: i === current ? "#FFFFFF" : "#B0C4DE",
                      borderBottom: "1px solid rgba(255,255,255,0.05)",
                    }}
                  >
                    <div
                      style={{
                        fontWeight: i === current ? "bold" : "normal",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {i + 1}. {track.title}
                    </div>
                    <div style={{ fontSize: 9, color: i === current ? "#99CCFF" : "#688" }}>
                      {track.artist} • {track.duration}
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: "6px 8px", borderTop: "1px solid #2A3C50", display: "flex", gap: 4 }}>
                <button
                  className="xp-button"
                  style={{ flex: 1, fontSize: 10 }}
                  onClick={() => fileInputRef.current?.click()}
                >
                  + Add File...
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      <div
        style={{
          background: "linear-gradient(180deg, #37475A 0%, #202E3F 35%, #151F2C 70%, #0C121B 100%)",
          borderTop: "1px solid #5A7490",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          display: "flex",
          flexDirection: "column",
          padding: "4px 10px 6px",
          gap: 4,
          flexShrink: 0,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: 10, color: "#99CCFF", minWidth: 35, textAlign: "right", fontFamily: "monospace" }}>
            {fmtTime(elapsed)}
          </span>
          <input
            type="range"
            min={0}
            max={duration || 100}
            value={elapsed}
            onChange={handleSeek}
            style={{
              flex: 1,
              height: 4,
              accentColor: "#3A82F7",
              cursor: "pointer",
            }}
          />
          <span style={{ fontSize: 10, color: "#8AB8E6", minWidth: 35, fontFamily: "monospace" }}>
            {fmtTime(duration)}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <TransportButton
              label={playbackState === "Playing" ? "Pause" : "Play"}
              icon={playbackState === "Playing" ? "❚❚" : "▶"}
              primary
              onClick={() => (playbackState === "Playing" ? doPause() : doPlay(current))}
            />
            <TransportButton label="Stop" icon="■" onClick={doStop} />
            <TransportButton label="Previous" icon="⏮" onClick={doPrev} />
            <TransportButton label="Next" icon="⏭" onClick={doNext} />
            <div style={{ width: 1, height: 16, background: "#3A5575", margin: "0 4px" }} />
            <TransportButton
              label="Shuffle"
              icon="🔀"
              active={shuffle}
              onClick={() => setShuffle((s) => !s)}
            />
            <TransportButton
              label="Repeat"
              icon="🔁"
              active={repeat}
              onClick={() => setRepeat((r) => !r)}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <button
              onClick={() => setMuted((m) => !m)}
              style={{
                background: "none",
                border: "none",
                color: muted ? "#FF6666" : "#99CCFF",
                cursor: "pointer",
                fontSize: 12,
                padding: 0,
              }}
              title={muted ? "Unmute" : "Mute"}
            >
              {muted ? "🔇" : "🔊"}
            </button>
            <input
              type="range"
              min={0}
              max={100}
              value={muted ? 0 : volume}
              onChange={(e) => {
                setVolume(parseInt(e.target.value, 10));
                setMuted(false);
              }}
              style={{ width: 64, height: 4, accentColor: "#3A82F7", cursor: "pointer" }}
              title={`Volume: ${volume}%`}
            />
            <button
              onClick={() => setShowPlaylist((p) => !p)}
              style={{
                background: showPlaylist ? "#1C4880" : "rgba(255,255,255,0.08)",
                border: "1px solid #3A5575",
                borderRadius: 2,
                color: "#99CCFF",
                fontSize: 10,
                padding: "2px 6px",
                cursor: "pointer",
                marginLeft: 4,
              }}
            >
              Playlist
            </button>
          </div>
        </div>
      </div>

      <div
        style={{
          height: 18,
          background: "#ECE9D8",
          borderTop: "1px solid #ACA899",
          display: "flex",
          fontSize: 10,
          color: "#000000",
          fontFamily: "Tahoma, sans-serif",
        }}
      >
        <div
          style={{
            flex: 2,
            padding: "2px 6px",
            borderRight: "1px solid #D0D0D0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {playbackState === "Playing" ? `Playing: ${tr.title}` : playbackState}
        </div>
        <div
          style={{
            flex: 2,
            padding: "2px 6px",
            borderRight: "1px solid #D0D0D0",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          Audio: 44.1 kHz, 16-bit, Stereo
        </div>
        <div style={{ width: 110, padding: "2px 6px", textAlign: "right" }}>
          {fmtTime(elapsed)} / {fmtTime(duration)}
        </div>
      </div>
    </div>
  );
}

function TransportButton({
  label,
  icon,
  onClick,
  primary,
  active,
}: {
  label: string;
  icon: string;
  onClick: () => void;
  primary?: boolean;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      style={{
        width: primary ? 28 : 22,
        height: primary ? 28 : 22,
        borderRadius: "50%",
        background: active
          ? "linear-gradient(180deg, #1A4476 0%, #0E2A4D 100%)"
          : primary
          ? "linear-gradient(180deg, #4A7EB8 0%, #1A4880 100%)"
          : "linear-gradient(180deg, #2E3E52 0%, #17212D 100%)",
        border: "1px solid #5A7EAC",
        color: "#FFFFFF",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        cursor: "pointer",
        fontSize: primary ? 12 : 10,
        boxShadow: "0 1px 2px rgba(0,0,0,0.4)",
        padding: 0,
      }}
    >
      {icon}
    </button>
  );
}
