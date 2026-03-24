import { useState } from 'react'

// --- TypeScript: define what props this component receives ---
type Props = {
  onStart: (name: string, goals: string[]) => void
}

// The goals the user can pick from
const GOAL_OPTIONS = [
  { id: 'body',       label: '⚔️ Body' },
  { id: 'mind',       label: '👁️ Mind' },
  { id: 'mastery',    label: '🥷 Mastery' },
  { id: 'autonomy',   label: '💰 Autonomy' },
  { id: 'growth',     label: '🌱 Growth' },
  { id: 'connection', label: '🤝 Connection' },
  { id: 'joy',        label: '✨ Joy' },
]

function Onboarding({ onStart }: Props) {
  // Local state — only used inside this component
  const [name, setName] = useState('')
  const [selectedGoals, setSelectedGoals] = useState<string[]>([])

  // Toggle a goal on/off when clicked
  const toggleGoal = (id: string) => {
    setSelectedGoals(prev =>
      prev.includes(id) ? prev.filter(g => g !== id) : [...prev, id]
    )
  }

  // --- NEW: Check if form is valid ---
  const isFormValid = name.trim().length > 0 && selectedGoals.length > 0

  // Called when user clicks START
  const handleStart = () => {
    if (!isFormValid) return 
    onStart(name.trim(), selectedGoals)
  }

  return (
    <div className="onboarding">
      <div className="onboarding-card">

        {/* Logo */}
        <div className="logo">LIFE OS</div>
        <div className="sub">YOUR DAILY OPERATING SYSTEM</div>

        {/* Name input */}
        <div className="question">What's your name?</div>
        <div className="hint">This is your personal dashboard. Make it yours.</div>
        <input
          className="name-input"
          placeholder="YOUR NAME"
          value={name}
          onChange={e => setName(e.target.value)}
          // Allow pressing Enter to start ONLY if valid
          onKeyDown={e => e.key === 'Enter' && isFormValid && handleStart()}
        />

        {/* Goal selection */}
        <div className="question">What are you working on?</div>
        <div className="hint">Pick as many as you want (select at least one).</div>
        <div className="goal-grid">
          {GOAL_OPTIONS.map(goal => (
            <button
              key={goal.id}
              className={`goal-btn ${selectedGoals.includes(goal.id) ? 'selected' : ''}`}
              onClick={() => toggleGoal(goal.id)}
            >
              {goal.label}
            </button>
          ))}
        </div>

        {/* Start button */}
        <button 
          className="start-btn" 
          onClick={handleStart}
          disabled={!isFormValid}
          style={{
            opacity: isFormValid ? 1 : 0.5,
            cursor: isFormValid ? 'pointer' : 'not-allowed'
          }}
        >
          INITIALIZE SYSTEM →
        </button>

      </div>
    </div>
  )
}

export default Onboarding