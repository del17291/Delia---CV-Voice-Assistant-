// Audio helper utilities for Gemini Live (16kHz in, 24kHz out) and Gemini TTS WAV playback

export class AudioStreamPlayer {
  private audioCtx: AudioContext | null = null;
  private nextPlayTime: number = 0;
  private isMuted: boolean = false;
  private activeSourceNodes: AudioBufferSourceNode[] = [];
  private onPlaybackEndCallback?: () => void;

  constructor() {
    // Lazy init on first user gesture
  }

  public setOnPlaybackEnd(cb: () => void) {
    this.onPlaybackEndCallback = cb;
  }

  public isPlaying(): boolean {
    if (!this.audioCtx) return false;
    return this.activeSourceNodes.length > 0 || this.audioCtx.currentTime < this.nextPlayTime - 0.05;
  }

  public init() {
    if (!this.audioCtx) {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioContextClass({ sampleRate: 24000 });
      this.nextPlayTime = this.audioCtx.currentTime;
    } else if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
  }

  public playChunkBase64(base64Pcm: string) {
    if (this.isMuted) return;
    this.init();
    if (!this.audioCtx) return;

    try {
      const binaryString = atob(base64Pcm);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }

      // Convert 16-bit PCM little-endian to Float32
      const int16Array = new Int16Array(bytes.buffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768.0;
      }

      const audioBuffer = this.audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.copyToChannel(float32Array, 0);

      const source = this.audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(this.audioCtx.destination);

      const currentTime = this.audioCtx.currentTime;
      if (this.nextPlayTime < currentTime) {
        this.nextPlayTime = currentTime;
      }

      source.start(this.nextPlayTime);
      this.nextPlayTime += audioBuffer.duration;

      this.activeSourceNodes.push(source);
      source.onended = () => {
        const idx = this.activeSourceNodes.indexOf(source);
        if (idx !== -1) {
          this.activeSourceNodes.splice(idx, 1);
        }
        if (this.activeSourceNodes.length === 0 && (!this.audioCtx || this.audioCtx.currentTime >= this.nextPlayTime - 0.1)) {
          this.onPlaybackEndCallback?.();
        }
      };
    } catch (e) {
      console.error('Error playing raw PCM chunk:', e);
    }
  }

  public stopAll() {
    for (const source of this.activeSourceNodes) {
      try {
        source.stop();
        source.disconnect();
      } catch (e) {
        // already stopped
      }
    }
    this.activeSourceNodes = [];
    if (this.audioCtx) {
      this.nextPlayTime = this.audioCtx.currentTime;
    }
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
    if (muted) {
      this.stopAll();
    }
  }

  public getContext(): AudioContext | null {
    return this.audioCtx;
  }
}

// Convert Float32 array to 16-bit PCM base64 for Live API input (16kHz)
export function float32ToPcm16Base64(inputData: Float32Array): string {
  const pcm16 = new Int16Array(inputData.length);
  for (let i = 0; i < inputData.length; i++) {
    const s = Math.max(-1, Math.min(1, inputData[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }

  let binary = '';
  const bytes = new Uint8Array(pcm16.buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Play a full WAV base64 string
export function playWavBase64(base64Wav: string, onEnded?: () => void): HTMLAudioElement {
  const audio = new Audio(`data:audio/wav;base64,${base64Wav}`);
  if (onEnded) {
    audio.onended = onEnded;
  }
  audio.play().catch((err) => {
    console.warn('Autoplay prevented or failed:', err);
  });
  return audio;
}
