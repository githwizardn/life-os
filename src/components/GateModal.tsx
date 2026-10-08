import { useState, useEffect } from 'react'
import type { Gate } from '../data/gates'

type Props = {
  gate: Gate
  onEnter: () => void
  onIgnore: () => void
}

function GateModal({ gate, onEnter, onIgnore }: Props) {
  const [seconds, setSeconds] = useState(60)

  useEffect(() => {
    const interval = setInterval(() => {
      setSeconds(prev => {
        if (prev <= 1) {
          clearInterval(interval)
          onIgnore()
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(interval)
  }, [onIgnore])

  return (
    <>
      <div className="modal-overlay gate-overlay" onClick={onIgnore} />
      <div className="modal gate-modal">
        <div className="gate-header">
          <div className="gate-pulse" />
          <span className="gate-label">⚠ A GATE HAS OPENED ⚠</span>
        </div>

        <div className="gate-name">{gate.name}</div>
        <div className="gate-category">{gate.category.toUpperCase()}</div>
        <div className="gate-description">{gate.description}</div>

        <div className="gate-meta">
          <div className="gate-meta-row">
            <span>Duration</span>
            <span>{gate.duration_minutes} min</span>
          </div>
          <div className="gate-meta-row">
            <span>Reward</span>
            <span style={{ color: 'var(--gold)' }}>+{gate.xp_reward} XP</span>
          </div>
          <div className="gate-meta-row">
            <span>Ignore cost</span>
            <span style={{ color: 'var(--danger)' }}>−{gate.honor_cost} HONOR</span>
          </div>
        </div>

        <div className="gate-timer">
          <div className="gate-timer-bar">
            <div
              className="gate-timer-fill"
              style={{ width: `${(seconds / 60) * 100}%` }}
            />
          </div>
          <div className="gate-timer-text">{seconds}s to decide</div>
        </div>

        <div className="gate-actions">
          <button className="gate-enter-btn" onClick={onEnter}>
            ENTER GATE →
          </button>
          <button className="gate-ignore-btn" onClick={onIgnore}>
            IGNORE (−{gate.honor_cost} HONOR)
          </button>
        </div>
      </div>
    </>
  )
}

export default GateModal