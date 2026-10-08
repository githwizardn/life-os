import type { TaskItem } from '../data/tasks'
import { CATEGORIES, CATEGORY_INFO } from '../data/tasks'

// --- Props ---
type Props = {
  tasks: TaskItem[]
  taskState: Record<string, boolean>
  declinedTasks: Record<string, boolean>
  onToggle: (id: string, xp: number) => void
  onTrack: (task: TaskItem) => void
  onDecline: (id: string) => void
}

const cap = (s: string) => s ? s[0].toUpperCase() + s.slice(1) : ''

const DIFFICULTY_LABEL: Record<string, string> = {
  easy:      'EASY',
  hard:      'HARD',
  legendary: '⚡ LEGENDARY',
}

function TaskList({ 
  tasks, 
  taskState, 
  declinedTasks, 
  onToggle, 
  onTrack, 
  onDecline 
}: Props) {
  return (
    <div className="task-section">

      {CATEGORIES.map(category => {
        const { icon } = CATEGORY_INFO[category] || { icon: '📌' } 
        const categoryTasks = tasks.filter(t => t.category === category)
        const doneTasks = categoryTasks.filter(t => taskState[t.id]).length
        const totalTasks = categoryTasks.length

        if (totalTasks === 0) return null

        return (
          <div key={category} className="task-category">

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

            {categoryTasks.map(task => {
              const isDone = !!taskState[task.id]
              const isDeclined = !!declinedTasks[task.id]
              const difficultyLabel = DIFFICULTY_LABEL[task.difficulty] || task.difficulty.toUpperCase()

              return (
                <div 
                  key={task.id} 
                  className={`task-wrapper ${isDone ? 'done' : ''} ${isDeclined ? 'declined' : ''}`}
                >

                  <div
                    className={`task ${isDone ? 'done' : ''} ${isDeclined ? 'declined' : ''}`}
                    onClick={() => {
                      if (isDeclined) return
                      onToggle(task.id, task.xp)
                    }}
                  >
                    <div className="checkbox">
                      {isDone ? '✓' : isDeclined ? '✕' : ''}
                    </div>

                    <div className="task-left">
                      <div className="task-label">{task.label}</div>
                    </div>

                    <div className="task-right">
                      <div className={`task-difficulty ${task.difficulty}`}>
                        {difficultyLabel}
                      </div>
                      <div className="task-xp">+{task.xp} XP</div>

                      {!isDone && !isDeclined && (
                        <button
                          className="task-decline-btn"
                          onClick={e => {
                            e.stopPropagation()
                            onDecline(task.id)
                          }}
                          title="Decline (-3 HONOR)"
                        >
                          ✕
                        </button>
                      )}

                      {task.difficulty === 'legendary' && !isDeclined && (
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

                  {!isDone && !isDeclined && task.penalty && (
                    <div className="task-penalty">
                      ⚠ {task.penalty}
                    </div>
                  )}

                  {isDeclined && (
                    <div className="task-declined-note">
                      ✕ Declined. The System remembers.
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