import { useState, useEffect, useRef } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { getDailyTasks, LEVELS } from './data/tasks'
import type { TaskItem, Quest } from './data/tasks'
import { supabase } from './lib/supabase'
import type { Session } from '@supabase/supabase-js'
import Auth from './components/Auth'
import Onboarding from './components/Onboarding'
import Header from './components/Header'
import XPBar from './components/XPBar'
import DayProgress from './components/DayProgress'
import TaskList from './components/TaskList'
import ScoreCards from './components/ScoreCards'
import Notes from './components/Notes'
import LevelUpModal from './components/LevelUpModal'
import CategorySelectModal from './components/CategorySelectModal'
import QuestTracker from './components/QuestTracker'
import SystemVoice from './components/SystemVoice'
import HonorBar from './components/HonorBar'
import SkillTree from './components/SkillTree'
import ShadowArmy from './components/ShadowArmy'
import DungeonList from './components/DungeonList'
import GateModal from './components/GateModal'
import SeasonBanner from './components/SeasonBanner'
import Chronicle from './components/Chronicle'
import type { ChronicleEntry } from './components/Chronicle'
import RelationshipCRM from './components/RelationshipCRM'
import ReachOutWidget from './components/ReachOutWidget'
import DecisionJournal from './components/DecisionJournal'
import { type Relationship } from './lib/relationships'
import { type Decision } from './lib/decisions'
import { determineShadowFromLegendary, type UserShadow } from './lib/shadows'
import { type UserDungeon, isExpired } from './lib/dungeons'
import { getDungeonById } from './data/dungeons'
import { generateGateForHour, getGateById, type Gate } from './data/gates'
import {
  getSeasonByNumber,
  evaluateBossRequirements,
  isBossDefeated,
  type UserSeason,
  type BossRequirementStatus,
} from './lib/seasons'
import {
  generateChronicle,
  getWeekNumber,
  type ChronicleStats,
} from './lib/chronicles'
import {
  loadProfile, saveProfile,
  loadGlobalData, saveGlobalData,
  loadTaskState, saveTaskState,
  loadNotes, saveNotes,
  loadQuests, saveQuest, deleteQuest,
  saveNotesHistory, loadNotesHistory,
  deleteNotesHistory,
  saveHonor,
  saveDeclinedTasks,
  saveHonorDecay,
  loadHonorDecay,
  loadSkillProgress,
  saveSkillProgress,
  saveCategoryXP,
  loadShadows,
  saveShadow,
  loadAllDungeons,
  enterDungeon,
  completeDungeon,
  failDungeon,
  loadPendingGate,
  saveGate,
  resolveGate,
  loadActiveSeason,
  createSeason,
  endSeason,
  loadChronicles,
  saveChronicle,
  loadRelationships,
  saveRelationship,
  markContacted,
  deleteRelationship,
  loadDecisions,
  saveDecision,
  deleteDecision,
} from './lib/db'
import {
  applyHonorAction,
  applyWeeklyDecay,
  shouldApplyDecay,
} from './lib/honor'
import {
  canUnlock,
  type SkillProgress,
  type CategoryXP,
} from './lib/skills'
import { ALL_SKILL_NODES } from './data/skillTrees'
import './App.css'

// ============================================
// TYPES
// ============================================

export type User = {
  name: string
  goals: string[]
  joined: string
}

export type GlobalData = {
  totalXP: number
  streak: number
  bestStreak: number
  lastDay: string
  honor: number
}

type RawQuestRow = {
  id: string
  label: string
  category: string
  xp: number
  start_date: string
  last_checkin: string
  days_completed: number
  total_days: number
  completed: boolean
}

type NoteHistoryEntry = {
  id: string
  user_id: string
  data: Record<string, string>
  saved_at: string
}

type RawSkillRow = {
  node_id: string
  status: string
  mastered_at: string | null
}

type RawShadowRow = {
  id: string
  shadow_id: string
  extracted_from: string
  extracted_at: string
}

type RawDungeonRow = {
  id: string
  dungeon_id: string
  status: string
  started_at: string
  completed_at: string | null
  failed_at: string | null
}

type RawGateRow = {
  id: string
  gate_id: string
  status: string
  appeared_at: string
  resolved_at: string | null
}

type RawSeasonRow = {
  id: string
  season_num: number
  started_at: string
  ended_at: string | null
  boss_defeated: boolean
  boss_defeated_at: string | null
  status: string
}

type RawChronicleRow = {
  id: string
  week_num: number
  season_num: number
  start_date: string
  end_date: string
  text: string
  created_at: string
}

// ============================================
// APP COMPONENT
// ============================================

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true)

  const [user, setUser] = useLocalStorage<User | null>('lifeos-user', null)
  const [taskState, setTaskState] = useLocalStorage<Record<string, boolean>>('lifeos-tasks', {})
  const [declinedTasks, setDeclinedTasks] = useLocalStorage<Record<string, boolean>>('lifeos-declined', {})
  const [globalData, setGlobalData] = useLocalStorage<GlobalData>('lifeos-global', {
    totalXP: 0,
    streak: 0,
    bestStreak: 0,
    lastDay: '',
    honor: 50,
  })
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('lifeos-notes', {})
  const [resetCount, setResetCount] = useLocalStorage<number>('lifeos-reset-count', 0)
  const [activeCategories, setActiveCategories] = useLocalStorage<string[]>('lifeos-active-categories', [])
  const [quests, setQuests] = useLocalStorage<Quest[]>('lifeos-quests', [])
  const [levelUpData, setLevelUpData] = useState<{ lvl: number; name: string } | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [notesHistory, setNotesHistory] = useState<NoteHistoryEntry[]>([])
  const [skillProgress, setSkillProgress] = useState<SkillProgress[]>([])
  const [categoryXP, setCategoryXP] = useState<CategoryXP>({
    body: 0, mind: 0, mastery: 0, autonomy: 0, growth: 0, connection: 0, joy: 0,
  })
  const [shadows, setShadows] = useState<UserShadow[]>([])
  const [activeDungeons, setActiveDungeons] = useState<UserDungeon[]>([])
  const [allDungeons, setAllDungeons] = useState<UserDungeon[]>([])
  const [activeGate, setActiveGate] = useState<Gate | null>(null)
  const [activeGateRowId, setActiveGateRowId] = useState<string | null>(null)
  const [lastGateHour, setLastGateHour] = useLocalStorage<string>('lifeos-last-gate-hour', '')
  const [userSeason, setUserSeason] = useState<UserSeason | null>(null)
  const [bossReqs, setBossReqs] = useState<BossRequirementStatus[]>([])
  const [chronicles, setChronicles] = useState<ChronicleEntry[]>([])
  const [relationships, setRelationships] = useState<Relationship[]>([])
  const [decisions, setDecisions] = useState<Decision[]>([])
  const gateCheckedRef = useRef<string>('')

  // ============================================
  // AUTH
  // ============================================

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => { setSession(session) }
    )

    return () => subscription.unsubscribe()
  }, [])

  // ============================================
  // LOAD ALL DATA
  // ============================================

  useEffect(() => {
    if (!session) return
    const userId = session.user.id

    async function loadAll() {
      try {
        // ---- Profile ----
        const profile = await loadProfile(userId)
        if (profile) {
          setUser({ name: profile.name, goals: profile.goals, joined: profile.joined })
        }

        // ---- Global Data + Honor ----
        const global = await loadGlobalData(userId)
        if (global) {
          setGlobalData({
            totalXP: global.total_xp,
            streak: global.streak,
            bestStreak: global.best_streak,
            lastDay: global.last_day,
            honor: global.honor ?? 50,
          })
          setResetCount(global.reset_count)
          setActiveCategories(global.active_categories || [])

          const lastDecay = await loadHonorDecay(userId)
          if (shouldApplyDecay(lastDecay)) {
            const decayedHonor = applyWeeklyDecay(global.honor ?? 50)
            await saveHonorDecay(userId, decayedHonor)
            setGlobalData(prev => ({ ...prev, honor: decayedHonor }))
          }

          const catXP = global.category_xp as CategoryXP | undefined
          if (catXP) {
            setCategoryXP({
              body: catXP.body ?? 0,
              mind: catXP.mind ?? 0,
              mastery: catXP.mastery ?? 0,
              autonomy: catXP.autonomy ?? 0,
              growth: catXP.growth ?? 0,
              connection: catXP.connection ?? 0,
              joy: catXP.joy ?? 0,
            })
          }
        }

        const taskData = await loadTaskState(userId)
        setTaskState(taskData)

        const { data: rawTaskRow } = await supabase
          .from('task_state')
          .select('declined')
          .eq('id', userId)
          .maybeSingle()

        if (rawTaskRow?.declined) setDeclinedTasks(rawTaskRow.declined)

        const notesData = await loadNotes(userId)
        setNotes(notesData)

        const history = await loadNotesHistory(userId)
        setNotesHistory(history)

        const questsData = await loadQuests(userId)
        setQuests(questsData.map((q: RawQuestRow) => ({
          id: q.id,
          label: q.label,
          category: q.category,
          xp: q.xp,
          startDate: q.start_date,
          lastCheckin: q.last_checkin,
          daysCompleted: q.days_completed,
          totalDays: q.total_days,
          completed: q.completed,
        })))

        const skillData = await loadSkillProgress(userId)
        setSkillProgress(skillData.map((s: RawSkillRow) => ({
          node_id: s.node_id,
          status: s.status as SkillProgress['status'],
          mastered_at: s.mastered_at,
        })))

        const shadowData = await loadShadows(userId)
        setShadows(shadowData.map((s: RawShadowRow) => ({
          id: s.id,
          shadow_id: s.shadow_id,
          extracted_from: s.extracted_from,
          extracted_at: s.extracted_at,
        })))

        const allD = await loadAllDungeons(userId)
        const mapped: UserDungeon[] = allD.map((d: RawDungeonRow) => ({
          id: d.id,
          dungeon_id: d.dungeon_id,
          status: d.status as UserDungeon['status'],
          started_at: d.started_at,
          completed_at: d.completed_at,
          failed_at: d.failed_at,
        }))

        const toFail: UserDungeon[] = []
        const stillActive: UserDungeon[] = []
        for (const ad of mapped.filter(x => x.status === 'active')) {
          if (isExpired(ad)) toFail.push(ad)
          else stillActive.push(ad)
        }

        let failPenalty = 0
        for (const f of toFail) {
          await failDungeon(userId, f.id)
          failPenalty += 10
        }

        if (failPenalty > 0 && global) {
          const newHonor = Math.max(0, (global.honor ?? 50) - failPenalty)
          await saveHonor(userId, newHonor)
          setGlobalData(prev => ({ ...prev, honor: newHonor }))
        }

        setAllDungeons(mapped)
        setActiveDungeons(stillActive)

        // ---- Season ----
        let activeSeason = await loadActiveSeason(userId)
        if (!activeSeason) {
          activeSeason = await createSeason(userId, 1)
        }
        if (activeSeason) {
          const raw = activeSeason as RawSeasonRow
          const seasonDef = getSeasonByNumber(raw.season_num)
          const daysSince = Math.floor(
            (Date.now() - new Date(raw.started_at).getTime()) / (1000 * 60 * 60 * 24)
          )

          if (daysSince >= seasonDef.duration_days) {
            await endSeason(userId, raw.id, false)
            const nextSeason = await createSeason(userId, raw.season_num + 1)
            const rawNext = nextSeason as RawSeasonRow
            setUserSeason({
              id: rawNext.id,
              season_num: rawNext.season_num,
              started_at: rawNext.started_at,
              ended_at: rawNext.ended_at,
              boss_defeated: rawNext.boss_defeated,
              boss_defeated_at: rawNext.boss_defeated_at,
              status: rawNext.status as 'active' | 'completed',
            })
          } else {
            setUserSeason({
              id: raw.id,
              season_num: raw.season_num,
              started_at: raw.started_at,
              ended_at: raw.ended_at,
              boss_defeated: raw.boss_defeated,
              boss_defeated_at: raw.boss_defeated_at,
              status: raw.status as 'active' | 'completed',
            })
          }
        }

        // ---- Chronicles ----
        const chronicleData = await loadChronicles(userId, 50)
        setChronicles(chronicleData.map((c: RawChronicleRow) => ({
          id: c.id,
          week_num: c.week_num,
          season_num: c.season_num,
          start_date: c.start_date,
          end_date: c.end_date,
          text: c.text,
          created_at: c.created_at,
        })))

        // ---- Relationships ----
        const relationshipsData = await loadRelationships(userId)
        setRelationships(relationshipsData as Relationship[])

        // ---- Decisions ----
        const decisionsData = await loadDecisions(userId)
        setDecisions(decisionsData as Decision[])

        // ---- Gates (load any pending) ----
        const pendingGate = await loadPendingGate(userId)
        if (pendingGate) {
          const g = getGateById((pendingGate as RawGateRow).gate_id)
          if (g) {
            setActiveGate(g)
            setActiveGateRowId((pendingGate as RawGateRow).id)
          }
        }
      } catch (error) {
        console.error("Failed to sync with database:", error)
      } finally {
        setDataLoading(false)
      }
    }

    loadAll()
  }, [session])

  // ============================================
  // GATE DETECTION
  // ============================================

  useEffect(() => {
    if (!session) return
    if (activeGate) return

    const checkGate = async () => {
      const now = new Date()
      const hourKey = `${session.user.id}-${now.toDateString()}-${now.getHours()}`

      if (gateCheckedRef.current === hourKey) return
      if (lastGateHour === hourKey) return

      gateCheckedRef.current = hourKey

      const gate = generateGateForHour(session.user.id, now.getHours())
      if (gate) {
        const row = await saveGate(session.user.id, gate.id, 'pending')
        setActiveGate(gate)
        setActiveGateRowId(row.id)
      }

      setLastGateHour(hourKey)
    }

    checkGate()
    const interval = setInterval(checkGate, 60000)
    return () => clearInterval(interval)
  }, [session, activeGate, lastGateHour, setLastGateHour])

  // ============================================
  // AUTO-UNLOCK SKILL NODES
  // ============================================

  useEffect(() => {
    if (!session) return
    if (skillProgress.length === 0 && categoryXP.body === 0) return

    const toUnlock: SkillProgress[] = []
    for (const node of ALL_SKILL_NODES) {
      const p = skillProgress.find(sp => sp.node_id === node.id)
      if (p?.status === 'mastered') continue
      const { can } = canUnlock(node, categoryXP, globalData.honor, skillProgress)
      if (can) {
        toUnlock.push({
          node_id: node.id,
          status: 'mastered',
          mastered_at: new Date().toISOString(),
        })
      }
    }

    if (toUnlock.length === 0) return

    const newProgress = [
      ...skillProgress.filter(p => !toUnlock.find(t => t.node_id === p.node_id)),
      ...toUnlock,
    ]
    setSkillProgress(newProgress)

    if (session) {
      for (const u of toUnlock) {
        saveSkillProgress(session.user.id, u.node_id, 'mastered')
      }
    }
  }, [categoryXP, globalData.honor, session, skillProgress])

  // ============================================
  // SEASON BOSS EVALUATION
  // ============================================

  useEffect(() => {
    if (!session || !userSeason) return

    const season = getSeasonByNumber(userSeason.season_num)
    const reqs = evaluateBossRequirements(season, categoryXP, shadows, allDungeons)
    setBossReqs(reqs)

    if (!userSeason.boss_defeated && isBossDefeated(reqs)) {
      endSeason(session.user.id, userSeason.id, true).then(() => {
        setUserSeason(prev =>
          prev ? { ...prev, boss_defeated: true, boss_defeated_at: new Date().toISOString() } : null
        )
      })

      if (!shadows.find(s => s.shadow_id === season.reward_shadow)) {
        const newShadow: UserShadow = {
          id: `${Date.now()}-${season.reward_shadow}`,
          shadow_id: season.reward_shadow,
          extracted_from: `${season.name} Boss`,
          extracted_at: new Date().toISOString(),
        }
        setShadows(prev => [newShadow, ...prev])
        saveShadow(session.user.id, season.reward_shadow, `${season.name} Boss`)
      }
    }
  }, [session, userSeason, categoryXP, shadows, allDungeons])

  // ============================================
  // CHRONICLE GENERATION
  // ============================================

  useEffect(() => {
    if (!session || !userSeason) return
    if (dataLoading) return

    const lastEntry = chronicles[0]
    const lastEntryDate = lastEntry ? lastEntry.created_at : userSeason.started_at
    const daysSince = Math.floor(
      (Date.now() - new Date(lastEntryDate).getTime()) / (1000 * 60 * 60 * 24)
    )

    if (daysSince < 7) return
    if (chronicles.find(c => c.week_num === getWeekNumber(userSeason.started_at))) return

    const weekNum = getWeekNumber(userSeason.started_at)
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000)

    const stats: ChronicleStats = {
      week_num: weekNum,
      season_num: userSeason.season_num,
      start_date: startDate.toISOString().slice(0, 10),
      end_date: endDate.toISOString().slice(0, 10),
      days_active: Math.min(7, Object.keys(taskState).length > 0 ? 5 : 2),
      tasks_completed: Object.values(taskState).filter(Boolean).length,
      xp_gained: globalData.totalXP,
      dominant_category: getDominantCategory(categoryXP),
      honor_start: Math.max(0, globalData.honor - 5),
      honor_end: globalData.honor,
      shadows_extracted: shadows.length,
      dungeons_cleared: allDungeons.filter(d => d.status === 'completed').length,
      gates_entered: 0,
      gates_ignored: 0,
      streak_at_end: globalData.streak,
      best_day: 'Tuesday',
      worst_day: 'Sunday',
      boss_progress: bossReqs.filter(r => r.met).length,
    }

    const text = generateChronicle(stats)

    saveChronicle(session.user.id, {
      week_num: stats.week_num,
      season_num: stats.season_num,
      start_date: stats.start_date,
      end_date: stats.end_date,
      text,
      stats: stats as unknown as Record<string, unknown>,
    }).then(row => {
      setChronicles(prev => [{
        id: row.id,
        week_num: row.week_num,
        season_num: row.season_num,
        start_date: row.start_date,
        end_date: row.end_date,
        text: row.text,
        created_at: row.created_at,
      }, ...prev])
    })
  }, [session, userSeason, chronicles, dataLoading, taskState, categoryXP, globalData, shadows, allDungeons, bossReqs])

  // ============================================
  // HELPERS
  // ============================================

  const getDominantCategory = (catXP: CategoryXP): string => {
    let max = 0
    let dominant = 'body'
    for (const [cat, xp] of Object.entries(catXP)) {
      if (xp > max) {
        max = xp
        dominant = cat
      }
    }
    return dominant
  }

  const allTasks: TaskItem[] = getDailyTasks(resetCount)
  const tasks = allTasks.filter(t => {
    const categories = activeCategories.length > 0 ? activeCategories : user?.goals ?? []
    return categories.includes(t.category)
  })

  const today = () => new Date().toDateString()

  const getLevelData = (xp: number) => {
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (xp >= LEVELS[i].min) return LEVELS[i]
    }
    return LEVELS[0]
  }

  // ============================================
  // HANDLERS
  // ============================================

  const handleStart = (name: string, goals: string[]) => {
    const newUser = { name, goals, joined: today() }
    setUser(newUser)
    setActiveCategories(goals)
    if (session) {
      saveProfile(session.user.id, newUser)
      saveGlobalData(session.user.id, globalData, resetCount, goals)
    }
  }

  const handleToggle = (taskId: string, xp: number) => {
    const wasChecked = taskState[taskId]
    const newState = { ...taskState, [taskId]: !wasChecked }
    setTaskState(newState)
    if (session) saveTaskState(session.user.id, newState)

    if (!wasChecked) {
      const task = allTasks.find(t => t.id === taskId)
      const prevLevel = getLevelData(globalData.totalXP)
      const newXP = globalData.totalXP + xp
      const newLevel = getLevelData(newXP)

      let honor = applyHonorAction(globalData.honor, 'task')
      if (task) {
        const categoryTasks = allTasks.filter(t => t.category === task.category)
        const completedInCategory = categoryTasks.filter(t => newState[t.id]).length
        if (completedInCategory === categoryTasks.length) {
          honor = applyHonorAction(honor, 'category_complete')
        }
      }

      if (task) {
        const newCatXP = { ...categoryXP }
        newCatXP[task.category] = (newCatXP[task.category] || 0) + xp
        setCategoryXP(newCatXP)
        if (session) saveCategoryXP(session.user.id, newCatXP)
      }

      if (task && task.difficulty === 'legendary') {
        const ownedIds = shadows.map(s => s.shadow_id)
        const newShadow = determineShadowFromLegendary(task.category, ownedIds)
        if (newShadow) {
          const extractedFrom = task.label
          const newEntry: UserShadow = {
            id: `${Date.now()}-${newShadow.id}`,
            shadow_id: newShadow.id,
            extracted_from: extractedFrom,
            extracted_at: new Date().toISOString(),
          }
          setShadows(prev => [newEntry, ...prev])
          if (session) saveShadow(session.user.id, newShadow.id, extractedFrom)
        }
      }

      const newGlobal = { ...globalData, totalXP: newXP, honor }
      setGlobalData(newGlobal)
      if (session) {
        saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
        saveHonor(session.user.id, honor)
      }
      if (newLevel.lvl > prevLevel.lvl) {
        setTimeout(() => setLevelUpData(newLevel), 600)
      }
    } else {
      const reversedHonor = Math.max(0, globalData.honor - 1)
      const newGlobal = {
        ...globalData,
        totalXP: Math.max(0, globalData.totalXP - xp),
        honor: reversedHonor,
      }
      setGlobalData(newGlobal)
      if (session) {
        saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
        saveHonor(session.user.id, reversedHonor)
      }

      const task = allTasks.find(t => t.id === taskId)
      if (task) {
        const newCatXP = { ...categoryXP }
        newCatXP[task.category] = Math.max(0, (newCatXP[task.category] || 0) - xp)
        setCategoryXP(newCatXP)
        if (session) saveCategoryXP(session.user.id, newCatXP)
      }
    }
  }

  const handleDecline = (taskId: string) => {
    if (taskState[taskId]) return
    if (declinedTasks[taskId]) return

    const newDeclined = { ...declinedTasks, [taskId]: true }
    setDeclinedTasks(newDeclined)
    if (session) saveDeclinedTasks(session.user.id, newDeclined)

    const newHonor = applyHonorAction(globalData.honor, 'decline')
    const newGlobal = { ...globalData, honor: newHonor }
    setGlobalData(newGlobal)
    if (session) {
      saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
      saveHonor(session.user.id, newHonor)
    }
  }

  const handleTrackQuest = (task: TaskItem) => {
    const alreadyTracked = quests.some(q => q.label === task.label && !q.completed)
    if (alreadyTracked) return

    const dayMatch = task.label.match(/(\d+)[\s-]day/)
    const totalDays = dayMatch ? parseInt(dayMatch[1]) : 7

    const newQuest: Quest = {
      id: `${Date.now()}`,
      label: task.label,
      category: task.category,
      xp: task.xp,
      startDate: today(),
      lastCheckin: '',
      daysCompleted: 0,
      totalDays,
      completed: false,
    }

    setQuests([...quests, newQuest])
    if (session) saveQuest(session.user.id, newQuest)
  }

  const handleQuestCheckin = (questId: string) => {
    const todayStr = today()
    const updatedQuests = quests.map(q => {
      if (q.id !== questId) return q
      if (q.lastCheckin === todayStr) return q

      const newDays = q.daysCompleted + 1
      const isComplete = newDays >= q.totalDays

      if (isComplete) {
        const newXP = globalData.totalXP + q.xp
        const prevLevel = getLevelData(globalData.totalXP)
        const newLevel = getLevelData(newXP)
        const newGlobal = { ...globalData, totalXP: newXP }
        setGlobalData(newGlobal)
        if (session) saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
        if (newLevel.lvl > prevLevel.lvl) setTimeout(() => setLevelUpData(newLevel), 600)
      }

      return { ...q, daysCompleted: newDays, lastCheckin: todayStr, completed: isComplete }
    })

    setQuests(updatedQuests)
    if (session) {
      const updated = updatedQuests.find(q => q.id === questId)
      if (updated) saveQuest(session.user.id, updated)
    }
  }

  const handleAbandonQuest = (questId: string) => {
    if (confirm('Abandon this quest? Progress will be lost.')) {
      setQuests(quests.filter(q => q.id !== questId))
      if (session) deleteQuest(session.user.id, questId)
    }
  }

  const handleResetDay = () => setShowCategoryModal(true)

  const handleConfirmReset = (selectedCategories: string[]) => {
    const newResetCount = resetCount + 1
    setTaskState({})
    setDeclinedTasks({})
    setResetCount(newResetCount)
    setActiveCategories(selectedCategories)
    setShowCategoryModal(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (session) {
      saveTaskState(session.user.id, {})
      saveDeclinedTasks(session.user.id, {})
      saveGlobalData(session.user.id, globalData, newResetCount, selectedCategories)
    }
  }

  const handleSetNotes = (newNotes: Record<string, string>) => {
    setNotes(newNotes)
    if (session) saveNotes(session.user.id, newNotes)
  }

  const handleSaveNotes = async () => {
    if (!session) return
    await saveNotesHistory(session.user.id, notes)
    const history = await loadNotesHistory(session.user.id)
    setNotesHistory(history)
  }

  const handleDeleteHistory = async (id: string) => {
    if (confirm('Delete this note entry? This cannot be undone.')) {
      await deleteNotesHistory(session!.user.id, id)
      const history = await loadNotesHistory(session!.user.id)
      setNotesHistory(history)
    }
  }

  const handleResetAll = () => {
    if (confirm('Reset EVERYTHING? This cannot be undone.')) {
      if (session) supabase.auth.signOut()
      localStorage.clear()
      window.location.reload()
    }
  }

  // ============================================
  // DUNGEON HANDLERS
  // ============================================

  const handleEnterDungeon = async (dungeonId: string) => {
    if (!session) return
    const row = await enterDungeon(session.user.id, dungeonId)
    const newActive: UserDungeon = {
      id: row.id,
      dungeon_id: row.dungeon_id,
      status: 'active',
      started_at: row.started_at,
      completed_at: null,
      failed_at: null,
    }
    setActiveDungeons([newActive])
    setAllDungeons(prev => [newActive, ...prev])
  }

  const handleCompleteDungeon = async (id: string) => {
    if (!session) return
    const active = activeDungeons.find(a => a.id === id)
    if (!active) return
    const dungeon = getDungeonById(active.dungeon_id)
    if (!dungeon) return

    await completeDungeon(session.user.id, id)

    const newXP = globalData.totalXP + dungeon.xp_reward
    const prevLevel = getLevelData(globalData.totalXP)
    const newLevel = getLevelData(newXP)
    const newGlobal = { ...globalData, totalXP: newXP }
    setGlobalData(newGlobal)
    await saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
    if (newLevel.lvl > prevLevel.lvl) setTimeout(() => setLevelUpData(newLevel), 600)

    if (!shadows.find(s => s.shadow_id === dungeon.shadow_reward)) {
      const newShadow: UserShadow = {
        id: `${Date.now()}-${dungeon.shadow_reward}`,
        shadow_id: dungeon.shadow_reward,
        extracted_from: dungeon.name,
        extracted_at: new Date().toISOString(),
      }
      setShadows(prev => [newShadow, ...prev])
      await saveShadow(session.user.id, dungeon.shadow_reward, dungeon.name)
    }

    setActiveDungeons([])
    setAllDungeons(prev =>
      prev.map(d => d.id === id ? { ...d, status: 'completed' as const, completed_at: new Date().toISOString() } : d)
    )
  }

  const handleAbandonDungeon = async (id: string) => {
    if (!session) return
    await failDungeon(session.user.id, id)
    const newHonor = Math.max(0, globalData.honor - 10)
    const newGlobal = { ...globalData, honor: newHonor }
    setGlobalData(newGlobal)
    await saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
    await saveHonor(session.user.id, newHonor)
    setActiveDungeons([])
    setAllDungeons(prev =>
      prev.map(d => d.id === id ? { ...d, status: 'failed' as const, failed_at: new Date().toISOString() } : d)
    )
  }

  // ============================================
  // GATE HANDLERS
  // ============================================

  const handleEnterGate = async () => {
    if (!session || !activeGateRowId || !activeGate) return

    const newXP = globalData.totalXP + activeGate.xp_reward
    const prevLevel = getLevelData(globalData.totalXP)
    const newLevel = getLevelData(newXP)
    const newGlobal = { ...globalData, totalXP: newXP }
    setGlobalData(newGlobal)
    await saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
    if (newLevel.lvl > prevLevel.lvl) setTimeout(() => setLevelUpData(newLevel), 600)

    await resolveGate(session.user.id, activeGateRowId, 'entered')

    setActiveGate(null)
    setActiveGateRowId(null)
  }

  const handleIgnoreGate = async () => {
    if (!session || !activeGateRowId || !activeGate) return

    const newHonor = Math.max(0, globalData.honor - activeGate.honor_cost)
    const newGlobal = { ...globalData, honor: newHonor }
    setGlobalData(newGlobal)
    await saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
    await saveHonor(session.user.id, newHonor)

    await resolveGate(session.user.id, activeGateRowId, 'ignored')

    setActiveGate(null)
    setActiveGateRowId(null)
  }

  // ============================================
  // RELATIONSHIP HANDLERS
  // ============================================

  const handleSaveRelationship = async (
    person: Omit<Relationship, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_contact_at'> & { id?: string }
  ): Promise<boolean> => {
    if (!session) return false
    try {
      await saveRelationship(session.user.id, person)
      const fresh = await loadRelationships(session.user.id)
      setRelationships(fresh as Relationship[])
      return true
    } catch (err) {
      console.error('Failed to save relationship:', err)
      return false
    }
  }

  const handleMarkContacted = async (id: string) => {
    if (!session) return
    await markContacted(session.user.id, id)
    setRelationships(prev =>
      prev.map(p => p.id === id ? { ...p, last_contact_at: new Date().toISOString() } : p)
    )
  }

  const handleDeleteRelationship = async (id: string) => {
    if (!session) return
    await deleteRelationship(session.user.id, id)
    setRelationships(prev => prev.filter(p => p.id !== id))
  }

  // ============================================
  // DECISION HANDLERS
  // ============================================

  const handleSaveDecision = async (
    decision: Omit<Decision, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }
  ): Promise<boolean> => {
    if (!session) return false
    try {
      await saveDecision(session.user.id, decision)
      const fresh = await loadDecisions(session.user.id)
      setDecisions(fresh as Decision[])
      return true
    } catch (err) {
      console.error('Failed to save decision:', err)
      return false
    }
  }

  const handleDeleteDecision = async (id: string) => {
    if (!session) return
    await deleteDecision(session.user.id, id)
    setDecisions(prev => prev.filter(d => d.id !== id))
  }

  // ============================================
  // LOADING SCREEN
  // ============================================

  if (authLoading || (session && dataLoading)) {
    return (
      <div className="onboarding">
        <div className="onboarding-card">
          <div className="logo">LIFE OS</div>
          <div className="sub">{authLoading ? 'AUTHENTICATING...' : 'SYNCING DATA...'}</div>
        </div>
      </div>
    )
  }

  if (!session) return <Auth />
  if (!user) return <Onboarding onStart={handleStart} />

  // ============================================
  // MAIN RENDER
  // ============================================

  return (
    <div className="app">
      <div className="bg-glow" />
      <Header user={user} />
      <XPBar globalData={globalData} getLevelData={getLevelData} />
      <HonorBar honor={globalData.honor} />
      <SystemVoice
        userId={session.user.id}
        state={{
          honor: globalData.honor,
          streak: globalData.streak,
          completedToday: Object.values(taskState).filter(Boolean).length,
          totalToday: tasks.length,
          hour: new Date().getHours(),
          daysIntoSeason: userSeason
            ? Math.floor((Date.now() - new Date(userSeason.started_at).getTime()) / (1000 * 60 * 60 * 24))
            : 0,
          hasRecentWin: false,
        }}
      />
      {userSeason && (
        <SeasonBanner
          season={getSeasonByNumber(userSeason.season_num)}
          userSeason={userSeason}
          requirements={bossReqs}
          bossDefeated={userSeason.boss_defeated}
        />
      )}
      <SkillTree
        categoryXP={categoryXP}
        honor={globalData.honor}
        progress={skillProgress}
      />
      <ShadowArmy shadows={shadows} />
      <DungeonList
        activeDungeons={activeDungeons}
        categoryXP={categoryXP}
        honor={globalData.honor}
        completedDungeonIds={allDungeons.filter(d => d.status === 'completed').map(d => d.dungeon_id)}
        onEnter={handleEnterDungeon}
        onComplete={handleCompleteDungeon}
        onAbandon={handleAbandonDungeon}
      />
      <DayProgress />

      <TaskList
        tasks={tasks}
        taskState={taskState}
        declinedTasks={declinedTasks}
        onToggle={handleToggle}
        onTrack={handleTrackQuest}
        onDecline={handleDecline}
      />

      {quests.filter(q => !q.completed).length > 0 && (
        <QuestTracker
          quests={quests.filter(q => !q.completed)}
          onCheckin={handleQuestCheckin}
          onAbandon={handleAbandonQuest}
        />
      )}

      <ScoreCards tasks={tasks} taskState={taskState} />

      <Chronicle entries={chronicles} />

      <DecisionJournal
        decisions={decisions}
        onSave={handleSaveDecision}
        onDelete={handleDeleteDecision}
      />

      {relationships.length > 0 && (
        <ReachOutWidget
          people={relationships}
          onMarkContacted={handleMarkContacted}
          onOpenPerson={() => {
            document
              .querySelector('.rel-section')
              ?.scrollIntoView({ behavior: 'smooth' })
          }}
        />
      )}

      <RelationshipCRM
        people={relationships}
        onSave={handleSaveRelationship}
        onMarkContacted={handleMarkContacted}
        onDelete={handleDeleteRelationship}
      />

      <Notes
        notes={notes}
        setNotes={handleSetNotes}
        onSave={handleSaveNotes}
        onDeleteHistory={handleDeleteHistory}
        history={notesHistory}
      />

      <div className="actions">
        <button onClick={handleResetDay}>Reset Day</button>
        <button onClick={handleResetAll}>Reset All</button>
      </div>

      {levelUpData && (
        <LevelUpModal
          level={levelUpData}
          onClose={() => setLevelUpData(null)}
        />
      )}

      {showCategoryModal && (
        <CategorySelectModal
          current={activeCategories.length > 0 ? activeCategories : user.goals}
          onConfirm={handleConfirmReset}
          onCancel={() => setShowCategoryModal(false)}
        />
      )}

      {activeGate && (
        <GateModal
          gate={activeGate}
          onEnter={handleEnterGate}
          onIgnore={handleIgnoreGate}
        />
      )}
    </div>
  )
}

export default App