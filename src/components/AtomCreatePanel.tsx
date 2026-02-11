interface AtomCreatePanelProps {
  newAtomData: string
  atomDepositEth: string
  onUpdateNewAtomData: (value: string) => void
  onUpdateAtomDeposit: (value: string) => void
  onCreateAtom: () => Promise<void>
  isCreateAtomDisabled: boolean
  isPending: boolean
}

/**
 * Atom作成パネルコンポーネント
 * 新しいAtomを作成するためのフォームを提供します。
 */
export function AtomCreatePanel({
  newAtomData,
  atomDepositEth,
  onUpdateNewAtomData,
  onUpdateAtomDeposit,
  onCreateAtom,
  isCreateAtomDisabled,
  isPending,
}: AtomCreatePanelProps) {
  return (
    <div className="grid">
      <section className="panel">
        <h2>Atom 作成</h2>
        <input
          className="input"
          type="text"
          placeholder="Atomデータ"
          value={newAtomData}
          onChange={(event) => onUpdateNewAtomData(event.target.value)}
        />
        <input
          className="input"
          type="text"
          placeholder="Deposit (ETH)"
          value={atomDepositEth}
          onChange={(event) => onUpdateAtomDeposit(event.target.value)}
        />
        <button
          type="button"
          className="button primary"
          onClick={onCreateAtom}
          disabled={isCreateAtomDisabled}
        >
          {isPending ? '作成中...' : 'Atom作成'}
        </button>
      </section>
    </div>
  )
}
