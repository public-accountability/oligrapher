import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import toString from 'lodash/toString'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

import Button from '@material-ui/core/Button'
import { makeStyles } from '@material-ui/core/styles'

import Graph from '../graph/graph'
import { findConnections, LsNodeWithEdges } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'
import { StateWithHistory } from '../util/defaultState'

import EditorHeader from './EditorHeader'
import AddConnectionsCategory from './AddConnectionsCategory'
import AddConnectionsNumberPicker from './AddConnectionsNumberPicker'

const useStyles = makeStyles({
  button: {
    marginLeft: '1em'
  },
  p: {
    marginTop: '2em'
  }
})

function littleSisNodesSelector(state: StateWithHistory): Array<string> {
  return Graph.littleSisNodes(state.graph).map(n => toString(n.id))
}

function createPositionSelector(id: string): (state: StateWithHistory) => { x: number, y: number } {
  return state => pick(state.graph.nodes[id], 'x', 'y')
}

function ResultsBox(props: { results: LsNodeWithEdges[] | null, className: string }) {
  if (props.results?.length) {
    return <p className={props.className}>{ `${props.results.length} connections found` }</p>
  } else {
    return <p className={props.className}>no connections found</p>
  }
}

/*
  Instead of selecting connected entities one by one,
  this version allows them to be added at once (without being previewed)
*/
export default function AddConnectionsClassic(props: { id: string }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { x, y } = useSelector(createPositionSelector(props.id))
  const littleSisIds = useSelector(littleSisNodesSelector)
  const [results, setResults] = useState< LsNodeWithEdges[] | null >(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [num, setNum] = useState<number>(5)

  const addConnections = useCallback(() => {
    if (results && Array.isArray(results)) {
      results.forEach( node => {
        dispatch({ type: 'ADD_NODE', node: omit(node, 'edges'), position: { x, y } })
        dispatch({ type: 'ADD_EDGES', edges: node.edges })
      })
    }
  }, [results, dispatch, x, y])

  useEffect(() => {
    setLoading(true)
    const httpRequest = makeCancelable(
      findConnections({entity_id: props.id, category_id: categoryId, num: num, excluded_ids: littleSisIds})
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
          setResults(null)
          setLoading(false)
        }
      })

    return httpRequest.cancel
  }, [props.id, categoryId, num, littleSisIds])


  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }), [setCategoryId, setResults])

  const hasResults = !loading && Array.isArray(results) && results.length > 0

  return (
    <div className="oligrapher-add-connections">
      <EditorHeader title="Add Connections" />
      <div>
        <AddConnectionsCategory categoryId={categoryId} onChange={changeCategory} variant="standard" />
        <AddConnectionsNumberPicker onChange={setNum} value={num} />
        { hasResults && <Button className={classes.button} onClick={addConnections}>add</Button> }
      </div>
       { hasResults && <ResultsBox className={classes.p} results={results} />}
    </div>
  )
}
