import { useState, useEffect } from 'react'
import { sound } from '../lib/sound'
import {
  notifPermission,
  requestNotifPermission,
  isNotifMuted,
  setNotifMuted,
} from '../lib/notifications'

type Props = { onClose: () => void }

function SettingsModal({ onClose }: Props) {
  const [soundOn, setSoundOn] = useState(!sound.isMuted())
   const [notifState, setNotifState] = useState<NotificationPermission>(
    notifPermission()
  )
  const [notifMuted, setNotifMutedState] = useState<boolean>(isNotifMuted())

  useEffect(() => {
    setNotifMuted(notifMuted)
  }, [notifMuted])

  useEffect(() => {
    sound.setMuted(!soundOn)
    try {
      localStorage.setItem('lifeos-sound', soundOn ? 'on' : 'off')
    } catch {
      /* ignore */
    }
  }, [soundOn])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  const enableNotifs = async () => {
    const ok = await requestNotifPermission()
    setNotifState(ok ? 'granted' : notifPermission())
  }

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div
        className="modal settings-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-title"
      >
        <div className="settings-title" id="settings-title">
          ⚙ SETTINGS
        </div>

        <div className="settings-row">
          <div className="settings-row-main">
            <div className="settings-label">Sound effects</div>
            <div className="settings-desc">
              Chimes on level up, gate alerts, task completion, HONOR drops
            </div>
          </div>
          <button
            type="button"
            className={`settings-toggle ${soundOn ? 'on' : ''}`}
            onClick={() => setSoundOn((v) => !v)}
            aria-label={`Sound effects ${soundOn ? 'on' : 'off'}`}
            aria-pressed={soundOn}
          >
            <span className="settings-toggle-knob" />
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-main">
            <div className="settings-label">Reminders</div>
            <div className="settings-desc">
              {notifState === 'granted' &&
                'Enabled. You will be reminded of overdue contacts, birthdays, and review dates.'}
              {notifState === 'denied' &&
                'Blocked. Enable notifications in your browser settings.'}
              {notifState === 'default' &&
                'Get reminded when someone is overdue or a decision review is due.'}
            </div>
          </div>
                    {notifState === 'granted' ? (
            <button
              type="button"
              className={`settings-toggle ${!notifMuted ? 'on' : ''}`}
              onClick={() => setNotifMutedState((v) => !v)}
              aria-label={`Reminders ${notifMuted ? 'muted' : 'on'}`}
              aria-pressed={!notifMuted}
            >
              <span className="settings-toggle-knob" />
            </button>
          ) : notifState === 'denied' ? (
            <span className="settings-badge denied">BLOCKED</span>
          ) : (
            <button
              type="button"
              className="settings-enable-btn"
              onClick={enableNotifs}
            >
              ENABLE
            </button>
          )}
        </div>

        <div className="settings-row settings-row-stacked">
          <div className="settings-row-main">
            <div className="settings-label">Install as app</div>
            <div className="settings-desc">
              Add LIFE OS to your home screen for a native feel.
            </div>
            <div className="settings-steps">
              <div>
                <strong>iPhone</strong> — open in Safari → Share → Add to Home Screen
              </div>
              <div>
                <strong>Android</strong> — Chrome menu → Install app
              </div>
              <div>
                <strong>Desktop</strong> — Chrome address bar → install icon
              </div>
            </div>
          </div>
        </div>

        <div className="settings-footer">
          <span className="settings-version">LIFE OS · Phase 11</span>
          <button className="rel-cancel-btn" onClick={onClose}>
            CLOSE
          </button>
        </div>
      </div>
    </>
  )
}

export default SettingsModal