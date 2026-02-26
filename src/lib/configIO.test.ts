import { describe, it, expect } from "vitest";
import { exportConfig, importConfig } from "./configIO";
import { createDefaultConfig } from "./sequencer";
import type { SequencerConfig } from "@/types";

const validConfig: SequencerConfig = createDefaultConfig();

describe("exportConfig", () => {
  it("returns a string", () => {
    expect(typeof exportConfig(validConfig)).toBe("string");
  });

  it("produces valid JSON", () => {
    expect(() => JSON.parse(exportConfig(validConfig))).not.toThrow();
  });

  it("preserves all top-level fields", () => {
    const parsed = JSON.parse(exportConfig(validConfig));
    expect(parsed).toHaveProperty("bulbs");
    expect(parsed).toHaveProperty("repetitions");
    expect(parsed).toHaveProperty("direction");
    expect(parsed).toHaveProperty("stepDurationMs");
  });
});

describe("importConfig", () => {
  describe("round-trip", () => {
    it("importConfig(exportConfig(config)) equals the original config", () => {
      const json = exportConfig(validConfig);
      const imported = importConfig(json);
      expect(imported).toEqual(validConfig);
    });

    it("preserves bulb colors", () => {
      const json = exportConfig(validConfig);
      const imported = importConfig(json);
      imported.bulbs.forEach((b, i) => {
        expect(b.color).toBe(validConfig.bulbs[i].color);
      });
    });

    it("preserves direction", () => {
      const rtlConfig: SequencerConfig = { ...validConfig, direction: "rtl" };
      const imported = importConfig(exportConfig(rtlConfig));
      expect(imported.direction).toBe("rtl");
    });
  });

  describe("invalid JSON", () => {
    it("throws on completely invalid JSON", () => {
      expect(() => importConfig("not json")).toThrow();
    });

    it("throws on empty string", () => {
      expect(() => importConfig("")).toThrow();
    });
  });

  describe("schema validation", () => {
    it("throws when bulbs array is missing", () => {
      const bad = JSON.stringify({
        repetitions: 1,
        direction: "ltr",
        stepDurationMs: 600,
      });
      expect(() => importConfig(bad)).toThrow(/bulbs/i);
    });

    it("throws when bulbs array is empty", () => {
      const bad = JSON.stringify({ ...validConfig, bulbs: [] });
      expect(() => importConfig(bad)).toThrow(/bulbs/i);
    });

    it("throws when repetitions is missing", () => {
      const { repetitions: _, ...rest } = validConfig;
      expect(() => importConfig(JSON.stringify(rest))).toThrow(/repetitions/i);
    });

    it("throws when direction is invalid", () => {
      const bad = JSON.stringify({ ...validConfig, direction: "up" });
      expect(() => importConfig(bad)).toThrow(/direction/i);
    });

    it("throws when stepDurationMs is missing", () => {
      const { stepDurationMs: _, ...rest } = validConfig;
      expect(() => importConfig(JSON.stringify(rest))).toThrow(
        /stepDurationMs/i,
      );
    });

    it("throws when a bulb is missing a required field", () => {
      const badBulbs = validConfig.bulbs.map(({ color: _, ...b }) => b);
      const bad = JSON.stringify({ ...validConfig, bulbs: badBulbs });
      expect(() => importConfig(bad)).toThrow(/color/i);
    });
  });
});
