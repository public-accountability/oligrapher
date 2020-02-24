import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import filter from 'lodash/filter'
import { findConnections } from '../../util/search'
import { makeCancelable } from '../../util/helpers'

import AddConnectionsResults from './AddConnectionsResults'

/*
  This is the "Add Connections" popup.
  It uses LittleSis /api/entities/:id/connections
  routes to get a list of connected entities.

  The results component is <AddConnectionsResults>
*/
export default function AddConnections(props) {
  const [results, setResults] = useState(null)

  // This function is passed all the way down into <AddConnectionResult>
  // The setResults(filter(results)) removes the clicked on entity from the display list
  const addConnectionToMap = (entity, relationship) => {
    setResults(filter(results, entityChoice => entityChoice.id !== entity.id))
    props.addConnectionToMap(entity, relationship)
  }

  useEffect(() => {
    const httpRequest = makeCancelable(findConnections(props.entityId))

    httpRequest
      .promise
      .then(json => {
        setResults( uniqBy(json['data'], 'id') ) // ..uUntil we figure out the best way handle the case where there are multiple relationship between the same entity
      })
      .catch(err => err.isCanceled ? null : console.error("Error finding connections", err))

    return () => httpRequest.cancel()

  }, [props.entityId])

  if (results && results.length > 0) {
    return <AddConnectionsResults results={results} addConnectionToMap={addConnectionToMap} />
  } else {
    return null
  }
}

AddConnections.propTypes = {
  entityId: PropTypes.number.isRequired,
  addConnectionToMap: PropTypes.func.isRequired
}
