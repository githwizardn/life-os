import { useEffect, useRef, useState } from 'react'
import type { GlobalData } from '../App'
import { LEVELS } from '../data/tasks'

// --- Props ---
type Props = {
  globalData: GlobalData
  getLevelData: (xp: number) => typeof LEVELS[0]
}

function XPBar({ globalData, getLevelData }: Props) {
  const [showPopup, setShowPopup] = useState(false)
  const [popupText, setPopupText] = useState('')

  // useRef stores the previous XP value WITHOUT causing re-renders
  // Unlike useState, changing a ref doesn't trigger re-render
  // Perfect for "remembering" a previous value
  const prevXPRef = useRef(globalData.totalXP)

  useEffect(() => {
    const prevXP = prevXPRef.current

    // Only show popup if XP actually increased
    if (globalData.totalXP > prevXP) {
      const gained = globalData.totalXP - prevXP
      // Update popup text and show it
      setPopupText(`+${gained} XP`)
      setShowPopup(true)
      setTimeout(() => setShowPopup(false), 1800)
    }

    // Update the ref AFTER checking
    // ref update doesn't cause re-render ✅
    prevXPRef.current = globalData.totalXP
  }, [globalData.totalXP])

  // Get current level info
  const lvl = getLevelData(globalData.totalXP)
  const nextLvl = LEVELS[Math.min(lvl.lvl, LEVELS.length - 1)]

  // Calculate progress % toward next level
  const progress = lvl.lvl >= 10
    ? 100
    : Math.round((globalData.totalXP - lvl.min) / (nextLvl.max - lvl.min) * 100)

  return (
    <div className="xp-section">

      {/* Top row — level badge + XP numbers */}
      <div className="xp-header">
        <div className="xp-level">
          <span className="level-badge">LVL {lvl.lvl}</span>
          <span className="xp-label">{lvl.name}</span>
        </div>
        <div className="xp-numbers">
          {globalData.totalXP} / {lvl.lvl >= 10 ? '∞' : nextLvl.max} XP
        </div>
      </div>

      {/* Progress bar */}
      <div className="xp-bar">
        <div
          className="xp-fill"
          style={{ width: `${Math.min(progress, 100)}%` }}
        />
      </div>

      {/* XP popup — briefly shows "+20 XP" when task is checked */}
      {showPopup && (
        <div className="xp-popup show">{popupText}</div>
      )}

    </div>
  )
}

export default XPBar