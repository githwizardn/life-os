import type { Quest } from '../data/tasks'
import { CATEGORY_INFO } from '../data/tasks'

type Props = {
  quests: Quest[]
  onCheckin: (id: string) => void
  onAbandon: (id: string) => void
}

function QuestTracker({ quests, onCheckin, onAbandon }: Props) {
  const today = new Date().toDateString()

  return (
    <div className="quest-section">

      {/* Header */}
      <div className="quest-header">
        <span className="quest-title">⚔️ ACTIVE QUESTS</span>
        <span className="quest-count">{quests.length} active</span>
      </div>

      {/* Quest list */}
      {quests.map(quest => {
        const pct = Math.round(quest.daysCompleted / quest.totalDays * 100)
        const checkedInToday = quest.lastCheckin === today
        const { icon } = CATEGORY_INFO[quest.category] || { icon: '📋' }

        return (
          <div key={quest.id} className="quest-card">

            {/* Top row */}
            <div className="quest-top">
              <span className="quest-cat-icon">{icon}</span>
              <span className="quest-label">{quest.label}</span>
              <span className="quest-xp">+{quest.xp} XP</span>
            </div>

            {/* Progress bar */}
            <div className="quest-progress-row">
              <div className="quest-bar">
                <div
                  className="quest-fill"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="quest-days">
                {quest.daysCompleted} / {quest.totalDays} days
              </span>
            </div>

            {/* Start date */}
            <div className="quest-meta">
              Started {quest.startDate}
            </div>

            {/* Actions */}
            <div className="quest-actions">
              <button
                className={`quest-checkin-btn ${checkedInToday ? 'done' : ''}`}
                onClick={() => onCheckin(quest.id)}
                disabled={checkedInToday}
              >
                {checkedInToday ? '✓ DONE TODAY' : '✓ CHECK IN TODAY'}
              </button>
              <button
                className="quest-abandon-btn"
                onClick={() => onAbandon(quest.id)}
              >
                ABANDON
              </button>
            </div>

          </div>
        )
      })}

    </div>
  )
}

export default QuestTracker