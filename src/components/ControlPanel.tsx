"use client";

import type { PlaybackState, SequencerConfig } from "@/types";

interface ControlPanelProps {
  config: SequencerConfig;
  playbackState: PlaybackState;
  onPlay: () => void;
  onStop: () => void;
  onConfigChange: (config: SequencerConfig) => void;
}

export function ControlPanel({
  config,
  playbackState,
  onPlay,
  onStop,
  onConfigChange,
}: ControlPanelProps) {
  const isPlaying = playbackState === "playing";

  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="flex justify-center">
        <button
          className={`inline-flex items-center gap-[10px] py-[14px] px-10 rounded-[12px] border-none text-[1rem] font-bold tracking-[0.04em] cursor-pointer transition-all duration-200 ease ${
            isPlaying
              ? "bg-gradient-to-br from-[#ef4444] to-[#f97316] text-white shadow-[0_4px_20px_rgba(239,68,68,0.4)] hover:from-[#f87171] hover:to-[#fb923c] hover:-translate-y-[2px] hover:shadow-[0_6px_28px_rgba(239,68,68,0.55)]"
              : "bg-gradient-to-br from-[#6366f1] to-[#8b5cf6] text-white shadow-[0_4px_20px_rgba(99,102,241,0.45)] hover:from-[#818cf8] hover:to-[#a78bfa] hover:-translate-y-[2px] hover:shadow-[0_6px_28px_rgba(99,102,241,0.6)] active:translate-y-0"
          }`}
          onClick={isPlaying ? onStop : onPlay}
          aria-label={isPlaying ? "Stop sequence" : "Play sequence"}
          data-testid="play-stop-btn"
        >
          {isPlaying ? (
            <>
              <StopIcon />
              Stop
            </>
          ) : (
            <>
              <PlayIcon />
              Play
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col gap-2.5">
        <label
          htmlFor="repetitions"
          className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.07em]"
        >
          Repetitions
        </label>
        <input
          id="repetitions"
          type="number"
          min={1}
          max={99}
          value={config.repetitions}
          disabled={isPlaying}
          className="w-[90px] py-2 px-3 rounded-lg border-[1.5px] border-[#334155] bg-[#0f172a] text-[#e2e8f0] text-[1rem] font-semibold text-center focus:outline-none focus:border-[#6366f1] disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="repetitions-input"
          onChange={(e) => {
            const val = Math.max(1, Number(e.target.value));
            onConfigChange({ ...config, repetitions: val });
          }}
        />
      </div>

      <div className="flex flex-col gap-2.5">
        <label className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.07em]">
          Direction
        </label>
        <div className="flex gap-2 flex-wrap">
          <button
            className={`flex-1 py-2.5 px-4 rounded-lg border-[1.5px] border-[#334155] bg-[#0f172a] text-[#94a3b8] text-[0.85rem] font-semibold cursor-pointer transition-all duration-200 hover:enabled:border-[#6366f1] hover:enabled:text-[#a5b4fc] disabled:opacity-40 disabled:cursor-not-allowed ${
              config.direction === "ltr"
                ? "bg-[#1e1b4b] border-[#6366f1] text-[#a5b4fc]"
                : ""
            }`}
            onClick={() => onConfigChange({ ...config, direction: "ltr" })}
            disabled={isPlaying}
            aria-pressed={config.direction === "ltr"}
            data-testid="direction-ltr"
          >
            → Left to Right
          </button>
          <button
            className={`flex-1 py-2.5 px-4 rounded-lg border-[1.5px] border-[#334155] bg-[#0f172a] text-[#94a3b8] text-[0.85rem] font-semibold cursor-pointer transition-all duration-200 hover:enabled:border-[#6366f1] hover:enabled:text-[#a5b4fc] disabled:opacity-40 disabled:cursor-not-allowed ${
              config.direction === "rtl"
                ? "bg-[#1e1b4b] border-[#6366f1] text-[#a5b4fc]"
                : ""
            }`}
            onClick={() => onConfigChange({ ...config, direction: "rtl" })}
            disabled={isPlaying}
            aria-pressed={config.direction === "rtl"}
            data-testid="direction-rtl"
          >
            ← Right to Left
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-2.5">
        <label
          htmlFor="step-duration"
          className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.07em]"
        >
          Step Duration:{" "}
          <span className="text-[#e2e8f0] font-bold">
            {config.stepDurationMs} ms
          </span>
        </label>
        <input
          id="step-duration"
          type="range"
          min={200}
          max={2000}
          step={50}
          value={config.stepDurationMs}
          disabled={isPlaying}
          className="w-full h-2 bg-[#1e293b] rounded-lg appearance-none cursor-pointer accent-[#6366f1] disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="step-duration-slider"
          onChange={(e) => {
            onConfigChange({
              ...config,
              stepDurationMs: Number(e.target.value),
            });
          }}
        />
        <div className="flex justify-between text-[0.72rem] text-[#64748b]">
          <span>Fast (200ms)</span>
          <span>Slow (2s)</span>
        </div>
      </div>
    </div>
  );
}

function PlayIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <polygon points="5,3 19,12 5,21" />
    </svg>
  );
}

function StopIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <rect x="4" y="4" width="16" height="16" rx="2" />
    </svg>
  );
}
