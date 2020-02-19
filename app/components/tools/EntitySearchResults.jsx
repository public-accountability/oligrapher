import React from 'react'
import PropTypes from 'prop-types'

function SearchResult({entity, addNode}) {
  const onClick = () => addNode(entity)

  return <div className="entity-search-entity">
           <a onClick={onClick}><b>{entity.name}</b></a>
         </div>
}

SearchResult.propTypes = {
  entity: PropTypes.object.isRequired,
  addNode: PropTypes.func.isRequired
}

export default function EntitySearchResults({results, addNode}) {
  return <div className="entity-search-results">
           { results.map(entity => <SearchResult addNode={addNode}
                                                entity={entity}
                                                key={entity.id} />) }
         </div>
}

EntitySearchResults.propTypes = {
  results: PropTypes.array.isRequired,
  addNode: PropTypes.func.isRequired
}
