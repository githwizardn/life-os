import { supabase } from './supabase'
import type { User, GlobalData } from '../App'
import type { Quest } from '../data/tasks'

// ===== PROFILE =====

export async function loadProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // returns null instead of 406 when no rows found
  return data
}

export async function saveProfile(userId: string, user: User) {
  await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: user.name,
      goals: user.goals,
      joined: user.joined,
    })
}

// ===== GLOBAL DATA =====

export async function loadGlobalData(userId: string) {
  const { data } = await supabase
    .from('global_data')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // returns null instead of 406 when no rows found
  return data
}

export async function saveGlobalData(userId: string, data: GlobalData, resetCount: number, activeCategories: string[]) {
  await supabase
    .from('global_data')
    .upsert({
      id: userId,
      total_xp: data.totalXP,
      streak: data.streak,
      best_streak: data.bestStreak,
      last_day: data.lastDay,
      reset_count: resetCount,
      active_categories: activeCategories,
    })
}

// ===== TASK STATE =====

export async function loadTaskState(userId: string) {
  const { data } = await supabase
    .from('task_state')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // returns null instead of 406 when no rows found
  return data?.state || {}
}

export async function saveTaskState(userId: string, state: Record<string, boolean>) {
  await supabase
    .from('task_state')
    .upsert({ id: userId, state, updated_at: new Date().toISOString() })
}

// ===== NOTES =====

export async function loadNotes(userId: string) {
  const { data } = await supabase
    .from('notes')
    .select('*')
    .eq('id', userId)
    .maybeSingle() // returns null instead of 406 when no rows found
  return data?.data || {}
}

export async function saveNotes(userId: string, notes: Record<string, string>) {
  await supabase
    .from('notes')
    .upsert({ id: userId, data: notes, updated_at: new Date().toISOString() })
}

// ===== QUESTS =====

export async function loadQuests(userId: string) {
  const { data } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
  return data || []
}

export async function saveQuest(userId: string, quest: Quest) {
  await supabase
    .from('quests')
    .upsert({
      id: quest.id,
      user_id: userId,
      label: quest.label,
      category: quest.category,
      xp: quest.xp,
      start_date: quest.startDate,
      last_checkin: quest.lastCheckin,
      days_completed: quest.daysCompleted,
      total_days: quest.totalDays,
      completed: quest.completed,
    })
}

export async function deleteQuest(userId: string, questId: string) {
  await supabase
    .from('quests')
    .delete()
    .eq('id', questId)
    .eq('user_id', userId)
}

// ===== NOTES HISTORY =====

export async function saveNotesHistory(userId: string, notes: Record<string, string>) {
  await supabase
    .from('notes_history')
    .insert({
      user_id: userId,
      data: notes,
    })
}

export async function loadNotesHistory(userId: string) {
  const { data } = await supabase
    .from('notes_history')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .limit(30) // last 30 saves
  return data || []
}

export async function deleteNotesHistory(id: string) {
  await supabase
    .from('notes_history')
    .delete()
    .eq('id', id)
}