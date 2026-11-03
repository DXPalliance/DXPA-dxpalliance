/**
 * Hardware-agnostic Web Audio utilities for Gemini Live API (gemini-3.8-live).
 * - Captures microphone audio at the device's native sample rate (48kHz, 44.1kHz, etc.)
 *   to prevent cross-sample-rate DOMExceptions on Firefox/Safari/iOS, then applies
 *   anti-aliased box-average downsampling to 16,000 Hz 16-bit little-endian PCM.
 * - Schedules 24,000 Hz 16-bit little-endian PCM output chunks gaplessly via DataView.
 */

const TARGET_INPUT_SAMPLE_RATE = 16000;
const MODEL_OUTPUT_SAMPLE_RATE = 24000;

export interface MicCaptureController {
  stop: () => void;
}

type AudioContextConstructor = typeof AudioContext;

function getAudioContextConstructor(): AudioContextConstructor {
  const win = window as Window & {
    webkitAudioContext?: AudioContextConstructor;
  };
  return window.AudioContext || win.webkitAudioContext!;
}

export function createPlaybackAudioContext(): AudioContext {
  const Ctx = getAudioContextConstructor();
  try {
    return new Ctx({ sampleRate: MODEL_OUTPUT_SAMPLE_RATE });
  } catch {
    // Fallback to native hardware rate; createBuffer(..., 24000) resamples automatically
    return new Ctx();
  }
}

export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

/**
 * Downsamples mono Float32 audio from `inputSampleRate` (e.g. 48000 or 44100 Hz)
 * to 16000 Hz 16-bit signed little-endian PCM encoded as base64.
 */
export function encodeFloat32ToPcm16kBase64(
  input: Float32Array,
  inputSampleRate: number
): string {
  if (input.length === 0) return "";

  const effectiveRate =
    inputSampleRate > 0 ? inputSampleRate : TARGET_INPUT_SAMPLE_RATE;

  if (effectiveRate === TARGET_INPUT_SAMPLE_RATE) {
    const buffer = new ArrayBuffer(input.length * 2);
    const view = new DataView(buffer);
    for (let i = 0; i < input.length; i++) {
      const clamped = Math.max(-1, Math.min(1, input[i]));
      const sample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
      view.setInt16(i * 2, Math.round(sample), true);
    }
    return arrayBufferToBase64(buffer);
  }

  const sampleRateRatio = effectiveRate / TARGET_INPUT_SAMPLE_RATE;
  const outputLength = Math.max(1, Math.round(input.length / sampleRateRatio));
  const buffer = new ArrayBuffer(outputLength * 2);
  const view = new DataView(buffer);

  let offsetResult = 0;
  let offsetBuffer = 0;

  while (offsetResult < outputLength) {
    const nextOffsetBuffer = Math.min(
      input.length,
      Math.round((offsetResult + 1) * sampleRateRatio)
    );
    let accum = 0;
    let count = 0;

    for (let i = offsetBuffer; i < nextOffsetBuffer; i++) {
      accum += input[i];
      count++;
    }

    const avg =
      count > 0
        ? accum / count
        : input[Math.min(offsetBuffer, input.length - 1)] || 0;
    const clamped = Math.max(-1, Math.min(1, avg));
    const sample = clamped < 0 ? clamped * 0x8000 : clamped * 0x7fff;
    view.setInt16(offsetResult * 2, Math.round(sample), true);

    offsetResult++;
    offsetBuffer = nextOffsetBuffer;
  }

  return arrayBufferToBase64(buffer);
}

/**
 * Starts capturing microphone audio from an existing MediaStream at native hardware
 * sample rate and emits 16kHz 16-bit PCM base64 frames via `onPcm16kBase64`.
 */
export function startNativeMicToPcm16k(
  stream: MediaStream,
  onPcm16kBase64: (base64Pcm: string) => void
): MicCaptureController {
  const Ctx = getAudioContextConstructor();
  const captureCtx = new Ctx();
  if (captureCtx.state === "suspended") {
    captureCtx.resume().catch(() => {});
  }

  const source = captureCtx.createMediaStreamSource(stream);
  const processor = captureCtx.createScriptProcessor(4096, 1, 1);
  // Zero-gain sink keeps ScriptProcessorNode scheduling active with zero speaker bleed
  const silentSink = captureCtx.createGain();
  silentSink.gain.value = 0;

  processor.onaudioprocess = (audioEvent: AudioProcessingEvent) => {
    const inputData = audioEvent.inputBuffer.getChannelData(0);
    const rate =
      audioEvent.inputBuffer.sampleRate ||
      captureCtx.sampleRate ||
      TARGET_INPUT_SAMPLE_RATE;
    const b64 = encodeFloat32ToPcm16kBase64(inputData, rate);
    if (b64) {
      onPcm16kBase64(b64);
    }
  };

  source.connect(processor);
  processor.connect(silentSink);
  silentSink.connect(captureCtx.destination);

  let stopped = false;
  return {
    stop: () => {
      if (stopped) return;
      stopped = true;
      processor.onaudioprocess = null;
      try {
        source.disconnect();
      } catch {
        // Ignore already disconnected node
      }
      try {
        processor.disconnect();
      } catch {
        // Ignore already disconnected node
      }
      try {
        silentSink.disconnect();
      } catch {
        // Ignore already disconnected node
      }
      captureCtx.close().catch(() => {});
    },
  };
}

/**
 * Decodes a 24kHz 16-bit little-endian PCM base64 chunk safely (handling odd byte
 * lengths and endianness via DataView) and schedules gapless playback.
 */
export function enqueuePcm24kPlaybackChunk(
  ctx: AudioContext,
  base64Pcm: string,
  nextStartTimeRef: { current: number },
  activeSourcesRef: { current: AudioBufferSourceNode[] }
): void {
  if (!base64Pcm) return;
  if (ctx.state === "suspended") {
    ctx.resume().catch(() => {});
  }

  const binary = atob(base64Pcm);
  const sampleCount = Math.floor(binary.length / 2);
  if (sampleCount <= 0) return;

  const bytes = new Uint8Array(sampleCount * 2);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
  const float32 = new Float32Array(sampleCount);
  for (let i = 0; i < sampleCount; i++) {
    float32[i] = view.getInt16(i * 2, true) / 32768;
  }

  const audioBuffer = ctx.createBuffer(1, sampleCount, MODEL_OUTPUT_SAMPLE_RATE);
  audioBuffer.getChannelData(0).set(float32);

  const source = ctx.createBufferSource();
  source.buffer = audioBuffer;
  source.connect(ctx.destination);

  const startTime = Math.max(ctx.currentTime, nextStartTimeRef.current);
  source.start(startTime);
  nextStartTimeRef.current = startTime + audioBuffer.duration;
  activeSourcesRef.current.push(source);

  source.onended = () => {
    activeSourcesRef.current = activeSourcesRef.current.filter(
      (s) => s !== source
    );
  };
}

export function clearActivePlaybackSources(
  nextStartTimeRef: { current: number },
  activeSourcesRef: { current: AudioBufferSourceNode[] }
): void {
  for (const src of activeSourcesRef.current) {
    try {
      src.stop();
    } catch {
      // Source already finished
    }
  }
  activeSourcesRef.current = [];
  nextStartTimeRef.current = 0;
}
