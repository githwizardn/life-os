import type { User } from '../App'

type Props = {
  user: User
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

function getDateParts() {
  const now = new Date()
  const day = now.getDate()
  const monthYear = now.toLocaleDateString('en-US', {
    month: 'short',
    year: 'numeric'
  }).toUpperCase()
  return { day, monthYear }
}

function Header({ user }: Props) {
  const { day, monthYear } = getDateParts()

  const nameParts = user.name.trim().split(' ')
  const firstName = nameParts[0].toUpperCase()
  const restOfName = nameParts.slice(1).join(' ').toUpperCase()

  return (
    <div className="header">
      <div className="header-left">
        <div className="greeting">{getGreeting()}</div>
        <div className="name">
          <span style={{ color: 'var(--accent)' }}>{firstName}</span>
          {restOfName && <span> {restOfName}</span>}
        </div>
      </div>

      <div className="header-right">
        <div className="date-big">{day}</div>
        <div className="date-sub">{monthYear}</div>
      </div>
    </div>
  )
}

export default Header