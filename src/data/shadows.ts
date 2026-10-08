// ============================================
// SHADOWS — Abilities extracted from hard work
// ============================================

export type Shadow = {
  id: string
  name: string
  icon: string
  category: string
  description: string
  passive: {
    type: 'xp_bonus' | 'honor_bonus' | 'max_honor' | 'all_xp_bonus'
    category?: string
    percent?: number
    amount?: number
    description: string
  }
}

export const SHADOW_POOL: Shadow[] = [
  // ── BODY ──
  {
    id: 'shadow_of_iron',
    name: 'Shadow of Iron',
    icon: '⚔️',
    category: 'body',
    description: 'Extracted from a Body Legendary. Your body remembers.',
    passive: {
      type: 'xp_bonus',
      category: 'body',
      percent: 15,
      description: '+15% Body XP',
    },
  },
  {
    id: 'shadow_of_hunger',
    name: 'Shadow of Hunger',
    icon: '🔥',
    category: 'body',
    description: 'You faced discomfort and did not flinch.',
    passive: {
      type: 'honor_bonus',
      amount: 1,
      description: '+1 HONOR per task',
    },
  },

  // ── MIND ──
  {
    id: 'shadow_of_discipline',
    name: 'Shadow of Discipline',
    icon: '🧠',
    category: 'mind',
    description: 'The mind is quiet when the will speaks.',
    passive: {
      type: 'all_xp_bonus',
      percent: 5,
      description: '+5% XP on all tasks',
    },
  },
  {
    id: 'shadow_of_truth',
    name: 'Shadow of Truth',
    icon: '👁️',
    category: 'mind',
    description: 'You looked inward and did not look away.',
    passive: {
      type: 'max_honor',
      amount: 5,
      description: 'Max HONOR +5',
    },
  },

  // ── MASTERY ──
  {
    id: 'shadow_of_fire',
    name: 'Shadow of Fire',
    icon: '🥷',
    category: 'mastery',
    description: 'Craft forged in silence and sweat.',
    passive: {
      type: 'xp_bonus',
      category: 'mastery',
      percent: 15,
      description: '+15% Mastery XP',
    },
  },

  // ── AUTONOMY ──
  {
    id: 'shadow_of_coin',
    name: 'Shadow of Coin',
    icon: '💰',
    category: 'autonomy',
    description: 'Money bends to those who count it.',
    passive: {
      type: 'xp_bonus',
      category: 'autonomy',
      percent: 15,
      description: '+15% Autonomy XP',
    },
  },

  // ── GROWTH ──
  {
    id: 'shadow_of_growth',
    name: 'Shadow of Growth',
    icon: '🌱',
    category: 'growth',
    description: 'Every day, a little more. Every year, unrecognizable.',
    passive: {
      type: 'xp_bonus',
      category: 'growth',
      percent: 15,
      description: '+15% Growth XP',
    },
  },

  // ── CONNECTION ──
  {
    id: 'shadow_of_presence',
    name: 'Shadow of Presence',
    icon: '🤝',
    category: 'connection',
    description: 'Being truly with someone is a skill.',
    passive: {
      type: 'xp_bonus',
      category: 'connection',
      percent: 15,
      description: '+15% Connection XP',
    },
  },

  // ── JOY ──
  {
    id: 'shadow_of_the_sun',
    name: 'Shadow of the Sun',
    icon: '☀️',
    category: 'joy',
    description: 'Joy was never a distraction. It was the point.',
    passive: {
      type: 'xp_bonus',
      category: 'joy',
      percent: 15,
      description: '+15% Joy XP',
    },
  },

  // ── RARE / SPECIAL ──
  {
    id: 'shadow_of_the_monarch',
    name: 'Shadow of the Monarch',
    icon: '👑',
    category: 'special',
    description: 'Extracted only when all 7 Legendaries fall. You are different now.',
    passive: {
      type: 'all_xp_bonus',
      percent: 25,
      description: '+25% XP on ALL tasks',
    },
  },
]

export function getShadowById(id: string): Shadow | undefined {
  return SHADOW_POOL.find(s => s.id === id)
}

// Given a category, which shadows could be extracted?
// Each legendary task extracts a shadow of that category (if not already owned)
export function getShadowsForCategory(category: string): Shadow[] {
  return SHADOW_POOL.filter(s => s.category === category)
}

export function getMonarchShadow(): Shadow | undefined {
  return SHADOW_POOL.find(s => s.id === 'shadow_of_the_monarch')
}

// The 7 base shadows
export const BASE_SHADOW_IDS = [
  'shadow_of_iron',
  'shadow_of_discipline',
  'shadow_of_fire',
  'shadow_of_coin',
  'shadow_of_growth',
  'shadow_of_presence',
  'shadow_of_the_sun',
]