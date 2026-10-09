// ============================================
// BOTTOM NAV — mobile-only bottom navigation
// ============================================

import { CoreIcon, AscentIcon, VesselIcon, CircleIcon, RecordIcon } from './NavIcon'
import type { TabId } from './Sidebar'

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

function BottomNav({ active, onChange }: Props) {
  return (
    <nav className="bottom-nav">
      {TABS.map(({ id, label, Icon }) => {
        const isActive = active === id
        return (
          <button
            key={id}
            type="button"
            className={`bottom-nav-item ${isActive ? 'active' : ''}`}
            onClick={() => onChange(id)}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon size={22} active={isActive} />
            <span className="bottom-nav-label">{label}</span>
          </button>
        )
      })}
    </nav>
  )
}

export default BottomNav