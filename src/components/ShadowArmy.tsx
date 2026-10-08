import { SHADOW_POOL, getShadowById } from '../data/shadows'
import type { UserShadow } from '../lib/shadows'

type Props = {
  shadows: UserShadow[]
}

function ShadowArmy({ shadows }: Props) {
  const ownedIds = shadows.map(s => s.shadow_id)
  const totalOwned = ownedIds.length
  const totalPossible = SHADOW_POOL.length

  return (
    <div className="shadow-army-section">
      <div className="shadow-army-header">
        <span className="shadow-army-title">👤 SHADOW ARMY</span>
        <span className="shadow-army-count">{totalOwned} / {totalPossible}</span>
      </div>

      {totalOwned === 0 ? (
        <div className="shadow-army-empty">
          <div className="shadow-army-empty-icon">🌑</div>
          <div className="shadow-army-empty-text">
            Complete a <span className="legendary-word">Legendary</span> task
            to extract your first Shadow.
          </div>
        </div>
      ) : (
        <div className="shadow-army-grid">
          {shadows.map(us => {
            const shadow = getShadowById(us.shadow_id)
            if (!shadow) return null
            return (
              <div key={us.id} className="shadow-card">
                <div className="shadow-card-icon">{shadow.icon}</div>
                <div className="shadow-card-name">{shadow.name}</div>
                <div className="shadow-card-passive">{shadow.passive.description}</div>
                <div className="shadow-card-origin">from: {us.extracted_from}</div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default ShadowArmy