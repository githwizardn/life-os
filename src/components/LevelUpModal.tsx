// --- Props ---
type Props = {
  level: { lvl: number; name: string }
  onClose: () => void
}

// --- Message for each level up ---
const LEVEL_MESSAGES: Record<number, string> = {
  2:  "You showed up. That's how it starts. Keep going.",
  3:  "Consistency is appearing. You're building something real.",
  4:  "You're a builder now. Every day is a brick.",
  5:  "Committed. This is who you are becoming.",
  6:  "Discipline over motivation. You've learned the secret.",
  7:  "Focused and relentless. The world notices people like this.",
  8:  "You're in rare company now. Don't stop.",
  9:  "Mastery is a process. You're deep in it.",
  10: "Autonomous. Joyful. Growing. You found out who you are.",
}

function LevelUpModal({ level, onClose }: Props) {
  // Get message for this level, fallback to generic message
  const message = LEVEL_MESSAGES[level.lvl] || "Keep going. Every day matters."

  return (
    <>
      {/* Dark overlay behind the modal */}
      {/* Clicking overlay also closes the modal */}
      <div className="modal-overlay" onClick={onClose} />

      {/* Modal box */}
      <div className="modal">

        {/* Animated star */}
        <div className="modal-star">⭐</div>

        {/* Level up title */}
        <div className="modal-title">LEVEL UP!</div>

        {/* New level info */}
        <div className="modal-level">
          LEVEL {level.lvl} — {level.name.toUpperCase()}
        </div>

        {/* Motivational message */}
        <div className="modal-message">{message}</div>

        {/* Close button */}
        <button className="modal-btn" onClick={onClose}>
          KEEP GOING →
        </button>

      </div>
    </>
  )
}

export default LevelUpModal