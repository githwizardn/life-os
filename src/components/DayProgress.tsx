import { useState, useEffect } from 'react'

function DayProgress() {
  // Helper — calculates time and day percentage
  // Returns values instead of calling setState directly
  function getTimeData() {
    const now = new Date()
    const currentMinutes = now.getHours() * 60 + now.getMinutes()
    const pct = Math.round(currentMinutes / 1440 * 100)
    const timeStr = now.toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
    return { pct, timeStr }
  }

  // Initialize state directly with calculated values
  // This way we never need to call setState inside useEffect
  const [time, setTime] = useState(() => getTimeData().timeStr)
  const [percent, setPercent] = useState(() => getTimeData().pct)

  useEffect(() => {
    // Update function — called by interval
    const update = () => {
      const { pct, timeStr } = getTimeData()
      setPercent(pct)
      setTime(timeStr)
    }

    // Set interval — runs every 60 seconds
    const interval = setInterval(update, 60000)

    // Cleanup — stop interval when component unmounts
    return () => clearInterval(interval)
  }, []) // empty [] = set up interval once on mount

  return (
    <div className="day-progress">
      <div className="day-header">
        <span className="day-label">DAY PROGRESS</span>
        <span className="day-time">{time}</span>
      </div>
      <div className="day-bar">
        <div
          className="day-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
      <div className="day-pct">{percent}% of day elapsed</div>
    </div>
  )
}

export default DayProgress