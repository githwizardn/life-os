// ============================================
// SEASON LOGIC
// ============================================

import { getSeasonByNum, type Season, type SeasonRequirement } from '../data/seasons'
import type { UserShadow } from './shadows'
import type { UserDungeon } from './dungeons'

export type UserSeason = {
  id: string
  season_num: number
  started_at: string
  ended_at: string | null
  boss_defeated: boolean
  boss_defeated_at: string | null
  status: 'active' | 'completed'
}

export type BossRequirementStatus = {
  req: SeasonRequirement
  current: number
  target: number
  met: boolean
}

export function getDaysElapsed(startedAt: string): number {
  const start = new Date(startedAt).getTime()
  const now = Date.now()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24))
}

export function getDaysRemaining(startedAt: string, durationDays: number): number {
  const elapsed = getDaysElapsed(startedAt)
  return Math.max(0, durationDays - elapsed)
}

export function getSeasonProgress(startedAt: string, durationDays: number): number {
  const elapsed = getDaysElapsed(startedAt)
  return Math.min(100, Math.round((elapsed / durationDays) * 100))
}

// ============================================
// CHECK BOSS REQUIREMENTS
// ============================================

export function evaluateBossRequirements(
  season: Season,
  categoryXP: Record<string, number>,
  shadows: UserShadow[],
  dungeons: UserDungeon[]
): BossRequirementStatus[] {
  return season.requirements.map(req => {
    if (req.type === 'category_xp') {
      const current = categoryXP[req.target] || 0
      const target = req.amount ?? 0
      return { req, current, target, met: current >= target }
    }
    if (req.type === 'shadow') {
      const has = shadows.some(s => s.shadow_id === req.target)
      return { req, current: has ? 1 : 0, target: 1, met: has }
    }
    if (req.type === 'dungeon') {
      const done = dungeons.some(d => d.dungeon_id === req.target && d.status === 'completed')
      return { req, current: done ? 1 : 0, target: 1, met: done }
    }
    return { req, current: 0, target: 1, met: false }
  })
}

export function isBossDefeated(reqs: BossRequirementStatus[]): boolean {
  return reqs.length > 0 && reqs.every(r => r.met)
}

export function getSeasonByNumber(num: number): Season {
  return getSeasonByNum(num)
}