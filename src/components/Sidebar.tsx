// ============================================
// SIDEBAR — desktop-only left navigation
// ============================================

import { CoreIcon, AscentIcon, VesselIcon, CircleIcon, RecordIcon } from './NavIcon'

export type TabId = 'core' | 'ascent' | 'vessel' | 'circle' | 'record'

type Props = {
  active: TabId
  onChange: (tab: TabId) => void
}

const TABS: { id: TabId; label: string; Icon: typeof CoreIcon }[] = [
  { id: 'core',   label: 'Core',   Icon: CoreIcon },
  { id: 'ascent', label: 'Ascent', Icon: AscentIcon },
  { id: 'vessel', label: 'Vessel', Icon: VesselIcon },
  { id: 'circle', label: 'Circle', Icon: CircleIcon },
  { id: 'record', label: 'Record', Icon: RecordIcon },
]

function Sidebar({ active, onChange }: Props) {
  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <span className="sidebar-logo-mark">◉</span>
        <span className="sidebar-logo-text">LIFE OS</span>
      </div>

      <nav className="sidebar-nav">
        {TABS.map(({ id, label, Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              className={`sidebar-item ${isActive ? 'active' : ''}`}
              onClick={() => onChange(id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={22} active={isActive} />
              <span className="sidebar-item-label">{label}</span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-footer">
        <span className="sidebar-version">PHASE 12</span>
      </div>
    </aside>
  )
}

export default Sidebar