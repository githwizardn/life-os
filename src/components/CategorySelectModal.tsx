import { useState } from 'react'
import { CATEGORIES, CATEGORY_INFO } from '../data/tasks'

type Props = {
  current: string[]
  onConfirm: (selected: string[]) => void
  onCancel: () => void
}

function CategorySelectModal({ current, onConfirm, onCancel }: Props) {
  const [selected, setSelected] = useState<string[]>(current)

  const toggle = (cat: string) => {
    setSelected(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    )
  }

  const handleConfirm = () => {
    // Must select at least 1
    if (selected.length === 0) return
    onConfirm(selected)
  }

  return (
    <>
      <div className="modal-overlay" onClick={onCancel} />
      <div className="modal">
        <div className="modal-title" style={{ fontSize: '20px', marginBottom: '8px' }}>
          CHOOSE TODAY'S CATEGORIES
        </div>
        <div className="modal-message">
          Only selected categories will appear today.
        </div>

        {/* Category grid */}
        <div className="cat-select-grid">
          {CATEGORIES.map(cat => {
            const { icon } = CATEGORY_INFO[cat]
            const isSelected = selected.includes(cat)
            return (
              <button
                key={cat}
                className={`cat-select-btn ${isSelected ? 'selected' : ''}`}
                onClick={() => toggle(cat)}
              >
                <span>{icon}</span>
                <span>{cat.toUpperCase()}</span>
              </button>
            )
          })}
        </div>

        {/* Confirm */}
        <button
          className="modal-btn"
          onClick={handleConfirm}
          style={{ width: '100%', marginTop: '16px' }}
        >
          START DAY → ({selected.length} categories)
        </button>

        {/* Cancel */}
        <button
          className="export-btn"
          onClick={onCancel}
          style={{ width: '100%', marginTop: '10px' }}
        >
          CANCEL
        </button>
      </div>
    </>
  )
}

export default CategorySelectModal