import { useState } from 'react'

type NoteEntry = {
  id: string
  data: Record<string, string>
  saved_at: string
}

type Props = {
  notes: Record<string, string>
  setNotes: (notes: Record<string, string>) => void
  onSave: () => void
  onDeleteHistory: (id: string) => void
  history: NoteEntry[]
}

const DAILY_FIELDS = [
  { id: 'n1', placeholder: "Today's thoughts & intentions..." },
  { id: 'n2', placeholder: "What am I building toward?" },
  { id: 'n3', placeholder: "Energy & mood check-in..." },
  { id: 'n4', placeholder: "Hard honest truth today..." },
]

const WEEKLY_FIELDS = [
  { id: 'rq1', placeholder: "What worked this week?" },
  { id: 'rq2', placeholder: "What didn't work?" },
  { id: 'rq3', placeholder: "One thing I'd change..." },
  { id: 'rq4', placeholder: "How did I feel overall?" },
]

const FIELD_LABELS: Record<string, string> = {
  n1: "Thoughts",
  n2: "Building toward",
  n3: "Energy & mood",
  n4: "Honest truth",
  rq1: "What worked",
  rq2: "What didn't",
  rq3: "One change",
  rq4: "How I felt",
}

function Notes({ notes, setNotes, onSave, onDeleteHistory, history }: Props) {
  const [showHistory, setShowHistory] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleChange = (id: string, value: string) => {
    setNotes({ ...notes, [id]: value })
  }

  const handleSave = () => {
    onSave()
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  // Download a single history entry as .txt
  const handleDownload = (entry: NoteEntry) => {
    const date = new Date(entry.saved_at).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric',
      hour: '2-digit', minute: '2-digit'
    })

    const lines = [
      'LIFE OS — Notes',
      `Saved: ${date}`,
      '',
      '=== DAILY NOTES ===',
      `Thoughts: ${entry.data.n1 || '(empty)'}`,
      `Building toward: ${entry.data.n2 || '(empty)'}`,
      `Energy & mood: ${entry.data.n3 || '(empty)'}`,
      `Honest truth: ${entry.data.n4 || '(empty)'}`,
      '',
      '=== WEEKLY REVIEW ===',
      `What worked: ${entry.data.rq1 || '(empty)'}`,
      `What didn't: ${entry.data.rq2 || '(empty)'}`,
      `One change: ${entry.data.rq3 || '(empty)'}`,
      `How I felt: ${entry.data.rq4 || '(empty)'}`,
    ]

    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `lifeos-notes-${new Date(entry.saved_at).toISOString().slice(0, 10)}.txt`
    a.click()
    
    // --- FIX 1: Prevent memory leak by destroying the URL after clicking ---
    URL.revokeObjectURL(a.href) 
  }

  return (
    <div className="notes-section">

      {/* Daily Notes */}
      <div className="notes-group">
        <div className="notes-title">📓 Daily Notes</div>
        {DAILY_FIELDS.map(field => (
          <textarea
            key={field.id}
            className="note-area"
            placeholder={field.placeholder}
            value={notes[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
          />
        ))}
      </div>

      {/* Weekly Review */}
      <div className="notes-group">
        <div className="notes-title">📅 Weekly Review</div>
        {WEEKLY_FIELDS.map(field => (
          <textarea
            key={field.id}
            className="note-area"
            placeholder={field.placeholder}
            value={notes[field.id] || ''}
            onChange={e => handleChange(field.id, e.target.value)}
          />
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: '10px' }}>
        <button className="export-btn" onClick={handleSave} style={{ flex: 1 }}>
          {saved ? '✓ SAVED!' : '💾 SAVE NOTES'}
        </button>
        <button
          className="export-btn"
          onClick={() => setShowHistory(!showHistory)}
          style={{ flex: 1 }}
        >
          {showHistory ? 'HIDE HISTORY' : `📚 HISTORY (${history.length})`}
        </button>
      </div>

      {/* Notes History */}
      {showHistory && (
        <div className="notes-history">
          <div className="notes-title" style={{ marginTop: '20px' }}>
            📚 SAVED NOTES HISTORY
          </div>

          {history.length === 0 ? (
            <div style={{ color: 'var(--text-muted)', fontSize: '13px', padding: '12px 0' }}>
              No saved notes yet. Click Save Notes to create your first entry.
            </div>
          ) : (
            history.map(entry => (
              <div key={entry.id} className="history-entry">

                {/* Header row — date + buttons */}
                <div className="history-header">
                  <div className="history-date">
                    {new Date(entry.saved_at).toLocaleDateString('en-US', {
                      weekday: 'short',
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="history-actions">
                    {/* Download button */}
                    <button
                      className="history-btn download"
                      onClick={() => handleDownload(entry)}
                      title="Download as .txt"
                    >
                      ⬇ DOWNLOAD
                    </button>
                    {/* Delete button */}
                    <button
                      className="history-btn delete"
                      onClick={() => onDeleteHistory(entry.id)}
                      title="Delete this entry"
                    >
                      🗑 DELETE
                    </button>
                  </div>
                </div>

                {/* Note fields */}
                {Object.entries(entry.data).map(([key, value]) =>
                  value ? (
                    <div key={key} className="history-field">
                      <div className="history-label">{FIELD_LABELS[key] || key}</div>
                      {/* --- FIX 2: whiteSpace 'pre-wrap' keeps line breaks intact! --- */}
                      <div className="history-value" style={{ whiteSpace: 'pre-wrap' }}>
                        {value as string}
                      </div>
                    </div>
                  ) : null
                )}

              </div>
            ))
          )}
        </div>
      )}

    </div>
  )
}

export default Notes