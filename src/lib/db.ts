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

export async function deleteNotesHistory(userId: string, id: string) {
  const { error } = await supabase
    .from('notes_history')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
    
  if (error) throw error
}

// ===== HONOR =====

export async function saveHonor(userId: string, honor: number) {
  const { error } = await supabase
    .from('global_data')
    .update({ 
      honor, 
      honor_updated_at: new Date().toISOString() 
    })
    .eq('id', userId)

  if (error) throw error
}

export async function saveHonorDecay(userId: string, honor: number) {
  const { error } = await supabase
    .from('global_data')
    .update({ 
      honor,
      last_honor_decay: new Date().toISOString(),
    })
    .eq('id', userId)

  if (error) throw error
}

export async function loadHonorDecay(userId: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('global_data')
    .select('last_honor_decay')
    .eq('id', userId)
    .maybeSingle()

  if (error) throw error
  return data?.last_honor_decay ?? null
}

// ===== DECLINED TASKS =====

export async function saveDeclinedTasks(
  userId: string, 
  declined: Record<string, boolean>
) {
  const { error } = await supabase
    .from('task_state')
    .update({ 
      declined, 
      updated_at: new Date().toISOString() 
    })
    .eq('id', userId)

  if (error) throw error
}

// ===== PHASE 2 — SKILL PROGRESS =====

export async function loadSkillProgress(userId: string) {
  const { data, error } = await supabase
    .from('user_skill_progress')
    .select('*')
    .eq('user_id', userId)

  if (error) throw error
  return data || []
}

export async function saveSkillProgress(
  userId: string,
  nodeId: string,
  status: string
) {
  const { error } = await supabase
    .from('user_skill_progress')
    .upsert({
      user_id: userId,
      node_id: nodeId,
      status,
      mastered_at: status === 'mastered' ? new Date().toISOString() : null,
    })

  if (error) throw error
}

export async function saveCategoryXP(
  userId: string,
  categoryXP: Record<string, number>
) {
  const { error } = await supabase
    .from('global_data')
    .update({ category_xp: categoryXP })
    .eq('id', userId)

  if (error) throw error
}

// ===== PHASE 3 — SHADOWS =====

export async function loadShadows(userId: string) {
  const { data, error } = await supabase
    .from('user_shadows')
    .select('*')
    .eq('user_id', userId)
    .order('extracted_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function saveShadow(
  userId: string,
  shadowId: string,
  extractedFrom: string
) {
  const { error } = await supabase
    .from('user_shadows')
    .insert({
      user_id: userId,
      shadow_id: shadowId,
      extracted_from: extractedFrom,
    })

  if (error) throw error
}

// ===== PHASE 4 — DUNGEONS =====

export async function loadActiveDungeons(userId: string) {
  const { data, error } = await supabase
    .from('user_dungeons')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')

  if (error) throw error
  return data || []
}

export async function loadAllDungeons(userId: string) {
  const { data, error } = await supabase
    .from('user_dungeons')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function enterDungeon(userId: string, dungeonId: string) {
  const { data, error } = await supabase
    .from('user_dungeons')
    .insert({
      user_id: userId,
      dungeon_id: dungeonId,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function completeDungeon(userId: string, id: string) {
  const { error } = await supabase
    .from('user_dungeons')
    .update({
      status: 'completed',
      completed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

export async function failDungeon(userId: string, id: string) {
  const { error } = await supabase
    .from('user_dungeons')
    .update({
      status: 'failed',
      failed_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

// ===== PHASE 5 — GATES =====

export async function loadPendingGate(userId: string) {
  const { data, error } = await supabase
    .from('user_gates')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'pending')
    .order('appeared_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  if (error) throw error
  return data
}

export async function saveGate(
  userId: string,
  gateId: string,
  status: string
) {
  const { data, error } = await supabase
    .from('user_gates')
    .insert({
      user_id: userId,
      gate_id: gateId,
      status,
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function resolveGate(userId: string, id: string, status: string) {
  const { error } = await supabase
    .from('user_gates')
    .update({
      status,
      resolved_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

// ===== PHASE 6 — SEASONS =====

export async function loadActiveSeason(userId: string) {
  const { data, error } = await supabase
    .from('user_seasons')
    .select('*')
    .eq('user_id', userId)
    .eq('status', 'active')
    .maybeSingle()

  if (error) throw error
  return data
}

export async function createSeason(userId: string, seasonNum: number) {
  const { data, error } = await supabase
    .from('user_seasons')
    .insert({
      user_id: userId,
      season_num: seasonNum,
      status: 'active',
    })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function endSeason(userId: string, id: string, bossDefeated: boolean) {
  const { error } = await supabase
    .from('user_seasons')
    .update({
      status: 'completed',
      ended_at: new Date().toISOString(),
      boss_defeated: bossDefeated,
      boss_defeated_at: bossDefeated ? new Date().toISOString() : null,
    })
    .eq('id', id)
    .eq('user_id', userId)

  if (error) throw error
}

// ===== PHASE 7 — CHRONICLES =====

export async function loadChronicles(userId: string, limit = 20) {
  const { data, error } = await supabase
    .from('user_chronicles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data || []
}

export async function saveChronicle(
  userId: string,
  entry: {
    week_num: number
    season_num: number
    start_date: string
    end_date: string
    text: string
    stats: Record<string, unknown>
  }
) {
  const { data, error } = await supabase
    .from('user_chronicles')
    .insert({ user_id: userId, ...entry })
    .select()
    .single()

  if (error) throw error
  return data
}

// ===== PHASE 8 — RELATIONSHIPS =====

export async function loadRelationships(userId: string) {
  const { data, error } = await supabase
    .from('relationships')
    .select('*')
    .eq('user_id', userId)
    .order('name', { ascending: true })

  if (error) throw error
  return data || []
}

export async function saveRelationship(
  userId: string,
  person: {
    id?: string
    name: string
    emoji: string
    tier: string
    birthday: string | null
    contact_freq_days: number
    notes: string
    gift_ideas: string
    key_facts: string
    their_people: string
    their_work: string
    their_struggles: string
    their_wins: string
    shared_history: string
  }
) {
  if (person.id) {
    const { error } = await supabase
      .from('relationships')
      .update({ ...person, updated_at: new Date().toISOString() })
      .eq('id', person.id)
      .eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('relationships')
      .insert({ user_id: userId, ...person })
    if (error) throw error
  }
}

export async function markContacted(userId: string, id: string) {
  const { error } = await supabase
    .from('relationships')
    .update({
      last_contact_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

export async function deleteRelationship(userId: string, id: string) {
  const { error } = await supabase
    .from('relationships')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ===== PHASE 9 — DECISIONS =====

export async function loadDecisions(userId: string) {
  const { data, error } = await supabase
    .from('decisions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data || []
}

export async function saveDecision(
  userId: string,
  decision: {
    id?: string
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
    status: string
  }
) {
  if (decision.id) {
    const { error } = await supabase
      .from('decisions')
      .update({ ...decision, updated_at: new Date().toISOString() })
      .eq('id', decision.id)
      .eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase
      .from('decisions')
      .insert({ user_id: userId, ...decision })
    if (error) throw error
  }
}

export async function deleteDecision(userId: string, id: string) {
  const { error } = await supabase
    .from('decisions')
    .delete()
    .eq('id', id)
    .eq('user_id', userId)
  if (error) throw error
}

// ===== PHASE 10 — BODY & MIND =====

export async function loadSleepLogs(userId: string) {
  const { data, error } = await supabase
    .from('sleep_logs').select('*')
    .eq('user_id', userId).order('date', { ascending: false })
  if (error) throw error
  return data || []
}
export async function saveSleepLog(userId: string, log: Partial<SleepLog> & { date: string }) {
  const { error } = await supabase
    .from('sleep_logs')
    .upsert({ user_id: userId, ...log, updated_at: new Date().toISOString() },
      { onConflict: 'user_id,date' })
  if (error) throw error
}
export async function deleteSleepLog(userId: string, id: string) {
  const { error } = await supabase.from('sleep_logs').delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

export async function loadWorkouts(userId: string) {
  const { data, error } = await supabase
    .from('workouts').select('*')
    .eq('user_id', userId).order('date', { ascending: false }).limit(200)
  if (error) throw error
  return data || []
}
export async function saveWorkout(userId: string, w: Omit<Workout, 'id' | 'user_id' | 'created_at'> & { id?: string }) {
  if (w.id) {
    const { error } = await supabase.from('workouts').update(w).eq('id', w.id).eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase.from('workouts').insert({ user_id: userId, ...w })
    if (error) throw error
  }
}
export async function deleteWorkout(userId: string, id: string) {
  const { error } = await supabase.from('workouts').delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

export async function loadMeasurements(userId: string) {
  const { data, error } = await supabase
    .from('measurements').select('*')
    .eq('user_id', userId).order('date', { ascending: false })
  if (error) throw error
  return data || []
}
export async function saveMeasurement(userId: string, m: Partial<Measurement> & { date: string }) {
  const { error } = await supabase
    .from('measurements')
    .upsert({ user_id: userId, ...m }, { onConflict: 'user_id,date' })
  if (error) throw error
}
export async function deleteMeasurement(userId: string, id: string) {
  const { error } = await supabase.from('measurements').delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

export async function loadReadingLogs(userId: string) {
  const { data, error } = await supabase
    .from('reading_logs').select('*')
    .eq('user_id', userId).order('created_at', { ascending: false })
  if (error) throw error
  return data || []
}
export async function saveReadingLog(userId: string, r: Partial<ReadingLog> & { title: string }) {
  if (r.id) {
    const { error } = await supabase
      .from('reading_logs').update({ ...r, updated_at: new Date().toISOString() })
      .eq('id', r.id).eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase.from('reading_logs').insert({ user_id: userId, ...r })
    if (error) throw error
  }
}
export async function deleteReadingLog(userId: string, id: string) {
  const { error } = await supabase.from('reading_logs').delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

export async function loadFinanceLogs(userId: string) {
  const { data, error } = await supabase
    .from('finance_logs').select('*')
    .eq('user_id', userId).order('date', { ascending: false }).limit(300)
  if (error) throw error
  return data || []
}
export async function saveFinanceLog(userId: string, f: Omit<FinanceLog, 'id' | 'user_id' | 'created_at'> & { id?: string }) {
  if (f.id) {
    const { error } = await supabase.from('finance_logs').update(f).eq('id', f.id).eq('user_id', userId)
    if (error) throw error
  } else {
    const { error } = await supabase.from('finance_logs').insert({ user_id: userId, ...f })
    if (error) throw error
  }
}
export async function deleteFinanceLog(userId: string, id: string) {
  const { error } = await supabase.from('finance_logs').delete().eq('id', id).eq('user_id', userId)
  if (error) throw error
}

// ===== PHASE 13 — EXPORT / IMPORT / RESET =====

export type BackupData = {
  version: number
  exported_at: string
  user_id: string
  data: {
    profile?: Record<string, unknown>
    global_data?: Record<string, unknown>
    task_state?: Record<string, unknown>
    notes?: Record<string, unknown>
    notes_history?: Record<string, unknown>[]
    quests?: Record<string, unknown>[]
    user_skill_progress?: Record<string, unknown>[]
    user_shadows?: Record<string, unknown>[]
    user_dungeons?: Record<string, unknown>[]
    user_gates?: Record<string, unknown>[]
    user_seasons?: Record<string, unknown>[]
    user_chronicles?: Record<string, unknown>[]
    relationships?: Record<string, unknown>[]
    decisions?: Record<string, unknown>[]
    sleep_logs?: Record<string, unknown>[]
    workouts?: Record<string, unknown>[]
    measurements?: Record<string, unknown>[]
    reading_logs?: Record<string, unknown>[]
    finance_logs?: Record<string, unknown>[]
  }
}

export async function exportAllUserData(userId: string): Promise<BackupData> {
  const [
    profile,
    globalData,
    taskState,
    notes,
    notesHistory,
    quests,
    skillProgress,
    shadows,
    dungeons,
    gates,
    seasons,
    chronicles,
    relationships,
    decisions,
    sleepLogs,
    workouts,
    measurements,
    readingLogs,
    financeLogs
  ] = await Promise.all([
    supabase.from('profiles').select('*').eq('id', userId).maybeSingle(),
    supabase.from('global_data').select('*').eq('id', userId).maybeSingle(),
    supabase.from('task_state').select('*').eq('id', userId).maybeSingle(),
    supabase.from('notes').select('*').eq('id', userId).maybeSingle(),
    supabase.from('notes_history').select('*').eq('user_id', userId),
    supabase.from('quests').select('*').eq('user_id', userId),
    supabase.from('user_skill_progress').select('*').eq('user_id', userId),
    supabase.from('user_shadows').select('*').eq('user_id', userId),
    supabase.from('user_dungeons').select('*').eq('user_id', userId),
    supabase.from('user_gates').select('*').eq('user_id', userId),
    supabase.from('user_seasons').select('*').eq('user_id', userId),
    supabase.from('user_chronicles').select('*').eq('user_id', userId),
    supabase.from('relationships').select('*').eq('user_id', userId),
    supabase.from('decisions').select('*').eq('user_id', userId),
    supabase.from('sleep_logs').select('*').eq('user_id', userId),
    supabase.from('workouts').select('*').eq('user_id', userId),
    supabase.from('measurements').select('*').eq('user_id', userId),
    supabase.from('reading_logs').select('*').eq('user_id', userId),
    supabase.from('finance_logs').select('*').eq('user_id', userId)
  ])

  return {
    version: 1,
    exported_at: new Date().toISOString(),
    user_id: userId,
    data: {
      profile: (profile.data as Record<string, unknown>) || undefined,
      global_data: (globalData.data as Record<string, unknown>) || undefined,
      task_state: (taskState.data as Record<string, unknown>) || undefined,
      notes: (notes.data as Record<string, unknown>) || undefined,
      notes_history: (notesHistory.data as Record<string, unknown>[]) || [],
      quests: (quests.data as Record<string, unknown>[]) || [],
      user_skill_progress: (skillProgress.data as Record<string, unknown>[]) || [],
      user_shadows: (shadows.data as Record<string, unknown>[]) || [],
      user_dungeons: (dungeons.data as Record<string, unknown>[]) || [],
      user_gates: (gates.data as Record<string, unknown>[]) || [],
      user_seasons: (seasons.data as Record<string, unknown>[]) || [],
      user_chronicles: (chronicles.data as Record<string, unknown>[]) || [],
      relationships: (relationships.data as Record<string, unknown>[]) || [],
      decisions: (decisions.data as Record<string, unknown>[]) || [],
      sleep_logs: (sleepLogs.data as Record<string, unknown>[]) || [],
      workouts: (workouts.data as Record<string, unknown>[]) || [],
      measurements: (measurements.data as Record<string, unknown>[]) || [],
      reading_logs: (readingLogs.data as Record<string, unknown>[]) || [],
      finance_logs: (financeLogs.data as Record<string, unknown>[]) || []
    }
  }
}

export async function wipeUserData(userId: string) {
  const tables = [
    'notes_history', 'notes', 'task_state', 'quests', 'user_skill_progress',
    'user_shadows', 'user_dungeons', 'user_gates', 'user_seasons', 
    'user_chronicles', 'relationships', 'decisions', 'sleep_logs', 
    'workouts', 'measurements', 'reading_logs', 'finance_logs', 
    'global_data', 'profiles'
  ]

  for (const table of tables) {
    const column = (table === 'profiles' || table === 'global_data' || table === 'task_state' || table === 'notes') ? 'id' : 'user_id'
    await supabase.from(table).delete().eq(column, userId)
  }
}

export async function importAllUserData(userId: string, importedData: BackupData) {
  await wipeUserData(userId)

  const d = importedData.data
  
  if (d.profile) await supabase.from('profiles').insert({ ...d.profile, id: userId })
  if (d.global_data) await supabase.from('global_data').insert({ ...d.global_data, id: userId })
  if (d.task_state) await supabase.from('task_state').insert({ ...d.task_state, id: userId })
  if (d.notes) await supabase.from('notes').insert({ ...d.notes, id: userId })

  const insertTable = async (table: string, rows: Record<string, unknown>[] | undefined) => {
    if (!rows || rows.length === 0) return
    const cleanRows = rows.map(r => ({ ...r, user_id: userId }))
    await supabase.from(table).insert(cleanRows)
  }

  await insertTable('notes_history', d.notes_history)
  await insertTable('quests', d.quests)
  await insertTable('user_skill_progress', d.user_skill_progress)
  await insertTable('user_shadows', d.user_shadows)
  await insertTable('user_dungeons', d.user_dungeons)
  await insertTable('user_gates', d.user_gates)
  await insertTable('user_seasons', d.user_seasons)
  await insertTable('user_chronicles', d.user_chronicles)
  await insertTable('relationships', d.relationships)
  await insertTable('decisions', d.decisions)
  await insertTable('sleep_logs', d.sleep_logs)
  await insertTable('workouts', d.workouts)
  await insertTable('measurements', d.measurements)
  await insertTable('reading_logs', d.reading_logs)
  await insertTable('finance_logs', d.finance_logs)
}

export async function resetUserSystem(userId: string, system: 'dungeons' | 'relationships' | 'decisions' | 'xp_honor') {
  if (system === 'dungeons') {
    await supabase.from('user_dungeons').delete().eq('user_id', userId)
  } else if (system === 'relationships') {
    await supabase.from('relationships').delete().eq('user_id', userId)
  } else if (system === 'decisions') {
    await supabase.from('decisions').delete().eq('user_id', userId)
  } else if (system === 'xp_honor') {
    await supabase.from('global_data').update({ total_xp: 0, streak: 0, best_streak: 0, honor: 50, category_xp: {} }).eq('id', userId)
  }
}

// Types re-exported for db.ts use
type SleepLog = import('./bodyMind').SleepLog
type Workout = import('./bodyMind').Workout
type Measurement = import('./bodyMind').Measurement
type ReadingLog = import('./bodyMind').ReadingLog
type FinanceLog = import('./bodyMind').FinanceLog