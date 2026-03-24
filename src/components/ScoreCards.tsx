import type { TaskItem } from '../data/tasks'
import { CATEGORIES } from '../data/tasks'

// --- Props ---
type Props = {
  tasks: TaskItem[]
  taskState: Record<string, boolean>
}

// --- Colors for each category ---
const COLORS: Record<string, string> = {
  body:       '#00ff88',   // electric green — physical energy
  mind:       '#c084fc',   // bright violet — mental/spiritual
  mastery:    '#facc15',   // vivid yellow-gold — achievement
  autonomy:   '#fb923c',   // deep orange — drive and freedom
  growth:     '#22d3ee',   // bright cyan — expansion and learning
  connection: '#f472b6',   // hot pink — human warmth
  joy:        '#ff4d4d',   // vivid red — passion and aliveness
}

// --- Icons ---
// FIX 1: Added the missing icons!
const ICONS: Record<string, string> = {
  body:       '💪',
  mind:       '🧠',
  mastery:    '🥷',
  autonomy:   '💰',
  growth:     '📈',
  connection: '🤝',
  joy:        '🎉',
}

// --- Capitalize helper ---
// FIX 2: Crash-proofed the string manipulation
const cap = (s: string) => s ? s[0].toUpperCase() + s.slice(1) : ''

function ScoreCards({ tasks, taskState }: Props) {
  return (
    <div className="score-grid">

      {CATEGORIES.map(category => {
        // Get tasks for this category
        const categoryTasks = tasks.filter(t => t.category === category)
        const total = categoryTasks.length

        // FIX 3: Hide the card completely if there are no tasks for this category today
        if (total === 0) return null

        // Count completed tasks
        const done = categoryTasks.filter(t => taskState[t.id]).length

        // Calculate percentage (Safe math!)
        const pct = Math.round((done / total) * 100)

        // Is this category fully complete?
        const isComplete = pct === 100

        return (
          <div
            key={category}
            className={`score-card ${isComplete ? 'complete' : ''}`}
          >
            {/* Icon + title */}
            <div className="score-header">
              <span className="score-icon">{ICONS[category] || '🎯'}</span>
              <span className="score-title">{cap(category)}</span>
            </div>

            {/* Percentage number */}
            <div
              className="score-pct"
              style={{ color: isComplete ? COLORS[category] : 'var(--text)' }}
            >
              {pct}%
            </div>

            {/* Progress bar */}
            <div className="score-bar">
              <div
                className="score-fill"
                style={{
                  width: `${pct}%`,
                  // Each category has its own color
                  background: COLORS[category]
                }}
              />
            </div>

            {/* Done count e.g. "2 / 4" */}
            <div className="score-count">
              {done} / {total} tasks
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default ScoreCards