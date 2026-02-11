import {
  createAtomFromString,
  createTripleStatement,
  getAtomDetails,
  getMultiVaultAddressFromChainId,
  getTripleDetails,
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
import './css/App.css'
import {
  ATOM_STALE_TIME_MS,
  ATOMS_LIMIT_COUNT,
  DEFAULT_DEPOSIT_ETH,
  SEARCH_MIN_LENGTH_COUNT,
  SEARCH_STALE_TIME_MS,
  SUBJECT_TRIPLES_DEFAULT_LIMIT_COUNT,
} from './utils/constants'
import {
  getDefaultSortKey,
  getNodeLabel,
  getSubjectTriplesOrderBy,
  getTriplesBySubject,
} from './utils/helper'
import type {
  AtomDetails,
  CreateAtomResult,
  CreateTripleResult,
  GlobalSearchResult,
  HexAddress,
  SortKey,
  SortOrder,
  SubjectSortKey,
  TabKey,
  TripleDetails,
  TripleKind,
  TriplesBySubjectResult,
} from './utils/types'

// コンポーネントのインポート
import { AtomCreatePanel } from './components/AtomCreatePanel'
import { AtomDetailPanel } from './components/AtomDetailPanel'
import { AtomSearchPanel } from './components/AtomSearchPanel'
import { Header } from './components/Header'
import { StatusMessage } from './components/StatusMessage'
import { SubjectTriplesPanel } from './components/SubjectTriplesPanel'
import { TabNavigation } from './components/TabNavigation'
import { TripleCreatePanel } from './components/TripleCreatePanel'
import { TripleFetchPanel } from './components/TripleFetchPanel'

/**
 * App コンポーネント
 * @returns 
 */
function App(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabKey>('explore')
  const [isTripleModalOpen, setIsTripleModalOpen] = useState<boolean>(false)
  const [isTripleGraphModalOpen, setIsTripleGraphModalOpen] =
    useState<boolean>(false)
  const [tripleModalKind, setTripleModalKind] =
    useState<TripleKind>('subject')
  const [tripleFilterQuery, setTripleFilterQuery] = useState<string>('')
  const [tripleSortKey, setTripleSortKey] = useState<SortKey>('predicate')
  const [tripleSortOrder, setTripleSortOrder] = useState<SortOrder>('asc')
  const [searchQuery, setSearchQuery] = useState<string>('')
  const [selectedAtomId, setSelectedAtomId] = useState<string>('')
  const [newAtomData, setNewAtomData] = useState<string>('')
  const [atomDepositEth, setAtomDepositEth] = useState<string>(DEFAULT_DEPOSIT_ETH)
  const [tripleSubjectId, setTripleSubjectId] = useState<string>('')
  const [triplePredicateId, setTriplePredicateId] = useState<string>('')
  const [tripleObjectId, setTripleObjectId] = useState<string>('')
  const [tripleDepositEth, setTripleDepositEth] =
    useState<string>(DEFAULT_DEPOSIT_ETH)
  const [fetchTripleId, setFetchTripleId] = useState<string>('')
  const [subjectTriplesSubjectId, setSubjectTriplesSubjectId] =
    useState<string>('')
  const [subjectTriplesPageIndex, setSubjectTriplesPageIndex] =
    useState<number>(0)
  const [subjectTriplesLimitCount, setSubjectTriplesLimitCount] =
    useState<number>(SUBJECT_TRIPLES_DEFAULT_LIMIT_COUNT)
  const [subjectTriplesFilterQuery, setSubjectTriplesFilterQuery] =
    useState<string>('')
  const [subjectTriplesSortKey, setSubjectTriplesSortKey] =
    useState<SubjectSortKey>('predicate')
  const [subjectTriplesSortOrder, setSubjectTriplesSortOrder] =
    useState<SortOrder>('asc')
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
  const { data: walletClient } = useWalletClient({
    chainId,
    query: { enabled: isConnected && isChainSupported },
  })
  const isWalletConnected = isConnected
  const isWalletClientReady = Boolean(walletClient)

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
  const tripleDetails = useQuery<TripleDetails>({
    queryKey: ['triple', fetchTripleId],
    queryFn: () => getTripleDetails(fetchTripleId),
    enabled: fetchTripleId.length > 0,
    staleTime: ATOM_STALE_TIME_MS,
  })
  const subjectTriplesQuery = useQuery<TriplesBySubjectResult>({
    queryKey: [
      'triplesBySubject',
      subjectTriplesSubjectId,
      subjectTriplesPageIndex,
      subjectTriplesLimitCount,
      subjectTriplesSortKey,
      subjectTriplesSortOrder,
    ],
    queryFn: () =>
      getTriplesBySubject(
        subjectTriplesSubjectId,
        subjectTriplesLimitCount,
        subjectTriplesPageIndex * subjectTriplesLimitCount,
        getSubjectTriplesOrderBy(
          subjectTriplesSortKey,
          subjectTriplesSortOrder,
        ),
      ),
    enabled: subjectTriplesSubjectId.length > 0,
    staleTime: ATOM_STALE_TIME_MS,
  })

  // Atomeを新たに登録するためのhook
  const createAtom = useMutation<CreateAtomResult, Error, { data: string; depositEth: string }>(
    {
      mutationFn: async ({ data, depositEth }): Promise<CreateAtomResult> => {
        if (!isConnected) {
          throw new Error('Walletが接続されていません')
        }
        if (!isChainSupported) {
          throw new Error(
            'このチェーンは未対応です。Intuition Mainnet / Testnetへ切り替えてください',
          )
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
        if (!isChainSupported) {
          throw new Error(
            'このチェーンは未対応です。Intuition Mainnet / Testnetへ切り替えてください',
          )
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
  const handleUpdateFetchTripleId = (value: string): void => {
    setFetchTripleId(value)
  }
  const handleUpdateSubjectTriplesSubjectId = (value: string): void => {
    setSubjectTriplesSubjectId(value)
    setSubjectTriplesPageIndex(0)
  }
  const handleUpdateSubjectTriplesFilterQuery = (value: string): void => {
    setSubjectTriplesFilterQuery(value)
  }
  const handleUpdateSubjectTriplesSortKey = (value: SubjectSortKey): void => {
    setSubjectTriplesSortKey(value)
    setSubjectTriplesPageIndex(0)
  }
  const handleToggleSubjectTriplesSortOrder = (): void => {
    setSubjectTriplesSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    setSubjectTriplesPageIndex(0)
  }
  const handleUpdateSubjectTriplesLimit = (value: number): void => {
    setSubjectTriplesLimitCount(value)
    setSubjectTriplesPageIndex(0)
  }
  const handleNextSubjectTriplesPage = (): void => {
    setSubjectTriplesPageIndex((prev) => prev + 1)
  }
  const handlePreviousSubjectTriplesPage = (): void => {
    setSubjectTriplesPageIndex((prev) => Math.max(prev - 1, 0))
  }

  const handleSelectTab = (tabKey: TabKey): void => {
    setActiveTab(tabKey)
  }

  const handleOpenTripleModal = (kind: TripleKind): void => {
    setTripleModalKind(kind)
    setTripleFilterQuery('')
    setTripleSortOrder('asc')
    setTripleSortKey(getDefaultSortKey(kind))
    setIsTripleModalOpen(true)
  }

  const handleCloseTripleModal = (): void => {
    setIsTripleModalOpen(false)
  }
  const handleOpenTripleGraphModal = (): void => {
    setIsTripleGraphModalOpen(true)
  }
  const handleCloseTripleGraphModal = (): void => {
    setIsTripleGraphModalOpen(false)
  }
  const handleUpdateTripleFilterQuery = (value: string): void => {
    setTripleFilterQuery(value)
  }
  const handleUpdateTripleSortKey = (value: SortKey): void => {
    setTripleSortKey(value)
  }
  const handleToggleTripleSortOrder = (): void => {
    setTripleSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
  }

  const isCreateAtomDisabled =
    !isWalletConnected ||
    !isChainSupported ||
    !isWalletClientReady ||
    newAtomData.trim().length === 0 ||
    createAtom.isPending
  const isCreateTripleDisabled =
    !isWalletConnected ||
    !isChainSupported ||
    !isWalletClientReady ||
    tripleSubjectId.trim().length === 0 ||
    triplePredicateId.trim().length === 0 ||
    tripleObjectId.trim().length === 0 ||
    createTriple.isPending

  const subjectTriplesItems = useMemo(
    () => subjectTriplesQuery.data?.triples ?? [],
    [subjectTriplesQuery.data],
  )
  const subjectTriplesFiltered = useMemo(() => {
    const normalizedQuery = subjectTriplesFilterQuery.trim().toLowerCase()
    if (!normalizedQuery) {
      return subjectTriplesItems
    }
    return subjectTriplesItems.filter((triple) => {
      const text = [
        getNodeLabel(triple.predicate),
        getNodeLabel(triple.object),
        triple.term_id,
      ]
        .join(' ')
        .toLowerCase()
      return text.includes(normalizedQuery)
    })
  }, [subjectTriplesFilterQuery, subjectTriplesItems])
  const subjectTriplesPageCount = Math.max(
    Math.ceil(
      (subjectTriplesQuery.data?.totalCount ?? 0) /
        subjectTriplesLimitCount,
    ),
    1,
  )

  return (
    <div className="app">
      <Header
        chainId={chainId}
        address={address}
        isConnected={isConnected}
        isConnecting={isConnecting}
        connectError={connectError}
        onConnect={handleConnectWallet}
        onDisconnect={handleDisconnectWallet}
      />

      <StatusMessage
        statusMessage={statusMessage}
        errorMessage={errorMessage}
        lastTransactionHash={lastTransactionHash}
        lastTransactionLabel={lastTransactionLabel}
        isWalletConnected={isWalletConnected}
        isWalletClientReady={isWalletClientReady}
        isChainSupported={isChainSupported}
      />

      <TabNavigation activeTab={activeTab} onSelectTab={handleSelectTab} />

      {activeTab === 'explore' && (
        <div className="grid">
          <AtomSearchPanel
            searchQuery={searchQuery}
            onUpdateSearchQuery={handleUpdateSearchQuery}
            isSearchEnabled={isSearchEnabled}
            searchResults={searchResults}
            selectedAtomId={selectedAtomId}
            onSelectAtom={handleSelectAtom}
          />

          <AtomDetailPanel
            selectedAtomId={selectedAtomId}
            atomDetails={atomDetails}
            isTripleModalOpen={isTripleModalOpen}
            tripleModalKind={tripleModalKind}
            tripleFilterQuery={tripleFilterQuery}
            tripleSortKey={tripleSortKey}
            tripleSortOrder={tripleSortOrder}
            onOpenTripleModal={handleOpenTripleModal}
            onCloseTripleModal={handleCloseTripleModal}
            onUpdateTripleFilterQuery={handleUpdateTripleFilterQuery}
            onUpdateTripleSortKey={handleUpdateTripleSortKey}
            onToggleTripleSortOrder={handleToggleTripleSortOrder}
          />
        </div>
      )}

      {activeTab === 'atom' && (
        <AtomCreatePanel
          newAtomData={newAtomData}
          atomDepositEth={atomDepositEth}
          onUpdateNewAtomData={handleUpdateNewAtomData}
          onUpdateAtomDeposit={handleUpdateAtomDeposit}
          onCreateAtom={handleCreateAtom}
          isCreateAtomDisabled={isCreateAtomDisabled}
          isPending={createAtom.isPending}
        />
      )}

      {activeTab === 'triple-create' && (
        <TripleCreatePanel
          tripleSubjectId={tripleSubjectId}
          triplePredicateId={triplePredicateId}
          tripleObjectId={tripleObjectId}
          tripleDepositEth={tripleDepositEth}
          onUpdateTripleSubjectId={handleUpdateTripleSubjectId}
          onUpdateTriplePredicateId={handleUpdateTriplePredicateId}
          onUpdateTripleObjectId={handleUpdateTripleObjectId}
          onUpdateTripleDeposit={handleUpdateTripleDeposit}
          onCreateTriple={handleCreateTriple}
          isCreateTripleDisabled={isCreateTripleDisabled}
          isPending={createTriple.isPending}
        />
      )}

      {activeTab === 'triple-fetch' && (
        <TripleFetchPanel
          fetchTripleId={fetchTripleId}
          onUpdateFetchTripleId={handleUpdateFetchTripleId}
          tripleDetails={tripleDetails}
          isTripleGraphModalOpen={isTripleGraphModalOpen}
          onOpenTripleGraphModal={handleOpenTripleGraphModal}
          onCloseTripleGraphModal={handleCloseTripleGraphModal}
        />
      )}

      {activeTab === 'triple-subject' && (
        <SubjectTriplesPanel
          subjectTriplesSubjectId={subjectTriplesSubjectId}
          onUpdateSubjectTriplesSubjectId={handleUpdateSubjectTriplesSubjectId}
          subjectTriplesQuery={subjectTriplesQuery}
          subjectTriplesFiltered={subjectTriplesFiltered}
          subjectTriplesFilterQuery={subjectTriplesFilterQuery}
          onUpdateSubjectTriplesFilterQuery={handleUpdateSubjectTriplesFilterQuery}
          subjectTriplesSortKey={subjectTriplesSortKey}
          onUpdateSubjectTriplesSortKey={handleUpdateSubjectTriplesSortKey}
          subjectTriplesSortOrder={subjectTriplesSortOrder}
          onToggleSubjectTriplesSortOrder={handleToggleSubjectTriplesSortOrder}
          subjectTriplesLimitCount={subjectTriplesLimitCount}
          onUpdateSubjectTriplesLimit={handleUpdateSubjectTriplesLimit}
          subjectTriplesPageIndex={subjectTriplesPageIndex}
          subjectTriplesPageCount={subjectTriplesPageCount}
          onNextSubjectTriplesPage={handleNextSubjectTriplesPage}
          onPreviousSubjectTriplesPage={handlePreviousSubjectTriplesPage}
        />
      )}
    </div>
  )
}

export default App
