// ============================================
// HONOR SYSTEM — All math in one place
// ============================================

export const HONOR_CONFIG = {
  START: 50,
  CAP: 100,
  FLOOR: 0,
  PER_TASK: 1,
  PER_CATEGORY_BONUS: 2,
  PER_DECLINE: -3,
  SKIP_DAY_PENALTY: -5,
  WEEKLY_DECAY_RATE: 0.2,   // 20% drift toward 50
  DRIFT_TARGET: 50,
  DECAY_INTERVAL_DAYS: 7,
}

// ============================================
// APPLY A SINGLE ACTION
// ============================================

export function applyHonorAction(
  current: number,
  action: 'task' | 'decline' | 'category_complete' | 'skip_day',
  multiplier: number = 1
): number {
  let delta = 0

  switch (action) {
    case 'task':
      delta = HONOR_CONFIG.PER_TASK * multiplier
      break
    case 'decline':
      delta = HONOR_CONFIG.PER_DECLINE * multiplier
      break
    case 'category_complete':
      delta = HONOR_CONFIG.PER_CATEGORY_BONUS * multiplier
      break
    case 'skip_day':
      delta = HONOR_CONFIG.SKIP_DAY_PENALTY * multiplier
      break
  }

  const next = current + delta
  return clampHonor(next)
}

// ============================================
// WEEKLY DECAY
// Formula: newHonor = honor + (50 - honor) * 0.2
// If you're at 100 → drops to 90
// If you're at 50  → stays at 50
// If you're at 30  → rises to 34
// ============================================

export function applyWeeklyDecay(current: number): number {
  const drift = (HONOR_CONFIG.DRIFT_TARGET - current) * HONOR_CONFIG.WEEKLY_DECAY_RATE
  const next = current + drift
  return clampHonor(next)
}

// ============================================
// CHECK IF DECAY SHOULD APPLY
// ============================================

export function shouldApplyDecay(lastDecayAt: string | null): boolean {
  if (!lastDecayAt) return false
  const last = new Date(lastDecayAt).getTime()
  const now = Date.now()
  const daysSince = (now - last) / (1000 * 60 * 60 * 24)
  return daysSince >= HONOR_CONFIG.DECAY_INTERVAL_DAYS
}

// ============================================
// HELPERS
// ============================================

export function clampHonor(value: number): number {
  if (value > HONOR_CONFIG.CAP) return HONOR_CONFIG.CAP
  if (value < HONOR_CONFIG.FLOOR) return HONOR_CONFIG.FLOOR
  return Math.round(value)
}

export function getHonorStatus(honor: number): {
  label: string
  color: string
} {
  if (honor >= 90) return { label: 'TRUSTED', color: 'var(--accent)' }
  if (honor >= 75) return { label: 'NOMINAL', color: 'var(--text)' }
  if (honor >= 50) return { label: 'CONCERNED', color: 'var(--gold)' }
  if (honor >= 25) return { label: 'DISAPPOINTED', color: 'var(--accent3)' }
  return { label: 'BROKEN', color: 'var(--danger)' }
}