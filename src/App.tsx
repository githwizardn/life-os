import { useState } from 'react'
import useLocalStorage from './hooks/useLocalStorage'
import { getDailyTasks, LEVELS } from './data/tasks'
import type { TaskItem, Quest } from './data/tasks'
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
  const [user, setUser] = useLocalStorage<User | null>('lifeos-user', null)
  const [taskState, setTaskState] = useLocalStorage<Record<string, boolean>>('lifeos-tasks', {})
  const [globalData, setGlobalData] = useLocalStorage<GlobalData>('lifeos-global', {
    totalXP: 0, streak: 0, bestStreak: 0, lastDay: '',
  })
  const [notes, setNotes] = useLocalStorage<Record<string, string>>('lifeos-notes', {})
  const [resetCount, setResetCount] = useLocalStorage<number>('lifeos-reset-count', 0)
  const [activeCategories, setActiveCategories] = useLocalStorage<string[]>('lifeos-active-categories', [])

  // --- Quests ---
  const [quests, setQuests] = useLocalStorage<Quest[]>('lifeos-quests', [])

  const [levelUpData, setLevelUpData] = useState<{ lvl: number; name: string } | null>(null)
  const [showCategoryModal, setShowCategoryModal] = useState(false)

  const allTasks: TaskItem[] = getDailyTasks(resetCount)
  const tasks = allTasks.filter(t => {
    const categories = activeCategories.length > 0
      ? activeCategories
      : user?.goals ?? []
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
    setUser({ name, goals, joined: today() })
    setActiveCategories(goals)
  }

  const handleToggle = (taskId: string, xp: number) => {
    const wasChecked = taskState[taskId]
    const newState = { ...taskState, [taskId]: !wasChecked }
    setTaskState(newState)

    if (!wasChecked) {
      const prevLevel = getLevelData(globalData.totalXP)
      const newXP = globalData.totalXP + xp
      const newLevel = getLevelData(newXP)
      setGlobalData({ ...globalData, totalXP: newXP })
      if (newLevel.lvl > prevLevel.lvl) {
        setTimeout(() => setLevelUpData(newLevel), 600)
      }
    } else {
      setGlobalData({
        ...globalData,
        totalXP: Math.max(0, globalData.totalXP - xp)
      })
    }
  }

  // --- Add a task as a tracked quest ---
  const handleTrackQuest = (task: TaskItem) => {
    // Don't add duplicates
    const alreadyTracked = quests.some(q => q.label === task.label && !q.completed)
    if (alreadyTracked) return

    // Try to detect how many days from the task label
    // e.g. "7 days", "30 days", "30-day"
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
  }

  // --- Check in on a quest for today ---
  const handleQuestCheckin = (questId: string) => {
    const todayStr = today()
    setQuests(quests.map(q => {
      if (q.id !== questId) return q
      // Already checked in today
      if (q.lastCheckin === todayStr) return q

      const newDays = q.daysCompleted + 1
      const isComplete = newDays >= q.totalDays

      // Award XP on completion
      if (isComplete) {
        const newXP = globalData.totalXP + q.xp
        const prevLevel = getLevelData(globalData.totalXP)
        const newLevel = getLevelData(newXP)
        setGlobalData({ ...globalData, totalXP: newXP })
        if (newLevel.lvl > prevLevel.lvl) {
          setTimeout(() => setLevelUpData(newLevel), 600)
        }
      }

      return {
        ...q,
        daysCompleted: newDays,
        lastCheckin: todayStr,
        completed: isComplete,
      }
    }))
  }

  // --- Abandon a quest ---
  const handleAbandonQuest = (questId: string) => {
    if (confirm('Abandon this quest? Progress will be lost.')) {
      setQuests(quests.filter(q => q.id !== questId))
    }
  }

  const handleResetDay = () => {
    setShowCategoryModal(true)
  }

  const handleConfirmReset = (selectedCategories: string[]) => {
    setTaskState({})
    setResetCount(resetCount + 1)
    setActiveCategories(selectedCategories)
    setShowCategoryModal(false)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleResetAll = () => {
    if (confirm('Reset EVERYTHING? This cannot be undone.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  if (!user) {
    return <Onboarding onStart={handleStart} />
  }

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

      {/* Quest tracker — only shown if there are active quests */}
      {quests.filter(q => !q.completed).length > 0 && (
        <QuestTracker
          quests={quests.filter(q => !q.completed)}
          onCheckin={handleQuestCheckin}
          onAbandon={handleAbandonQuest}
        />
      )}

      <ScoreCards tasks={tasks} taskState={taskState} />
      <Notes notes={notes} setNotes={setNotes} />
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