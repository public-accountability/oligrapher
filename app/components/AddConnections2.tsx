import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { findConnections } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'


export default function AddConnections2(props: AddConnectionsProps) {
  /*
    state:
      - results
      - loading
      - categoryId
   */
  const [results, setResults] = useState(null)
  const [loading, setLoading] = useState(true)
  const [categoryId, setCategoryId] = useState(0)

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(findConnections(props.id, categoryId))

    httpRequest
      .promise
      .then(results => {
        setResults(results)
        setLoading(false)
      })
      .catch(err => {
        if (!err.isCanceled) {
          console.error("Error finding connections", err)
          setResults(false)
          setLoading(false)
        }
      })

    return httpRequest.cancel
  }, [props.id, categoryId])


  return <code>JSON.stringify(results, null, 4)</code>


}

interface AddConnectionsProps {
  id: string
}
