import { useState } from 'react'
import { SKILL_TREES, getPathLabel, getPathIcon, getPathColor, type SkillNode } from '../data/skillTrees'
import { canUnlock, type SkillProgress, type CategoryXP } from '../lib/skills'

type Props = {
  categoryXP: CategoryXP
  honor: number
  progress: SkillProgress[]
}

function SkillTree({ categoryXP, honor, progress }: Props) {
  const [selectedNode, setSelectedNode] = useState<SkillNode | null>(null)
  const paths = Object.keys(SKILL_TREES)

  const getNodeState = (node: SkillNode) => {
    const p = progress.find(pr => pr.node_id === node.id)
    if (p?.status === 'mastered') return 'mastered'
    const { can } = canUnlock(node, categoryXP, honor, progress)
    return can ? 'available' : 'locked'
  }

  return (
    <div className="skill-trees-section">
      <div className="skill-trees-header">
        <span className="skill-trees-title">⚔️ SKILL TREES</span>
        <span className="skill-trees-sub">The Seven Paths</span>
      </div>

      <div className="skill-paths-scroll">
        {paths.map(path => {
          const nodes = SKILL_TREES[path]
          const color = getPathColor(path)
          const masteredCount = nodes.filter(
            n => progress.find(p => p.node_id === n.id)?.status === 'mastered'
          ).length

          return (
            <div key={path} className="skill-path-column">
              <div className="skill-path-header" style={{ borderColor: color }}>
                <span className="skill-path-icon">{getPathIcon(path)}</span>
                <span className="skill-path-name" style={{ color }}>
                  {getPathLabel(path)}
                </span>
                <span className="skill-path-count">{masteredCount}/{nodes.length}</span>
              </div>

              <div className="skill-nodes-stack">
                {nodes.map((node, i) => {
                  const state = getNodeState(node)
                  return (
                    <div key={node.id} className="skill-node-wrapper">
                      {i > 0 && (
                        <div
                          className={`skill-connector ${state === 'locked' ? 'dim' : ''}`}
                          style={{ background: state === 'locked' ? 'var(--border)' : color }}
                        />
                      )}
                      <button
                        className={`skill-node skill-node-${state}`}
                        onClick={() => setSelectedNode(node)}
                        style={{ borderColor: state === 'locked' ? 'var(--border)' : color }}
                      >
                        <span className="skill-node-icon">{node.icon}</span>
                        <span className="skill-node-tier">T{node.tier}</span>
                        <span className="skill-node-name">{node.name}</span>
                      </button>
                    </div>
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>

      {selectedNode && (
        <SkillDetailModal
          node={selectedNode}
          state={getNodeState(selectedNode)}
          categoryXP={categoryXP}
          honor={honor}
          progress={progress}
          onClose={() => setSelectedNode(null)}
        />
      )}
    </div>
  )
}

type ModalProps = {
  node: SkillNode
  state: string
  categoryXP: CategoryXP
  honor: number
  progress: SkillProgress[]
  onClose: () => void
}

function SkillDetailModal({ node, state, categoryXP, honor, progress, onClose }: ModalProps) {
  const color = getPathColor(node.path)
  const currentXP = categoryXP[node.path] || 0
  const { reason } = canUnlock(node, categoryXP, honor, progress)

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />
      <div className="modal skill-modal">
        <div className="skill-modal-header" style={{ borderColor: color }}>
          <span className="skill-modal-icon">{node.icon}</span>
          <div className="skill-modal-title-block">
            <div className="skill-modal-title" style={{ color }}>{node.name}</div>
            <div className="skill-modal-sub">{getPathLabel(node.path)} · Tier {node.tier}</div>
          </div>
        </div>

        <div className="skill-modal-description">{node.description}</div>

        <div className="skill-modal-section">
          <div className="skill-modal-label">REQUIREMENTS</div>
          <div className="skill-req-row">
            <span>{node.path} XP</span>
            <span style={{ color: currentXP >= node.requirement.category_xp ? 'var(--accent)' : 'var(--text-muted)' }}>
              {currentXP} / {node.requirement.category_xp}
            </span>
          </div>
          <div className="skill-req-row">
            <span>HONOR</span>
            <span style={{ color: honor >= node.requirement.honor ? 'var(--accent)' : 'var(--text-muted)' }}>
              {honor} / {node.requirement.honor}
            </span>
          </div>
        </div>

        <div className="skill-modal-section">
          <div className="skill-modal-label">MASTERY TEST</div>
          <div className="skill-modal-value">{node.mastery_test}</div>
        </div>

        <div className="skill-modal-section">
          <div className="skill-modal-label">PASSIVE EFFECT</div>
          <div className="skill-modal-passive" style={{ color }}>{node.passive.description}</div>
        </div>

        {state === 'mastered' && <div className="skill-modal-status mastered">✓ MASTERED</div>}
        {state === 'available' && <div className="skill-modal-status available">READY TO UNLOCK</div>}
        {state === 'locked' && reason && <div className="skill-modal-status locked">{reason}</div>}

        <button className="modal-btn" onClick={onClose} style={{ width: '100%', marginTop: 16 }}>
          CLOSE
        </button>
      </div>
    </>
  )
}

export default SkillTree