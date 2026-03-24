import type { User } from '../App'

// --- Props ---
type Props = {
  user: User
}

// Helper — returns greeting based on time of day
function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

// Helper — returns today's date parts
function getDateParts() {
  const now = new Date()
  const day = now.getDate() // just the number e.g. 21
  const monthYear = now.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  }).toUpperCase() // e.g. "MAR 2026"
  return { day, monthYear }
}

function Header({ user }: Props) {
  const { day, monthYear } = getDateParts()

  // Safely split the name into the first word and the rest
  const nameParts = user.name.trim().split(' ')
  const firstName = nameParts[0].toUpperCase()
  const restOfName = nameParts.slice(1).join(' ').toUpperCase()

  return (
    <div className="header">

      {/* Left side — greeting and name */}
      <div className="header-left">
        <div className="greeting">{getGreeting()}</div>
        <div className="name">
          {/* Now it actually splits the name! */}
          <span style={{ color: 'var(--accent)' }}>{firstName}</span>
          {restOfName && <span> {restOfName}</span>}
        </div>
      </div>

      {/* Right side — date */}
      <div className="header-right">
        <div className="date-big">{day}</div>
        <div className="date-sub">{monthYear}</div>
      </div>

    </div>
  )
}

export default Header