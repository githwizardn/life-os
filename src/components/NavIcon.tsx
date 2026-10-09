// ============================================
// NAV ICONS — N3 Custom Sigil Family
// All share circle motif, 1.8px stroke, gradient #00ffaa → #a855f7
// ============================================

type IconProps = {
  size?: number
  active?: boolean
}

const ACTIVE_GRADIENT = 'nav-icon-grad'
const INACTIVE_COLOR = '#7878a8'

function Defs() {
  return (
    <defs>
      <linearGradient id={ACTIVE_GRADIENT} x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stopColor="#00ffaa" />
        <stop offset="1" stopColor="#a855f7" />
      </linearGradient>
    </defs>
  )
}

export function CoreIcon({ size = 24, active = false }: IconProps) {
  const c = active ? `url(#${ACTIVE_GRADIENT})` : INACTIVE_COLOR
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs />
      <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="1.8" />
      <circle cx="16" cy="16" r="4" fill={c} />
      <line x1="16" y1="3" x2="16" y2="9" stroke={c} strokeWidth="1.8" />
      <line x1="16" y1="23" x2="16" y2="29" stroke={c} strokeWidth="1.8" />
    </svg>
  )
}

export function AscentIcon({ size = 24, active = false }: IconProps) {
  const c = active ? `url(#${ACTIVE_GRADIENT})` : INACTIVE_COLOR
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs />
      <circle cx="16" cy="18" r="11" stroke={c} strokeWidth="1.8" />
      <path
        d="M 6 11 L 16 3 L 26 11"
        stroke={c}
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="16" cy="18" r="3" fill={c} />
    </svg>
  )
}

export function VesselIcon({ size = 24, active = false }: IconProps) {
  const c = active ? `url(#${ACTIVE_GRADIENT})` : INACTIVE_COLOR
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs />
      <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="1.8" />
      <rect x="9" y="9" width="14" height="14" stroke={c} strokeWidth="1.5" />
      <circle cx="16" cy="16" r="3.5" fill={c} />
    </svg>
  )
}

export function CircleIcon({ size = 24, active = false }: IconProps) {
  const c = active ? `url(#${ACTIVE_GRADIENT})` : INACTIVE_COLOR
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs />
      <circle cx="11" cy="16" r="9" stroke={c} strokeWidth="1.8" />
      <circle cx="21" cy="16" r="9" stroke={c} strokeWidth="1.8" />
      <circle cx="16" cy="16" r="2.5" fill={c} />
    </svg>
  )
}

export function RecordIcon({ size = 24, active = false }: IconProps) {
  const c = active ? `url(#${ACTIVE_GRADIENT})` : INACTIVE_COLOR
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none">
      <Defs />
      <circle cx="16" cy="16" r="13" stroke={c} strokeWidth="1.8" />
      <line x1="10" y1="13" x2="22" y2="13" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="16" x2="22" y2="16" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
      <line x1="10" y1="19" x2="18" y2="19" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}