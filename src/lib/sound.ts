// ============================================
// SOUND — Web Audio chimes (no audio files)
// ============================================

let ctx: AudioContext | null = null
let muted = false

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
            const AC =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    return ctx
  } catch {
    return null
  }
}

function beep(
  freq: number,
  duration: number,
  type: OscillatorType = 'sine',
  volume = 0.08,
  delay = 0
) {
  if (muted) return
  const c = getCtx()
  if (!c) return
  const start = c.currentTime + delay
  const osc = c.createOscillator()
  const gain = c.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(volume, start)
  gain.gain.exponentialRampToValueAtTime(0.0001, start + duration)
  osc.connect(gain)
  gain.connect(c.destination)
  osc.start(start)
  osc.stop(start + duration)
}

export const sound = {
  setMuted(v: boolean) {
    muted = v
  },
  isMuted() {
    return muted
  },

  taskComplete() {
    beep(660, 0.08, 'sine', 0.06, 0)
    beep(880, 0.12, 'sine', 0.05, 0.06)
  },

  levelUp() {
    beep(523, 0.12, 'sine', 0.08, 0)
    beep(659, 0.12, 'sine', 0.08, 0.1)
    beep(784, 0.14, 'sine', 0.08, 0.2)
    beep(1047, 0.28, 'sine', 0.09, 0.32)
  },

  honorDrop() {
    beep(220, 0.22, 'sawtooth', 0.06, 0)
    beep(165, 0.28, 'sawtooth', 0.05, 0.08)
  },

  gateAppear() {
    beep(880, 0.1, 'square', 0.05, 0)
    beep(880, 0.1, 'square', 0.05, 0.14)
    beep(1100, 0.2, 'square', 0.06, 0.28)
  },

  notify() {
    beep(700, 0.09, 'sine', 0.05, 0)
    beep(950, 0.11, 'sine', 0.05, 0.08)
  },
}