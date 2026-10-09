// ============================================
// BODY & MIND — TYPES + HELPERS
// ============================================

export type SleepLog = {
  id: string
  user_id: string
  date: string
  bedtime: string
  wake_time: string
  hours: number
  quality: number
  notes: string
  created_at: string
  updated_at: string
}

export type Workout = {
  id: string
  user_id: string
  date: string
  exercise: string
  sets: number
  reps: number
  weight: number
  unit: string
  notes: string
  created_at: string
}

export type Measurement = {
  id: string
  user_id: string
  date: string
  weight: number | null
  waist: number | null
  chest: number | null
  arms: number | null
  notes: string
  created_at: string
}

export type ReadingLog = {
  id: string
  user_id: string
  title: string
  author: string
  type: string
  status: string
  rating: number
  takeaways: string
  started_at: string | null
  finished_at: string | null
  created_at: string
  updated_at: string
}

export type FinanceLog = {
  id: string
  user_id: string
  date: string
  type: string
  amount: number
  category: string
  notes: string
  created_at: string
}

// ============================================
// HELPERS
// ============================================

export function todayISO(): string {
  return new Date().toISOString().slice(0, 10)
}

export function fmtDate(iso: string): string {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

export function computeHours(bedtime: string, wakeTime: string): number {
  if (!bedtime || !wakeTime) return 0
  const [bh, bm] = bedtime.split(':').map(Number)
  const [wh, wm] = wakeTime.split(':').map(Number)
  if ([bh, bm, wh, wm].some(isNaN)) return 0
  let mins = (wh * 60 + wm) - (bh * 60 + bm)
  if (mins < 0) mins += 24 * 60
  return Math.round((mins / 60) * 100) / 100
}

export const READING_TYPES = [
  { id: 'book', label: 'Book' },
  { id: 'course', label: 'Course' },
  { id: 'article', label: 'Article' },
  { id: 'paper', label: 'Paper' },
  { id: 'other', label: 'Other' },
]

export const READING_STATUS = [
  { id: 'reading', label: 'Reading' },
  { id: 'finished', label: 'Finished' },
  { id: 'abandoned', label: 'Abandoned' },
]

export const FINANCE_TYPES = [
  { id: 'income', label: 'Income', color: '#00ffaa' },
  { id: 'expense', label: 'Expense', color: '#ff3366' },
  { id: 'net_worth', label: 'Net Worth', color: '#ffd700' },
]

export function getQualityColor(q: number): string {
  if (q <= 2) return '#ff3366'
  if (q === 3) return '#ffd700'
  return '#00ffaa'
}

export function getLast7Sleep(logs: SleepLog[]): SleepLog[] {
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  return sorted.slice(0, 7).reverse()
}

export function getLastEntry<T extends { date: string }>(items: T[]): T | null {
  if (items.length === 0) return null
  return [...items].sort((a, b) => b.date.localeCompare(a.date))[0]
}

export function getPreviousEntry<T extends { date: string }>(items: T[]): T | null {
  if (items.length < 2) return null
  const sorted = [...items].sort((a, b) => b.date.localeCompare(a.date))
  return sorted[1]
}