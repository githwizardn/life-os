// ============================================
// DUNGEON LOGIC
// ============================================

import { getDungeonById, type Dungeon } from '../data/dungeons'

export type UserDungeon = {
  id: string
  dungeon_id: string
  status: 'active' | 'completed' | 'failed'
  started_at: string
  completed_at: string | null
  failed_at: string | null
}

// How many seconds left?
export function getSecondsRemaining(active: UserDungeon): number {
  const dungeon = getDungeonById(active.dungeon_id)
  if (!dungeon) return 0
  const started = new Date(active.started_at).getTime()
  const totalMs = dungeon.duration_hours * 3600 * 1000
  const elapsed = Date.now() - started
  return Math.max(0, Math.floor((totalMs - elapsed) / 1000))
}

export function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}

export function isExpired(active: UserDungeon): boolean {
  return getSecondsRemaining(active) === 0
}

export function canEnterDungeon(
  dungeon: Dungeon,
  categoryXP: Record<string, number>,
  honor: number,
  activeDungeons: UserDungeon[]
): { can: boolean; reason?: string } {
  // Any active dungeon already?
  if (activeDungeons.length > 0) {
    return { can: false, reason: 'Another dungeon is already active' }
  }

  // Requirement check
  const catXP = categoryXP[dungeon.category] || 0
  if (catXP < dungeon.unlock.category_xp) {
    return {
      can: false,
      reason: `Need ${dungeon.unlock.category_xp - catXP} more ${dungeon.category} XP`,
    }
  }

  if (honor < dungeon.unlock.honor) {
    return { can: false, reason: `Need HONOR ≥ ${dungeon.unlock.honor}` }
  }

  return { can: true }
}