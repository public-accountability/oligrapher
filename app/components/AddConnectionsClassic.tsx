import React, { useEffect, useState, useCallback } from 'react'
import { findConnections } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'

import EditorHeader from './EditorHeader'
import AddConnectionsCategory from './AddConnectionsCategory'
import AddConnectionsNumberPicker from './AddConnectionsNumberPicker'

/*
  Instead of selecting connected entities one by one,
  this version allows them to be added at once (without being previewed)
*/
export default function AddConnectionsClassic(props: AddConnectionsProps) {
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [num, setNum] = useState<number>(5)

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


  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }), [setCategoryId, setResults])

  return (
    <div className="oligrapher-add-connections">
      <EditorHeader title="Add Connections" />
      <AddConnectionsCategory categoryId={categoryId} onChange={changeCategory} />
      <AddConnectionsNumberPicker onChange={setNum} value={num} />
      <button onClick={() => console.log('you clicked the button')}>add</button>
    </div>
  )

}

// return <pre>{ JSON.stringify(results, null, 2) }</pre>

interface AddConnectionsProps {
  id: string
}
