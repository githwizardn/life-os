import { useState, useEffect } from 'react'
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
import {
  loadProfile, saveProfile,
  loadGlobalData, saveGlobalData,
  loadTaskState, saveTaskState,
  loadNotes, saveNotes,
  loadQuests, saveQuest, deleteQuest,
  saveNotesHistory, loadNotesHistory,
  deleteNotesHistory
} from './lib/db'
import './App.css'

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
}

function App() {
  const [session, setSession] = useState<Session | null>(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [dataLoading, setDataLoading] = useState(true) // <-- Data loading state
  
  const [user, setUser] = useLocalStorage<User | null>('lifeos-user', null)
  const [taskState, setTaskState] = useLocalStorage<Record<string, boolean>>('lifeos-tasks', {})
  const [globalData, setGlobalData] = useLocalStorage<GlobalData>('lifeos-global', {
    totalXP: 0, streak: 0, bestStreak: 0, lastDay: '',
  })
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('lifeos-notes', {})
  const [resetCount, setResetCount] = useLocalStorage<number>('lifeos-reset-count', 0)
  const [activeCategories, setActiveCategories] = useLocalStorage<string[]>('lifeos-active-categories', [])
  const [quests, setQuests] = useLocalStorage<Quest[]>('lifeos-quests', [])
  const [levelUpData, setLevelUpData] = useState<{ lvl: number; name: string } | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [notesHistory, setNotesHistory] = useState<any[]>([])

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

  useEffect(() => {
    if (!session) return
    const userId = session.user.id

    async function loadAll() {
      // <--  try/catch block for safe network requests
      try {
        const profile = await loadProfile(userId)
        if (profile) {
          setUser({ name: profile.name, goals: profile.goals, joined: profile.joined })
        }

        const global = await loadGlobalData(userId)
        if (global) {
          setGlobalData({
            totalXP: global.total_xp,
            streak: global.streak,
            bestStreak: global.best_streak,
            lastDay: global.last_day,
          })
          setResetCount(global.reset_count)
          setActiveCategories(global.active_categories || [])
        }

        const tasks = await loadTaskState(userId)
        setTaskState(tasks)

        const notes = await loadNotes(userId)
        setNotes(notes)

        const history = await loadNotesHistory(userId)
        setNotesHistory(history)

        const quests = await loadQuests(userId)
        setQuests(quests.map((q: any) => ({
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
      } catch (error) {
        console.error("Failed to sync with database:", error)
      } finally {
        // <-- Unlock the UI once downloading finishes (or fails)
        setDataLoading(false) 
      }
    }

    loadAll()
  }, [session])

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
      const prevLevel = getLevelData(globalData.totalXP)
      const newXP = globalData.totalXP + xp
      const newLevel = getLevelData(newXP)
      const newGlobal = { ...globalData, totalXP: newXP }
      setGlobalData(newGlobal)
      if (session) saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
      if (newLevel.lvl > prevLevel.lvl) setTimeout(() => setLevelUpData(newLevel), 600)
    } else {
      const newGlobal = { ...globalData, totalXP: Math.max(0, globalData.totalXP - xp) }
      setGlobalData(newGlobal)
      if (session) saveGlobalData(session.user.id, newGlobal, resetCount, activeCategories)
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
    setResetCount(newResetCount)
    setActiveCategories(selectedCategories)
    setShowCategoryModal(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
    if (session) {
      saveTaskState(session.user.id, {})
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
      // --- FIX: Now passing the user ID for security! ---
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

  //  Blocks the UI if auth is loading OR if the user is logged in but data is still downloading
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

  return (
    <div className="app">
      <div className="bg-glow" />
      <Header user={user} />
      <XPBar globalData={globalData} getLevelData={getLevelData} />
      <DayProgress />
      <TaskList
        tasks={tasks}
        taskState={taskState}
        onToggle={handleToggle}
        onTrack={handleTrackQuest}
      />

      {quests.filter(q => !q.completed).length > 0 && (
        <QuestTracker
          quests={quests.filter(q => !q.completed)}
          onCheckin={handleQuestCheckin}
          onAbandon={handleAbandonQuest}
        />
      )}

      <ScoreCards tasks={tasks} taskState={taskState} />

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
    </div>
  )
}

export default App