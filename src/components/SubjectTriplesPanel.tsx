import type { UseQueryResult } from '@tanstack/react-query'
import { getNodeLabel } from '../utils/helper'
import { SUBJECT_TRIPLES_LIMIT_OPTIONS } from '../utils/constants'
import type { SubjectSortKey, SubjectTriplesQueryTriple, TriplesBySubjectResult, SortOrder } from '../utils/types'

interface SubjectTriplesPanelProps {
  subjectTriplesSubjectId: string
  onUpdateSubjectTriplesSubjectId: (value: string) => void
  subjectTriplesQuery: UseQueryResult<TriplesBySubjectResult, Error>
  subjectTriplesFiltered: SubjectTriplesQueryTriple[]
  subjectTriplesFilterQuery: string
  onUpdateSubjectTriplesFilterQuery: (value: string) => void
  subjectTriplesSortKey: SubjectSortKey
  onUpdateSubjectTriplesSortKey: (value: SubjectSortKey) => void
  subjectTriplesSortOrder: SortOrder
  onToggleSubjectTriplesSortOrder: () => void
  subjectTriplesLimitCount: number
  onUpdateSubjectTriplesLimit: (value: number) => void
  subjectTriplesPageIndex: number
  subjectTriplesPageCount: number
  onNextSubjectTriplesPage: () => void
  onPreviousSubjectTriplesPage: () => void
}

/**
 * Subject Triple一覧パネルコンポーネント
 * 特定のSubjectに関連するTripleの一覧を表示・フィルタリングします。
 */
export function SubjectTriplesPanel({
  subjectTriplesSubjectId,
  onUpdateSubjectTriplesSubjectId,
  subjectTriplesQuery,
  subjectTriplesFiltered,
  subjectTriplesFilterQuery,
  onUpdateSubjectTriplesFilterQuery,
  subjectTriplesSortKey,
  onUpdateSubjectTriplesSortKey,
  subjectTriplesSortOrder,
  onToggleSubjectTriplesSortOrder,
  subjectTriplesLimitCount,
  onUpdateSubjectTriplesLimit,
  subjectTriplesPageIndex,
  subjectTriplesPageCount,
  onNextSubjectTriplesPage,
  onPreviousSubjectTriplesPage,
}: SubjectTriplesPanelProps) {
  return (
    <div className="grid">
      <section className="panel">
        <h2>SubjectでTriple一覧取得</h2>
        <input
          className="input"
          type="text"
          placeholder="Subject ID (term_id)"
          value={subjectTriplesSubjectId}
          onChange={(event) =>
            onUpdateSubjectTriplesSubjectId(event.target.value)
          }
        />
        <div className="muted">Subject IDを入力すると自動で取得します</div>
        {subjectTriplesQuery.isLoading && <div>取得中...</div>}
        {subjectTriplesQuery.isError && (
          <div className="message error">
            {subjectTriplesQuery.error instanceof Error
              ? subjectTriplesQuery.error.message
              : '取得に失敗しました'}
          </div>
        )}
        {subjectTriplesQuery.data && (
          <div className="atom-value">
            <div className="atom-section-title">取得結果</div>
            <div className="muted">
              {subjectTriplesQuery.data.totalCount} 件中{' '}
              {subjectTriplesFiltered.length} 件を表示
            </div>
            <div className="modal-controls">
              <input
                className="input"
                type="text"
                placeholder="フィルタ（predicate/object/ID）"
                value={subjectTriplesFilterQuery}
                onChange={(event) =>
                  onUpdateSubjectTriplesFilterQuery(
                    event.target.value,
                  )
                }
              />
              <div className="controls-row">
                <select
                  className="select"
                  value={subjectTriplesSortKey}
                  onChange={(event) =>
                    onUpdateSubjectTriplesSortKey(
                      event.target.value as SubjectSortKey,
                    )
                  }
                >
                  <option value="predicate">predicate</option>
                  <option value="object">object</option>
                  <option value="term">term</option>
                </select>
                <button
                  type="button"
                  className="button"
                  onClick={onToggleSubjectTriplesSortOrder}
                >
                  {subjectTriplesSortOrder === 'asc' ? '昇順' : '降順'}
                </button>
                <select
                  className="select"
                  value={subjectTriplesLimitCount}
                  onChange={(event) =>
                    onUpdateSubjectTriplesLimit(
                      Number(event.target.value),
                    )
                  }
                >
                  {SUBJECT_TRIPLES_LIMIT_OPTIONS.map((option) => (
                    <option key={option} value={option}>
                      {option} 件
                    </option>
                  ))}
                </select>
              </div>
              <div className="controls-row">
                <button
                  type="button"
                  className="button"
                  onClick={onPreviousSubjectTriplesPage}
                  disabled={subjectTriplesPageIndex === 0}
                >
                  前へ
                </button>
                <div className="muted">
                  {subjectTriplesPageIndex + 1} / {subjectTriplesPageCount}
                </div>
                <button
                  type="button"
                  className="button"
                  onClick={onNextSubjectTriplesPage}
                  disabled={
                    subjectTriplesPageIndex + 1 >= subjectTriplesPageCount
                  }
                >
                  次へ
                </button>
              </div>
            </div>
            {subjectTriplesFiltered.length === 0 && (
              <div className="muted">該当するTripleがありません</div>
            )}
            {subjectTriplesFiltered.map((triple) => (
              <div key={triple.term_id} className="triple-item">
                <span className="triple-node strong">
                  {getNodeLabel(triple.subject)}
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
          </div>
        )}
      </section>
    </div>
  )
}
