export interface BulbConfig {
  id: string;
  label: string;
  color: string;
  soundFrequency: number;
}

export type Direction = "ltr" | "rtl";

export interface SequencerConfig {
  bulbs: BulbConfig[];
  repetitions: number;
  direction: Direction;
  stepDurationMs: number;
}

export type PlaybackState = "idle" | "playing";

export interface SequencerState {
  config: SequencerConfig;
  playbackState: PlaybackState;
  activeBulbIndex: number;
  currentRep: number;
}
