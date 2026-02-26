import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { act } from "@testing-library/react";
import { useSequencerStore } from "./useSequencerStore";

vi.mock("@/lib/audioEngine", () => ({
  playTone: vi.fn(),
}));

describe("useSequencerStore", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useSequencerStore.getState().reset();
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.runOnlyPendingTimers();
    vi.useRealTimers();
  });

  describe("initial state", () => {
    it("starts in idle playback state", () => {
      const state = useSequencerStore.getState();
      expect(state.playbackState).toBe("idle");
    });

    it("starts with activeBulbIndex of -1 (none active)", () => {
      const state = useSequencerStore.getState();
      expect(state.activeBulbIndex).toBe(-1);
    });

    it("starts with 3 bulbs by default", () => {
      const state = useSequencerStore.getState();
      expect(state.config.bulbs).toHaveLength(3);
    });
  });

  describe("play()", () => {
    it("transitions to playing state", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      expect(useSequencerStore.getState().playbackState).toBe("playing");
    });

    it("sets activeBulbIndex to 0 immediately", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      expect(useSequencerStore.getState().activeBulbIndex).toBe(0);
    });

    it("is idempotent — calling play twice does not reset the position", () => {
      act(() => {
        useSequencerStore.getState().play();
      });

      // Advance one step
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs,
        );
      });
      const indexAfterOneStep = useSequencerStore.getState().activeBulbIndex;
      expect(indexAfterOneStep).toBe(1);

      // Call play again — should not reset
      act(() => {
        useSequencerStore.getState().play();
      });
      expect(useSequencerStore.getState().activeBulbIndex).toBe(
        indexAfterOneStep,
      );
    });
  });

  describe("stop()", () => {
    it("transitions back to idle", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      act(() => {
        useSequencerStore.getState().stop();
      });
      expect(useSequencerStore.getState().playbackState).toBe("idle");
    });

    it("resets activeBulbIndex to -1", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      act(() => {
        useSequencerStore.getState().stop();
      });
      expect(useSequencerStore.getState().activeBulbIndex).toBe(-1);
    });
  });

  describe("step advancement", () => {
    it("advances to index 1 after one step duration", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs,
        );
      });
      expect(useSequencerStore.getState().activeBulbIndex).toBe(1);
    });

    it("advances to index 2 after two step durations", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs * 2,
        );
      });
      expect(useSequencerStore.getState().activeBulbIndex).toBe(2);
    });

    it("auto-stops after all steps of a single rep complete", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      // 3 bulbs × 1 rep → 3 steps total (0→1→2→done)
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs * 3,
        );
      });
      expect(useSequencerStore.getState().playbackState).toBe("idle");
      expect(useSequencerStore.getState().activeBulbIndex).toBe(-1);
    });

    it("loops bulbs across multiple reps before stopping", () => {
      // Set 2 repetitions
      act(() => {
        useSequencerStore.getState().updateConfig({
          ...useSequencerStore.getState().config,
          repetitions: 2,
        });
      });

      act(() => {
        useSequencerStore.getState().play();
      });

      // Advance 5 steps (0, 1, 2, 0, 1)
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs * 5,
        );
      });
      expect(useSequencerStore.getState().playbackState).toBe("playing");
      expect(useSequencerStore.getState().activeBulbIndex).toBe(2);

      // Next step makes it done
      act(() => {
        vi.advanceTimersByTime(
          useSequencerStore.getState().config.stepDurationMs,
        );
      });
      expect(useSequencerStore.getState().playbackState).toBe("idle");
    });
  });

  describe("updateConfig()", () => {
    it("stops playback when config is updated mid-play", () => {
      act(() => {
        useSequencerStore.getState().play();
      });
      act(() => {
        useSequencerStore.getState().updateConfig({
          ...useSequencerStore.getState().config,
          repetitions: 3,
        });
      });
      expect(useSequencerStore.getState().playbackState).toBe("idle");
    });
  });
});
