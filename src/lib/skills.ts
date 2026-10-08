// ============================================
// SKILL LOGIC
// ============================================

import { ALL_SKILL_NODES, type SkillNode } from '../data/skillTrees'

export type SkillProgress = {
  node_id: string
  status: 'locked' | 'available' | 'mastered'
  mastered_at: string | null
}

export type CategoryXP = Record<string, number>

export function canUnlock(
  node: SkillNode,
  categoryXP: CategoryXP,
  honor: number,
  progress: SkillProgress[]
): { can: boolean; reason?: string } {
  const thisProgress = progress.find(p => p.node_id === node.id)
  if (thisProgress?.status === 'mastered') {
    return { can: false, reason: 'Already mastered' }
  }

  if (node.parent_id) {
    const parentProgress = progress.find(p => p.node_id === node.parent_id)
    if (!parentProgress || parentProgress.status !== 'mastered') {
      return { can: false, reason: 'Prerequisite not mastered' }
    }
  }

  const currentXP = categoryXP[node.path] || 0
  if (currentXP < node.requirement.category_xp) {
    return {
      can: false,
      reason: `Need ${node.requirement.category_xp - currentXP} more ${node.path} XP`,
    }
  }

  if (honor < node.requirement.honor) {
    return { can: false, reason: `Need HONOR ≥ ${node.requirement.honor}` }
  }

  return { can: true }
}

export function getCategoryXPBonus(
  category: string,
  progress: SkillProgress[]
): number {
  const masteredIds = new Set(
    progress.filter(p => p.status === 'mastered').map(p => p.node_id)
  )

  let bonus = 0
  for (const node of ALL_SKILL_NODES) {
    if (masteredIds.has(node.id) && node.passive.category === category) {
      bonus += node.passive.percent
    }
  }
  return bonus
}

export function applyXPBonus(
  baseXP: number,
  category: string,
  progress: SkillProgress[]
): number {
  const bonusPercent = getCategoryXPBonus(category, progress)
  const multiplier = 1 + bonusPercent / 100
  return Math.round(baseXP * multiplier)
}