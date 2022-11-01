import React from "react"
import { useSelector } from "react-redux"
import { FiExternalLink } from "react-icons/fi"

type EntitySearchResult = {
  id: number | string
  name: string
  description: string
  url: string
}

export function SearchResult({ entity, onClick }: SearchResultPropTypes) {
  return (
    <div className="entity-search-result" data-testid="entity-search-result">
      <a data-testid="entity-search-result-addnode" onClick={() => onClick(entity)}>
        <b>{entity.name}</b>
      </a>
      {entity.url && (
        <a
          className="entity-external-link"
          href={entity.url}
          target="_blank"
          rel="noopener noreferrer"
        >
          <FiExternalLink />
        </a>
      )}
      {entity.description && <div className="entity-search-description">{entity.description}</div>}
    </div>
  )
}

interface SearchResultPropTypes {
  entity: EntitySearchResult
  onClick: (entity: EntitySearchResult) => void
}

export default function EntitySearchResults({ results, onClick }: EntitySearchResultsPropTypes) {
  const existingNodeIds = useSelector(state => Object.keys(state.graph.nodes))
  const visibleResults = results.filter(entity => !existingNodeIds.includes(entity.id.toString()))

  return (
    <div className="entity-search-results" data-testid="entity-search-results">
      {visibleResults.map(entity => (
        <SearchResult onClick={onClick} entity={entity} key={entity.id} />
      ))}
    </div>
  )
}

interface EntitySearchResultsPropTypes {
  results: Array<EntitySearchResult>
  onClick: (entity: EntitySearchResult) => void
}
