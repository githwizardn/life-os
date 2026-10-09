// ============================================
// SEARCH — cross-section index + filter
// ============================================

import type { TaskItem, Quest } from '../data/tasks'
import type { Relationship } from './relationships'
import type { Decision } from './decisions'
import type { ReadingLog } from './bodyMind'

export type SearchTab = 'core' | 'ascent' | 'vessel' | 'circle' | 'record'

export type SearchItem = {
  id: string
  type: 'nav' | 'task' | 'quest' | 'person' | 'decision' | 'book' | 'note'
  label: string
  sub?: string
  icon: string
  tab: SearchTab
  keywords: string
}

type Sources = {
  tasks: TaskItem[]
  quests: Quest[]
  relationships: Relationship[]
  decisions: Decision[]
  readingLogs: ReadingLog[]
  notes: Record<string, string>
}

export function buildIndex(sources: Sources): SearchItem[] {
  const items: SearchItem[] = []

  const navItems: { tab: SearchTab; label: string; sub: string; icon: string }[] = [
    { tab: 'core',   label: 'Core',   sub: 'Home · Tasks · Voice',            icon: '◉' },
    { tab: 'ascent', label: 'Ascent', sub: 'Skills · Shadows · Dungeons',     icon: '▲' },
    { tab: 'vessel', label: 'Vessel', sub: 'Body & Mind · Chronicle · Notes', icon: '◆' },
    { tab: 'circle', label: 'Circle', sub: 'Relationship Dossier',            icon: '◎' },
    { tab: 'record', label: 'Record', sub: 'Decision Journal',                icon: '▤' },
  ]
  for (const n of navItems) {
    items.push({
      id: `nav-${n.tab}`,
      type: 'nav',
      label: n.label,
      sub: n.sub,
      icon: n.icon,
      tab: n.tab,
      keywords: `${n.label} ${n.sub}`.toLowerCase(),
    })
  }

  for (const t of sources.tasks) {
    items.push({
      id: `task-${t.id}`,
      type: 'task',
      label: t.label,
      sub: `${t.category} · ${t.xp} XP`,
      icon: '⬜',
      tab: 'core',
      keywords: `${t.label} ${t.category}`.toLowerCase(),
    })
  }

  for (const q of sources.quests) {
    if (q.completed) continue
    items.push({
      id: `quest-${q.id}`,
      type: 'quest',
      label: q.label,
      sub: `${q.daysCompleted}/${q.totalDays} days`,
      icon: '🎯',
      tab: 'core',
      keywords: `${q.label} ${q.category}`.toLowerCase(),
    })
  }

  for (const p of sources.relationships) {
    items.push({
      id: `person-${p.id}`,
      type: 'person',
      label: p.name,
      sub: p.tier,
      icon: p.emoji || '👤',
      tab: 'circle',
      keywords: `${p.name} ${p.key_facts || ''} ${p.notes || ''}`.toLowerCase(),
    })
  }

  for (const d of sources.decisions) {
    items.push({
      id: `decision-${d.id}`,
      type: 'decision',
      label: d.title,
      sub: d.status,
      icon: '📓',
      tab: 'record',
      keywords: `${d.title} ${d.reasoning || ''} ${d.chosen || ''}`.toLowerCase(),
    })
  }

  for (const r of sources.readingLogs) {
    items.push({
      id: `book-${r.id}`,
      type: 'book',
      label: r.title,
      sub: r.author || r.type,
      icon: '📚',
      tab: 'vessel',
      keywords: `${r.title} ${r.author || ''} ${r.takeaways || ''}`.toLowerCase(),
    })
  }

  for (const [key, value] of Object.entries(sources.notes)) {
    if (!value || value.trim().length < 3) continue
    items.push({
      id: `note-${key}`,
      type: 'note',
      label: value.slice(0, 60) + (value.length > 60 ? '…' : ''),
      sub: `Note · ${key}`,
      icon: '📝',
      tab: 'vessel',
      keywords: `${key} ${value}`.toLowerCase(),
    })
  }

  return items
}

export function filterIndex(
  items: SearchItem[],
  query: string,
  maxPerType = 5
): SearchItem[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    return items.filter(i => i.type === 'nav')
  }

  const scored = items
    .map(item => {
      const label = item.label.toLowerCase()
      let score = 0
      if (label === q) score = 100
      else if (label.startsWith(q)) score = 80
      else if (label.includes(q)) score = 60
      else if (item.keywords.includes(q)) score = 30
      return { item, score }
    })
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)

  const byType: Partial<Record<SearchItem['type'], SearchItem[]>> = {}
  for (const { item } of scored) {
    if (!byType[item.type]) byType[item.type] = []
    if (byType[item.type]!.length < maxPerType) {
      byType[item.type]!.push(item)
    }
  }

  const order: SearchItem['type'][] = [
    'nav', 'task', 'quest', 'person', 'decision', 'book', 'note',
  ]
  const result: SearchItem[] = []
  for (const t of order) {
    if (byType[t]) result.push(...byType[t]!)
  }
  return result
}