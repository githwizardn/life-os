// ============================================
// DECISION JOURNAL LOGIC
// ============================================

export type Decision = {
  id: string
  user_id: string
  title: string
  context: string
  options: string
  chosen: string
  reasoning: string
  emotion: string
  expected_outcome: string
  confidence: number
  outcome_1w: string
  outcome_1m: string
  outcome_1y: string
  status: 'active' | 'resolved'
  created_at: string
  updated_at: string
}

export const EMOTIONS = [
  { id: 'scared', label: 'Scared', icon: '😨' },
  { id: 'excited', label: 'Excited', icon: '🤩' },
  { id: 'numb', label: 'Numb', icon: '😐' },
  { id: 'pressured', label: 'Pressured', icon: '😰' },
  { id: 'hopeful', label: 'Hopeful', icon: '🙂' },
  { id: 'resigned', label: 'Resigned', icon: '😔' },
]

export function getEmotionInfo(id: string) {
  return EMOTIONS.find(e => e.id === id) || null
}

export function getDaysSince(decision: Decision): number {
  const then = new Date(decision.created_at).getTime()
  return Math.floor((Date.now() - then) / (1000 * 60 * 60 * 24))
}

export type ReviewSlot = {
  key: 'outcome_1w' | 'outcome_1m' | 'outcome_1y'
  label: string
  minDays: number
  dueIn: number
  available: boolean
  filled: boolean
}

export function getReviews(decision: Decision): ReviewSlot[] {
  const days = getDaysSince(decision)
  return [
    {
      key: 'outcome_1w',
      label: '1 week',
      minDays: 7,
      dueIn: 7 - days,
      available: days >= 7,
      filled: decision.outcome_1w.trim().length > 0,
    },
    {
      key: 'outcome_1m',
      label: '1 month',
      minDays: 30,
      dueIn: 30 - days,
      available: days >= 30,
      filled: decision.outcome_1m.trim().length > 0,
    },
    {
      key: 'outcome_1y',
      label: '1 year',
      minDays: 365,
      dueIn: 365 - days,
      available: days >= 365,
      filled: decision.outcome_1y.trim().length > 0,
    },
  ]
}

export function getNextDueReview(decision: Decision): ReviewSlot | null {
  if (decision.status === 'resolved') return null
  const reviews = getReviews(decision)
  const availableUnfilled = reviews.find(r => r.available && !r.filled)
  if (availableUnfilled) return availableUnfilled
  return reviews.find(r => !r.filled) || null
}

export function isReviewOverdue(decision: Decision): boolean {
  if (decision.status === 'resolved') return false
  const reviews = getReviews(decision)
  return reviews.some(r => r.available && !r.filled)
}

export function isDecisionResolved(decision: Decision): boolean {
  return (
    decision.outcome_1w.trim().length > 0 &&
    decision.outcome_1m.trim().length > 0 &&
    decision.outcome_1y.trim().length > 0
  )
}