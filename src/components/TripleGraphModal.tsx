import { getNodeLabel } from '../utils/helper'
import type { TripleDetails } from '../utils/types'

interface TripleGraphModalProps {
  isOpen: boolean
  tripleDetails: TripleDetails | undefined
  onClose: () => void
}

/**
 * Tripleナレッジグラフモーダル
 * Tripleの関係性を視覚的に表示します。
 */
export function TripleGraphModal({ isOpen, tripleDetails, onClose }: TripleGraphModalProps) {
  if (!isOpen || !tripleDetails) return null

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Triple ナレッジグラフ"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">Triple ナレッジグラフ</div>
            <div className="modal-subtitle">
              {tripleDetails.term_id}
            </div>
          </div>
          <button
            type="button"
            className="modal-close"
            onClick={onClose}
          >
            閉じる
          </button>
        </div>
        <div className="modal-body">
          <div className="triple-graph">
            <div className="triple-graph-node">
              <div className="triple-graph-label">Subject</div>
              <div className="triple-graph-value">
                {getNodeLabel(tripleDetails.subject)}
              </div>
            </div>
            <div className="triple-graph-link">
              <div className="triple-graph-line" />
              <div className="triple-graph-badge">
                {getNodeLabel(tripleDetails.predicate)}
              </div>
              <div className="triple-graph-arrow">→</div>
              <div className="triple-graph-caption">Predicate</div>
            </div>
            <div className="triple-graph-node">
              <div className="triple-graph-label">Object</div>
              <div className="triple-graph-value">
                {getNodeLabel(tripleDetails.object)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
