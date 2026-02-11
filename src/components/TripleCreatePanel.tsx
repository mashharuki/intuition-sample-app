interface TripleCreatePanelProps {
  tripleSubjectId: string
  triplePredicateId: string
  tripleObjectId: string
  tripleDepositEth: string
  onUpdateTripleSubjectId: (value: string) => void
  onUpdateTriplePredicateId: (value: string) => void
  onUpdateTripleObjectId: (value: string) => void
  onUpdateTripleDeposit: (value: string) => void
  onCreateTriple: () => Promise<void>
  isCreateTripleDisabled: boolean
  isPending: boolean
}

/**
 * Triple作成パネルコンポーネント
 * 新しいTripleを作成するためのフォームを提供します。
 */
export function TripleCreatePanel({
  tripleSubjectId,
  triplePredicateId,
  tripleObjectId,
  tripleDepositEth,
  onUpdateTripleSubjectId,
  onUpdateTriplePredicateId,
  onUpdateTripleObjectId,
  onUpdateTripleDeposit,
  onCreateTriple,
  isCreateTripleDisabled,
  isPending,
}: TripleCreatePanelProps) {
  return (
    <div className="grid">
      <section className="panel">
        <h2>Triple 作成</h2>
        <input
          className="input"
          type="text"
          placeholder="Subject ID"
          value={tripleSubjectId}
          onChange={(event) => onUpdateTripleSubjectId(event.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Predicate ID"
          value={triplePredicateId}
          onChange={(event) => onUpdateTriplePredicateId(event.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Object ID"
          value={tripleObjectId}
          onChange={(event) => onUpdateTripleObjectId(event.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Deposit (ETH)"
          value={tripleDepositEth}
          onChange={(event) => onUpdateTripleDeposit(event.target.value)}
        />
        <button
          type="button"
          className="button primary"
          onClick={onCreateTriple}
          disabled={isCreateTripleDisabled}
        >
          {isPending ? '作成中...' : 'Triple作成'}
        </button>
      </section>
    </div>
  )
}
