import { getHonorStatus, HONOR_CONFIG } from '../lib/honor'

type Props = {
  honor: number
}

function HonorBar({ honor }: Props) {
  const { label, color } = getHonorStatus(honor)
  const pct = (honor / HONOR_CONFIG.CAP) * 100

  return (
    <div className="honor-bar">
      <div className="honor-left">
        <span className="honor-label">HONOR</span>
        <span className="honor-value" style={{ color }}>{honor}</span>
      </div>
      <div className="honor-bar-track">
        <div
          className="honor-bar-fill"
          style={{ width: `${pct}%`, background: color }}
        />
      </div>
      <span className="honor-status" style={{ color }}>{label}</span>
    </div>
  )
}

export default HonorBar