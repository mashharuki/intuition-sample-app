export const SEARCH_MIN_LENGTH_COUNT = 3
export const SEARCH_STALE_TIME_MS = 1000 * 60
export const ATOM_STALE_TIME_MS = 1000 * 60 * 5
export const ATOMS_LIMIT_COUNT = 10
export const DEFAULT_DEPOSIT_ETH = '0.01'
export const EXPLORER_BASE_URL = 'https://intuition-testnet.explorer.caldera.xyz'
export const SUBJECT_TRIPLES_LIMIT_OPTIONS = [10, 20, 50] as const
export const SUBJECT_TRIPLES_DEFAULT_LIMIT_COUNT = 20
export const TAB_ITEMS = [
  { key: 'explore', label: '検索・詳細' },
  { key: 'atom', label: 'Atom作成' },
  { key: 'triple-create', label: 'Triple作成' },
  { key: 'triple-fetch', label: 'Triple取得' },
  { key: 'triple-subject', label: 'Subject Triple一覧' },
] as const
export const MAX_TRIPLE_PREVIEW_COUNT = 3
export const MAX_NODE_LABEL_LENGTH_COUNT = 36
export const SUPPORTED_CHAIN_LABELS: Record<number, string> = {
  1155: 'Intuition Mainnet (1155)',
  13579: 'Intuition Testnet (13579)',
}
export const OPTIONAL_CHAIN_LABELS: Record<number, string> = {
  84532: 'Base Sepolia (84532)',
}