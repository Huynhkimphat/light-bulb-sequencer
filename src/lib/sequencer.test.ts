import { describe, it, expect } from "vitest";
import {
  createDefaultConfig,
  getOrderedBulbIds,
  getNextStep,
} from "./sequencer";

describe("createDefaultConfig", () => {
  it("returns config with 3 bulbs", () => {
    const config = createDefaultConfig();
    expect(config.bulbs).toHaveLength(3);
  });

  it("defaults to 1 repetition", () => {
    expect(createDefaultConfig().repetitions).toBe(1);
  });

  it("defaults to ltr direction", () => {
    expect(createDefaultConfig().direction).toBe("ltr");
  });

  it("each bulb has a unique id", () => {
    const { bulbs } = createDefaultConfig();
    const ids = bulbs.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("each bulb has a positive soundFrequency", () => {
    const { bulbs } = createDefaultConfig();
    bulbs.forEach((b) => expect(b.soundFrequency).toBeGreaterThan(0));
  });
});

describe("getOrderedBulbIds", () => {
  const config = createDefaultConfig();
  const ltrIds = config.bulbs.map((b) => b.id);

  it("returns ids in ltr order when direction is ltr", () => {
    expect(getOrderedBulbIds({ ...config, direction: "ltr" })).toEqual(ltrIds);
  });

  it("returns ids in reverse order when direction is rtl", () => {
    expect(getOrderedBulbIds({ ...config, direction: "rtl" })).toEqual(
      [...ltrIds].reverse(),
    );
  });

  it("does not mutate the original bulbs array", () => {
    const original = config.bulbs.map((b) => b.id);
    getOrderedBulbIds({ ...config, direction: "rtl" });
    expect(config.bulbs.map((b) => b.id)).toEqual(original);
  });
});

describe("getNextStep", () => {
  describe("within a single repetition", () => {
    it("advances to the next bulb within a rep", () => {
      const result = getNextStep(0, 3, 1, 1);
      expect(result).toEqual({ nextIndex: 1, nextRep: 1, done: false });
    });

    it("advances from index 1 to 2", () => {
      const result = getNextStep(1, 3, 1, 1);
      expect(result).toEqual({ nextIndex: 2, nextRep: 1, done: false });
    });
  });

  describe("end of a repetition", () => {
    it("wraps to index 0 on the next rep when there are more reps", () => {
      const result = getNextStep(2, 3, 1, 3);
      expect(result).toEqual({ nextIndex: 0, nextRep: 2, done: false });
    });

    it("marks done=true when it is the last bulb of the last rep", () => {
      const result = getNextStep(2, 3, 1, 1);
      expect(result.done).toBe(true);
    });

    it("marks done=true at end of the final rep in multi-rep sequences", () => {
      const result = getNextStep(2, 3, 3, 3);
      expect(result.done).toBe(true);
    });

    it("returns nextIndex -1 when done", () => {
      const result = getNextStep(2, 3, 1, 1);
      expect(result.nextIndex).toBe(-1);
    });
  });

  describe("multi-rep sequencing", () => {
    it("correctly sequences all steps across 2 reps of 3 bulbs", () => {
      let idx = 0;
      let rep = 1;
      const visited: Array<{ idx: number; rep: number }> = [{ idx, rep }];

      for (let i = 0; i < 5; i++) {
        const result = getNextStep(idx, 3, rep, 2);
        if (result.done) break;
        idx = result.nextIndex;
        rep = result.nextRep;
        visited.push({ idx, rep });
      }

      expect(visited).toEqual([
        { idx: 0, rep: 1 },
        { idx: 1, rep: 1 },
        { idx: 2, rep: 1 },
        { idx: 0, rep: 2 },
        { idx: 1, rep: 2 },
        { idx: 2, rep: 2 },
      ]);
    });
  });
});
