import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async () => {
    if (!email.trim()) return
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: window.location.origin
      }
    })

    if (error) {
      setError(error.message)
    } else {
      setSent(true)
    }
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="onboarding">
        <div className="onboarding-card">
          <div className="logo">LIFE OS</div>
          <div className="sub">CHECK YOUR EMAIL</div>
          <div className="question">Magic link sent! ✉️</div>
          <div className="hint">
            We sent a login link to <strong>{email}</strong>
            <br />
            Click it to enter your dashboard.
            <br /><br />
            You can close this tab.
          </div>
          <button
            className="export-btn"
            onClick={() => setSent(false)}
            style={{ width: '100%', marginTop: '16px' }}
          >
            ← Use different email
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="onboarding">
      <div className="onboarding-card">
        <div className="logo">LIFE OS</div>
        <div className="sub">YOUR DAILY OPERATING SYSTEM</div>

        <div className="question">Enter your email</div>
        <div className="hint">
          We'll send you a magic link — no password needed.
          <br />
          Your data will sync across all your devices.
        </div>

        <input
          className="name-input"
          type="email"
          placeholder="your@email.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleLogin()}
        />

        {error && (
          <div style={{
            color: 'var(--danger)',
            fontSize: '13px',
            marginBottom: '16px'
          }}>
            {error}
          </div>
        )}

        <button
          className="start-btn"
          onClick={handleLogin}
          disabled={loading}
        >
          {loading ? 'SENDING...' : 'SEND MAGIC LINK →'}
        </button>
      </div>
    </div>
  )
}

export default Auth