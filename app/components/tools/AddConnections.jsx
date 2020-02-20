import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import uniqBy from 'lodash/uniqBy'
import filter from 'lodash/filter'
import { findConnections } from '../../util/search'
import { makeCancelable } from '../../util/helpers'

import AddConnectionsResults from './AddConnectionsResults'

export default function AddConnections(props) {
  const [results, setResults] = useState(null)

  const addConnectionToMap = (entity, relationship) => {
    setResults(filter(results, entityChoice => entityChoice.id !== entity.id))
    props.addConnectionToMap(entity, relationship)
  }

  useEffect(() => {
    const httpRequest = makeCancelable(findConnections(props.entityId))

    httpRequest
      .promise
      .then(json => {
        setResults( uniqBy(json['data'], 'id') )
      })
      .catch(err => err.isCanceled ? null : console.error("Error finding connections", err))

    return () => httpRequest.cancel()

  }, [props.entityId])

  if (results && results.length > 0) {
    return <AddConnectionsResults results={results} addConnectionToMap={addConnectionToMap}/>
  } else {
    return null
  }
}


AddConnections.propTypes = {
  entityId: PropTypes.number.isRequired,
  addConnectionToMap: PropTypes.func.isRequired
}
