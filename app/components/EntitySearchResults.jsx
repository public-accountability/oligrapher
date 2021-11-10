import React from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { FiExternalLink } from '@react-icons/all-files/fi/FiExternalLink'

export function SearchResult({ entity, onClick }) {
  return (
    <div className="entity-search-result">
      <a onClick={() => onClick(entity)}><b>{entity.name}</b></a>
      { entity.url &&
        <a className="entity-external-link" href={entity.url} target="_blank" rel="noopener noreferrer">
          <FiExternalLink />
        </a>
      }
      { entity.description && <div className="entity-search-description">{entity.description}</div> }
    </div>
  )
}

SearchResult.propTypes = {
  entity: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default function EntitySearchResults({ results, onClick }) {
  const existingNodeIds = useSelector(state => Object.keys(state.graph.nodes))
  const visibleResults = results.filter(entity => !existingNodeIds.includes(entity.id))

  return (
    <div className="entity-search-results">
      { visibleResults.map(entity => (
          <SearchResult
            onClick={onClick}
            entity={entity}
            key={entity.id} />
        ))
      }
    </div>
  )
}

EntitySearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  onClick: PropTypes.func.isRequired
}
