import { getTripleDisplay } from '../utils/ui-helper'
import type { TripleKind, ModalTriple, AtomDetails, SortKey, SortOrder } from '../utils/types'

interface TripleListModalProps {
  isOpen: boolean
  kind: TripleKind
  atomData: AtomDetails | null
  triples: ModalTriple[]
  filterQuery: string
  sortKey: SortKey
  sortOrder: SortOrder
  onClose: () => void
  onUpdateFilterQuery: (value: string) => void
  onUpdateSortKey: (value: SortKey) => void
  onToggleSortOrder: () => void
}

/**
 * Triple一覧モーダル
 * Atomに関連するTripleの一覧を表示し、フィルタリング・ソート機能を提供します。
 */
export function TripleListModal({
  isOpen,
  kind,
  atomData,
  triples,
  filterQuery,
  sortKey,
  sortOrder,
  onClose,
  onUpdateFilterQuery,
  onUpdateSortKey,
  onToggleSortOrder,
}: TripleListModalProps) {
  if (!isOpen || !atomData) return null

  const modalTitle =
    kind === 'subject'
      ? '主語としての関連'
      : kind === 'predicate'
        ? '述語としての関連'
        : '目的語としての関連'

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label={modalTitle}
        onClick={(event) => event.stopPropagation()}
      >
        <div className="modal-header">
          <div>
            <div className="modal-title">{modalTitle}</div>
            <div className="modal-subtitle">
              {triples.length} 件
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
        <div className="modal-controls">
          <input
            className="input"
            type="text"
            placeholder="フィルタ（subject/predicate/object/ID）"
            value={filterQuery}
            onChange={(e) =>
              onUpdateFilterQuery(e.target.value)
            }
          />
          <div className="controls-row">
            <select
              className="select"
              value={sortKey}
              onChange={(e) =>
                onUpdateSortKey(e.target.value as SortKey)
              }
            >
              {kind !== 'subject' && (
                <option value="subject">subject</option>
              )}
              {kind !== 'predicate' && (
                <option value="predicate">predicate</option>
              )}
              {kind !== 'object' && (
                <option value="object">object</option>
              )}
              <option value="term">term</option>
            </select>
            <button
              type="button"
              className="button"
              onClick={onToggleSortOrder}
            >
              {sortOrder === 'asc' ? '昇順' : '降順'}
            </button>
          </div>
        </div>
        <div className="modal-body">
          {triples.length === 0 && (
            <div className="muted">まだ関連がありません</div>
          )}
          {triples.map((triple) => {
            const display = getTripleDisplay(
              triple,
              kind,
              atomData,
            )
            return (
              <div key={triple.term_id} className="modal-item">
                <div className="triple-item">
                  <span
                    className={`triple-node ${
                      kind === 'subject' ? 'strong' : ''
                    }`}
                  >
                    {display.subjectLabel}
                  </span>
                  <span className="triple-arrow">—</span>
                  <span
                    className={`triple-predicate ${
                      kind === 'predicate' ? 'strong' : ''
                    }`}
                  >
                    {display.predicateLabel}
                  </span>
                  <span className="triple-arrow">→</span>
                  <span
                    className={`triple-node ${
                      kind === 'object' ? 'strong' : ''
                    }`}
                  >
                    {display.objectLabel}
                  </span>
                </div>
                <div className="modal-meta">
                  Triple ID: {triple.term_id}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
