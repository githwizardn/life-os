import { useState } from 'react'

export type ChronicleEntry = {
  id: string
  week_num: number
  season_num: number
  start_date: string
  end_date: string
  text: string
  created_at: string
}

type Props = {
  entries: ChronicleEntry[]
}

function Chronicle({ entries }: Props) {
  const [expanded, setExpanded] = useState(false)

  if (entries.length === 0) {
    return (
      <div className="chronicle-section">
        <div className="chronicle-header">
          <span className="chronicle-title">📜 CHRONICLE</span>
          <span className="chronicle-count">0 entries</span>
        </div>
        <div className="chronicle-empty">
          <div className="chronicle-empty-text">
            Your first Chronicle will be written at the end of week one.
          </div>
        </div>
      </div>
    )
  }

  const shown = expanded ? entries : entries.slice(0, 3)

  return (
    <div className="chronicle-section">
      <div className="chronicle-header">
        <span className="chronicle-title">📜 CHRONICLE</span>
        <span className="chronicle-count">
          {entries.length} {entries.length === 1 ? 'entry' : 'entries'}
        </span>
      </div>

      <div className="chronicle-list">
        {shown.map(entry => (
          <div key={entry.id} className="chronicle-entry">
            <div className="chronicle-entry-header">
              <span className="chronicle-week">Week {entry.week_num}</span>
              <span className="chronicle-date">
                {new Date(entry.start_date).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric'
                })}
                {' — '}
                {new Date(entry.end_date).toLocaleDateString('en-US', {
                  month: 'short', day: 'numeric', year: 'numeric'
                })}
              </span>
            </div>
            <div className="chronicle-text">{entry.text}</div>
          </div>
        ))}
      </div>

      {entries.length > 3 && (
        <button
          className="chronicle-toggle-btn"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'SHOW LESS' : `SHOW ALL ${entries.length}`}
        </button>
      )}
    </div>
  )
}

export default Chronicle