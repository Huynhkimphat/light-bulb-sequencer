"use client";

import { useEffect, useMemo } from "react";
import { useSequencerStore } from "@/store/useSequencerStore";
import { BulbStage } from "@/components/BulbStage";
import { ControlPanel } from "@/components/ControlPanel";
import { BulbConfigPanel } from "@/components/BulbConfigPanel";
import { ImportExport } from "@/components/ImportExport";
import { getOrderedBulbIds } from "@/lib/sequencer";

export default function Home() {
  const config = useSequencerStore((state) => state.config);
  const playbackState = useSequencerStore((state) => state.playbackState);
  const activeBulbIndex = useSequencerStore((state) => state.activeBulbIndex);
  const currentRep = useSequencerStore((state) => state.currentRep);
  const play = useSequencerStore((state) => state.play);
  const stop = useSequencerStore((state) => state.stop);
  const updateConfig = useSequencerStore((state) => state.updateConfig);

  const isPlaying = playbackState === "playing";

  const orderedBulbIds = useMemo(() => getOrderedBulbIds(config), [config]);

  useEffect(() => {
    return () => {
      useSequencerStore.getState().stop();
    };
  }, []);

  return (
    <div className="min-h-svh flex flex-col bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,#1e1b4b_0%,#020817_65%)]">
      <header className="text-center pt-12 px-6 pb-0">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span
            className="text-[2rem] [filter:drop-shadow(0_0_12px_rgba(250,204,21,0.6))] animate-float"
            aria-hidden="true"
          >
            💡
          </span>
          <h1 className="text-[2rem] font-extrabold bg-clip-text text-transparent bg-gradient-to-br from-[#a5b4fc] via-[#818cf8] to-[#c084fc] m-0 tracking-tight">
            Light Bulb Sequencer
          </h1>
        </div>
        <p className="text-[#64748b] text-[0.95rem] m-0">
          Configure, play, and share animated light sequences
        </p>
      </header>

      <main className="flex-1 grid grid-cols-2 gap-6 py-8 px-10 pb-12 max-w-[1100px] mx-auto w-full max-[900px]:grid-cols-1 max-[900px]:py-5 max-[900px]:px-4 max-[900px]:pb-10 max-[900px]:gap-4">
        <section
          className="flex flex-col items-center justify-center bg-[#0f172a] border-[1.5px] border-[#1e293b] rounded-[20px] py-8 px-6 min-h-[300px] gap-4 max-[900px]:min-h-[240px]"
          aria-label="Bulb display"
        >
          <BulbStage
            bulbs={config.bulbs}
            orderedBulbIds={orderedBulbIds}
            activeBulbIndex={activeBulbIndex}
          />

          <div
            className="text-[0.82rem] font-semibold min-h-[28px]"
            aria-live="polite"
          >
            {isPlaying ? (
              <span className="flex items-center gap-[7px] text-[#a5b4fc]">
                <span
                  className="w-2 h-2 rounded-full bg-[#6366f1] animate-blink"
                  aria-hidden="true"
                />
                Playing — rep {currentRep}/{config.repetitions}
              </span>
            ) : (
              <span className="text-[#475569]">Ready</span>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <section
            className="bg-[#0f172a] border-[1.5px] border-[#1e293b] rounded-[16px] p-6 transition-[border-color] duration-250 ease hover:border-[#334155]"
            aria-label="Playback controls"
          >
            <ControlPanel
              config={config}
              playbackState={playbackState}
              onPlay={play}
              onStop={stop}
              onConfigChange={updateConfig}
            />
          </section>

          <section
            className="bg-[#0f172a] border-[1.5px] border-[#1e293b] rounded-[16px] p-6 transition-[border-color] duration-250 ease hover:border-[#334155]"
            aria-label="Bulb configuration"
          >
            <BulbConfigPanel
              config={config}
              disabled={isPlaying}
              onConfigChange={updateConfig}
            />
          </section>

          {/* ── Import / Export ── */}
          <section
            className="bg-[#0f172a] border-[1.5px] border-[#1e293b] rounded-[16px] p-6 transition-[border-color] duration-250 ease hover:border-[#334155]"
            aria-label="Import and export"
          >
            <ImportExport config={config} onImport={updateConfig} />
          </section>
        </div>
      </main>
    </div>
  );
}
