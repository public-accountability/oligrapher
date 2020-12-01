import React, { useEffect, useState, useCallback } from 'react'
import { findConnections } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'

import EditorHeader from './EditorHeader'
import AddConnectionsCategory from './AddConnectionsCategory'
import AddConnectionsNumberPicker from './AddConnectionsNumberPicker'
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles({
  button: {
    marginLeft: '1em'
  },
  p: {
    marginTop: '2em'
  }
});

/*
  Instead of selecting connected entities one by one,
  this version allows them to be added at once (without being previewed)
*/
export default function AddConnectionsClassic(props: { id: string }) {
  const classes = useStyles()
  const [results, setResults] = useState<any>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [num, setNum] = useState<number>(5)

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(
      findConnections({entity_id: props.id, category_id: categoryId, num: num})
    )

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
  }, [props.id, categoryId, num])


  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }), [setCategoryId, setResults])

  const showResults = !loading && Array.isArray(results) && results.length > 0

  return (
    <div className="oligrapher-add-connections">
      <EditorHeader title="Add Connections" />
      <div>
        <AddConnectionsCategory categoryId={categoryId} onChange={changeCategory} variant="standard" />
        <AddConnectionsNumberPicker onChange={setNum} value={num} />
         <Button className={classes.button} onClick={() => console.log('you clicked the button')}>add</Button>
      </div>
      { showResults && <p className={classes.p}>{ `${results.length} connections found` }</p> }
    </div>
  )

}
