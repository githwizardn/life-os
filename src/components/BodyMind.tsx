import { useState } from 'react'
import {
  type SleepLog, type Workout, type Measurement, type ReadingLog, type FinanceLog,
  READING_TYPES, READING_STATUS, FINANCE_TYPES,
  todayISO, fmtDate, computeHours, getQualityColor, getLast7Sleep,
  getLastEntry, getPreviousEntry,
} from '../lib/bodyMind'

type Props = {
  sleepLogs: SleepLog[]
  workouts: Workout[]
  measurements: Measurement[]
  readingLogs: ReadingLog[]
  financeLogs: FinanceLog[]
  onSaveSleep: (log: Omit<SleepLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  onDeleteSleep: (id: string) => void
  onSaveWorkout: (w: Omit<Workout, 'id' | 'user_id' | 'created_at'> & { id?: string }) => Promise<boolean>
  onDeleteWorkout: (id: string) => void
  onSaveMeasurement: (m: Omit<Measurement, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>
  onDeleteMeasurement: (id: string) => void
  onSaveReading: (r: Omit<ReadingLog, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<boolean>
  onDeleteReading: (id: string) => void
  onSaveFinance: (f: Omit<FinanceLog, 'id' | 'user_id' | 'created_at'> & { id?: string }) => Promise<boolean>
  onDeleteFinance: (id: string) => void
}

type Tab = 'sleep' | 'workout' | 'measure' | 'reading' | 'finance'

function BodyMind(props: Props) {
  const [tab, setTab] = useState<Tab>('sleep')

  return (
    <div className="bm-section">
      <div className="bm-header">
        <span className="bm-title">💪 BODY & MIND</span>
      </div>

      <div className="bm-tabs">
        {(['sleep','workout','measure','reading','finance'] as Tab[]).map(t => (
          <button
            key={t}
            className={`bm-tab ${tab === t ? 'active' : ''}`}
            onClick={() => setTab(t)}
          >
            {t === 'sleep' && '😴 SLEEP'}
            {t === 'workout' && '🏋️ WORKOUT'}
            {t === 'measure' && '📏 MEASURE'}
            {t === 'reading' && '📚 READING'}
            {t === 'finance' && '💰 FINANCE'}
          </button>
        ))}
      </div>

      {tab === 'sleep' && <SleepTab {...props} />}
      {tab === 'workout' && <WorkoutTab {...props} />}
      {tab === 'measure' && <MeasureTab {...props} />}
      {tab === 'reading' && <ReadingTab {...props} />}
      {tab === 'finance' && <FinanceTab {...props} />}
    </div>
  )
}

// ============================================
// SLEEP TAB
// ============================================

function SleepTab({ sleepLogs, onSaveSleep, onDeleteSleep }: Props) {
  const [open, setOpen] = useState(false)
  const last7 = getLast7Sleep(sleepLogs)
  const avgHours = last7.length
    ? Math.round((last7.reduce((s, l) => s + Number(l.hours), 0) / last7.length) * 10) / 10
    : 0
  const avgQuality = last7.length
    ? Math.round((last7.reduce((s, l) => s + l.quality, 0) / last7.length) * 10) / 10
    : 0

  return (
    <>
      <div className="bm-stats">
        <div className="bm-stat">
          <div className="bm-stat-label">AVG HOURS (7d)</div>
          <div className="bm-stat-value">{avgHours || '—'}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">AVG QUALITY</div>
          <div className="bm-stat-value">{avgQuality || '—'}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">NIGHTS LOGGED</div>
          <div className="bm-stat-value">{sleepLogs.length}</div>
        </div>
      </div>

      {last7.length > 0 && (
        <div className="bm-sleep-chart">
          {last7.map(l => (
            <div key={l.id} className="bm-sleep-bar-wrap">
              <div
                className="bm-sleep-bar"
                style={{
                  height: `${Math.min(100, (Number(l.hours) / 10) * 100)}%`,
                  background: getQualityColor(l.quality),
                }}
                title={`${l.hours}h · quality ${l.quality}/5`}
              />
              <div className="bm-sleep-label">{fmtDate(l.date)}</div>
            </div>
          ))}
        </div>
      )}

      <button className="bm-add-btn" onClick={() => setOpen(true)}>
        + LOG SLEEP
      </button>

      {sleepLogs.length === 0 && (
        <div className="bm-empty">No sleep logged yet. Start tonight.</div>
      )}

      <div className="bm-list">
        {sleepLogs.slice(0, 30).map(l => (
          <div key={l.id} className="bm-row">
            <div className="bm-row-main">
              <div className="bm-row-title">
                {l.hours}h · {fmtDate(l.date)}
              </div>
              <div className="bm-row-sub">
                {l.bedtime && `🌙 ${l.bedtime}`} {l.wake_time && `☀ ${l.wake_time}`}
                {' · '}quality {l.quality}/5
              </div>
              {l.notes && <div className="bm-row-notes">{l.notes}</div>}
            </div>
            <button className="bm-del-btn" onClick={() => onDeleteSleep(l.id)} title="Delete">×</button>
          </div>
        ))}
      </div>

      {open && (
        <SleepModal
          onSave={async d => { const ok = await onSaveSleep(d); if (ok) setOpen(false); return ok }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function SleepModal({ onSave, onClose }: {
  onSave: (d: Omit<SleepLog, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<boolean>
  onClose: () => void
}) {
  const [date, setDate] = useState(todayISO())
  const [bedtime, setBedtime] = useState('23:00')
  const [wakeTime, setWakeTime] = useState('07:00')
  const [quality, setQuality] = useState(3)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const hours = computeHours(bedtime, wakeTime)

  const handle = async () => {
    setSaving(true)
    const ok = await onSave({ date, bedtime, wake_time: wakeTime, hours, quality, notes })
    setSaving(false)
    if (!ok) alert('Save failed — check console')
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal rel-modal">
        <div className="rel-modal-title">LOG SLEEP</div>

        <label className="rel-label">DATE</label>
        <input className="rel-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">BEDTIME</label>
            <input className="rel-input" type="time" value={bedtime} onChange={e => setBedtime(e.target.value)} />
          </div>
          <div>
            <label className="rel-label">WAKE TIME</label>
            <input className="rel-input" type="time" value={wakeTime} onChange={e => setWakeTime(e.target.value)} />
          </div>
        </div>

        <div className="bm-hours-preview">= {hours} hours</div>

        <label className="rel-label">QUALITY (1–5)</label>
        <div className="bm-quality-picker">
          {[1,2,3,4,5].map(q => (
            <button key={q}
              className={`bm-quality-opt ${quality === q ? 'active' : ''}`}
              onClick={() => setQuality(q)}
              style={quality === q ? { borderColor: getQualityColor(q), color: getQualityColor(q) } : {}}
            >{q}</button>
          ))}
        </div>

        <label className="rel-label">NOTES</label>
        <textarea className="rel-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

        <div className="rel-modal-actions">
          <button className="rel-save-btn" onClick={handle} disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE'}
          </button>
          <button className="rel-cancel-btn" onClick={onClose} disabled={saving}>CANCEL</button>
        </div>
      </div>
    </>
  )
}

// ============================================
// WORKOUT TAB
// ============================================

function WorkoutTab({ workouts, onSaveWorkout, onDeleteWorkout }: Props) {
  const [open, setOpen] = useState(false)
  const [now] = useState(() => Date.now())

  const grouped: Record<string, Workout[]> = {}
  for (const w of workouts) {
    if (!grouped[w.date]) grouped[w.date] = []
    grouped[w.date].push(w)
  }
  const dates = Object.keys(grouped).sort((a, b) => b.localeCompare(a))

  return (
    <>
      <div className="bm-stats">
        <div className="bm-stat">
          <div className="bm-stat-label">TOTAL SESSIONS</div>
          <div className="bm-stat-value">{dates.length}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">LAST 7 DAYS</div>
          <div className="bm-stat-value">
                        {dates.filter(d => (now - new Date(d).getTime()) < 7 * 864e5).length}
          </div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">TOTAL EXERCISES</div>
          <div className="bm-stat-value">{workouts.length}</div>
        </div>
      </div>

      <button className="bm-add-btn" onClick={() => setOpen(true)}>+ LOG WORKOUT</button>

      {dates.length === 0 && (
        <div className="bm-empty">No workouts yet. Log your first session.</div>
      )}

      {dates.slice(0, 15).map(d => (
        <div key={d} className="bm-group">
          <div className="bm-group-date">{fmtDate(d)}</div>
          {grouped[d].map(w => (
            <div key={w.id} className="bm-row">
              <div className="bm-row-main">
                <div className="bm-row-title">{w.exercise}</div>
                <div className="bm-row-sub">
                  {w.sets} × {w.reps}{w.weight > 0 && ` · ${w.weight}${w.unit}`}
                </div>
                {w.notes && <div className="bm-row-notes">{w.notes}</div>}
              </div>
              <button className="bm-del-btn" onClick={() => onDeleteWorkout(w.id)}>×</button>
            </div>
          ))}
        </div>
      ))}

      {open && (
        <WorkoutModal
          onSave={async d => { const ok = await onSaveWorkout(d); if (ok) setOpen(false); return ok }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function WorkoutModal({ onSave, onClose }: {
  onSave: (d: Omit<Workout, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>
  onClose: () => void
}) {
  const [date, setDate] = useState(todayISO())
  const [exercise, setExercise] = useState('')
  const [sets, setSets] = useState(3)
  const [reps, setReps] = useState(10)
  const [weight, setWeight] = useState(0)
  const [unit, setUnit] = useState('kg')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    if (!exercise.trim()) { alert('Exercise name required'); return }
    setSaving(true)
    const ok = await onSave({
      date, exercise: exercise.trim(), sets, reps, weight, unit, notes,
    })
    setSaving(false)
    if (!ok) alert('Save failed — check console')
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal rel-modal">
        <div className="rel-modal-title">LOG WORKOUT</div>

        <label className="rel-label">DATE</label>
        <input className="rel-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

        <label className="rel-label">EXERCISE</label>
        <input className="rel-input" value={exercise} onChange={e => setExercise(e.target.value)}
          placeholder="Bench press, Squat, Running…" autoFocus />

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">SETS</label>
            <input className="rel-input" type="number" min="0" value={sets}
              onChange={e => setSets(parseInt(e.target.value) || 0)} />
          </div>
          <div>
            <label className="rel-label">REPS</label>
            <input className="rel-input" type="number" min="0" value={reps}
              onChange={e => setReps(parseInt(e.target.value) || 0)} />
          </div>
        </div>

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">WEIGHT</label>
            <input className="rel-input" type="number" min="0" step="0.5" value={weight}
              onChange={e => setWeight(parseFloat(e.target.value) || 0)} />
          </div>
          <div>
            <label className="rel-label">UNIT</label>
            <div className="bm-unit-picker">
              <button className={`bm-unit ${unit === 'kg' ? 'active' : ''}`} onClick={() => setUnit('kg')}>KG</button>
              <button className={`bm-unit ${unit === 'lb' ? 'active' : ''}`} onClick={() => setUnit('lb')}>LB</button>
            </div>
          </div>
        </div>

        <label className="rel-label">NOTES</label>
        <textarea className="rel-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

        <div className="rel-modal-actions">
          <button className="rel-save-btn" onClick={handle} disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE'}
          </button>
          <button className="rel-cancel-btn" onClick={onClose} disabled={saving}>CANCEL</button>
        </div>
      </div>
    </>
  )
}

// ============================================
// MEASURE TAB
// ============================================

function MeasureTab({ measurements, onSaveMeasurement, onDeleteMeasurement }: Props) {
  const [open, setOpen] = useState(false)
  const latest = getLastEntry(measurements)
  const prev = getPreviousEntry(measurements)

  const delta = (key: 'weight'|'waist'|'chest'|'arms'): string => {
    if (!latest || !prev) return ''
    const a = latest[key], b = prev[key]
    if (a == null || b == null) return ''
    const d = a - b
    if (d === 0) return '•'
    return (d > 0 ? '↑' : '↓') + Math.abs(d).toFixed(1)
  }

  const deltaColor = (key: 'weight'|'waist'|'chest'|'arms'): string => {
    if (!latest || !prev) return 'var(--text-muted)'
    const a = latest[key], b = prev[key]
    if (a == null || b == null) return 'var(--text-muted)'
    return 'var(--text-mid)'
  }

  return (
    <>
      {latest && (
        <div className="bm-stats">
          {(['weight','waist','chest','arms'] as const).map(k => (
            latest[k] != null && (
              <div key={k} className="bm-stat">
                <div className="bm-stat-label">{k.toUpperCase()}</div>
                <div className="bm-stat-value">{latest[k]}</div>
                {prev && <div className="bm-stat-delta" style={{ color: deltaColor(k) }}>{delta(k)}</div>}
              </div>
            )
          ))}
        </div>
      )}

      <button className="bm-add-btn" onClick={() => setOpen(true)}>+ LOG MEASUREMENT</button>

      {measurements.length === 0 && (
        <div className="bm-empty">No measurements yet.</div>
      )}

      <div className="bm-list">
        {measurements.slice(0, 20).map(m => (
          <div key={m.id} className="bm-row">
            <div className="bm-row-main">
              <div className="bm-row-title">{fmtDate(m.date)}</div>
              <div className="bm-row-sub">
                {m.weight != null && `W ${m.weight} · `}
                {m.waist != null && `Waist ${m.waist} · `}
                {m.chest != null && `Chest ${m.chest} · `}
                {m.arms != null && `Arms ${m.arms}`}
              </div>
              {m.notes && <div className="bm-row-notes">{m.notes}</div>}
            </div>
            <button className="bm-del-btn" onClick={() => onDeleteMeasurement(m.id)}>×</button>
          </div>
        ))}
      </div>

      {open && (
        <MeasureModal
          onSave={async d => { const ok = await onSaveMeasurement(d); if (ok) setOpen(false); return ok }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function MeasureModal({ onSave, onClose }: {
  onSave: (d: Omit<Measurement, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>
  onClose: () => void
}) {
  const [date, setDate] = useState(todayISO())
  const [weight, setWeight] = useState('')
  const [waist, setWaist] = useState('')
  const [chest, setChest] = useState('')
  const [arms, setArms] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    setSaving(true)
    const ok = await onSave({
      date,
      weight: weight ? parseFloat(weight) : null,
      waist: waist ? parseFloat(waist) : null,
      chest: chest ? parseFloat(chest) : null,
      arms: arms ? parseFloat(arms) : null,
      notes,
    })
    setSaving(false)
    if (!ok) alert('Save failed — check console')
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal rel-modal">
        <div className="rel-modal-title">LOG MEASUREMENT</div>

        <label className="rel-label">DATE</label>
        <input className="rel-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">WEIGHT</label>
            <input className="rel-input" type="number" step="0.1" value={weight} onChange={e => setWeight(e.target.value)} />
          </div>
          <div>
            <label className="rel-label">WAIST</label>
            <input className="rel-input" type="number" step="0.1" value={waist} onChange={e => setWaist(e.target.value)} />
          </div>
        </div>

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">CHEST</label>
            <input className="rel-input" type="number" step="0.1" value={chest} onChange={e => setChest(e.target.value)} />
          </div>
          <div>
            <label className="rel-label">ARMS</label>
            <input className="rel-input" type="number" step="0.1" value={arms} onChange={e => setArms(e.target.value)} />
          </div>
        </div>

        <label className="rel-label">NOTES</label>
        <textarea className="rel-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

        <div className="rel-modal-actions">
          <button className="rel-save-btn" onClick={handle} disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE'}
          </button>
          <button className="rel-cancel-btn" onClick={onClose} disabled={saving}>CANCEL</button>
        </div>
      </div>
    </>
  )
}

// ============================================
// READING TAB
// ============================================

function ReadingTab({ readingLogs, onSaveReading, onDeleteReading }: Props) {
  const [editing, setEditing] = useState<ReadingLog | null>(null)
  const [creating, setCreating] = useState(false)

  const reading = readingLogs.filter(r => r.status === 'reading')
  const finished = readingLogs.filter(r => r.status !== 'reading')

  return (
    <>
      <div className="bm-stats">
        <div className="bm-stat">
          <div className="bm-stat-label">READING</div>
          <div className="bm-stat-value">{reading.length}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">FINISHED</div>
          <div className="bm-stat-value">{finished.filter(f => f.status === 'finished').length}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">TOTAL</div>
          <div className="bm-stat-value">{readingLogs.length}</div>
        </div>
      </div>

      <button className="bm-add-btn" onClick={() => setCreating(true)}>+ ADD BOOK</button>

      {readingLogs.length === 0 && <div className="bm-empty">Nothing yet. Log what you're reading.</div>}

      <div className="bm-list">
        {readingLogs.map(r => (
          <div key={r.id} className="bm-row" onClick={() => setEditing(r)} style={{ cursor: 'pointer' }}>
            <div className="bm-row-main">
              <div className="bm-row-title">
                {r.title}
                {r.rating > 0 && <span className="bm-rating"> {'★'.repeat(r.rating)}{'☆'.repeat(5 - r.rating)}</span>}
              </div>
              <div className="bm-row-sub">
                {r.author && `${r.author} · `}{r.type} · {r.status}
              </div>
              {r.takeaways && <div className="bm-row-notes">{r.takeaways.slice(0, 120)}</div>}
            </div>
            <button className="bm-del-btn" onClick={e => { e.stopPropagation(); onDeleteReading(r.id) }}>×</button>
          </div>
        ))}
      </div>

      {(editing || creating) && (
        <ReadingModal
          log={editing}
          onSave={async d => {
            const ok = await onSaveReading(d)
            if (ok) { setEditing(null); setCreating(false) }
            return ok
          }}
          onClose={() => { setEditing(null); setCreating(false) }}
        />
      )}
    </>
  )
}

function ReadingModal({ log, onSave, onClose }: {
  log: ReadingLog | null
  onSave: (d: Omit<ReadingLog, 'id' | 'user_id' | 'created_at' | 'updated_at'> & { id?: string }) => Promise<boolean>
  onClose: () => void
}) {
  const [title, setTitle] = useState(log?.title || '')
  const [author, setAuthor] = useState(log?.author || '')
  const [type, setType] = useState(log?.type || 'book')
  const [status, setStatus] = useState(log?.status || 'reading')
  const [rating, setRating] = useState(log?.rating || 0)
  const [takeaways, setTakeaways] = useState(log?.takeaways || '')
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    if (!title.trim()) { alert('Title required'); return }
    setSaving(true)
    const ok = await onSave({
      id: log?.id,
      title: title.trim(),
      author,
      type,
      status,
      rating,
      takeaways,
      started_at: log?.started_at || null,
      finished_at: status === 'finished' ? (log?.finished_at || todayISO()) : null,
    })
    setSaving(false)
    if (!ok) alert('Save failed — check console')
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal rel-modal">
        <div className="rel-modal-title">{log ? 'EDIT' : 'NEW'} READING</div>

        <label className="rel-label">TITLE</label>
        <input className="rel-input" value={title} onChange={e => setTitle(e.target.value)} autoFocus />

        <label className="rel-label">AUTHOR</label>
        <input className="rel-input" value={author} onChange={e => setAuthor(e.target.value)} />

        <div className="rel-form-row-2">
          <div>
            <label className="rel-label">TYPE</label>
            <select className="rel-input" value={type} onChange={e => setType(e.target.value)}>
              {READING_TYPES.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
          <div>
            <label className="rel-label">STATUS</label>
            <select className="rel-input" value={status} onChange={e => setStatus(e.target.value)}>
              {READING_STATUS.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <label className="rel-label">RATING</label>
        <div className="bm-rating-picker">
          {[1,2,3,4,5].map(n => (
            <button key={n}
              className={`bm-star ${rating >= n ? 'active' : ''}`}
              onClick={() => setRating(rating === n ? 0 : n)}
            >★</button>
          ))}
        </div>

        <label className="rel-label">TAKEAWAYS</label>
        <textarea className="rel-textarea" value={takeaways} onChange={e => setTakeaways(e.target.value)} rows={3} />

        <div className="rel-modal-actions">
          <button className="rel-save-btn" onClick={handle} disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE'}
          </button>
          <button className="rel-cancel-btn" onClick={onClose} disabled={saving}>CANCEL</button>
        </div>
      </div>
    </>
  )
}

// ============================================
// FINANCE TAB
// ============================================

function FinanceTab({ financeLogs, onSaveFinance, onDeleteFinance }: Props) {
  const [open, setOpen] = useState(false)
  const [filter, setFilter] = useState<'all' | 'income' | 'expense' | 'net_worth'>('all')
  const [now] = useState(() => Date.now())

  const visible = filter === 'all' ? financeLogs : financeLogs.filter(f => f.type === filter)

  const latestNetWorth = financeLogs.filter(f => f.type === 'net_worth')
    .sort((a, b) => b.date.localeCompare(a.date))[0]

    const last30Income = financeLogs.filter(f => f.type === 'income' &&
    (now - new Date(f.date).getTime()) < 30 * 864e5).reduce((s, f) => s + Number(f.amount), 0)
  const last30Expense = financeLogs.filter(f => f.type === 'expense' &&
    (now - new Date(f.date).getTime()) < 30 * 864e5).reduce((s, f) => s + Number(f.amount), 0)

  return (
    <>
      <div className="bm-stats">
        <div className="bm-stat">
          <div className="bm-stat-label">NET WORTH</div>
          <div className="bm-stat-value">{latestNetWorth ? latestNetWorth.amount : '—'}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">IN (30d)</div>
          <div className="bm-stat-value" style={{ color: 'var(--accent)' }}>+{last30Income}</div>
        </div>
        <div className="bm-stat">
          <div className="bm-stat-label">OUT (30d)</div>
          <div className="bm-stat-value" style={{ color: 'var(--danger)' }}>-{last30Expense}</div>
        </div>
      </div>

      <div className="bm-filter-row">
        {(['all','income','expense','net_worth'] as const).map(f => (
          <button key={f}
            className={`bm-filter-chip ${filter === f ? 'active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'ALL' : f === 'net_worth' ? 'NET' : f.toUpperCase()}
          </button>
        ))}
      </div>

      <button className="bm-add-btn" onClick={() => setOpen(true)}>+ LOG ENTRY</button>

      {visible.length === 0 && <div className="bm-empty">No entries.</div>}

      <div className="bm-list">
        {visible.slice(0, 40).map(f => {
          const typeInfo = FINANCE_TYPES.find(t => t.id === f.type)
          return (
            <div key={f.id} className="bm-row">
              <div className="bm-row-main">
                <div className="bm-row-title" style={{ color: typeInfo?.color }}>
                  {f.type === 'expense' ? '-' : f.type === 'income' ? '+' : '='} {f.amount}
                </div>
                <div className="bm-row-sub">
                  {fmtDate(f.date)}{f.category && ` · ${f.category}`}
                </div>
                {f.notes && <div className="bm-row-notes">{f.notes}</div>}
              </div>
              <button className="bm-del-btn" onClick={() => onDeleteFinance(f.id)}>×</button>
            </div>
          )
        })}
      </div>

      {open && (
        <FinanceModal
          onSave={async d => { const ok = await onSaveFinance(d); if (ok) setOpen(false); return ok }}
          onClose={() => setOpen(false)}
        />
      )}
    </>
  )
}

function FinanceModal({ onSave, onClose }: {
  onSave: (d: Omit<FinanceLog, 'id' | 'user_id' | 'created_at'>) => Promise<boolean>
  onClose: () => void
}) {
  const [date, setDate] = useState(todayISO())
  const [type, setType] = useState('expense')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  const handle = async () => {
    if (!amount || isNaN(parseFloat(amount))) { alert('Amount required'); return }
    setSaving(true)
    const ok = await onSave({
      date, type, amount: parseFloat(amount), category, notes,
    })
    setSaving(false)
    if (!ok) alert('Save failed — check console')
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal rel-modal">
        <div className="rel-modal-title">LOG ENTRY</div>

        <label className="rel-label">TYPE</label>
        <div className="bm-type-picker">
          {FINANCE_TYPES.map(t => (
            <button key={t.id}
              className={`bm-type-opt ${type === t.id ? 'active' : ''}`}
              onClick={() => setType(t.id)}
              style={type === t.id ? { borderColor: t.color, color: t.color } : {}}
            >{t.label}</button>
          ))}
        </div>

        <label className="rel-label">DATE</label>
        <input className="rel-input" type="date" value={date} onChange={e => setDate(e.target.value)} />

        <label className="rel-label">AMOUNT</label>
        <input className="rel-input" type="number" step="0.01" value={amount}
          onChange={e => setAmount(e.target.value)} placeholder="0.00" />

        <label className="rel-label">CATEGORY (optional)</label>
        <input className="rel-input" value={category} onChange={e => setCategory(e.target.value)}
          placeholder="Food, Rent, Salary…" />

        <label className="rel-label">NOTES</label>
        <textarea className="rel-textarea" value={notes} onChange={e => setNotes(e.target.value)} rows={2} />

        <div className="rel-modal-actions">
          <button className="rel-save-btn" onClick={handle} disabled={saving}>
            {saving ? 'SAVING…' : 'SAVE'}
          </button>
          <button className="rel-cancel-btn" onClick={onClose} disabled={saving}>CANCEL</button>
        </div>
      </div>
    </>
  )
}

export default BodyMind