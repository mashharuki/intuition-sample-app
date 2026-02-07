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

/**
 * App コンポーネント
 * @returns 
 */
function App(): ReactElement {
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
              {atomDetails.data && (
                <pre className="code">
                  {JSON.stringify(atomDetails.data, null, 2)}
                </pre>
              )}
            </>
          ) : (
            <div className="muted">Atomを選択してください</div>
          )}
        </section>

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
    </div>
  )
}

export default App
