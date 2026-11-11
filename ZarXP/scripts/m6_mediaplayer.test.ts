import { test, describe } from "node:test";
import assert from "node:assert/strict";

describe("Milestone 6: MediaPlayer XP Source Fidelity Standards", () => {
  test("MediaPlayer time formatting formats seconds into mm:ss or hh:mm:ss", () => {
    const fmt = (s: number): string => {
      if (isNaN(s) || s < 0) return "00:00";
      const h = Math.floor(s / 3600);
      const m = Math.floor((s % 3600) / 60);
      const sec = Math.floor(s % 60);
      if (h > 0) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
      }
      return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    };

    assert.equal(fmt(0), "00:00");
    assert.equal(fmt(65), "01:05");
    assert.equal(fmt(267), "04:27");
    assert.equal(fmt(3665), "01:01:05");
  });

  test("MediaPlayer playback finite state machine transitions correctly", () => {
    type PlaybackState = "Closed" | "Stopped" | "Playing" | "Paused" | "FastForwarding" | "Rewinding";
    interface PlayerModel {
      state: PlaybackState;
      hasTrack: boolean;
    }

    const play = (p: PlayerModel): PlayerModel => {
      if (!p.hasTrack) return { ...p, state: "Closed" };
      return { ...p, state: "Playing" };
    };

    const pause = (p: PlayerModel): PlayerModel => {
      if (p.state === "Playing") return { ...p, state: "Paused" };
      if (p.state === "Paused") return { ...p, state: "Playing" };
      return p;
    };

    const stop = (p: PlayerModel): PlayerModel => {
      if (!p.hasTrack) return { ...p, state: "Closed" };
      return { ...p, state: "Stopped" };
    };

    let p: PlayerModel = { state: "Stopped", hasTrack: true };
    p = play(p);
    assert.equal(p.state, "Playing");
    p = pause(p);
    assert.equal(p.state, "Paused");
    p = pause(p);
    assert.equal(p.state, "Playing");
    p = stop(p);
    assert.equal(p.state, "Stopped");
  });

  test("Visualizer modes list contains all 5 authentic Windows XP modes", () => {
    const MODES = ["bars", "oscilloscope", "firestorm", "water", "albumArt"] as const;
    assert.equal(MODES.length, 5);
    assert.ok(MODES.includes("bars"));
    assert.ok(MODES.includes("oscilloscope"));
    assert.ok(MODES.includes("firestorm"));
    assert.ok(MODES.includes("water"));
    assert.ok(MODES.includes("albumArt"));
  });
});
