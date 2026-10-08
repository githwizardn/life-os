import type { UserSeason, BossRequirementStatus } from '../lib/seasons'
import { getDaysRemaining, getSeasonProgress } from '../lib/seasons'
import type { Season } from '../data/seasons'

type Props = {
  season: Season
  userSeason: UserSeason
  requirements: BossRequirementStatus[]
  bossDefeated: boolean
}

function SeasonBanner({ season, userSeason, requirements, bossDefeated }: Props) {
  const daysLeft = getDaysRemaining(userSeason.started_at, season.duration_days)
  const progress = getSeasonProgress(userSeason.started_at, season.duration_days)
  const metCount = requirements.filter(r => r.met).length

  return (
    <div
      className={`season-banner ${bossDefeated ? 'defeated' : ''}`}
      style={{ borderColor: season.color }}
    >
      <div className="season-header">
        <div className="season-header-left">
          <span className="season-icon">{season.icon}</span>
          <span className="season-name" style={{ color: season.color }}>
            {season.name}
          </span>
        </div>
        <div className="season-days-left">
          <span className="season-days-num">{daysLeft}</span>
          <span className="season-days-label">DAYS LEFT</span>
        </div>
      </div>

      <div className="season-progress-bar">
        <div
          className="season-progress-fill"
          style={{ width: `${progress}%`, background: season.color }}
        />
      </div>

      <div className="season-boss">
        <div className="season-boss-header">
          <span className="season-boss-label">
            {bossDefeated ? '✓ BOSS DEFEATED' : '⚔ BOSS'}
          </span>
          <span className="season-boss-count">{metCount} / {requirements.length}</span>
        </div>
        <div className="season-boss-name">{season.boss_name}</div>
        <div className="season-boss-desc">{season.boss_description}</div>

        <div className="season-requirements">
          {requirements.map((r, i) => (
            <div key={i} className={`season-req ${r.met ? 'met' : ''}`}>
              <span className="season-req-check">{r.met ? '✓' : '○'}</span>
              <span className="season-req-desc">{r.req.description}</span>
              {r.req.type === 'category_xp' && (
                <span className="season-req-progress">
                  {r.current} / {r.target}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>

      {bossDefeated && (
        <div className="season-victory" style={{ color: season.color }}>
          ⚔ THE BOSS HAS FALLEN ⚔
        </div>
      )}
    </div>
  )
}

export default SeasonBanner