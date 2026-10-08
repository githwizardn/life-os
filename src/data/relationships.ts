// ============================================
// RELATIONSHIP TIERS + EMOJI OPTIONS
// ============================================

export type Tier = 'inner' | 'close' | 'family' | 'friend' | 'pro' | 'ext'

export type TierInfo = {
  id: Tier
  label: string
  icon: string
  color: string
  softCap: number | null
  defaultFreq: number
}

export const TIERS: TierInfo[] = [
  { id: 'inner', label: 'Inner Circle', icon: '❤️', color: '#ff4d4d', softCap: 5, defaultFreq: 7 },
  { id: 'close', label: 'Close', icon: '💛', color: '#facc15', softCap: 15, defaultFreq: 14 },
  { id: 'family', label: 'Family', icon: '🏠', color: '#00ffaa', softCap: null, defaultFreq: 14 },
  { id: 'friend', label: 'Friends', icon: '🤝', color: '#22d3ee', softCap: null, defaultFreq: 30 },
  { id: 'pro', label: 'Professional', icon: '💼', color: '#a855f7', softCap: null, defaultFreq: 60 },
  { id: 'ext', label: 'Extended', icon: '👤', color: '#7878a8', softCap: null, defaultFreq: 90 },
]

export function getTierInfo(id: string): TierInfo {
  return TIERS.find(t => t.id === id) || TIERS[TIERS.length - 1]
}

// Suggested emoji for a person
export const PERSON_EMOJIS = [
  '👤', '👨', '👩', '🧑', '👴', '👵', '🧔', '👱', '👨‍🦰', '👩‍🦰',
  '🧑‍🎤', '🧑‍💻', '🧑‍🍳', '🧑‍🎨', '🧑‍🚀', '🧙', '🧝', '🥷', '🤴', '👸',
  '🦸', '🧛', '🕵️', '💂', '👷', '🧑‍🏫', '🧑‍⚕️', '🧑‍⚖️', '🧑‍🔬', '🧑‍🌾',
]