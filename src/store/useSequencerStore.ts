import { create } from "zustand";
import type { PlaybackState, SequencerConfig, SequencerState } from "@/types";
import { createDefaultConfig, getNextStep } from "@/lib/sequencer";
import { playTone } from "@/lib/audioEngine";

interface SequencerActions {
  play: () => void;
  stop: () => void;
  advanceStep: () => void;
  updateConfig: (config: SequencerConfig) => void;
  reset: () => void;
}

export type SequencerStore = SequencerState & SequencerActions;

/**
 * Module-level interval ID for the sequencer timer.
 * This ensures only one timer runs even if the hook is unmounted/remounted.
 */
let sequencerIntervalId: ReturnType<typeof setInterval> | null = null;

const clearSequencerTimer = () => {
  if (sequencerIntervalId !== null) {
    clearInterval(sequencerIntervalId);
    sequencerIntervalId = null;
  }
};

const playCurrentBulbTone = (state: SequencerState) => {
  const { config, activeBulbIndex, playbackState } = state;
  if (playbackState !== "playing" || activeBulbIndex < 0) return;

  const ids = config.bulbs.map((b) => b.id);
  const orderedBulbIds = config.direction === "rtl" ? [...ids].reverse() : ids;

  const bulbId = orderedBulbIds[activeBulbIndex];
  const bulb = config.bulbs.find((b) => b.id === bulbId);

  if (bulb) {
    playTone(bulb.soundFrequency, config.stepDurationMs * 0.8);
  }
};

export const useSequencerStore = create<SequencerStore>((set, get) => ({
  config: createDefaultConfig(),
  playbackState: "idle",
  activeBulbIndex: -1,
  currentRep: 1,

  play: () => {
    if (get().playbackState === "playing") return;

    clearSequencerTimer();

    set({
      playbackState: "playing",
      activeBulbIndex: 0,
      currentRep: 1,
    });

    playCurrentBulbTone(get());

    const duration = get().config.stepDurationMs;
    sequencerIntervalId = setInterval(() => {
      get().advanceStep();
    }, duration);
  },

  stop: () => {
    clearSequencerTimer();
    set({
      playbackState: "idle",
      activeBulbIndex: -1,
      currentRep: 1,
    });
  },

  advanceStep: () => {
    const { config, activeBulbIndex, currentRep } = get();
    const totalBulbs = config.bulbs.length;
    const result = getNextStep(
      activeBulbIndex,
      totalBulbs,
      currentRep,
      config.repetitions,
    );

    if (result.done) {
      get().stop();
    } else {
      set({
        activeBulbIndex: result.nextIndex,
        currentRep: result.nextRep,
      });
      playCurrentBulbTone(get());
    }
  },

  updateConfig: (config: SequencerConfig) => {
    if (get().playbackState === "playing") {
      get().stop();
    }

    set({
      config,
      playbackState: "idle",
      activeBulbIndex: -1,
      currentRep: 1,
    });
  },

  reset: () => {
    get().stop();
    set({
      config: createDefaultConfig(),
      playbackState: "idle",
      activeBulbIndex: -1,
      currentRep: 1,
    });
  },
}));
