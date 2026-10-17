import { useState, useEffect, useRef } from 'react'
import { sound } from '../lib/sound'
import {
  notifPermission,
  requestNotifPermission,
  isNotifMuted,
  setNotifMuted,
} from '../lib/notifications'
import { exportAllUserData, importAllUserData, wipeUserData, resetUserSystem } from '../lib/db'
import { supabase } from '../lib/supabase'

type Props = { 
  onClose: () => void
  userId: string
  onDataChange: () => void 
}

function SettingsModal({ onClose, userId, onDataChange }: Props) {
  const [soundOn, setSoundOn] = useState(!sound.isMuted())
  const [notifState, setNotifState] = useState<NotificationPermission>(notifPermission())
  const [notifMuted, setNotifMutedState] = useState<boolean>(isNotifMuted())
  const [loadingData, setLoadingData] = useState(false)
  
  // გავყავით ორ ცალკე state-ად
  const [importConfirm, setImportConfirm] = useState('')
  const [wipeConfirm, setWipeConfirm] = useState('')
  
  const fileInputRef = useRef<HTMLInputElement>(null)

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

  const handleExport = async () => {
    try {
      setLoadingData(true)
      const data = await exportAllUserData(userId)
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lifeos-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
    } catch (err) {
      console.error(err)
      alert('Export failed')
    } finally {
      setLoadingData(false)
    }
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (importConfirm !== 'REPLACE') {
      alert('Type REPLACE in the box below to confirm.')
      if (fileInputRef.current) fileInputRef.current.value = ''
      return
    }

    try {
      setLoadingData(true)
      const text = await file.text()
      const json = JSON.parse(text)
      if (json.version !== 1) {
        alert('Invalid or unsupported backup file version.')
        return
      }
      
      await importAllUserData(userId, json)
      alert('Import successful! App will reload.')
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Import failed. Check file format.')
    } finally {
      setLoadingData(false)
      setImportConfirm('')
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleResetSystem = async (system: 'dungeons' | 'relationships' | 'decisions' | 'xp_honor') => {
    if (!confirm(`Are you sure you want to reset ${system}? This cannot be undone.`)) return
    try {
      setLoadingData(true)
      await resetUserSystem(userId, system)
      alert(`${system} reset successfully.`)
      onDataChange()
    } catch (err) {
      console.error(err)
      alert('Reset failed')
    } finally {
      setLoadingData(false)
    }
  }

  const handleResetAll = async () => {
    if (wipeConfirm !== 'DELETE') {
      alert('Type DELETE in the box below to confirm.')
      return
    }
    if (!confirm('WARNING: This will permanently delete ALL your data from the server. Are you absolutely sure?')) return

    try {
      setLoadingData(true)
      await wipeUserData(userId)
      localStorage.clear()
      await supabase.auth.signOut()
      window.location.reload()
    } catch (err) {
      console.error(err)
      alert('Reset failed')
    } finally {
      setLoadingData(false)
    }
  }

  return (
    <>
      <div className="modal-overlay" onClick={loadingData ? undefined : onClose} />
      <div className="modal settings-modal" role="dialog" aria-modal="true">
        <div className="settings-title">⚙ SETTINGS</div>

        {/* GENERAL */}
        <div className="settings-row">
          <div className="settings-row-main">
            <div className="settings-label">Sound effects</div>
            <div className="settings-desc">Chimes for level ups, gates, tasks</div>
          </div>
          <button
            type="button"
            className={`settings-toggle ${soundOn ? 'on' : ''}`}
            onClick={() => setSoundOn((v) => !v)}
          >
            <span className="settings-toggle-knob" />
          </button>
        </div>

        <div className="settings-row">
          <div className="settings-row-main">
            <div className="settings-label">Reminders</div>
            <div className="settings-desc">Get notified of overdue contacts, birthdays, and reviews.</div>
          </div>
          {notifState === 'granted' ? (
            <button
              type="button"
              className={`settings-toggle ${!notifMuted ? 'on' : ''}`}
              onClick={() => setNotifMutedState((v) => !v)}
            >
              <span className="settings-toggle-knob" />
            </button>
          ) : notifState === 'denied' ? (
            <span className="settings-badge denied">BLOCKED</span>
          ) : (
            <button type="button" className="settings-enable-btn" onClick={enableNotifs}>
              ENABLE
            </button>
          )}
        </div>

        {/* DATA MANAGEMENT */}
        <div className="settings-title" style={{ marginTop: '20px', fontSize: '13px' }}>DATA MANAGEMENT</div>
        
        <div className="settings-row settings-row-stacked">
          <div className="settings-row-main">
            <div className="settings-label">Backup & Restore</div>
            <div className="settings-desc">Download a JSON file with all your data, or restore from a previous backup.</div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button className="settings-enable-btn" onClick={handleExport} disabled={loadingData}>
                ⬇ EXPORT DATA
              </button>
              
              <div style={{ display: 'flex', gap: '8px', flex: 1, alignItems: 'center' }}>
                <input 
                  type="text" 
                  placeholder="Type REPLACE to confirm" 
                  value={importConfirm}
                  onChange={e => setImportConfirm(e.target.value)}
                  className="rel-input"
                  style={{ padding: '8px', fontSize: '12px', minWidth: '120px' }}
                />
                <input 
                  type="file" 
                  accept=".json" 
                  style={{ display: 'none' }} 
                  ref={fileInputRef}
                  onChange={handleImport}
                />
                <button 
                  className="settings-enable-btn" 
                  onClick={() => fileInputRef.current?.click()}
                  disabled={loadingData || importConfirm !== 'REPLACE'}
                  style={{ background: importConfirm === 'REPLACE' ? 'var(--accent)' : 'var(--surface3)', color: importConfirm === 'REPLACE' ? 'var(--bg)' : 'var(--text-muted)', borderColor: importConfirm === 'REPLACE' ? 'var(--accent)' : 'var(--border2)' }}
                >
                  ⬆ IMPORT
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="settings-row settings-row-stacked">
          <div className="settings-row-main">
            <div className="settings-label" style={{ color: 'var(--danger)' }}>Danger Zone</div>
            <div className="settings-desc">Reset specific parts of your system or wipe everything.</div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '10px', flexWrap: 'wrap' }}>
              <button className="rel-delete-btn" onClick={() => handleResetSystem('xp_honor')} disabled={loadingData}>Reset XP & Honor</button>
              <button className="rel-delete-btn" onClick={() => handleResetSystem('dungeons')} disabled={loadingData}>Reset Dungeons</button>
              <button className="rel-delete-btn" onClick={() => handleResetSystem('relationships')} disabled={loadingData}>Reset Relationships</button>
              <button className="rel-delete-btn" onClick={() => handleResetSystem('decisions')} disabled={loadingData}>Reset Decisions</button>
            </div>
            
            <div style={{ display: 'flex', gap: '8px', marginTop: '16px', alignItems: 'center', borderTop: '1px solid var(--border)', paddingTop: '16px' }}>
              <input 
                type="text" 
                placeholder="Type DELETE to confirm" 
                value={wipeConfirm}
                onChange={e => setWipeConfirm(e.target.value)}
                className="rel-input"
                style={{ padding: '8px', fontSize: '12px', flex: 1 }}
              />
              <button 
                className="rel-delete-btn" 
                onClick={handleResetAll}
                disabled={loadingData || wipeConfirm !== 'DELETE'}
                style={{ padding: '8px 12px' }}
              >
                WIPE ACCOUNT
              </button>
            </div>
          </div>
        </div>

        <div className="settings-footer" style={{ marginTop: '10px' }}>
          <span className="settings-version">LIFE OS · Phase 13</span>
          <button className="rel-cancel-btn" onClick={onClose} disabled={loadingData}>
            CLOSE
          </button>
        </div>
      </div>
    </>
  )
}

export default SettingsModal