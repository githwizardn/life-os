// ============================================
// SYSTEM VOICE — The System speaks
// ============================================

import { getDailySystemMessage, type SystemState } from '../data/systemVoice'

type Props = {
  state: SystemState
  userId: string
}

function SystemVoice({ state, userId }: Props) {
  const { mood, message } = getDailySystemMessage(state, userId)

  return (
    <div className={`system-voice mood-${mood}`}>
      <div className="system-voice-indicator">
        <span className="system-dot" />
        <span className="system-label">THE SYSTEM</span>
      </div>
      <div className="system-voice-message">
        "{message}"
      </div>
    </div>
  )
}

export default SystemVoice