import { useState } from 'react'
import { supabase } from '../lib/supabase'

function Auth() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false) // New state for Google button
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  // Email Magic Link Login
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

  // Google OAuth Login
  const handleGoogleLogin = async () => {
    setGoogleLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin
      }
    })

    if (error) {
      setError(error.message)
      setGoogleLoading(false)
    }
    // Note: We don't set loading to false on success because the browser will instantly redirect to Google
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
          disabled={loading || googleLoading}
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
          disabled={loading || googleLoading}
        >
          {loading ? 'SENDING...' : 'SEND MAGIC LINK →'}
        </button>

        {/* --- NEW GOOGLE AUTH SECTION --- */}
        <div style={{ margin: '24px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }} />
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', letterSpacing: '1px' }}>OR</span>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.1)', flex: 1 }} />
        </div>

        <button
          className="start-btn"
          style={{ 
            background: '#ffffff', 
            color: '#000000',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}
          onClick={handleGoogleLogin}
          disabled={loading || googleLoading}
        >
          {/* Simple Google G SVG icon */}
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          {googleLoading ? 'CONNECTING...' : 'SIGN IN WITH GOOGLE'}
        </button>

      </div>
    </div>
  )
}

export default Auth