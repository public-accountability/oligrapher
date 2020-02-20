import React from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import { entityLink } from '../../util/entity'

// "Entity" is the json from our api
function AddConnectionResult({ entity }) {
  return <div className="add-connections-entity">
           <div className="entity-name">
             <a target="_blank" url={entityLink(entity.id, entity.attributes.name, entity.attributes.primary_ext)}>
               {entity.attributes.name}
             </a>
           </div>
           <div className="entity-blurb">
             {entity.attributes.blurb}
           </div>
         </div>
}

AddConnectionResult.propTypes = {
  entity: PropTypes.object.isRequired
}

export default function AddConnectionsResults({results}) {
  return <main className="add-connections-results">
           {
             uniqBy(results, 'id')
               .map( entity => <AddConnectionResult entity={entity} key={entity.id} />)
           }
         </main>
}

AddConnectionsResults.propTypes = {
  results: PropTypes.array.isRequired
}
