import type { UseQueryResult } from '@tanstack/react-query'
import {
  formatDateLabel,
  getAtomPrimaryLabel,
  getAtomSecondaryLabel,
  getAtomValueInfo,
  getDefaultSortKey,
  getNodeLabel,
  getTransactionUrl,
} from '../utils/helper'
import { getTripleSortValue, tripleIncludesQuery } from '../utils/ui-helper'
import { MAX_TRIPLE_PREVIEW_COUNT } from '../utils/constants'
import type { AtomDetails, TripleKind, SortKey, SortOrder } from '../utils/types'
import { TripleListModal } from './TripleListModal'

interface AtomDetailPanelProps {
  selectedAtomId: string
  atomDetails: UseQueryResult<AtomDetails, Error>
  isTripleModalOpen: boolean
  tripleModalKind: TripleKind
  tripleFilterQuery: string
  tripleSortKey: SortKey
  tripleSortOrder: SortOrder
  onOpenTripleModal: (kind: TripleKind) => void
  onCloseTripleModal: () => void
  onUpdateTripleFilterQuery: (value: string) => void
  onUpdateTripleSortKey: (value: SortKey) => void
  onToggleTripleSortOrder: () => void
}

/**
 * Atom詳細パネルコンポーネント
 * 選択されたAtomの詳細情報、Knowledge Graph、関連Tripleを表示します。
 */
export function AtomDetailPanel({
  selectedAtomId,
  atomDetails,
  isTripleModalOpen,
  tripleModalKind,
  tripleFilterQuery,
  tripleSortKey,
  tripleSortOrder,
  onOpenTripleModal,
  onCloseTripleModal,
  onUpdateTripleFilterQuery,
  onUpdateTripleSortKey,
  onToggleTripleSortOrder,
}: AtomDetailPanelProps) {
  const atomData = atomDetails.data ?? null
  const atomPrimaryLabel = getAtomPrimaryLabel(atomData)
  const atomSecondaryLabel = getAtomSecondaryLabel(atomData)
  const atomValueInfo = getAtomValueInfo(atomData)

  const subjectTriples = atomData?.as_subject_triples ?? []
  const predicateTriples = atomData?.as_predicate_triples ?? []
  const objectTriples = atomData?.as_object_triples ?? []

  const subjectPreview = subjectTriples.slice(0, MAX_TRIPLE_PREVIEW_COUNT)
  const predicatePreview = predicateTriples.slice(0, MAX_TRIPLE_PREVIEW_COUNT)
  const objectPreview = objectTriples.slice(0, MAX_TRIPLE_PREVIEW_COUNT)

  const subjectMoreCount = Math.max(
    subjectTriples.length - subjectPreview.length,
    0,
  )
  const predicateMoreCount = Math.max(
    predicateTriples.length - predicatePreview.length,
    0,
  )
  const objectMoreCount = Math.max(
    objectTriples.length - objectPreview.length,
    0,
  )

  const modalTriples =
    tripleModalKind === 'subject'
      ? subjectTriples
      : tripleModalKind === 'predicate'
        ? predicateTriples
        : objectTriples

  const filteredTriples = modalTriples.filter((t) =>
    tripleFilterQuery.trim().length === 0
      ? true
      : tripleIncludesQuery(t, tripleFilterQuery),
  )

  const sortedTriples = filteredTriples.slice().sort((a, b) => {
    const av = getTripleSortValue(a, tripleSortKey)
    const bv = getTripleSortValue(b, tripleSortKey)
    const cmp = av.localeCompare(bv)
    return tripleSortOrder === 'asc' ? cmp : -cmp
  })

  return (
    <section className="panel">
      <h2>Atom 詳細</h2>
      {selectedAtomId ? (
        <>
          <div className="muted">選択中: {selectedAtomId}</div>
          {atomDetails.isLoading && <div>取得中...</div>}
          {atomData && (
            <div className="atom-detail">
              <div className="atom-hero">
                <div className="atom-identity">
                  <div className="atom-title">{atomPrimaryLabel}</div>
                  {atomSecondaryLabel && (
                    <div className="atom-subtitle">
                      {atomSecondaryLabel}
                    </div>
                  )}
                  <div className="atom-meta">
                    {atomData.emoji && (
                      <span className="atom-chip">{atomData.emoji}</span>
                    )}
                    <span className="atom-chip">
                      Type: {String(atomData.type ?? '-')}
                    </span>
                    <span className="atom-chip">
                      Created: {formatDateLabel(atomData.created_at)}
                    </span>
                    <span className="atom-chip">
                      Creator:{' '}
                      {atomData.creator?.label ?? atomData.creator_id}
                    </span>
                  </div>
                </div>
                {atomData.image && (
                  <div className="atom-image">
                    <img src={atomData.image} alt={atomPrimaryLabel} />
                  </div>
                )}
              </div>

              <div className="atom-info-grid">
                <div className="atom-info">
                  <div className="atom-info-label">Atom ID</div>
                  <div className="atom-info-value">{atomData.term_id}</div>
                </div>
                <div className="atom-info">
                  <div className="atom-info-label">Tx</div>
                  <a
                    className="atom-info-link"
                    href={getTransactionUrl(atomData.transaction_hash)}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {atomData.transaction_hash}
                  </a>
                </div>
                <div className="atom-info">
                  <div className="atom-info-label">Wallet</div>
                  <div className="atom-info-value">
                    {atomData.wallet_id}
                  </div>
                </div>
              </div>

              {atomValueInfo && (
                <div className="atom-value">
                  <div className="atom-section-title">
                    Value: {atomValueInfo.typeLabel}
                  </div>
                  <div className="atom-value-body">
                    {atomValueInfo.image && (
                      <div className="atom-value-image">
                        <img
                          src={atomValueInfo.image}
                          alt={atomValueInfo.name ?? atomPrimaryLabel}
                        />
                      </div>
                    )}
                    <div className="atom-value-text">
                      {atomValueInfo.name && (
                        <div className="atom-value-title">
                          {atomValueInfo.name}
                        </div>
                      )}
                      {atomValueInfo.description && (
                        <div className="atom-value-description">
                          {atomValueInfo.description}
                        </div>
                      )}
                      {atomValueInfo.url && (
                        <a
                          className="atom-value-link"
                          href={atomValueInfo.url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {atomValueInfo.url}
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              )}

              <div className="atom-graph">
                <div className="atom-section-title">
                  Knowledge Graph
                </div>
                <div className="graph-summary">
                  <div className="graph-card">
                    <div className="graph-count">
                      {subjectTriples.length}
                    </div>
                    <div className="graph-label">Subject</div>
                  </div>
                  <div className="graph-card highlight">
                    <div className="graph-count">
                      {predicateTriples.length}
                    </div>
                    <div className="graph-label">Predicate</div>
                  </div>
                  <div className="graph-card">
                    <div className="graph-count">
                      {objectTriples.length}
                    </div>
                    <div className="graph-label">Object</div>
                  </div>
                </div>

                <div className="triple-columns">
                  <div className="triple-column">
                    <div className="triple-label">主語として</div>
                    {subjectPreview.length === 0 && (
                      <div className="muted">まだ関連がありません</div>
                    )}
                    {subjectPreview.map((triple) => (
                      <div
                        key={triple.term_id}
                        className="triple-item"
                      >
                        <span className="triple-node strong">
                          {getNodeLabel(atomData ?? null)}
                        </span>
                        <span className="triple-arrow">—</span>
                        <span className="triple-predicate">
                          {getNodeLabel(triple.predicate)}
                        </span>
                        <span className="triple-arrow">→</span>
                        <span className="triple-node">
                          {getNodeLabel(triple.object)}
                        </span>
                      </div>
                    ))}
                    {subjectMoreCount > 0 && (
                      <div className="muted">他 {subjectMoreCount} 件</div>
                    )}
                    {subjectTriples.length > 0 && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => onOpenTripleModal('subject')}
                      >
                        全件表示
                      </button>
                    )}
                  </div>

                  <div className="triple-column">
                    <div className="triple-label">述語として</div>
                    {predicatePreview.length === 0 && (
                      <div className="muted">まだ関連がありません</div>
                    )}
                    {predicatePreview.map((triple) => (
                      <div
                        key={triple.term_id}
                        className="triple-item"
                      >
                        <span className="triple-node">
                          {getNodeLabel(triple.subject)}
                        </span>
                        <span className="triple-arrow">—</span>
                        <span className="triple-predicate strong">
                          {getNodeLabel(atomData ?? null)}
                        </span>
                        <span className="triple-arrow">→</span>
                        <span className="triple-node">
                          {getNodeLabel(triple.object)}
                        </span>
                      </div>
                    ))}
                    {predicateMoreCount > 0 && (
                      <div className="muted">他 {predicateMoreCount} 件</div>
                    )}
                    {predicateTriples.length > 0 && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => onOpenTripleModal('predicate')}
                      >
                        全件表示
                      </button>
                    )}
                  </div>

                  <div className="triple-column">
                    <div className="triple-label">目的語として</div>
                    {objectPreview.length === 0 && (
                      <div className="muted">まだ関連がありません</div>
                    )}
                    {objectPreview.map((triple) => (
                      <div
                        key={triple.term_id}
                        className="triple-item"
                      >
                        <span className="triple-node">
                          {getNodeLabel(triple.subject)}
                        </span>
                        <span className="triple-arrow">—</span>
                        <span className="triple-predicate">
                          {getNodeLabel(triple.predicate)}
                        </span>
                        <span className="triple-arrow">→</span>
                        <span className="triple-node strong">
                          {getNodeLabel(atomData ?? null)}
                        </span>
                      </div>
                    ))}
                    {objectMoreCount > 0 && (
                      <div className="muted">他 {objectMoreCount} 件</div>
                    )}
                    {objectTriples.length > 0 && (
                      <button
                        type="button"
                        className="text-button"
                        onClick={() => onOpenTripleModal('object')}
                      >
                        全件表示
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="muted">Atomを選択してください</div>
      )}
      <TripleListModal
        isOpen={isTripleModalOpen}
        kind={tripleModalKind}
        atomData={atomData}
        triples={sortedTriples}
        filterQuery={tripleFilterQuery}
        sortKey={tripleSortKey}
        sortOrder={tripleSortOrder}
        onClose={onCloseTripleModal}
        onUpdateFilterQuery={onUpdateTripleFilterQuery}
        onUpdateSortKey={onUpdateTripleSortKey}
        onToggleSortOrder={onToggleTripleSortOrder}
      />
    </section>
  )
}
