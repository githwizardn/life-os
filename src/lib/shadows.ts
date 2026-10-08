// ============================================
// SHADOW LOGIC — Extraction, passive calculation
// ============================================

import {
  SHADOW_POOL,
  getShadowsForCategory,
  getMonarchShadow,
  BASE_SHADOW_IDS,
  type Shadow,
} from '../data/shadows'

export type UserShadow = {
  id: string
  shadow_id: string
  extracted_from: string
  extracted_at: string
}

// ============================================
// DETERMINE WHICH SHADOW A COMPLETED LEGENDARY EXTRACTS
// ============================================

export function determineShadowFromLegendary(
  category: string,
  ownedShadowIds: string[]
): Shadow | null {
  // All 7 base owned? Offer Monarch.
  const allBaseOwned = BASE_SHADOW_IDS.every(id => ownedShadowIds.includes(id))
  if (allBaseOwned && !ownedShadowIds.includes('shadow_of_the_monarch')) {
    const monarch = getMonarchShadow()
    if (monarch) return monarch
  }

  // Otherwise: find an unowned shadow of this category
  const candidates = getShadowsForCategory(category).filter(
    s => !ownedShadowIds.includes(s.id)
  )
  if (candidates.length === 0) return null // Already own all shadows of this category

  // Pick the first one (deterministic)
  return candidates[0]
}

// ============================================
// TOTAL XP BONUS FROM ALL SHADOWS
// ============================================

export function getTotalXPBonus(
  category: string,
  ownedShadowIds: string[]
): number {
  let bonus = 0
  for (const id of ownedShadowIds) {
    const shadow = SHADOW_POOL.find(s => s.id === id)
    if (!shadow) continue
    const p = shadow.passive

    if (p.type === 'xp_bonus' && p.category === category) {
      bonus += p.percent ?? 0
    }
    if (p.type === 'all_xp_bonus') {
      bonus += p.percent ?? 0
    }
  }
  return bonus
}

// ============================================
// HONOR BONUS FROM SHADOWS
// ============================================

export function getHonorPerTaskBonus(ownedShadowIds: string[]): number {
  let bonus = 0
  for (const id of ownedShadowIds) {
    const shadow = SHADOW_POOL.find(s => s.id === id)
    if (!shadow) continue
    if (shadow.passive.type === 'honor_bonus') {
      bonus += shadow.passive.amount ?? 0
    }
  }
  return bonus
}

export function getMaxHonorBonus(ownedShadowIds: string[]): number {
  let bonus = 0
  for (const id of ownedShadowIds) {
    const shadow = SHADOW_POOL.find(s => s.id === id)
    if (!shadow) continue
    if (shadow.passive.type === 'max_honor') {
      bonus += shadow.passive.amount ?? 0
    }
  }
  return bonus
}