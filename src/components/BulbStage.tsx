import { LightBulb } from "./LightBulb";
import type { BulbConfig } from "@/types";

interface BulbStageProps {
  bulbs: BulbConfig[];
  orderedBulbIds: string[];
  activeBulbIndex: number;
}

export function BulbStage({
  bulbs,
  orderedBulbIds,
  activeBulbIndex,
}: BulbStageProps) {
  const bulbMap = new Map(bulbs.map((b) => [b.id, b]));

  return (
    <div
      className="flex flex-row items-center justify-center gap-12 py-10 px-0 max-[480px]:gap-6"
      data-testid="bulb-stage"
    >
      {orderedBulbIds.map((id, idx) => {
        const bulb = bulbMap.get(id);
        if (!bulb) return null;
        return (
          <LightBulb
            key={id}
            id={id}
            label={bulb.label}
            color={bulb.color}
            active={idx === activeBulbIndex}
          />
        );
      })}
    </div>
  );
}
