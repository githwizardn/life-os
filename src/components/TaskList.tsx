import type { TaskItem } from '../data/tasks'
import { CATEGORIES, CATEGORY_INFO } from '../data/tasks'

// --- Props ---
type Props = {
  tasks: TaskItem[]
  taskState: Record<string, boolean>
  onToggle: (id: string, xp: number) => void
  onTrack: (task: TaskItem) => void  // ← added
}

// --- Helper: capitalize first letter ---
const cap = (s: string) => s[0].toUpperCase() + s.slice(1)

// --- Difficulty labels ---
const DIFFICULTY_LABEL: Record<string, string> = {
  easy:      'EASY',
  hard:      'HARD',
  legendary: '⚡ LEGENDARY',
}

function TaskList({ tasks, taskState, onToggle, onTrack }: Props) {  // ← added onTrack
  return (
    <div className="task-section">

      {CATEGORIES.map(category => {

        const { icon } = CATEGORY_INFO[category]
        const categoryTasks = tasks.filter(t => t.category === category)
        const doneTasks = categoryTasks.filter(t => taskState[t.id]).length
        const totalTasks = categoryTasks.length

        // Don't render category if no tasks for it today
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

                    {/* Task label */}
                    <div className="task-label">{task.label}</div>

                    {/* Difficulty badge */}
                    <div className={`task-difficulty ${task.difficulty}`}>
                      {DIFFICULTY_LABEL[task.difficulty]}
                    </div>

                    {/* XP badge */}
                    <div className="task-xp">+{task.xp} XP</div>

                    {/* Track button — only on legendary tasks */}
                    {task.difficulty === 'legendary' && (
                      <button
                        className="task-track-btn"
                        onClick={e => {
                          e.stopPropagation() // prevent toggling the task
                          onTrack(task)
                        }}
                      >
                        TRACK
                      </button>
                    )}

                  </div>

                  {/* Penalty — only when task is not done */}
                  {!isDone && (
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