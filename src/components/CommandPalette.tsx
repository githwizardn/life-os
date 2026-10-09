// ============================================
// COMMAND PALETTE — Ctrl+K / ⌘K
// ============================================

import { useEffect, useMemo, useRef, useState } from 'react'
import type { TaskItem, Quest } from '../data/tasks'
import type { Relationship } from '../lib/relationships'
import type { Decision } from '../lib/decisions'
import type { ReadingLog } from '../lib/bodyMind'
import type { TabId } from './Sidebar'
import { buildIndex, filterIndex, type SearchItem } from '../lib/search'

type Props = {
  open: boolean
  onClose: () => void
  onNavigate: (tab: TabId) => void
  tasks: TaskItem[]
  quests: Quest[]
  relationships: Relationship[]
  decisions: Decision[]
  readingLogs: ReadingLog[]
  notes: Record<string, string>
}

const GROUP_LABELS: Record<SearchItem['type'], string> = {
  nav: 'NAVIGATE',
  task: 'TASKS',
  quest: 'QUESTS',
  person: 'PEOPLE',
  decision: 'DECISIONS',
  book: 'READING',
  note: 'NOTES',
}

const GROUP_ORDER: SearchItem['type'][] = [
  'nav', 'task', 'quest', 'person', 'decision', 'book', 'note',
]

function CommandPalette({
  open,
  onClose,
  onNavigate,
  tasks,
  quests,
  relationships,
  decisions,
  readingLogs,
  notes,
}: Props) {
  const [query, setQuery] = useState('')
  const [cursor, setCursor] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const index = useMemo(
    () =>
      buildIndex({
        tasks,
        quests,
        relationships,
        decisions,
        readingLogs,
        notes,
      }),
    [tasks, quests, relationships, decisions, readingLogs, notes]
  )

  const results = useMemo(() => filterIndex(index, query), [index, query])

  useEffect(() => {
    if (open) {
      setQuery('')
      setCursor(0)
      const t = setTimeout(() => inputRef.current?.focus(), 30)
      return () => clearTimeout(t)
    }
  }, [open])

  useEffect(() => {
    setCursor(0)
  }, [query])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        onClose()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        setCursor(c => Math.min(results.length - 1, c + 1))
      }
      if (e.key === 'ArrowUp') {
        e.preventDefault()
        setCursor(c => Math.max(0, c - 1))
      }
      if (e.key === 'Enter') {
        e.preventDefault()
        const item = results[cursor]
        if (item) {
          onNavigate(item.tab)
          onClose()
        }
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, results, cursor, onNavigate, onClose])

  if (!open) return null

  const grouped: Partial<Record<SearchItem['type'], SearchItem[]>> = {}
  for (const item of results) {
    if (!grouped[item.type]) grouped[item.type] = []
    grouped[item.type]!.push(item)
  }

  let flatIndex = -1

  return (
    <>
      <div className="palette-overlay" onClick={onClose} />
      <div className="palette" role="dialog" aria-modal="true" aria-label="Command palette">
        <div className="palette-input-row">
          <span className="palette-prefix">&gt;</span>
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search or jump to…"
            spellCheck={false}
            autoComplete="off"
          />
          <span className="palette-hint">ESC</span>
        </div>

        <div className="palette-body">
          {results.length === 0 && (
            <div className="palette-empty">No matches</div>
          )}

          {GROUP_ORDER.map(type => {
            const items = grouped[type]
            if (!items || items.length === 0) return null
            return (
              <div key={type} className="palette-group">
                <div className="palette-group-label">{GROUP_LABELS[type]}</div>
                {items.map(item => {
                  flatIndex++
                  const idx = flatIndex
                  const isActive = idx === cursor
                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={`palette-item ${isActive ? 'active' : ''}`}
                      onMouseEnter={() => setCursor(idx)}
                      onClick={() => {
                        onNavigate(item.tab)
                        onClose()
                      }}
                    >
                      <span className="palette-item-icon">{item.icon}</span>
                      <span className="palette-item-label">{item.label}</span>
                      {item.sub && (
                        <span className="palette-item-sub">{item.sub}</span>
                      )}
                    </button>
                  )
                })}
              </div>
            )
          })}
        </div>

        <div className="palette-footer">
          <span><kbd>↑</kbd><kbd>↓</kbd> navigate</span>
          <span><kbd>↵</kbd> open</span>
          <span><kbd>esc</kbd> close</span>
        </div>
      </div>
    </>
  )
}

export default CommandPalette