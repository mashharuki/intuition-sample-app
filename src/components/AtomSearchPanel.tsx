import type { UseQueryResult } from '@tanstack/react-query'
import type { GlobalSearchResult } from '../utils/types'

interface AtomSearchPanelProps {
  searchQuery: string
  onUpdateSearchQuery: (value: string) => void
  isSearchEnabled: boolean
  searchResults: UseQueryResult<GlobalSearchResult, Error>
  selectedAtomId: string
  onSelectAtom: (atomId: string) => void
}

/**
 * Atom検索パネルコンポーネント
 * Atomの検索と結果一覧表示を行います。
 */
export function AtomSearchPanel({
  searchQuery,
  onUpdateSearchQuery,
  isSearchEnabled,
  searchResults,
  selectedAtomId,
  onSelectAtom,
}: AtomSearchPanelProps) {
  return (
    <section className="panel">
      <h2>検索</h2>
      <input
        className="input"
        type="text"
        placeholder="3文字以上で検索"
        value={searchQuery}
        onChange={(event) => onUpdateSearchQuery(event.target.value)}
      />
      <div className="muted">
        {isSearchEnabled
          ? '検索結果を更新中'
          : '検索条件を入力してください'}
      </div>
      {searchResults.isLoading && <div>検索中...</div>}
      {searchResults.data?.atoms?.length ? (
        <div className="list">
          {searchResults.data.atoms.map((atom) => {
            const atomId = atom.term_id
            return (
              <button
                key={atomId}
                type="button"
                className={`list-item ${
                  atomId === selectedAtomId ? 'active' : ''
                }`}
                onClick={() => onSelectAtom(atomId)}
              >
                <div className="list-title">{atom.label ?? atomId}</div>
                <div className="list-subtitle">{atomId}</div>
              </button>
            )
          })}
        </div>
      ) : (
        isSearchEnabled && !searchResults.isLoading && <div>結果なし</div>
      )}
    </section>
  )
}
