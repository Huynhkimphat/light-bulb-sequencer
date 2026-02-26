import type { SequencerConfig, BulbConfig } from "@/types";

function isString(v: unknown): v is string {
  return typeof v === "string";
}

function isNumber(v: unknown): v is number {
  return typeof v === "number" && isFinite(v);
}

function validateBulb(b: unknown, index: number): BulbConfig {
  if (!b || typeof b !== "object") {
    throw new Error(`Bulb at index ${index} is not an object`);
  }
  const obj = b as Record<string, unknown>;
  if (!isString(obj.id)) throw new Error(`Bulb[${index}].id must be a string`);
  if (!isString(obj.label))
    throw new Error(`Bulb[${index}].label must be a string`);
  if (!isString(obj.color))
    throw new Error(`Bulb[${index}].color must be a string`);
  if (!isNumber(obj.soundFrequency))
    throw new Error(`Bulb[${index}].soundFrequency must be a number`);
  return {
    id: obj.id,
    label: obj.label,
    color: obj.color,
    soundFrequency: obj.soundFrequency,
  };
}

function validateConfig(raw: unknown): SequencerConfig {
  if (!raw || typeof raw !== "object")
    throw new Error("Config must be an object");
  const obj = raw as Record<string, unknown>;

  if (!Array.isArray(obj.bulbs) || obj.bulbs.length === 0) {
    throw new Error("Config must have a non-empty bulbs array");
  }
  const bulbs: BulbConfig[] = obj.bulbs.map(validateBulb);

  if (!isNumber(obj.repetitions) || (obj.repetitions as number) < 1) {
    throw new Error("Config.repetitions must be a positive number");
  }
  if (obj.direction !== "ltr" && obj.direction !== "rtl") {
    throw new Error('Config.direction must be "ltr" or "rtl"');
  }
  if (!isNumber(obj.stepDurationMs) || (obj.stepDurationMs as number) < 0) {
    throw new Error("Config.stepDurationMs must be a non-negative number");
  }

  return {
    bulbs,
    repetitions: obj.repetitions as number,
    direction: obj.direction,
    stepDurationMs: obj.stepDurationMs as number,
  };
}

export function exportConfig(config: SequencerConfig): string {
  return JSON.stringify(config, null, 2);
}

export function importConfig(json: string): SequencerConfig {
  let parsed: unknown;
  try {
    parsed = JSON.parse(json);
  } catch {
    throw new Error("Invalid JSON: could not parse the configuration file");
  }
  return validateConfig(parsed);
}

export function downloadConfigFile(config: SequencerConfig): void {
  const json = exportConfig(config);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "bulb-sequence-config.json";
  a.click();
  URL.revokeObjectURL(url);
}

export function readConfigFile(file: File): Promise<SequencerConfig> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result;
        if (typeof text !== "string") throw new Error("Could not read file");
        resolve(importConfig(text));
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error("File read error"));
    reader.readAsText(file);
  });
}
