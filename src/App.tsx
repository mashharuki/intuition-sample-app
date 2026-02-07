import {
  createAtomFromString,
  createTripleStatement,
  getAtomDetails,
  getMultiVaultAddressFromChainId,
  globalSearch,
} from '@0xintuition/sdk'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useMemo, useState, type ReactElement } from 'react'
import { parseEther } from 'viem'
import {
  useAccount,
  useChainId,
  useConnect,
  useDisconnect,
  usePublicClient,
  useWalletClient,
} from 'wagmi'
import './App.css'

type AtomDetails = Awaited<ReturnType<typeof getAtomDetails>>
type GlobalSearchResult = Awaited<ReturnType<typeof globalSearch>>
type CreateAtomResult = Awaited<ReturnType<typeof createAtomFromString>>
type CreateTripleResult = Awaited<ReturnType<typeof createTripleStatement>>
type HexAddress = `0x${string}`

const SEARCH_MIN_LENGTH_COUNT = 3
const SEARCH_STALE_TIME_MS = 1000 * 60
const ATOM_STALE_TIME_MS = 1000 * 60 * 5
const ATOMS_LIMIT_COUNT = 10
const DEFAULT_DEPOSIT_ETH = '0.01'
const EXPLORER_BASE_URL = 'https://explorer.intuition.systems'
const TAB_ITEMS = [
  { key: 'explore', label: '検索・詳細' },
  { key: 'atom', label: 'Atom作成' },
  { key: 'triple', label: 'Triple作成' },
] as const
const MAX_TRIPLE_PREVIEW_COUNT = 3
const MAX_NODE_LABEL_LENGTH_COUNT = 36
const SUPPORTED_CHAIN_LABELS: Record<number, string> = {
  1155: 'Intuition Mainnet (1155)',
  13579: 'Intuition Testnet (13579)',
}
const OPTIONAL_CHAIN_LABELS: Record<number, string> = {
  84532: 'Base Sepolia (84532)',
}

function getChainLabel(chainId: number): string {
  return (
    SUPPORTED_CHAIN_LABELS[chainId] ??
    OPTIONAL_CHAIN_LABELS[chainId] ??
    `Unknown (${chainId})`
  )
}

function getTransactionUrl(hash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${hash}`
}

type TabKey = (typeof TAB_ITEMS)[number]['key']
type AtomValueInfo = {
  typeLabel: string
  name?: string
  description?: string
  url?: string
  image?: string
}

function getDisplayText(value: string, maxLengthCount: number): string {
  if (value.length <= maxLengthCount) {
    return value
  }
  return `${value.slice(0, Math.max(maxLengthCount - 1, 0))}…`
}

function formatDateLabel(value: unknown): string {
  if (!value) {
    return '-'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString('ja-JP')
}

function getNodeLabel(
  node?: {
    label?: string | null
    data?: string | null
    term_id?: string
    emoji?: string | null
  } | null | undefined,
): string {
  if (!node) {
    return '-'
  }
  const base =
    node.label ??
    node.data ??
    node.term_id ??
    '-'
  const label = node.emoji ? `${node.emoji} ${base}` : base
  return getDisplayText(label, MAX_NODE_LABEL_LENGTH_COUNT)
}

function getAtomValueInfo(
  atom: AtomDetails | null | undefined,
): AtomValueInfo | null {
  if (!atom?.value) {
    return null
  }
  if (atom.value.person) {
    return {
      typeLabel: '人物',
      name: atom.value.person.name ?? undefined,
      description: atom.value.person.description ?? undefined,
      url: atom.value.person.url ?? undefined,
      image: atom.value.person.image ?? undefined,
    }
  }
  if (atom.value.organization) {
    return {
      typeLabel: '組織',
      name: atom.value.organization.name ?? undefined,
      description: atom.value.organization.description ?? undefined,
      url: atom.value.organization.url ?? undefined,
      image: atom.value.organization.image ?? undefined,
    }
  }
  if (atom.value.thing) {
    return {
      typeLabel: 'モノ',
      name: atom.value.thing.name ?? undefined,
      description: atom.value.thing.description ?? undefined,
      url: atom.value.thing.url ?? undefined,
      image: atom.value.thing.image ?? undefined,
    }
  }
  if (atom.value.account) {
    return {
      typeLabel: 'アカウント',
      name: atom.value.account.label ?? undefined,
      image: atom.value.account.image ?? undefined,
    }
  }
  return null
}

function getAtomPrimaryLabel(atom: AtomDetails | null | undefined): string {
  if (!atom) {
    return '-'
  }
  const valueInfo = getAtomValueInfo(atom)
  return (
    atom.label ??
    valueInfo?.name ??
    atom.data ??
    atom.term_id
  )
}

function getAtomSecondaryLabel(atom: AtomDetails | null | undefined): string {
  if (!atom) {
    return ''
  }
  if (atom.label && atom.data) {
    return getDisplayText(atom.data, MAX_NODE_LABEL_LENGTH_COUNT)
  }
  if (atom.label && atom.term_id) {
    return atom.term_id
  }
  if (atom.data && atom.term_id) {
    return atom.term_id
  }
  return ''
}

/**
 * App コンポーネント
 * @returns 
 */
function App(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('explore')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedAtomId, setSelectedAtomId] = useState<string>('')
  const [newAtomData, setNewAtomData] = useState<string>('')
  const [atomDepositEth, setAtomDepositEth] = useState<string>(DEFAULT_DEPOSIT_ETH)
  const [tripleSubjectId, setTripleSubjectId] = useState<string>('')
  const [triplePredicateId, setTriplePredicateId] = useState<string>('')
  const [tripleObjectId, setTripleObjectId] = useState<string>('')
  const [tripleDepositEth, setTripleDepositEth] =
    useState<string>(DEFAULT_DEPOSIT_ETH)
  const [statusMessage, setStatusMessage] = useState<string>('')
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [lastTransactionHash, setLastTransactionHash] = useState<string>('')
  const [lastTransactionLabel, setLastTransactionLabel] =
    useState<string>('')

  const chainId = useChainId()
  const { address, isConnected } = useAccount()
  const { connect, connectors, isPending: isConnecting, error: connectError } =
    useConnect()
  const { disconnect } = useDisconnect()
  const publicClient = usePublicClient({ chainId })
  const { data: walletClient } = useWalletClient({ chainId })
  const queryClient = useQueryClient()
  const defaultConnector = useMemo(() => connectors[0], [connectors])
  const multiVaultAddress = useMemo((): HexAddress | undefined => {
    try {
      return getMultiVaultAddressFromChainId(chainId) as HexAddress
    } catch {
      return undefined
    }
  }, [chainId])
  const isChainSupported = Boolean(multiVaultAddress)
  const isPublicClientReady = Boolean(publicClient)
  const isWalletClientReady = Boolean(walletClient)
  const isWalletReady = isConnected && isPublicClientReady && isWalletClientReady

  const isSearchEnabled = searchQuery.length >= SEARCH_MIN_LENGTH_COUNT

  // 検索結果を取得するhooks
  const searchResults = useQuery<GlobalSearchResult>({
    queryKey: ['search', searchQuery],
    queryFn: () => globalSearch(searchQuery, { atomsLimit: ATOMS_LIMIT_COUNT }),
    enabled: isSearchEnabled,
    staleTime: SEARCH_STALE_TIME_MS,
  })

  // Atomの詳細情報を取得するhooks
  const atomDetails = useQuery<AtomDetails>({
    queryKey: ['atom', selectedAtomId],
    queryFn: () => getAtomDetails(selectedAtomId),
    enabled: selectedAtomId.length > 0,
    staleTime: ATOM_STALE_TIME_MS,
  })

  // Atomeを新たに登録するためのhook
  const createAtom = useMutation<CreateAtomResult, Error, { data: string; depositEth: string }>(
    {
      mutationFn: async ({ data, depositEth }): Promise<CreateAtomResult> => {
        if (!isConnected) {
          throw new Error('Walletが接続されていません')
        }
        if (!walletClient) {
          throw new Error('Walletクライアントを取得できません')
        }
        if (!publicClient) {
          throw new Error('Public clientを取得できません')
        }
        if (!multiVaultAddress) {
          throw new Error(
            'このチェーンは未対応です。Intuition Mainnet / Testnetへ切り替えてください',
          )
        }
        const address = multiVaultAddress
        const depositAmount = parseEther(depositEth)
        return createAtomFromString(
          { walletClient, publicClient, address },
          data,
          depositAmount,
        )
      },
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: ['search'] })
        setSelectedAtomId(result.state.termId)
        setNewAtomData('')
        setStatusMessage(`Atom作成に成功: ${result.state.termId}`)
        setLastTransactionHash(result.transactionHash)
        setLastTransactionLabel('Atom')
        setErrorMessage('')
      },
      onError: (error) => {
        setErrorMessage(error.message)
      },
    },
  )

  // Tripleを新たに登録するhooks
  const createTriple = useMutation<CreateTripleResult, Error, { subjectId: string; predicateId: string; objectId: string; depositEth: string }>(
    {
      mutationFn: async ({
        subjectId,
        predicateId,
        objectId,
        depositEth,
      }): Promise<CreateTripleResult> => {
        if (!isConnected) {
          throw new Error('Walletが接続されていません')
        }
        if (!walletClient) {
          throw new Error('Walletクライアントを取得できません')
        }
        if (!publicClient) {
          throw new Error('Public clientを取得できません')
        }
        if (!multiVaultAddress) {
          throw new Error(
            'このチェーンは未対応です。Intuition Mainnet / Testnetへ切り替えてください',
          )
        }
        const address = multiVaultAddress
        const depositAmount = parseEther(depositEth)
        return createTripleStatement(
          { walletClient, publicClient, address },
          {
            args: [
              [subjectId as `0x${string}`],
              [predicateId as `0x${string}`],
              [objectId as `0x${string}`],
              [depositAmount],
            ],
            value: depositAmount,
          },
        )
      },
      onSuccess: (result) => {
        queryClient.invalidateQueries({ queryKey: ['search'] })
        setStatusMessage('Triple作成に成功')
        setLastTransactionHash(result.transactionHash)
        setLastTransactionLabel('Triple')
        setErrorMessage('')
        setTripleSubjectId('')
        setTriplePredicateId('')
        setTripleObjectId('')
      },
      onError: (error) => {
        setErrorMessage(error.message)
      },
    },
  )

  /**
   * Atomeを選択した時の処理
   * @param atomId 
   */
  const handleSelectAtom = (atomId: string): void => {
    setSelectedAtomId(atomId)
  }

  /**
   * Walletに接続する時の処理
   * @returns 
   */
  const handleConnectWallet = (): void => {
    if (!defaultConnector) {
      setErrorMessage('利用可能なコネクタが見つかりません')
      return
    }
    connect({ connector: defaultConnector })
  }

  /**
   * Walletとの接続を遮断する時の処理
   */
  const handleDisconnectWallet = (): void => {
    disconnect()
  }

  /**
   * Atomの作成ボタンを押した時の処理
   */
  const handleCreateAtom = async (): Promise<void> => {
    setStatusMessage('')
    setErrorMessage('')
    setLastTransactionHash('')
    setLastTransactionLabel('')
    await createAtom.mutateAsync({
      data: newAtomData,
      depositEth: atomDepositEth,
    })
  } 

  /**
   * Tripleを作成するときの処理
   */
  const handleCreateTriple = async (): Promise<void> => {
    setStatusMessage('')
    setErrorMessage('')
    setLastTransactionHash('')
    setLastTransactionLabel('')
    await createTriple.mutateAsync({
      subjectId: tripleSubjectId,
      predicateId: triplePredicateId,
      objectId: tripleObjectId,
      depositEth: tripleDepositEth,
    })
  }

  const handleUpdateSearchQuery = (value: string): void => {
    setSearchQuery(value)
  }

  const handleUpdateNewAtomData = (value: string): void => {
    setNewAtomData(value)
  }

  const handleUpdateAtomDeposit = (value: string): void => {
    setAtomDepositEth(value)
  }

  const handleUpdateTripleSubjectId = (value: string): void => {
    setTripleSubjectId(value)
  }

  const handleUpdateTriplePredicateId = (value: string): void => {
    setTriplePredicateId(value)
  }

  const handleUpdateTripleObjectId = (value: string): void => {
    setTripleObjectId(value)
  }

  const handleUpdateTripleDeposit = (value: string): void => {
    setTripleDepositEth(value)
  }

  const handleSelectTab = (tabKey: TabKey): void => {
    setActiveTab(tabKey)
  }

  const isCreateAtomDisabled =
    !isWalletReady ||
    !isChainSupported ||
    newAtomData.trim().length === 0 ||
    createAtom.isPending
  const isCreateTripleDisabled =
    !isWalletReady ||
    !isChainSupported ||
    tripleSubjectId.trim().length === 0 ||
    triplePredicateId.trim().length === 0 ||
    tripleObjectId.trim().length === 0 ||
    createTriple.isPending
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

  return (
    <div className="app">
      <header className="header">
        <div>
          <div className="title">Intuition Atom Explorer</div>
          <div className="subtitle">React + TanStack Query + Wagmi</div>
        </div>
        <div className="wallet">
          <div className="wallet-info">
            <span>Chain: {getChainLabel(chainId)}</span>
            <span>Account: {address ?? '-'}</span>
          </div>
          <div className="wallet-actions">
            {!isConnected ? (
              <button
                type="button"
                className="button primary"
                onClick={handleConnectWallet}
                disabled={!defaultConnector || isConnecting}
              >
                {isConnecting ? '接続中...' : 'Wallet接続'}
              </button>
            ) : (
              <button
                type="button"
                className="button"
                onClick={handleDisconnectWallet}
              >
                接続解除
              </button>
            )}
          </div>
          {connectError && (
            <div className="message error">{connectError.message}</div>
          )}
        </div>
      </header>

      <div className="messages">
        {statusMessage && <div className="message success">{statusMessage}</div>}
        {errorMessage && <div className="message error">{errorMessage}</div>}
        {lastTransactionHash && (
          <div className="message info">
            {lastTransactionLabel} Tx:{' '}
            <a
              href={getTransactionUrl(lastTransactionHash)}
              target="_blank"
              rel="noreferrer"
            >
              {lastTransactionHash}
            </a>
          </div>
        )}
        {!isChainSupported && (
          <div className="message error">
            対応チェーン: {Object.values(SUPPORTED_CHAIN_LABELS).join(', ')}
          </div>
        )}
      </div>

      <div className="tabs">
        {TAB_ITEMS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            className={`tab ${activeTab === tab.key ? 'active' : ''}`}
            onClick={() => handleSelectTab(tab.key)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'explore' && (
        <div className="grid">
          <section className="panel">
            <h2>検索</h2>
            <input
              className="input"
              type="text"
              placeholder="3文字以上で検索"
              value={searchQuery}
              onChange={(event) => handleUpdateSearchQuery(event.target.value)}
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
                    onClick={() => handleSelectAtom(atomId)}
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
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="muted">Atomを選択してください</div>
            )}
          </section>
        </div>
      )}

      {activeTab === 'atom' && (
        <div className="grid">
          <section className="panel">
            <h2>Atom 作成</h2>
            <input
              className="input"
              type="text"
              placeholder="Atomデータ"
              value={newAtomData}
              onChange={(event) => handleUpdateNewAtomData(event.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Deposit (ETH)"
              value={atomDepositEth}
              onChange={(event) => handleUpdateAtomDeposit(event.target.value)}
            />
            <button
              type="button"
              className="button primary"
              onClick={handleCreateAtom}
              disabled={isCreateAtomDisabled}
            >
              {createAtom.isPending ? '作成中...' : 'Atom作成'}
            </button>
          </section>
        </div>
      )}

      {activeTab === 'triple' && (
        <div className="grid">
          <section className="panel">
            <h2>Triple 作成</h2>
            <input
              className="input"
              type="text"
              placeholder="Subject ID"
              value={tripleSubjectId}
              onChange={(event) => handleUpdateTripleSubjectId(event.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Predicate ID"
              value={triplePredicateId}
              onChange={(event) => handleUpdateTriplePredicateId(event.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Object ID"
              value={tripleObjectId}
              onChange={(event) => handleUpdateTripleObjectId(event.target.value)}
            />
            <input
              className="input"
              type="text"
              placeholder="Deposit (ETH)"
              value={tripleDepositEth}
              onChange={(event) => handleUpdateTripleDeposit(event.target.value)}
            />
            <button
              type="button"
              className="button primary"
              onClick={handleCreateTriple}
              disabled={isCreateTripleDisabled}
            >
              {createTriple.isPending ? '作成中...' : 'Triple作成'}
            </button>
          </section>
        </div>
      )}
    </div>
  )
}

export default App
