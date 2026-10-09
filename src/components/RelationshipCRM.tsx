import { useState } from 'react'
import { TIERS, PERSON_EMOJIS, getTierInfo } from '../data/relationships'
import type { Relationship } from '../lib/relationships'
import {
  isOverdue,
  getDaysUntilBirthday,
  getUrgencyScore,
  formatLastContact,
  getTierCounts,
} from '../lib/relationships'

type Props = {
  people: Relationship[]
  onSave: (person: Omit<Relationship, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_contact_at'> & { id?: string }) => Promise<boolean>
  onMarkContacted: (id: string) => void
  onDelete: (id: string) => void
}

function RelationshipCRM({ people, onSave, onMarkContacted, onDelete }: Props) {
  const [editing, setEditing] = useState<Relationship | null>(null)
  const [creating, setCreating] = useState(false)
  const [tierFilter, setTierFilter] = useState<string | null>(null)

  const counts = getTierCounts(people)

  const sorted = [...people].sort((a, b) => {
    const ua = getUrgencyScore(a)
    const ub = getUrgencyScore(b)
    if (ua !== ub) return ub - ua
    return a.name.localeCompare(b.name)
  })

  const filtered = tierFilter ? sorted.filter(p => p.tier === tierFilter) : sorted

  return (
    <div className="rel-section">
      <div className="rel-header">
        <span className="rel-title">📇 RELATIONSHIP DOSSIER</span>
        <span className="rel-count">{people.length} tracked</span>
      </div>

      <div className="rel-tier-filter">
        <button
          className={`rel-tier-chip ${tierFilter === null ? 'active' : ''}`}
          onClick={() => setTierFilter(null)}
        >
          ALL ({people.length})
        </button>
        {TIERS.map(t => (
          <button
            key={t.id}
            className={`rel-tier-chip ${tierFilter === t.id ? 'active' : ''}`}
            onClick={() => setTierFilter(t.id)}
            style={{ borderColor: t.color, color: tierFilter === t.id ? t.color : undefined }}
          >
            {t.icon} {t.label} ({counts[t.id] || 0})
          </button>
        ))}
      </div>

      {people.length === 0 && (
        <div className="rel-empty">
          <div className="rel-empty-icon">👥</div>
          <div className="rel-empty-text">
            No one tracked yet. Start with your Inner Circle — the 5 people who matter most.
          </div>
        </div>
      )}

      <button className="rel-add-btn" onClick={() => setCreating(true)}>
        + ADD PERSON
      </button>

      <div className="rel-grid">
        {filtered.map(person => {
          const tier = getTierInfo(person.tier)
          const overdue = isOverdue(person)
          const bd = getDaysUntilBirthday(person.birthday)
          const bdSoon = bd !== null && bd <= 14

          return (
            <div
              key={person.id}
              className={`rel-card ${overdue ? 'overdue' : ''}`}
              style={{ borderLeftColor: tier.color }}
              onClick={() => setEditing(person)}
            >
              <div className="rel-card-top">
                <span className="rel-card-emoji">{person.emoji}</span>
                <div className="rel-card-info">
                  <div className="rel-card-name">{person.name}</div>
                  <div className="rel-card-tier" style={{ color: tier.color }}>
                    {tier.icon} {tier.label}
                  </div>
                </div>
              </div>

              <div className="rel-card-meta">
                <div className={`rel-card-contact ${overdue ? 'overdue' : ''}`}>
                  {overdue ? '⚠ ' : ''}{formatLastContact(person)}
                </div>
                {bdSoon && (
                  <div className="rel-card-birthday">
                    🎂 in {bd}d
                  </div>
                )}
              </div>

              {person.key_facts && (
                <div className="rel-card-facts">{person.key_facts}</div>
              )}

              <button
                className="rel-card-contact-btn"
                onClick={e => {
                  e.stopPropagation()
                  onMarkContacted(person.id)
                }}
                title="Mark as contacted now"
              >
                ✓ MARK CONTACTED
              </button>
            </div>
          )
        })}
      </div>

      {(editing || creating) && (
        <PersonModal
          person={editing}
          onSave={onSave}
          onDelete={editing ? () => {
            if (confirm(`Delete ${editing.name}?`)) {
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
// PERSON EDIT MODAL
// ============================================

type ModalProps = {
  person: Relationship | null
  onSave: (data: Omit<Relationship, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'last_contact_at'> & { id?: string }) => Promise<boolean>
  onDelete?: () => void
  onClose: () => void
}

// ============================================
// BIRTHDAY VALIDATION (MM-DD)
// ============================================

function validateBirthday(value: string): string | null {
  if (!value) return null
  if (value.length !== 5 || value[2] !== '-') {
    return 'Use DD-MM format (e.g. 15-04)'
  }
  const d = parseInt(value.slice(0, 2), 10)
  const m = parseInt(value.slice(3, 5), 10)
  if (isNaN(d) || d < 1 || d > 31) return 'Day must be 01–31'
  if (isNaN(m) || m < 1 || m > 12) return 'Month must be 01–12'

  // Real calendar check (day exists in that month)
  const daysInMonth = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  if (d > daysInMonth[m - 1]) {
    return `Month ${String(m).padStart(2, '0')} has only ${daysInMonth[m - 1]} days`
  }

  return null
}

function PersonModal({ person, onSave, onDelete, onClose }: ModalProps) {
  const [name, setName] = useState(person?.name || '')
  const [emoji, setEmoji] = useState(person?.emoji || '👤')
  const [tier, setTier] = useState(person?.tier || 'friend')
  const [birthday, setBirthday] = useState(person?.birthday || '')
  const [contactFreq, setContactFreq] = useState(person?.contact_freq_days || 30)
  const [notes, setNotes] = useState(person?.notes || '')
  const [giftIdeas, setGiftIdeas] = useState(person?.gift_ideas || '')
  const [keyFacts, setKeyFacts] = useState(person?.key_facts || '')
  const [theirPeople, setTheirPeople] = useState(person?.their_people || '')
  const [theirWork, setTheirWork] = useState(person?.their_work || '')
  const [theirStruggles, setTheirStruggles] = useState(person?.their_struggles || '')
  const [theirWins, setTheirWins] = useState(person?.their_wins || '')
  const [sharedHistory, setSharedHistory] = useState(person?.shared_history || '')

  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const birthdayError = validateBirthday(birthday)

  const handleSave = async () => {
    setError(null)

    if (!name.trim()) {
      setError('Name is required.')
      return
    }
    if (birthdayError) {
      setError(birthdayError)
      return
    }

    setSaving(true)
    const ok = await onSave({
      id: person?.id,
      name: name.trim(),
      emoji,
      tier,
      birthday: birthday || null,
      contact_freq_days: contactFreq,
      notes,
      gift_ideas: giftIdeas,
      key_facts: keyFacts,
      their_people: theirPeople,
      their_work: theirWork,
      their_struggles: theirStruggles,
      their_wins: theirWins,
      shared_history: sharedHistory,
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
      <div className="modal rel-modal">
        <div className="rel-modal-title">
          {person ? 'EDIT DOSSIER' : 'NEW DOSSIER'}
        </div>

        <div className="rel-form-row">
          <div className="rel-emoji-picker">
            <div className="rel-emoji-display">{emoji}</div>
            <div className="rel-emoji-grid">
              {PERSON_EMOJIS.slice(0, 15).map(e => (
                <button
                  key={e}
                  className={`rel-emoji-opt ${emoji === e ? 'active' : ''}`}
                  onClick={() => setEmoji(e)}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
        </div>

        <label className="rel-label">NAME</label>
        <input
          className="rel-input"
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="Their name"
          autoFocus
        />

        <label className="rel-label">TIER</label>
        <div className="rel-tier-picker">
          {TIERS.map(t => (
            <button
              key={t.id}
              className={`rel-tier-opt ${tier === t.id ? 'active' : ''}`}
              onClick={() => setTier(t.id)}
              style={{ borderColor: tier === t.id ? t.color : undefined }}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <div className="rel-form-row-2">
          <div>
                        <label className="rel-label">BIRTHDAY (DD-MM)</label>
            <input
              className={`rel-input ${birthdayError ? 'rel-input-error' : ''}`}
              type="text"
              inputMode="numeric"
              placeholder="15-04"
              maxLength={5}
              value={birthday}
              onChange={e => {
                let v = e.target.value.replace(/[^0-9]/g, '')
                if (v.length > 4) v = v.slice(0, 4)
                if (v.length >= 3) v = v.slice(0, 2) + '-' + v.slice(2)
                setBirthday(v)
              }}
            />
            {birthdayError && (
              <div className="rel-field-error">{birthdayError}</div>
            )}
          </div>
          <div>
            <label className="rel-label">CONTACT EVERY (DAYS)</label>
            <input
              className="rel-input"
              type="number"
              value={contactFreq}
              onChange={e => setContactFreq(parseInt(e.target.value) || 30)}
              min="1"
            />
          </div>
        </div>

        <label className="rel-label">KEY FACTS</label>
        <textarea
          className="rel-textarea"
          value={keyFacts}
          onChange={e => setKeyFacts(e.target.value)}
          placeholder="Kids' names, job, hobbies, allergies, anything you should remember..."
          rows={2}
        />

        <label className="rel-label">THEIR PEOPLE</label>
        <textarea
          className="rel-textarea"
          value={theirPeople}
          onChange={e => setTheirPeople(e.target.value)}
          placeholder="Partner, kids, parents, close friends..."
          rows={2}
        />

        <label className="rel-label">THEIR WORK</label>
        <textarea
          className="rel-textarea"
          value={theirWork}
          onChange={e => setTheirWork(e.target.value)}
          placeholder="What they do. Their role. Their ambitions."
          rows={2}
        />

        <label className="rel-label">THEIR STRUGGLES</label>
        <textarea
          className="rel-textarea"
          value={theirStruggles}
          onChange={e => setTheirStruggles(e.target.value)}
          placeholder="What they're going through. So you can be there."
          rows={2}
        />

        <label className="rel-label">THEIR WINS</label>
        <textarea
          className="rel-textarea"
          value={theirWins}
          onChange={e => setTheirWins(e.target.value)}
          placeholder="What they're proud of. So you can celebrate."
          rows={2}
        />

        <label className="rel-label">GIFT IDEAS</label>
        <textarea
          className="rel-textarea"
          value={giftIdeas}
          onChange={e => setGiftIdeas(e.target.value)}
          placeholder="Things they mentioned wanting. Books. Hobbies. Interests."
          rows={2}
        />

        <label className="rel-label">SHARED HISTORY</label>
        <textarea
          className="rel-textarea"
          value={sharedHistory}
          onChange={e => setSharedHistory(e.target.value)}
          placeholder="How you met. What you've been through. Moments that matter."
          rows={2}
        />

        <label className="rel-label">NOTES</label>
        <textarea
          className="rel-textarea"
          value={notes}
          onChange={e => setNotes(e.target.value)}
          placeholder="Anything else. Free-form."
          rows={3}
        />

        {error && <div className="rel-modal-error">{error}</div>}

        <div className="rel-modal-actions">
          <button
            className="rel-save-btn"
            onClick={handleSave}
            disabled={saving || !!birthdayError}
          >
            {saving ? 'SAVING…' : (person ? 'SAVE' : 'CREATE')}
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

export default RelationshipCRM