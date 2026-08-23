const cache = new Map<string, HTMLAudioElement>();

function resolveBase(): string {
  const base = (import.meta as unknown as { env: { BASE_URL?: string } }).env.BASE_URL || "/"
  return base.endsWith("/") ? base : base + "/"
}

export function playSound(name: string, volume = 0.3) {
  let audio = cache.get(name);
  if (!audio) {
    audio = new Audio(`${resolveBase()}assets/sounds/${name}`);
    audio.volume = volume;
    cache.set(name, audio);
  } else {
    audio.currentTime = 0;
  }
  audio.play().catch(() => {});
}

export const XP_SOUNDS = {
  startup: "Windows XP Startup.wav",
  logon: "Windows XP Logon Sound.wav",
  logoff: "Windows XP Logoff Sound.wav",
  shutdown: "Windows XP Shutdown.wav",
  menuCommand: "Windows XP Menu Command.wav",
  minimize: "Windows XP Minimize.wav",
  restore: "Windows XP Restore.wav",
  error: "Windows XP Error.wav",
  exclamation: "Windows XP Exclamation.wav",
  criticalStop: "Windows XP Critical Stop.wav",
  ding: "Windows XP Ding.wav",
  notify: "Windows XP Notify.wav",
  balloon: "Windows XP Balloon.wav",
  chimes: "chimes.wav",
  chord: "chord.wav",
  tada: "tada.wav",
  recycle: "Windows XP Recycle.wav",
  hardwareInsert: "Windows XP Hardware Insert.wav",
  hardwareRemove: "Windows XP Hardware Remove.wav",
} as const
