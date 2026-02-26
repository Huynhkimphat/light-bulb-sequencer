let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    audioCtx = new AudioContext();
  }
  return audioCtx;
}

/**
 * Plays a sine-wave tone at the given frequency for a given duration.
 * Safe to call in rapid succession; each call gets its own oscillator node.
 *
 * @param frequencyHz  Pitch of the tone (Hz)
 * @param durationMs   How long to play (ms). Should be ≤ stepDurationMs.
 */
export function playTone(frequencyHz: number, durationMs: number): void {
  try {
    const ctx = getAudioContext();

    if (ctx.state === "suspended") {
      ctx.resume();
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(frequencyHz, ctx.currentTime);

    // Soft attack & release to avoid clicking artefacts
    const attackTime = 0.01;
    const releaseTime = 0.05;
    const durationSec = durationMs / 1000;

    gain.gain.setValueAtTime(0, ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, ctx.currentTime + attackTime);
    gain.gain.setValueAtTime(0.4, ctx.currentTime + durationSec - releaseTime);
    gain.gain.linearRampToValueAtTime(0, ctx.currentTime + durationSec);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + durationSec);
  } catch {
    // Audio not available (e.g. test environment) — fail silently
  }
}
