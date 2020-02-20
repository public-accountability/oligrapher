import React from 'react'
import PropTypes from 'prop-types'

// "Entity" is the json from our api
function AddConnectionResult({ entity }) {
  return <div className="add-connections-entity">
           <div>{entity.attributes.name}</div>
           <div>{entity.attributes.blurb}</div>
         </div>
}

AddConnectionResult.propTypes = {
  entity: PropTypes.object.isRequired
}

export default function AddConnectionsResults({results}) {
  return <main className="add-connections-results">
           {
             results.map( (entity, idx) => <AddConnectionResult entity={entity} key={idx} />)
           }
         </main>
}

AddConnectionsResults.propTypes = {
  results: PropTypes.array.isRequired
}
