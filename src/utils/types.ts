import type { GetTriplesQuery } from '@0xintuition/graphql'
import {
  createAtomFromString,
  createTripleStatement,
  getAtomDetails,
  getTripleDetails,
  globalSearch,
} from '@0xintuition/sdk'
import type { TAB_ITEMS } from "./constants"

export type TabKey = (typeof TAB_ITEMS)[number]['key']
export type AtomValueInfo = {
  typeLabel: string
  name?: string
  description?: string
  url?: string
  image?: string
}
export type TripleKind = 'subject' | 'predicate' | 'object'
export type TripleNodeKey = 'subject' | 'predicate' | 'object'
export type SortOrder = 'asc' | 'desc'
export type SortKey = 'subject' | 'predicate' | 'object' | 'term'
export type SubjectSortKey = 'predicate' | 'object' | 'term'
export type ModalTriple =
  | SubjectTriple
  | PredicateTriple
  | ObjectTriple
export type TripleDisplay = {
  subjectLabel: string
  predicateLabel: string
  objectLabel: string
}

export type AtomDetails = Awaited<ReturnType<typeof getAtomDetails>>
export type GlobalSearchResult = Awaited<ReturnType<typeof globalSearch>>
export type CreateAtomResult = Awaited<ReturnType<typeof createAtomFromString>>
export type CreateTripleResult = Awaited<ReturnType<typeof createTripleStatement>>
export type HexAddress = `0x${string}`
export type SubjectTriple = NonNullable<AtomDetails>['as_subject_triples'][number]
export type PredicateTriple = NonNullable<AtomDetails>['as_predicate_triples'][number]
export type ObjectTriple = NonNullable<AtomDetails>['as_object_triples'][number]
export type TripleDetails = Awaited<ReturnType<typeof getTripleDetails>>
export type SubjectTriplesQueryTriple = GetTriplesQuery['triples'][number]
export type TriplesBySubjectResult = {
  totalCount: number
  triples: SubjectTriplesQueryTriple[]
}
