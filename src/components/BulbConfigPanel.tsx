"use client";

import type { BulbConfig, SequencerConfig } from "@/types";

interface BulbConfigPanelProps {
  config: SequencerConfig;
  disabled: boolean;
  onConfigChange: (config: SequencerConfig) => void;
}

export function BulbConfigPanel({
  config,
  disabled,
  onConfigChange,
}: BulbConfigPanelProps) {
  function updateBulb(id: string, patch: Partial<BulbConfig>) {
    const updatedBulbs = config.bulbs.map((b) =>
      b.id === id ? { ...b, ...patch } : b,
    );
    onConfigChange({ ...config, bulbs: updatedBulbs });
  }

  return (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.07em] m-0">
        Bulb Settings
      </h3>
      <div className="grid grid-cols-3 gap-4 max-[600px]:grid-cols-1">
        {config.bulbs.map((bulb) => (
          <div
            key={bulb.id}
            className="bg-[#0f172a] border-[1.5px] border-[#1e293b] rounded-[14px] p-4 flex flex-col gap-3.5 transition-all duration-250 ease hover:border-[color-mix(in_srgb,var(--card-color)_50%,transparent)]"
            style={{ "--card-color": bulb.color } as React.CSSProperties}
          >
            <div className="flex items-center gap-[10px]">
              <span
                className="w-3.5 h-3.5 rounded-full shrink-0 transition-all duration-200 ease"
                style={{ background: bulb.color }}
              />
              <input
                className="flex-1 bg-transparent border-none border-b border-[#334155] text-[#e2e8f0] text-[0.9rem] font-semibold py-[2px] px-0 outline-none w-full focus:border-b-[#6366f1] disabled:opacity-50"
                type="text"
                value={bulb.label}
                disabled={disabled}
                maxLength={20}
                aria-label={`Label for ${bulb.id}`}
                data-testid={`label-input-${bulb.id}`}
                onChange={(e) => updateBulb(bulb.id, { label: e.target.value })}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[0.72rem] font-semibold text-[#64748b] uppercase tracking-[0.06em]"
                htmlFor={`color-${bulb.id}`}
              >
                Color
              </label>
              <div className="flex items-center gap-[10px]">
                <input
                  id={`color-${bulb.id}`}
                  type="color"
                  value={bulb.color}
                  disabled={disabled}
                  className="w-9 h-9 border-none rounded-lg cursor-pointer p-[2px] bg-transparent disabled:opacity-40 disabled:cursor-not-allowed"
                  aria-label={`Color for ${bulb.label}`}
                  data-testid={`color-input-${bulb.id}`}
                  onChange={(e) =>
                    updateBulb(bulb.id, { color: e.target.value })
                  }
                />
                <span className="text-[0.8rem] text-[#64748b] font-mono">
                  {bulb.color}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label
                className="text-[0.72rem] font-semibold text-[#64748b] uppercase tracking-[0.06em]"
                htmlFor={`freq-${bulb.id}`}
              >
                Tone (Hz)
              </label>
              <input
                id={`freq-${bulb.id}`}
                type="number"
                min={80}
                max={2000}
                step={1}
                value={bulb.soundFrequency}
                disabled={disabled}
                className="w-full py-1.5 px-2.5 rounded-lg border-[1.5px] border-[#334155] bg-[#1e293b] text-[#e2e8f0] text-[0.9rem] focus:outline-none focus:border-[#6366f1] disabled:opacity-40 disabled:cursor-not-allowed"
                aria-label={`Frequency for ${bulb.label}`}
                data-testid={`freq-input-${bulb.id}`}
                onChange={(e) =>
                  updateBulb(bulb.id, {
                    soundFrequency: Number(e.target.value),
                  })
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
