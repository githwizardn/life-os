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
const ICONS: Record<string, string> = {
  body:   '💪',
  mind:   '🧠',
  growth: '📈',
  joy:    '🎉',
}

// --- Capitalize helper ---
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

function ScoreCards({ tasks, taskState }: Props) {
  return (
    <div className="score-grid">

      {CATEGORIES.map(category => {
        // Get tasks for this category
        const categoryTasks = tasks.filter(t => t.category === category)

        // Count completed tasks
        const done = categoryTasks.filter(t => taskState[t.id]).length
        const total = categoryTasks.length

        // Calculate percentage
        // e.g. 2 done out of 4 total = 50%
        const pct = total === 0 ? 0 : Math.round(done / total * 100)

        // Is this category fully complete?
        const isComplete = pct === 100

        return (
          <div
            key={category}
            className={`score-card ${isComplete ? 'complete' : ''}`}
          >
            {/* Icon + title */}
            <div className="score-header">
              <span className="score-icon">{ICONS[category]}</span>
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