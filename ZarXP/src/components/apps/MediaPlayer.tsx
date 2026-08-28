import { useState, useRef, useEffect, useCallback } from "react";
import { assetUrl } from "../../utils/assets";
import { useLangStore } from "../../store/langStore";

interface Track {
  src: string;
  title: string;
  artist: string;
  album: string;
  duration: string;
}

const REAL_TRACKS: Track[] = [
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

function fmt(s: number) {
  if (isNaN(s) || s < 0) return "00:00";
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
}

export default function MediaPlayer(_: { id: string }) {
  const [playing, setPlaying] = useState(false);
  const [current, setCurrent] = useState(0);
  const [volume, setVolume] = useState(75);
  const [muted, setMuted] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);

  const t = useLangStore((s) => s.t);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const sourceRef = useRef<MediaElementAudioSourceNode | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number>(0);

  const peaksRef = useRef<{ val: number; speed: number }[]>(Array(36).fill({ val: 0, speed: 0 }));
  const barsRef = useRef<number[]>(Array(36).fill(0));

  const tr = REAL_TRACKS[current];

  const initAudio = useCallback(() => {
    if (!audioCtxRef.current && audioRef.current) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        audioCtxRef.current = new AudioCtx();
        analyserRef.current = audioCtxRef.current.createAnalyser();
        analyserRef.current.fftSize = 128;
        sourceRef.current = audioCtxRef.current.createMediaElementSource(audioRef.current);
        sourceRef.current.connect(analyserRef.current);
        analyserRef.current.connect(audioCtxRef.current.destination);
      } catch {}
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      audioCtxRef.current.resume();
    }
  }, []);

  const drawVisualizer = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const w = canvas.width;
    const h = canvas.height;

    ctx.fillStyle = "#000000";
    ctx.fillRect(0, 0, w, h);

    const numBars = 36;
    const barWidth = Math.max(4, Math.floor((w - (numBars - 1) * 3) / numBars));
    const gap = 3;
    const totalW = numBars * barWidth + (numBars - 1) * gap;
    const startX = Math.floor((w - totalW) / 2);

    let rawData = new Uint8Array(64);
    if (analyserRef.current && playing) {
      analyserRef.current.getByteFrequencyData(rawData);
    }

    const currentBars = barsRef.current;
    const peaks = peaksRef.current;

    for (let i = 0; i < numBars; i++) {
      let targetH = 0;
      if (playing) {
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

    rafRef.current = requestAnimationFrame(drawVisualizer);
  }, [playing]);

  useEffect(() => {
    rafRef.current = requestAnimationFrame(drawVisualizer);
    return () => cancelAnimationFrame(rafRef.current);
  }, [drawVisualizer]);

  const doPlay = useCallback((idx: number) => {
    initAudio();
    setCurrent(idx);
    setPlaying(true);
    if (audioRef.current) {
      audioRef.current.src = REAL_TRACKS[idx].src;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(() => {});
    }
  }, [initAudio]);

  const doPause = useCallback(() => {
    setPlaying(false);
    audioRef.current?.pause();
  }, []);

  const doStop = useCallback(() => {
    setPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setElapsed(0);
  }, []);

  const doPrev = useCallback(() => {
    const idx = (current - 1 + REAL_TRACKS.length) % REAL_TRACKS.length;
    doPlay(idx);
  }, [current, doPlay]);

  const doNext = useCallback(() => {
    if (shuffle) {
      const rnd = Math.floor(Math.random() * REAL_TRACKS.length);
      doPlay(rnd);
    } else {
      const idx = (current + 1) % REAL_TRACKS.length;
      doPlay(idx);
    }
  }, [current, shuffle, doPlay]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = muted ? 0 : volume / 100;
    }
  }, [volume, muted]);

  const progressPct = duration > 0 ? (elapsed / duration) * 100 : 0;

  return (
    <div style={{ width: "100%", height: "100%", background: "#000", display: "flex", flexDirection: "column", fontFamily: "Tahoma, Arial, sans-serif", userSelect: "none", overflow: "hidden" }}>
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

      <div style={{ flex: 1, position: "relative", overflow: "hidden", background: "#000" }}>
        <canvas
          ref={canvasRef}
          width={580}
          height={320}
          style={{ width: "100%", height: "100%", display: "block" }}
        />

        {showPlaylist && (
          <div style={{ position: "absolute", top: 0, left: 0, width: 220, bottom: 0, background: "rgba(10, 18, 30, 0.92)", borderRight: "1px solid #3A5575", display: "flex", flexDirection: "column", zIndex: 10, backdropFilter: "blur(4px)" }}>
            <div style={{ padding: "6px 10px", fontSize: 10, fontWeight: "bold", color: "#8AB8E6", borderBottom: "1px solid #2A3C50", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span>{t("playlist")}</span>
              <button onClick={() => setShowPlaylist(false)} style={{ background: "none", border: "none", color: "#888", cursor: "pointer", fontSize: 11 }}>✕</button>
            </div>
            <div style={{ flex: 1, overflowY: "auto" }}>
              {REAL_TRACKS.map((track, i) => (
                <div
                  key={i}
                  onDoubleClick={() => doPlay(i)}
                  style={{
                    padding: "5px 8px", fontSize: 11, cursor: "pointer",
                    background: i === current ? "#1C4880" : "transparent",
                    color: i === current ? "#FFF" : "#B0C4DE",
                    borderBottom: "1px solid rgba(255,255,255,0.05)"
                  }}
                >
                  <div style={{ fontWeight: i === current ? "bold" : "normal", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{track.title}</div>
                  <div style={{ fontSize: 9, color: i === current ? "#99CCFF" : "#688" }}>{track.artist} • {track.duration}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div
        style={{
          height: 64,
          background: "linear-gradient(180deg, #37475A 0%, #202E3F 35%, #151F2C 70%, #0C121B 100%)",
          borderTop: "1px solid #5A7490",
          boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          flexShrink: 0,
          padding: "2px 8px 6px"
        }}
      >
        <div
          style={{ height: 6, width: "100%", background: "#0A1018", borderRadius: 3, border: "1px solid #1E2D3D", position: "relative", cursor: "pointer", marginTop: 2, marginBottom: 4 }}
          onClick={(e) => {
            if (audioRef.current && duration > 0) {
              const rect = e.currentTarget.getBoundingClientRect();
              const seekTime = ((e.clientX - rect.left) / rect.width) * duration;
              audioRef.current.currentTime = seekTime;
              setElapsed(seekTime);
            }
          }}
        >
          <div style={{ width: `${progressPct}%`, height: "100%", background: "linear-gradient(90deg, #1C70D8, #4DA5FF)", borderRadius: 2 }} />
          <div
            style={{
              position: "absolute",
              top: -3,
              left: `calc(${progressPct}% - 4px)`,
              width: 8,
              height: 10,
              background: "radial-gradient(circle at 35% 35%, #FFFFFF 0%, #5AC4FF 60%, #1572C8 100%)",
              border: "1px solid #002244",
              borderRadius: 2,
              boxShadow: "0 0 4px #4DA5FF"
            }}
          />
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6, minWidth: 90 }}>
            <span style={{ fontSize: 11, color: "#FFFFFF", fontFamily: "Arial, Tahoma, sans-serif", letterSpacing: 0.5 }}>{fmt(elapsed)}</span>
            <button
              onClick={() => setShowPlaylist((p) => !p)}
              title={t("playlist")}
              style={{
                background: showPlaylist ? "#1C4880" : "linear-gradient(180deg, #2E3E50 0%, #17222E 100%)",
                border: "1px solid #4C6580",
                borderRadius: 3,
                color: "#CCDDEE",
                fontSize: 9,
                padding: "2px 5px",
                cursor: "pointer"
              }}
            >
              ☰
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 5, justifyContent: "center" }}>
            <button
              onClick={() => setShuffle((s) => !s)}
              title="Shuffle"
              style={{
                background: "transparent",
                border: "none",
                color: shuffle ? "#5AC4FF" : "#8FA4BA",
                cursor: "pointer",
                padding: 3,
                display: "flex",
                alignItems: "center"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.46 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
              </svg>
            </button>

            <button
              onClick={() => setRepeat((r) => !r)}
              title="Repeat"
              style={{
                background: "transparent",
                border: "none",
                color: repeat ? "#5AC4FF" : "#8FA4BA",
                cursor: "pointer",
                padding: 3,
                display: "flex",
                alignItems: "center"
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 7h10v3l4-4-4-4v3H5v6h2V7zm10 10H7v-3l-4 4 4 4v-3h12v-6h-2v4z"/>
              </svg>
            </button>

            <button
              onClick={doStop}
              title={t("stop")}
              style={{
                width: 22,
                height: 22,
                background: "linear-gradient(180deg, #3A4E62 0%, #1E2B38 100%)",
                border: "1px solid #5A7490",
                borderRadius: 3,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)"
              }}
            >
              <div style={{ width: 8, height: 8, background: "#FFFFFF", borderRadius: 1 }} />
            </button>

            <button
              onClick={doPrev}
              title={t("prev")}
              style={{
                width: 32,
                height: 22,
                background: "linear-gradient(180deg, #3A4E62 0%, #1E2B38 100%)",
                border: "1px solid #5A7490",
                borderRadius: "11px 4px 4px 11px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FFFFFF",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M11 18V6l-8.5 6 8.5 6zm.5-6l8.5 6V6l-8.5 6z"/>
              </svg>
            </button>

            <button
              onClick={() => playing ? doPause() : doPlay(current)}
              title={playing ? t("pause") : t("play")}
              style={{
                width: 36,
                height: 36,
                borderRadius: "50%",
                background: "radial-gradient(circle at 35% 30%, #5AC4FF 0%, #1E7CE0 50%, #0D4E96 100%)",
                border: "2px solid #7E9EB8",
                boxShadow: "0 0 8px rgba(40,140,255,0.6), inset 0 1px 2px rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                margin: "0 2px"
              }}
            >
              {playing ? (
                <div style={{ display: "flex", gap: 3 }}>
                  <div style={{ width: 3, height: 12, background: "#FFFFFF", borderRadius: 1 }} />
                  <div style={{ width: 3, height: 12, background: "#FFFFFF", borderRadius: 1 }} />
                </div>
              ) : (
                <div style={{ width: 0, height: 0, borderTop: "6px solid transparent", borderBottom: "6px solid transparent", borderLeft: "10px solid #FFFFFF", marginLeft: 2 }} />
              )}
            </button>

            <button
              onClick={doNext}
              title={t("next")}
              style={{
                width: 32,
                height: 22,
                background: "linear-gradient(180deg, #3A4E62 0%, #1E2B38 100%)",
                border: "1px solid #5A7490",
                borderRadius: "4px 11px 11px 4px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: "#FFFFFF",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.2)"
              }}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#FFFFFF">
                <path d="M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z"/>
              </svg>
            </button>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 4, minWidth: 100, justifyContent: "flex-end" }}>
            <button
              onClick={() => setMuted((m) => !m)}
              title={muted ? t("volume") : t("mute")}
              style={{ background: "transparent", border: "none", color: muted ? "#FF6666" : "#A0B5CC", cursor: "pointer", padding: 2, display: "flex", alignItems: "center" }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
              </svg>
            </button>
            <div style={{ position: "relative", width: 60, height: 6, background: "#0A1018", borderRadius: 3, border: "1px solid #1E2D3D" }}>
              <input
                type="range"
                min={0}
                max={100}
                value={muted ? 0 : volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setMuted(false); }}
                style={{
                  position: "absolute",
                  inset: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer"
                }}
              />
              <div style={{ width: `${muted ? 0 : volume}%`, height: "100%", background: "linear-gradient(90deg, #1C70D8, #4DA5FF)", borderRadius: 2 }} />
              <div
                style={{
                  position: "absolute",
                  top: -2,
                  left: `calc(${muted ? 0 : volume}% - 4px)`,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "radial-gradient(circle, #FFFFFF 0%, #4DA5FF 60%, #1572C8 100%)",
                  border: "1px solid #002244"
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
