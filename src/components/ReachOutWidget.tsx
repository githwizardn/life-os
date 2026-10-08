import type { Relationship } from '../lib/relationships'
import {
  isOverdue,
  getDaysUntilBirthday,
  formatLastContact,
} from '../lib/relationships'
import { getTierInfo } from '../data/relationships'

type Props = {
  people: Relationship[]
  onMarkContacted: (id: string) => void
  onOpenPerson: () => void
}

function ReachOutWidget({ people, onMarkContacted, onOpenPerson }: Props) {
  // People who are overdue OR have a birthday within 7 days
  const actionable = people
    .map(p => {
      const overdue = isOverdue(p)
      const bd = getDaysUntilBirthday(p.birthday)
      const bdSoon = bd !== null && bd <= 7
      return { person: p, overdue, bdSoon, bd }
    })
    .filter(x => x.overdue || x.bdSoon)
    .sort((a, b) => {
      // Birthday within 7 days first, then overdue
      if (a.bdSoon && !b.bdSoon) return -1
      if (b.bdSoon && !a.bdSoon) return 1
      return 0
    })

  if (actionable.length === 0) return null

  return (
    <div className="reachout-section">
      <div className="reachout-header">
        <span className="reachout-title">📞 REACH OUT TODAY</span>
        <span className="reachout-count">{actionable.length}</span>
      </div>

      <div className="reachout-grid">
        {actionable.map(({ person, overdue, bdSoon, bd }) => {
          const tier = getTierInfo(person.tier)
          return (
            <div
              key={person.id}
              className="reachout-card"
              onClick={onOpenPerson}
              style={{ borderLeftColor: tier.color }}
            >
              <div className="reachout-emoji">{person.emoji}</div>
              <div className="reachout-info">
                <div className="reachout-name">{person.name}</div>
                <div className="reachout-reason">
                  {bdSoon && bd !== null && (
                    <span className="reachout-bday">🎂 Birthday in {bd}d</span>
                  )}
                  {overdue && !bdSoon && (
                    <span className="reachout-overdue">
                      ⚠ {formatLastContact(person)}
                    </span>
                  )}
                  {overdue && bdSoon && bd !== null && (
                    <span className="reachout-overdue">
                      {' · '}{formatLastContact(person)}
                    </span>
                  )}
                </div>
              </div>
              <button
                className="reachout-mark-btn"
                onClick={e => {
                  e.stopPropagation()
                  onMarkContacted(person.id)
                }}
                title="Mark as contacted"
              >
                ✓
              </button>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default ReachOutWidget