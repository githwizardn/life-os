import { useState } from 'react'
import {
  type Decision,
  type ReviewSlot,
  EMOTIONS,
  getEmotionInfo,
  getDaysSince,
  getReviews,
  getNextDueReview,
  isReviewOverdue,
} from '../lib/decisions'

type Props = {
  decisions: Decision[]
  onSave: (decision: Omit<Decision, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<boolean>
  onDelete: (id: string) => void
}

type Filter = 'all' | 'due' | 'active' | 'resolved'

function DecisionJournal({ decisions, onSave, onDelete }: Props) {
  const [editing, setEditing] = useState<Decision | null>(null)
  const [creating, setCreating] = useState(false)
  const [filter, setFilter] = useState<Filter>('all')

  const due = decisions.filter(d => isReviewOverdue(d))
  const resolved = decisions.filter(d => d.status === 'resolved')
  const active = decisions.filter(d => d.status === 'active' && !isReviewOverdue(d))

  const visible = (() => {
    switch (filter) {
      case 'due': return due
      case 'active': return active
      case 'resolved': return resolved
      default: return decisions
    }
  })()

  const sorted = [...visible].sort((a, b) => {
    const aDue = isReviewOverdue(a)
    const bDue = isReviewOverdue(b)
    if (aDue !== bDue) return aDue ? -1 : 1
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  })

  return (
    <div className="decision-section">
      <div className="decision-header">
        <span className="decision-title">📓 DECISION JOURNAL</span>
        <span className="decision-count">{decisions.length} logged</span>
      </div>

      {decisions.length > 0 && (
        <div className="decision-filter">
          <button
            className={`decision-filter-chip ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            ALL ({decisions.length})
          </button>
          <button
            className={`decision-filter-chip ${filter === 'due' ? 'active' : ''}`}
            onClick={() => setFilter('due')}
          >
            REVIEW DUE ({due.length})
          </button>
          <button
            className={`decision-filter-chip ${filter === 'active' ? 'active' : ''}`}
            onClick={() => setFilter('active')}
          >
            ACTIVE ({active.length})
          </button>
          <button
            className={`decision-filter-chip ${filter === 'resolved' ? 'active' : ''}`}
            onClick={() => setFilter('resolved')}
          >
            RESOLVED ({resolved.length})
          </button>
        </div>
      )}

      {decisions.length === 0 && (
        <div className="decision-empty">
          <div className="decision-empty-icon">📓</div>
          <div className="decision-empty-text">
            No decisions logged yet. Log your next important choice — with reasoning —
            so future you can learn from it.
          </div>
        </div>
      )}

      <button className="decision-add-btn" onClick={() => setCreating(true)}>
        + LOG DECISION
      </button>

      {sorted.length > 0 && (
        <div className="decision-grid">
          {sorted.map(d => (
            <DecisionCard
              key={d.id}
              decision={d}
              onClick={() => setEditing(d)}
            />
          ))}
        </div>
      )}

      {(editing || creating) && (
        <DecisionModal
          decision={editing}
          onSave={onSave}
          onDelete={editing ? () => {
            if (confirm(`Delete "${editing.title}"? This cannot be undone.`)) {
              onDelete(editing.id)
              setEditing(null)
            }
          } : undefined}
          onClose={() => {
            setEditing(null)
            setCreating(false)
          }}
        />
      )}
    </div>
  )
}

// ============================================
// CARD
// ============================================

function DecisionCard({ decision, onClick }: { decision: Decision; onClick: () => void }) {
  const days = getDaysSince(decision)
  const overdue = isReviewOverdue(decision)
  const resolved = decision.status === 'resolved'
  const nextDue = getNextDueReview(decision)
  const emotion = getEmotionInfo(decision.emotion)

  return (
    <div
      className={`decision-card ${overdue ? 'overdue' : ''} ${resolved ? 'resolved' : ''}`}
      onClick={onClick}
    >
      <div className="decision-card-top">
        <div className="decision-card-title">{decision.title}</div>
        {emotion && (
          <span className="decision-card-emotion" title={emotion.label}>
            {emotion.icon}
          </span>
        )}
      </div>

      <div className="decision-card-meta">
        <span>
          {days === 0 ? 'Today' : days === 1 ? '1 day ago' : `${days} days ago`}
        </span>
        <span className="decision-card-confidence">{decision.confidence}/10</span>
      </div>

      {overdue && (
        <div className="decision-card-review">
          ⚠ REVIEW DUE — {nextDue?.label}
        </div>
      )}

      {resolved && (
        <div className="decision-card-resolved">✓ RESOLVED</div>
      )}

      {!resolved && !overdue && nextDue && (
        <div className="decision-card-next">
          Next review: {nextDue.label}{' '}
          {nextDue.dueIn > 0 ? `in ${nextDue.dueIn}d` : 'now'}
        </div>
      )}
    </div>
  )
}

// ============================================
// MODAL
// ============================================

type ModalProps = {
  decision: Decision | null
  onSave: (decision: Omit<Decision, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<boolean>
  onDelete?: () => void
  onClose: () => void
}

function DecisionModal({ decision, onSave, onDelete, onClose }: ModalProps) {
  const [title, setTitle] = useState(decision?.title || '')
  const [context, setContext] = useState(decision?.context || '')
  const [options, setOptions] = useState(decision?.options || '')
  const [chosen, setChosen] = useState(decision?.chosen || '')
  const [reasoning, setReasoning] = useState(decision?.reasoning || '')
  const [emotion, setEmotion] = useState(decision?.emotion || '')
  const [expectedOutcome, setExpectedOutcome] = useState(decision?.expected_outcome || '')
  const [confidence, setConfidence] = useState(decision?.confidence || 5)
  const [outcome1w, setOutcome1w] = useState(decision?.outcome_1w || '')
  const [outcome1m, setOutcome1m] = useState(decision?.outcome_1m || '')
  const [outcome1y, setOutcome1y] = useState(decision?.outcome_1y || '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const isNew = !decision
  const reviews = decision ? getReviews(decision) : []

  const handleSave = async () => {
    setError(null)

    if (!title.trim()) {
      setError('Title is required.')
      return
    }

    setSaving(true)

    const willBeResolved =
      outcome1w.trim().length > 0 &&
      outcome1m.trim().length > 0 &&
      outcome1y.trim().length > 0

    const ok = await onSave({
      id: decision?.id,
      title: title.trim(),
      context,
      options,
      chosen,
      reasoning,
      emotion,
      expected_outcome: expectedOutcome,
      confidence,
      outcome_1w: outcome1w,
      outcome_1m: outcome1m,
      outcome_1y: outcome1y,
      status: willBeResolved ? 'resolved' : 'active',
    })

    setSaving(false)

    if (ok) {
      onClose()
    } else {
      setError('Save failed. Check the browser console for details.')
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={saving ? undefined : onClose} />
      <div className="modal decision-modal">
        <div className="decision-modal-title">
          {isNew ? 'LOG DECISION' : 'DECISION REVIEW'}
        </div>

        <label className="rel-label">TITLE</label>
        <input
          className="rel-input"
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="e.g. Quit the side project"
          autoFocus
        />

        <label className="rel-label">CONTEXT</label>
        <textarea
          className="rel-textarea"
          value={context}
          onChange={e => setContext(e.target.value)}
          placeholder="What's happening that forced this choice?"
          rows={3}
        />

        <label className="rel-label">OPTIONS CONSIDERED</label>
        <textarea
          className="rel-textarea"
          value={options}
          onChange={e => setOptions(e.target.value)}
          placeholder="What were the alternatives?"
          rows={2}
        />

        <label className="rel-label">WHAT YOU CHOSE</label>
        <textarea
          className="rel-textarea"
          value={chosen}
          onChange={e => setChosen(e.target.value)}
          placeholder="The actual decision you made"
          rows={2}
        />

        <label className="rel-label">REASONING — THE HONEST VERSION</label>
        <textarea
          className="rel-textarea"
          value={reasoning}
          onChange={e => setReasoning(e.target.value)}
          placeholder="Why you chose this. Don't filter it."
          rows={3}
        />

        <label className="rel-label">EMOTION AT THE TIME</label>
        <div className="decision-emotion-picker">
          {EMOTIONS.map(e => (
            <button
              key={e.id}
              type="button"
              className={`decision-emotion-opt ${emotion === e.id ? 'active' : ''}`}
              onClick={() => setEmotion(emotion === e.id ? '' : e.id)}
            >
              <span className="decision-emotion-icon">{e.icon}</span>
              <span className="decision-emotion-label">{e.label}</span>
            </button>
          ))}
        </div>

        <label className="rel-label">EXPECTED OUTCOME</label>
        <textarea
          className="rel-textarea"
          value={expectedOutcome}
          onChange={e => setExpectedOutcome(e.target.value)}
          placeholder="What do you predict will happen?"
          rows={2}
        />

        <label className="rel-label">CONFIDENCE — {confidence}/10</label>
        <input
          className="decision-confidence-slider"
          type="range"
          min="1"
          max="10"
          value={confidence}
          onChange={e => setConfidence(parseInt(e.target.value))}
        />

        {!isNew && reviews.length > 0 && (
          <>
            <div className="decision-review-divider">
              <span>REVIEWS</span>
            </div>

            <ReviewField
              slot={reviews[0]}
              value={outcome1w}
              onChange={setOutcome1w}
              placeholder="What actually happened after 1 week?"
            />
            <ReviewField
              slot={reviews[1]}
              value={outcome1m}
              onChange={setOutcome1m}
              placeholder="What actually happened after 1 month?"
            />
            <ReviewField
              slot={reviews[2]}
              value={outcome1y}
              onChange={setOutcome1y}
              placeholder="What actually happened after 1 year?"
            />
          </>
        )}

        {error && <div className="rel-modal-error">{error}</div>}

        <div className="rel-modal-actions">
          <button
            className="rel-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? 'SAVING…' : (isNew ? 'CREATE' : 'SAVE')}
          </button>
          <button
            className="rel-cancel-btn"
            onClick={onClose}
            disabled={saving}
          >
            CANCEL
          </button>
          {onDelete && (
            <button
              className="rel-delete-btn"
              onClick={onDelete}
              disabled={saving}
            >
              DELETE
            </button>
          )}
        </div>
      </div>
    </>
  )
}

// ============================================
// REVIEW FIELD (locked / unlocked)
// ============================================

function ReviewField({
  slot,
  value,
  onChange,
  placeholder,
}: {
  slot: ReviewSlot
  value: string
  onChange: (v: string) => void
  placeholder: string
}) {
  if (!slot.available) {
    return (
      <div className="decision-review-locked">
        <label className="rel-label">
          {slot.label.toUpperCase()} REVIEW — LOCKED
        </label>
        <div className="decision-review-locked-text">
          Available in {slot.dueIn} day{slot.dueIn === 1 ? '' : 's'}
        </div>
      </div>
    )
  }

  return (
    <>
      <label className="rel-label">
        {slot.label.toUpperCase()} REVIEW
        {slot.filled ? ' ✓' : ' — DUE'}
      </label>
      <textarea
        className="rel-textarea"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
      />
    </>
  )
}

export default DecisionJournal