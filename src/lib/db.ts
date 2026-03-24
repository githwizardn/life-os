import { supabase } from './supabase'
import type { User, GlobalData } from '../App'
import type { Quest } from '../data/tasks'

// ===== PROFILE =====

export async function loadProfile(userId: string) {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle() 

  if (error) throw error
  return data
}

export async function saveProfile(userId: string, user: User) {
  const { error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      name: user.name,
      goals: user.goals,
      joined: user.joined,
    })
    
  if (error) throw error
}

// ===== GLOBAL DATA =====

export async function loadGlobalData(userId: string) {
  const { data, error } = await supabase
    .from('global_data')
    .select('*')
    .eq('id', userId)
    .maybeSingle() 
    
  if (error) throw error
  return data
}

export async function saveGlobalData(userId: string, data: GlobalData, resetCount: number, activeCategories: string[]) {
  const { error } = await supabase
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
    
  if (error) throw error
}

// ===== TASK STATE =====

export async function loadTaskState(userId: string) {
  const { data, error } = await supabase
    .from('task_state')
    .select('*')
    .eq('id', userId)
    .maybeSingle() 
    
  if (error) throw error
  return data?.state || {}
}

export async function saveTaskState(userId: string, state: Record<string, boolean>) {
  const { error } = await supabase
    .from('task_state')
    .upsert({ id: userId, state, updated_at: new Date().toISOString() })
    
  if (error) throw error
}

// ===== NOTES =====

export async function loadNotes(userId: string) {
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('id', userId)
    .maybeSingle() 
    
  if (error) throw error
  return data?.data || {}
}

export async function saveNotes(userId: string, notes: Record<string, string>) {
  const { error } = await supabase
    .from('notes')
    .upsert({ id: userId, data: notes, updated_at: new Date().toISOString() })
    
  if (error) throw error
}

// ===== QUESTS =====

export async function loadQuests(userId: string) {
  const { data, error } = await supabase
    .from('quests')
    .select('*')
    .eq('user_id', userId)
    .eq('completed', false)
    
  if (error) throw error
  return data || []
}

export async function saveQuest(userId: string, quest: Quest) {
  const { error } = await supabase
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
    
  if (error) throw error
}

export async function deleteQuest(userId: string, questId: string) {
  const { error } = await supabase
    .from('quests')
    .delete()
    .eq('id', questId)
    .eq('user_id', userId)
    
  if (error) throw error
}

// ===== NOTES HISTORY =====

export async function saveNotesHistory(userId: string, notes: Record<string, string>) {
  const { error } = await supabase
    .from('notes_history')
    .insert({
      user_id: userId,
      data: notes,
    })
    
  if (error) throw error
}

export async function loadNotesHistory(userId: string) {
  const { data, error } = await supabase
    .from('notes_history')
    .select('*')
    .eq('user_id', userId)
    .order('saved_at', { ascending: false })
    .limit(30) 
    
  if (error) throw error
  return data || []
}

// --- SECURITY FIX: Added userId verification to prevent unauthorized deletion ---
export async function deleteNotesHistory(userId: string, id: string) {
  const { error } = await supabase
    .from('notes_history')
    .delete()
    .eq('id', id)
    .eq('user_id', userId) // Security check!
    
  if (error) throw error
}