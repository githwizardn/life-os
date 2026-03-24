import type { TaskItem } from '../data/tasks'
import { CATEGORIES, CATEGORY_INFO } from '../data/tasks'

// --- Props ---
type Props = {
  tasks: TaskItem[]
  taskState: Record<string, boolean>
  onToggle: (id: string, xp: number) => void
  onTrack: (task: TaskItem) => void
}

// --- Helper: capitalize first letter (with crash-proofing) ---
const cap = (s: string) => s ? s[0].toUpperCase() + s.slice(1) : ''

// --- Difficulty labels ---
const DIFFICULTY_LABEL: Record<string, string> = {
  easy:      'EASY',
  hard:      'HARD',
  legendary: '⚡ LEGENDARY',
}

function TaskList({ tasks, taskState, onToggle, onTrack }: Props) {
  return (
    <div className="task-section">

      {CATEGORIES.map(category => {

        // Provide a fallback icon just in case CATEGORY_INFO misses a key
        const { icon } = CATEGORY_INFO[category] || { icon: '📌' } 
        const categoryTasks = tasks.filter(t => t.category === category)
        const doneTasks = categoryTasks.filter(t => taskState[t.id]).length
        const totalTasks = categoryTasks.length

        if (totalTasks === 0) return null

        return (
          <div key={category} className="task-category">

            {/* Category header */}
            <div className="cat-header">
              <span className="cat-icon">{icon}</span>
              <span className="cat-title">{cap(category)}</span>
              <span
                className="cat-count"
                style={{
                  color: doneTasks === totalTasks
                    ? 'var(--accent)'
                    : 'var(--text-muted)'
                }}
              >
                {doneTasks}/{totalTasks}
              </span>
            </div>

            {/* Task items */}
            {categoryTasks.map(task => {
              const isDone = !!taskState[task.id]
              
              // NEW: Safe fallback for unknown difficulties
              const difficultyLabel = DIFFICULTY_LABEL[task.difficulty] || task.difficulty.toUpperCase()

              return (
                <div key={task.id} className={`task-wrapper ${isDone ? 'done' : ''}`}>

                  {/* Main task row */}
                  <div
                    className={`task ${isDone ? 'done' : ''}`}
                    onClick={() => onToggle(task.id, task.xp)}
                  >
                    {/* Checkbox */}
                    <div className="checkbox">
                      {isDone ? '✓' : ''}
                    </div>

                    {/* Left side — label only */}
                    <div className="task-left">
                      <div className="task-label">{task.label}</div>
                    </div>

                    {/* Right side — difficulty, xp, track */}
                    <div className="task-right">
                      <div className={`task-difficulty ${task.difficulty}`}>
                        {difficultyLabel}
                      </div>
                      <div className="task-xp">+{task.xp} XP</div>
                      {task.difficulty === 'legendary' && (
                        <button
                          className="task-track-btn"
                          onClick={e => {
                            e.stopPropagation()
                            onTrack(task)
                          }}
                        >
                          TRACK
                        </button>
                      )}
                    </div>

                  </div>

                  {/* Penalty — only when task is not done */}
                  {!isDone && task.penalty && (
                    <div className="task-penalty">
                      ⚠ {task.penalty}
                    </div>
                  )}

                </div>
              )
            })}

          </div>
        )
      })}

    </div>
  )
}

export default TaskList