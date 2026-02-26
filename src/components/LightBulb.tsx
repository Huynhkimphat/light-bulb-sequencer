import React from "react";

interface LightBulbProps {
  id: string;
  label: string;
  color: string;
  active: boolean;
}

export function LightBulb({ id, label, color, active }: LightBulbProps) {
  return (
    <div
      className="flex flex-col items-center gap-3"
      data-testid={`bulb-${id}`}
    >
      <div
        className={`relative w-[100px] h-[100px] rounded-full flex items-center justify-center cursor-default transition-all duration-250 ease ${
          active
            ? "active bg-[var(--bulb-color)] border-[var(--bulb-color)] [box-shadow:0_0_20px_4px_var(--bulb-glow),0_0_50px_12px_var(--bulb-glow),inset_0_2px_8px_rgba(255,255,255,0.3)] scale-[1.08] animate-pulse-custom"
            : "bg-[color-mix(in_srgb,var(--bulb-color)_25%,#1a1a2e)] border-[3px] border-[color-mix(in_srgb,var(--bulb-color)_40%,transparent)]"
        }`}
        style={
          {
            "--bulb-color": color,
            "--bulb-glow": `${color}88`,
          } as React.CSSProperties
        }
        aria-label={`${label}${active ? " (active)" : ""}`}
        role="img"
      >
        <svg
          className={`w-11 h-11 transition-all duration-250 ${
            active
              ? "text-[rgba(255,255,255,0.95)] [filter:drop-shadow(0_0_4px_rgba(255,255,255,0.8))]"
              : "text-[color-mix(in_srgb,var(--bulb-color)_60%,#ffffff)] [filter:drop-shadow(0_0_2px_transparent)]"
          }`}
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <path
            d="M9 21h6M12 3a6 6 0 0 1 6 6c0 2.22-1.21 4.16-3 5.2V18H9v-3.8C7.21 13.16 6 11.22 6 9a6 6 0 0 1 6-6z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <span className="text-[0.8rem] font-semibold text-[#94a3b8] uppercase tracking-[0.05em]">
        {label}
      </span>
    </div>
  );
}
