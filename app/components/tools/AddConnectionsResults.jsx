import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { entityLink } from '../../util/entity'
import { getRelationship } from '../../util/search'
import ResultLoadingIcon from './ResultLoadingIcon'

function AddConnectionResult({ entity, addConnectionToMap }) {
  const [isLoading, setLoading] = useState(false)

  const onClick = () => {
    setLoading(true)

    getRelationship(entity.attributes.relationship_id)
      .then(json => {
        setLoading(false)
        addConnectionToMap(entity, json.data)
      })
      .catch(err => {
        console.error(`Failed to load relationship #${entity.attributes.relationship_id}`)
        console.error(err)
        setLoading(false)
      })
  }

  return <div className="add-connections-entity" onClick={onClick}>
           <div className="entity-name">
             <a target="_blank"
                rel="noopener noreferrer"
                href={ entityLink(entity.id, entity.attributes.name, entity.attributes.primary_ext) }
                title="View this entity on LittleSis">
               {entity.attributes.name}
             </a>{ isLoading && <ResultLoadingIcon /> }
           </div>

           <div className="entity-blurb">
             {entity.attributes.blurb}
           </div>

         </div>
}

AddConnectionResult.propTypes = {
  entity: PropTypes.object.isRequired,  // "Entity" is the json from our api
  addConnectionToMap: PropTypes.func.isRequired
}

export default function AddConnectionsResults(props) {
  return <main className="add-connections-results">
           {
             props.results.map( entity => <AddConnectionResult entity={entity}
                                                               key={entity.id}
                                                               addConnectionToMap={props.addConnectionToMap} />)
           }
         </main>
}

AddConnectionsResults.propTypes = {
  results: PropTypes.array.isRequired,
  addConnectionToMap: PropTypes.func.isRequired // takes two arguments: Entity and Relationship
}
