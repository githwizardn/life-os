// ============================================
// NOTIFICATIONS — permission, fire, dedupe
// ============================================

type Category = 'overdue_contact' | 'birthday' | 'review_due' | 'dungeon_expiring'

const LAST_FIRED_KEY = 'lifeos-notif-last-fired'

function readLastFired(): Record<string, string> {
  try {
    return JSON.parse(localStorage.getItem(LAST_FIRED_KEY) || '{}')
  } catch {
    return {}
  }
}

function writeLastFired(map: Record<string, string>) {
  try {
    localStorage.setItem(LAST_FIRED_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

function firedToday(cat: Category): boolean {
  const map = readLastFired()
  const last = map[cat]
  if (!last) return false
  return last.slice(0, 10) === new Date().toISOString().slice(0, 10)
}

function markFired(cat: Category) {
  const map = readLastFired()
  map[cat] = new Date().toISOString()
  writeLastFired(map)
}

const MUTE_KEY = 'lifeos-notif-muted'

export function isNotifMuted(): boolean {
  try {
    return localStorage.getItem(MUTE_KEY) === 'on'
  } catch {
    return false
  }
}

export function setNotifMuted(v: boolean) {
  try {
    if (v) localStorage.setItem(MUTE_KEY, 'on')
    else localStorage.removeItem(MUTE_KEY)
  } catch {
    /* ignore */
  }
}

export function notifPermission(): NotificationPermission {
  if (typeof window === 'undefined' || !('Notification' in window)) return 'denied'
  return Notification.permission
}

export async function requestNotifPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) return false
  if (Notification.permission === 'granted') return true
  if (Notification.permission === 'denied') return false
  try {
    const res = await Notification.requestPermission()
    return res === 'granted'
  } catch {
    return false
  }
}

async function showNotification(title: string, body: string) {
  if (notifPermission() !== 'granted') return
  const options: NotificationOptions = {
    body,
    icon: '/icon.svg',
    badge: '/icon.svg',
    tag: 'lifeos',
  }
  try {
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration()
      if (reg && 'showNotification' in reg) {
        await reg.showNotification(title, options)
        return
      }
    }
    new Notification(title, options)
  } catch (err) {
    console.warn('Notification failed:', err)
  }
}

function fireOnce(cat: Category, title: string, body: string) {
  if (notifPermission() !== 'granted') return
  if (firedToday(cat)) return
  markFired(cat)
  showNotification(title, body)
}

export type NotifyInput = {
  overduePeople: { name: string }[]
  birthdaysToday: { name: string }[]
  reviewsDue: number
  dungeonExpiring: boolean
}

export function checkAndNotify(data: NotifyInput) {
  if (notifPermission() !== 'granted') return
  if (isNotifMuted()) return

  if (data.birthdaysToday.length > 0) {
    const names = data.birthdaysToday.slice(0, 3).map((p) => p.name).join(', ')
    fireOnce('birthday', '🎂 Birthday today', names)
  }

  if (data.overduePeople.length > 0) {
    const names = data.overduePeople.slice(0, 3).map((p) => p.name).join(', ')
    const extra =
      data.overduePeople.length > 3
        ? ` +${data.overduePeople.length - 3} more`
        : ''
    fireOnce('overdue_contact', '📞 Reach out today', `${names}${extra}`)
  }

  if (data.reviewsDue > 0) {
    fireOnce(
      'review_due',
      `📓 ${data.reviewsDue} decision review${data.reviewsDue > 1 ? 's' : ''} due`,
      'Open Decision Journal to fill in outcomes'
    )
  }

  if (data.dungeonExpiring) {
    fireOnce(
      'dungeon_expiring',
      '⏳ Dungeon expiring soon',
      'Complete or abandon before it fails'
    )
  }
}