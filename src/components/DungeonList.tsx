import { useState, useEffect } from 'react'
import { DUNGEONS } from '../data/dungeons'
import type { UserDungeon } from '../lib/dungeons'
import { getSecondsRemaining, formatTime } from '../lib/dungeons'
import { canEnterDungeon } from '../lib/dungeons'
import { getShadowById } from '../data/shadows'

type Props = {
  activeDungeons: UserDungeon[]
  categoryXP: Record<string, number>
  honor: number
  completedDungeonIds: string[]
  onEnter: (dungeonId: string) => void
  onComplete: (id: string) => void
  onAbandon: (id: string) => void
}

function DungeonList({
  activeDungeons,
  categoryXP,
  honor,
  completedDungeonIds,
  onEnter,
  onComplete,
  onAbandon,
}: Props) {
  // If there's an active dungeon, show that
  if (activeDungeons.length > 0) {
    return (
      <ActiveDungeonView
        active={activeDungeons[0]}
        onComplete={onComplete}
        onAbandon={onAbandon}
      />
    )
  }

  return (
    <div className="dungeon-section">
      <div className="dungeon-header">
        <span className="dungeon-title">🏰 DUNGEONS</span>
        <span className="dungeon-sub">The Deep Trials</span>
      </div>

      <div className="dungeon-grid">
        {DUNGEONS.map(dungeon => {
          const isCompleted = completedDungeonIds.includes(dungeon.id)
          const { can, reason } = canEnterDungeon(dungeon, categoryXP, honor, activeDungeons)
          const shadow = getShadowById(dungeon.shadow_reward)
          const stars = '★'.repeat(dungeon.difficulty) + '☆'.repeat(5 - dungeon.difficulty)

          return (
            <div
              key={dungeon.id}
              className={`dungeon-card ${isCompleted ? 'completed' : ''} ${!can ? 'locked' : ''}`}
            >
              <div className="dungeon-card-header">
                <span className="dungeon-card-icon">{dungeon.icon}</span>
                <span className="dungeon-card-name">{dungeon.name}</span>
              </div>

              <div className="dungeon-card-meta">
                <span className="dungeon-card-duration">{dungeon.duration_hours}h</span>
                <span className="dungeon-card-stars">{stars}</span>
              </div>

              <div className="dungeon-card-desc">{dungeon.description}</div>

              <div className="dungeon-card-reward">
                <span className="dungeon-reward-xp">+{dungeon.xp_reward} XP</span>
                {shadow && (
                  <span className="dungeon-reward-shadow">
                    {shadow.icon} {shadow.name}
                  </span>
                )}
              </div>

              {isCompleted ? (
                <div className="dungeon-card-status">✓ CLEARED</div>
              ) : can ? (
                <button
                  className="dungeon-enter-btn"
                  onClick={() => onEnter(dungeon.id)}
                >
                  ENTER DUNGEON →
                </button>
              ) : (
                <div className="dungeon-card-locked">{reason}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

// ============================================
// ACTIVE DUNGEON — Fullscreen timer view
// ============================================

type ActiveProps = {
  active: UserDungeon
  onComplete: (id: string) => void
  onAbandon: (id: string) => void
}

function ActiveDungeonView({ active, onComplete, onAbandon }: ActiveProps) {
  const [seconds, setSeconds] = useState(() => getSecondsRemaining(active))
  const dungeon = DUNGEONS.find(d => d.id === active.dungeon_id)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(getSecondsRemaining(active))
    }, 1000)
    return () => clearInterval(interval)
  }, [active])

  if (!dungeon) return null

  const expired = seconds === 0

  return (
    <div className="dungeon-section active">
      <div className="dungeon-header">
        <span className="dungeon-title">🏰 ACTIVE DUNGEON</span>
      </div>

      <div className="active-dungeon-card">
        <div className="active-dungeon-icon">{dungeon.icon}</div>
        <div className="active-dungeon-name">{dungeon.name}</div>
        <div className="active-dungeon-desc">{dungeon.description}</div>

        <div className={`active-dungeon-timer ${expired ? 'expired' : ''}`}>
          {expired ? 'TIME EXPIRED' : formatTime(seconds)}
        </div>

        <div className="active-dungeon-objectives">
          <div className="objectives-label">OBJECTIVES</div>
          {dungeon.objectives.map((obj, i) => (
            <div key={i} className="objective-item">▸ {obj}</div>
          ))}
        </div>

        {!expired && (
          <button
            className="dungeon-complete-btn"
            onClick={() => onComplete(active.id)}
          >
            ✓ COMPLETE DUNGEON
          </button>
        )}

        {expired && (
          <div className="dungeon-expired-msg">
            The Dungeon has claimed you. −10 HONOR.
          </div>
        )}

        <button
          className="dungeon-abandon-btn"
          onClick={() => {
            if (confirm('Abandon this dungeon? You will fail and lose 10 HONOR.')) {
              onAbandon(active.id)
            }
          }}
        >
          ABANDON (−10 HONOR)
        </button>
      </div>
    </div>
  )
}

export default DungeonList