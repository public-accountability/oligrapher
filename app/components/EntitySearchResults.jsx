import React from 'react'
import PropTypes from 'prop-types'
import { FiExternalLink } from 'react-icons/fi'

export function SearchResult({ entity, onClick }) {
  return (
    <div className="entity-search-result">
      <a onClick={() => onClick(entity)}><b>{entity.name}</b></a>
      { entity.url && 
        <a className="entity-external-link" href={entity.url} target="_blank" rel="noopener noreferrer">
          <FiExternalLink />
        </a> 
      }
      { entity.description && <br /> }
      { entity.description && <span className="entity-search-description">{entity.description}</span> }
    </div>
  )
}

SearchResult.propTypes = {
  entity: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired
}

export default function EntitySearchResults({ results, onClick }) {
  return (
    <div className="entity-search-results">
      { results.map(entity => (
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
