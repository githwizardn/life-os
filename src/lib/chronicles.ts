// ============================================
// CHRONICLES — template-based narrative generation
// Zero AI. Reads real stats. Writes real story.
// ============================================

import { getSeasonByNumber } from './seasons'

export type ChronicleStats = {
  week_num: number
  season_num: number
  start_date: string
  end_date: string
  days_active: number         // days with any task completed (0-7)
  tasks_completed: number     // total tasks
  xp_gained: number
  dominant_category: string
  honor_start: number
  honor_end: number
  shadows_extracted: number
  dungeons_cleared: number
  gates_entered: number
  gates_ignored: number
  streak_at_end: number
  best_day: string            // weekday name
  worst_day: string           // weekday name
  boss_progress: number       // 0-3 requirements met
}

// ============================================
// MAIN GENERATOR
// ============================================

export function generateChronicle(stats: ChronicleStats): string {
  const season = getSeasonByNumber(stats.season_num)
  const parts: string[] = []

  // ---- Opening ----
  parts.push(opening(stats, season))

  // ---- Activity ----
  parts.push(activityLine(stats))

  // ---- Dominant path ----
  if (stats.tasks_completed > 0) {
    parts.push(pathLine(stats))
  }

  // ---- Shadows / Dungeons ----
  if (stats.shadows_extracted > 0) {
    parts.push(shadowsLine(stats))
  }
  if (stats.dungeons_cleared > 0) {
    parts.push(dungeonsLine(stats))
  }

  // ---- Gates ----
  if (stats.gates_entered > 0 || stats.gates_ignored > 0) {
    parts.push(gatesLine(stats))
  }

  // ---- Honor ----
  parts.push(honorLine(stats))

  // ---- Pattern observation ----
  if (stats.days_active >= 3) {
    parts.push(patternLine(stats))
  }

  // ---- Boss status ----
  parts.push(bossLine(stats, season))

  // ---- Closing ----
  parts.push(closing(stats))

  return parts.join(' ')
}

// ============================================
// LINE GENERATORS
// ============================================

function opening(stats: ChronicleStats, season: { name: string; icon: string }): string {
  const weekWord = ['first', 'second', 'third', 'fourth', 'fifth', 'sixth', 'seventh',
    'eighth', 'ninth', 'tenth', 'eleventh', 'twelfth', 'thirteenth'][stats.week_num - 1]
    || `week ${stats.week_num}`

  const templates = [
    `In the ${weekWord} week of the ${season.name}, the System observed the Player.`,
    `The ${weekWord} week of the ${season.name} has closed. The System records.`,
    `The ${weekWord} week of the ${season.name} ends. This is what the System saw.`,
    `Week ${stats.week_num} of the ${season.name}. The System has been watching.`,
  ]
  return templates[hash(stats.start_date) % templates.length]
}

function activityLine(stats: ChronicleStats): string {
  const { days_active, tasks_completed } = stats

  if (tasks_completed === 0) {
    return `The Player was absent. No tasks were completed. The System does not judge. It records.`
  }
  if (days_active <= 2) {
    return `The Player appeared on ${days_active} of 7 days. ${tasks_completed} tasks were completed. The System notes an uneven rhythm.`
  }
  if (days_active <= 4) {
    return `The Player walked ${days_active} of 7 days. ${tasks_completed} tasks completed. Noteworthy, but the System expects more.`
  }
  if (days_active <= 6) {
    return `The Player appeared on ${days_active} of 7 days, completing ${tasks_completed} tasks. The pattern is becoming consistent.`
  }
  return `The Player appeared all 7 days, completing ${tasks_completed} tasks. The System acknowledges true consistency.`
}

function pathLine(stats: ChronicleStats): string {
  const labels: Record<string, string> = {
    body: 'Iron', mind: 'Mind', mastery: 'Craft',
    autonomy: 'Coin', growth: 'Grove', connection: 'Voice', joy: 'Flame',
  }
  const path = labels[stats.dominant_category] || stats.dominant_category

  return `The Path of ${path} received the most attention this week.`
}

function shadowsLine(stats: ChronicleStats): string {
  if (stats.shadows_extracted === 1) {
    return `A Shadow was extracted from the Player's efforts. One more piece of them belongs to the Player now.`
  }
  return `${stats.shadows_extracted} Shadows were extracted. The Player's army grows.`
}

function dungeonsLine(stats: ChronicleStats): string {
  if (stats.dungeons_cleared === 1) {
    return `A dungeon was cleared. Not many walk out. The Player did.`
  }
  return `${stats.dungeons_cleared} dungeons were cleared. The System notes the effort.`
}

function gatesLine(stats: ChronicleStats): string {
  const entered = stats.gates_entered
  const ignored = stats.gates_ignored

  if (entered > 0 && ignored === 0) {
    return `Gates appeared. The Player entered them all. The System respects this.`
  }
  if (entered === 0 && ignored > 0) {
    return `${ignored} gates were ignored. The System records the avoidance.`
  }
  return `Of the gates that appeared, ${entered} were entered and ${ignored} were ignored.`
}

function honorLine(stats: ChronicleStats): string {
  const delta = stats.honor_end - stats.honor_start

  if (delta > 5) {
    return `HONOR rose from ${stats.honor_start} to ${stats.honor_end}. The Player is becoming trustworthy.`
  }
  if (delta > 0) {
    return `HONOR rose slightly, from ${stats.honor_start} to ${stats.honor_end}.`
  }
  if (delta === 0) {
    return `HONOR held at ${stats.honor_end}.`
  }
  if (delta > -5) {
    return `HONOR drifted down to ${stats.honor_end}. The System notes the decline.`
  }
  return `HONOR fell from ${stats.honor_start} to ${stats.honor_end}. The System warns of a pattern.`
}

function patternLine(stats: ChronicleStats): string {
  const templates = [
    `The strongest day was ${stats.best_day}. The weakest was ${stats.worst_day}. The System notes the pattern.`,
    `The Player is strongest on ${stats.best_day}, weakest on ${stats.worst_day}. This is important information.`,
    `${stats.best_day} showed the Player at their best. ${stats.worst_day} the opposite. The System remembers both.`,
  ]
  return templates[hash(stats.start_date + stats.best_day) % templates.length]
}

function bossLine(stats: ChronicleStats, season: { boss_name: string }): string {
  if (stats.boss_progress === 0) {
    return `The ${season.boss_name} remains untouched.`
  }
  if (stats.boss_progress === 1) {
    return `The first condition against the ${season.boss_name} is met. Two remain.`
  }
  if (stats.boss_progress === 2) {
    return `Two of three conditions against the ${season.boss_name} are met. One remains.`
  }
  return `The ${season.boss_name} has fallen.`
}

function closing(stats: ChronicleStats): string {
  if (stats.days_active === 0) {
    return `Next week begins. The System awaits the Player's return.`
  }
  if (stats.days_active >= 6 && stats.honor_end >= 85) {
    return `The next week awaits. The System expects more of the same.`
  }
  if (stats.honor_end < 60) {
    return `The next week is a chance. The System recommends correction.`
  }
  return `The next week begins. The System continues to observe.`
}

// ============================================
// DETERMINISTIC HASH
// ============================================

function hash(seed: string): number {
  return seed.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0)
}

// ============================================
// WHEN TO GENERATE A CHRONICLE
// ============================================

export function shouldGenerateChronicle(lastEntryDate: string | null): boolean {
  if (!lastEntryDate) return false
  const last = new Date(lastEntryDate).getTime()
  const now = Date.now()
  const daysSince = (now - last) / (1000 * 60 * 60 * 24)
  return daysSince >= 7
}

export function getWeekNumber(startedAt: string): number {
  const start = new Date(startedAt).getTime()
  const now = Date.now()
  return Math.floor((now - start) / (1000 * 60 * 60 * 24 * 7)) + 1
}