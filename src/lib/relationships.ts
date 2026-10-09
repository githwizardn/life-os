// ============================================
// RELATIONSHIP LOGIC
// ============================================

export type Relationship = {
  id: string
  user_id: string
  name: string
  emoji: string
  tier: string
  birthday: string | null
  contact_freq_days: number
  last_contact_at: string | null
  notes: string
  gift_ideas: string
  key_facts: string
  their_people: string
  their_work: string
  their_struggles: string
  their_wins: string
  shared_history: string
  created_at: string
  updated_at: string
}

// ============================================
// DAYS SINCE LAST CONTACT
// ============================================

export function getDaysSinceContact(person: Relationship): number | null {
  if (!person.last_contact_at) return null
  const last = new Date(person.last_contact_at).getTime()
  const now = Date.now()
  return Math.floor((now - last) / (1000 * 60 * 60 * 24))
}

// ============================================
// IS A PERSON OVERDUE?
// ============================================

export function isOverdue(person: Relationship): boolean {
  const days = getDaysSinceContact(person)
  if (days === null) return true // Never contacted
  return days >= person.contact_freq_days
}

// ============================================
// DAYS UNTIL BIRTHDAY
// Accepts "MM-DD" (preferred) or "YYYY-MM-DD" (legacy).
// Returns null if invalid.
// ============================================

export function getDaysUntilBirthday(birthday: string | null): number | null {
  if (!birthday) return null

  let month: number
  let day: number

  const trimmed = birthday.trim()

  if (trimmed.length === 5 && trimmed[2] === '-') {
    // DD-MM (current format)
    day = parseInt(trimmed.slice(0, 2), 10)
    month = parseInt(trimmed.slice(3, 5), 10) - 1
  } else if (trimmed.length === 10) {
    // YYYY-MM-DD (legacy from old date input)
    const parts = trimmed.split('-')
    month = parseInt(parts[1], 10) - 1
    day = parseInt(parts[2], 10)
  } else {
    return null
  }

  if (isNaN(month) || isNaN(day)) return null
  if (month < 0 || month > 11) return null
  if (day < 1 || day > 31) return null

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const thisYear = new Date(now.getFullYear(), month, day)
  if (thisYear.getTime() < now.getTime()) {
    thisYear.setFullYear(thisYear.getFullYear() + 1)
  }
  const diff = thisYear.getTime() - now.getTime()
  return Math.round(diff / (1000 * 60 * 60 * 24))
}

// ============================================
// URGENCY SCORE — for sorting
// Overdue = higher. Close birthday = higher.
// ============================================

export function getUrgencyScore(person: Relationship): number {
  let score = 0

  if (isOverdue(person)) {
    const days = getDaysSinceContact(person)
    if (days === null) score += 100
    else score += Math.min(50, days - person.contact_freq_days + 10)
  }

  const bd = getDaysUntilBirthday(person.birthday)
  if (bd !== null && bd <= 14) {
    score += (15 - bd) * 3
  }

  return score
}

// ============================================
// FORMATTED LAST CONTACT TEXT
// ============================================

export function formatLastContact(person: Relationship): string {
  const days = getDaysSinceContact(person)
  if (days === null) return 'Never contacted'
  if (days === 0) return 'Today'
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days} days ago`
  if (days < 30) return `${Math.floor(days / 7)}w ago`
  if (days < 365) return `${Math.floor(days / 30)}mo ago`
  return `${Math.floor(days / 365)}y ago`
}

// ============================================
// TIER COUNT + SOFT CAP CHECK
// ============================================

export function getTierCounts(people: Relationship[]): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const p of people) {
    counts[p.tier] = (counts[p.tier] || 0) + 1
  }
  return counts
}