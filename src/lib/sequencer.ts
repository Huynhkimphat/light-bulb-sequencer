import type { BulbConfig, Direction, SequencerConfig } from "@/types";

const DEFAULT_BULBS: BulbConfig[] = [
  { id: "bulb-1", label: "Bulb 1", color: "#ef4444", soundFrequency: 261.63 },
  { id: "bulb-2", label: "Bulb 2", color: "#22c55e", soundFrequency: 329.63 },
  { id: "bulb-3", label: "Bulb 3", color: "#3b82f6", soundFrequency: 392.0 },
];

export function createDefaultConfig(): SequencerConfig {
  return {
    bulbs: DEFAULT_BULBS,
    repetitions: 1,
    direction: "ltr",
    stepDurationMs: 600,
  };
}

export function getOrderedBulbIds(config: SequencerConfig): string[] {
  const ids = config.bulbs.map((b) => b.id);
  return config.direction === "rtl" ? [...ids].reverse() : ids;
}

export interface StepResult {
  nextIndex: number;
  nextRep: number;
  done: boolean;
}

/**
 * Given the current position, return the next position.
 *
 * @param currentIndex  0-based index into the ordered bulb array
 * @param totalBulbs    total number of bulbs
 * @param currentRep    1-based current repetition number
 * @param totalReps     total repetitions configured
 */
export function getNextStep(
  currentIndex: number,
  totalBulbs: number,
  currentRep: number,
  totalReps: number,
): StepResult {
  const nextIndex = currentIndex + 1;

  if (nextIndex < totalBulbs) {
    return { nextIndex, nextRep: currentRep, done: false };
  }

  const nextRep = currentRep + 1;
  if (nextRep <= totalReps) {
    return { nextIndex: 0, nextRep, done: false };
  }

  return { nextIndex: -1, nextRep: currentRep, done: true };
}
