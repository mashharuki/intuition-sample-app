import {
  fetcher,
  GetTriplesDocument,
  type GetTriplesQuery,
  type GetTriplesQueryVariables,
  type Order_By,
  type Triples_Order_By,
} from '@0xintuition/graphql'
import { EXPLORER_BASE_URL, MAX_NODE_LABEL_LENGTH_COUNT, OPTIONAL_CHAIN_LABELS, SUPPORTED_CHAIN_LABELS } from "./constants"
import type { AtomDetails, AtomValueInfo, SortKey, SortOrder, SubjectSortKey, TripleKind, TriplesBySubjectResult } from "./types"

export function getChainLabel(chainId: number): string {
  return (
    SUPPORTED_CHAIN_LABELS[chainId] ??
    OPTIONAL_CHAIN_LABELS[chainId] ??
    `Unknown (${chainId})`
  )
}

export function getTransactionUrl(hash: string): string {
  return `${EXPLORER_BASE_URL}/tx/${hash}`
}

export function getDisplayText(value: string, maxLengthCount: number): string {
  if (value.length <= maxLengthCount) {
    return value
  }
  return `${value.slice(0, Math.max(maxLengthCount - 1, 0))}…`
}

export function formatDateLabel(value: unknown): string {
  if (!value) {
    return '-'
  }
  const date = new Date(String(value))
  if (Number.isNaN(date.getTime())) {
    return String(value)
  }
  return date.toLocaleString('ja-JP')
}

export function getNodeLabel(
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

export function getAtomValueInfo(
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

export function getAtomPrimaryLabel(atom: AtomDetails | null | undefined): string {
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

export function getAtomSecondaryLabel(atom: AtomDetails | null | undefined): string {
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

export function getDefaultSortKey(kind: TripleKind): SortKey {
  if (kind === 'predicate') {
    return 'subject'
  }
  return 'predicate'
}

export function getSubjectTriplesOrderBy(
  key: SubjectSortKey,
  order: SortOrder,
): Triples_Order_By[] {
  const orderBy = order as Order_By
  if (key === 'predicate') {
    return [{ predicate: { label: orderBy } }]
  }
  if (key === 'object') {
    return [{ object: { label: orderBy } }]
  }
  return [{ term_id: orderBy }]
}

export async function getTriplesBySubject(
  subjectId: string,
  limitCount: number,
  offsetCount: number,
  orderBy: Triples_Order_By[],
): Promise<TriplesBySubjectResult> {
  const data = await fetcher<
    GetTriplesQuery,
    GetTriplesQueryVariables
  >(GetTriplesDocument, {
    limit: limitCount,
    offset: offsetCount,
    orderBy,
    where: {
      subject_id: {
        _eq: subjectId,
      },
    },
  })()
  return {
    totalCount: data.total.aggregate?.count ?? 0,
    triples: data.triples,
  }
}