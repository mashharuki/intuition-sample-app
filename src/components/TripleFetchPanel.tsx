import type { UseQueryResult } from '@tanstack/react-query'
import { formatDateLabel, getTransactionUrl } from '../utils/helper'
import type { TripleDetails } from '../utils/types'
import { TripleGraphModal } from './TripleGraphModal'

interface TripleFetchPanelProps {
  fetchTripleId: string
  onUpdateFetchTripleId: (value: string) => void
  tripleDetails: UseQueryResult<TripleDetails, Error>
  isTripleGraphModalOpen: boolean
  onOpenTripleGraphModal: () => void
  onCloseTripleGraphModal: () => void
}

/**
 * Triple取得パネルコンポーネント
 * Triple IDによる詳細情報の取得と表示を行います。
 */
export function TripleFetchPanel({
  fetchTripleId,
  onUpdateFetchTripleId,
  tripleDetails,
  isTripleGraphModalOpen,
  onOpenTripleGraphModal,
  onCloseTripleGraphModal,
}: TripleFetchPanelProps) {
  return (
    <div className="grid">
      <section className="panel">
        <h2>Triple 取得</h2>
        <input
          className="input"
          type="text"
          placeholder="Triple ID (term_id)"
          value={fetchTripleId}
          onChange={(event) => onUpdateFetchTripleId(event.target.value)}
        />
        <div className="muted">IDを入力すると自動で取得します</div>
        {tripleDetails.isLoading && <div>取得中...</div>}
        {tripleDetails.data && (
          <div className="atom-value">
            <div className="atom-section-title">Triple 詳細</div>
            <div className="atom-info-grid">
              <div className="atom-info">
                <div className="atom-info-label">Triple ID</div>
                <div className="atom-info-value">
                  {tripleDetails.data.term_id}
                </div>
              </div>
              <div className="atom-info">
                <div className="atom-info-label">Tx</div>
                <a
                  className="atom-info-link"
                  href={getTransactionUrl(tripleDetails.data.transaction_hash)}
                  target="_blank"
                  rel="noreferrer"
                >
                  {tripleDetails.data.transaction_hash}
                </a>
              </div>
              <div className="atom-info">
                <div className="atom-info-label">作成者</div>
                <div className="atom-info-value">
                  {tripleDetails.data.creator?.label ??
                    tripleDetails.data.creator_id}
                </div>
              </div>
              <div className="atom-info">
                <div className="atom-info-label">作成日時</div>
                <div className="atom-info-value">
                  {formatDateLabel(tripleDetails.data.created_at)}
                </div>
              </div>
            </div>
            <button
              type="button"
              className="button"
              onClick={onOpenTripleGraphModal}
            >
              ナレッジグラフ表示
            </button>
          </div>
        )}
        {!tripleDetails.isLoading &&
          fetchTripleId &&
          !tripleDetails.data && (
            <div className="muted">該当するTripleが見つかりません</div>
          )}
        <TripleGraphModal
          isOpen={isTripleGraphModalOpen}
          tripleDetails={tripleDetails.data}
          onClose={onCloseTripleGraphModal}
        />
      </section>
    </div>
  )
}
