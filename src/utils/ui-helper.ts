import { getNodeLabel } from './helper'
import type { ModalTriple, TripleNodeKey, TripleKind, AtomDetails, TripleDisplay, SortKey } from './types'

export const getTripleNodeLabel = (
  triple: ModalTriple,
  nodeKey: TripleNodeKey,
): string => {
  if (nodeKey === 'subject' && 'subject' in triple) {
    return getNodeLabel(triple.subject)
  }
  if (nodeKey === 'predicate' && 'predicate' in triple) {
    return getNodeLabel(triple.predicate)
  }
  if (nodeKey === 'object' && 'object' in triple) {
    return getNodeLabel(triple.object)
  }
  return ''
}

export const getTripleDisplay = (
  triple: ModalTriple,
  kind: TripleKind,
  atom: AtomDetails | null,
): TripleDisplay => {
  const atomLabel = getNodeLabel(atom)
  if (kind === 'subject') {
    return {
      subjectLabel: atomLabel,
      predicateLabel: getTripleNodeLabel(triple, 'predicate'),
      objectLabel: getTripleNodeLabel(triple, 'object'),
    }
  }
  if (kind === 'predicate') {
    return {
      subjectLabel: getTripleNodeLabel(triple, 'subject'),
      predicateLabel: atomLabel,
      objectLabel: getTripleNodeLabel(triple, 'object'),
    }
  }
  return {
    subjectLabel: getTripleNodeLabel(triple, 'subject'),
    predicateLabel: getTripleNodeLabel(triple, 'predicate'),
    objectLabel: atomLabel,
  }
}

export const tripleIncludesQuery = (triple: ModalTriple, query: string): boolean => {
  const text = [
    getTripleNodeLabel(triple, 'subject'),
    getTripleNodeLabel(triple, 'predicate'),
    getTripleNodeLabel(triple, 'object'),
    triple.term_id,
  ]
    .join(' ')
    .toLowerCase()
  return text.includes(query.toLowerCase())
}

export const getTripleSortValue = (
  triple: ModalTriple,
  key: SortKey,
): string => {
  if (key === 'term') {
    return triple.term_id
  }
  if (key === 'subject') {
    return getTripleNodeLabel(triple, 'subject')
  }
  if (key === 'predicate') {
    return getTripleNodeLabel(triple, 'predicate')
  }
  return getTripleNodeLabel(triple, 'object')
}
