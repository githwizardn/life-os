// --- Props ---
type Props = {
  notes: Record<string, string>
  setNotes: (notes: Record<string, string>) => void
}

// --- Note fields definition ---
// Each field has an id (used as key in storage) and a placeholder
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

function Notes({ notes, setNotes }: Props) {

  // Called every time user types in any textarea
  // id = which field changed, value = new text
  const handleChange = (id: string, value: string) => {
    // Spread existing notes, update only the changed field
    // e.g. { n1: 'old', n2: 'old' } → { n1: 'new', n2: 'old' }
    setNotes({ ...notes, [id]: value })
  }

  // Export notes as a .txt file
  const handleExport = () => {
    const lines = [
      'LIFE OS — Notes Export',
      `Date: ${new Date().toLocaleDateString()}`,
      '',
      '=== DAILY NOTES ===',
      `Thoughts: ${notes.n1 || '(empty)'}`,
      `Building toward: ${notes.n2 || '(empty)'}`,
      `Energy & mood: ${notes.n3 || '(empty)'}`,
      `Honest truth: ${notes.n4 || '(empty)'}`,
      '',
      '=== WEEKLY REVIEW ===',
      `What worked: ${notes.rq1 || '(empty)'}`,
      `What didn't: ${notes.rq2 || '(empty)'}`,
      `One change: ${notes.rq3 || '(empty)'}`,
      `How I felt: ${notes.rq4 || '(empty)'}`,
    ]

    // Create a text file and trigger download
    const blob = new Blob([lines.join('\n')], { type: 'text/plain' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `lifeos-notes-${new Date().toISOString().slice(0, 10)}.txt`
    a.click()
  }

  return (
    <div className="notes-section">

      {/* Tabs — Daily and Weekly */}
      {/* Daily Notes */}
      <div className="notes-group">
        <div className="notes-title">📓 Daily Notes</div>

        {DAILY_FIELDS.map(field => (
          <textarea
            key={field.id}
            className="note-area"
            placeholder={field.placeholder}
            // Get saved value from notes object, fallback to empty string
            value={notes[field.id] || ''}
            // Update notes when user types
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

      {/* Export button */}
      <button className="export-btn" onClick={handleExport}>
        📥 Export Notes
      </button>

    </div>
  )
}

export default Notes