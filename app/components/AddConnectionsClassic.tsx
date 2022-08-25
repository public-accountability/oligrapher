import React, { useEffect, useState, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'

import toString from 'lodash/toString'
import omit from 'lodash/omit'
import pick from 'lodash/pick'

import Button from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress';
import FormGroup from '@mui/material/FormGroup';
import { makeStyles } from '@mui/material/styles'

import Graph from '../graph/graph'
import { findConnections, LsNodeWithEdges, AddConnectionsOrder } from '../datasources/littlesis3'
import { makeCancelable, callWithTargetValue } from '../util/helpers'
import { StateWithHistory } from '../util/defaultState'

import EditorHeader from './EditorHeader'
import AddConnectionsCategory from './AddConnectionsCategory'
import AddConnectionsNumberPicker from './AddConnectionsNumberPicker'
import AddConnectionsOrderPicker from './AddConnectionsOrderPicker'

const useStyles = makeStyles({
  button: {
    marginLeft: '1em'
  },
  statusBox: {
    marginTop: '2em'
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

interface StatusBoxProps {
  results: LsNodeWithEdges[] | null,
  className: string,
  loading: boolean
}

function StatusBox(props: StatusBoxProps) {
  if (props.loading) {
    return <CircularProgress />
  } else if (props.results?.length) {
    return <p className={props.className}>{ `${props.results.length} connections found` }</p>
  } else {
    return <p className={props.className}>no connections found</p>
  }
}

//  Instead of selecting connected entities one by one like AddConnections,
//  this version allows them to be added at once (without being previewed)
export default function AddConnectionsClassic(props: { id: string }) {
  const classes = useStyles()
  const dispatch = useDispatch()
  const { x, y } = useSelector(createPositionSelector(props.id))
  const littleSisIds = useSelector(littleSisNodesSelector)
  const [results, setResults] = useState< LsNodeWithEdges[] | null >(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [categoryId, setCategoryId] = useState<number>(0)
  const [num, setNum] = useState<number>(5)
  const [order, setOrder] = useState<AddConnectionsOrder>('link_count')

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

    const params = {
      entity_id: props.id,
      num: num,
      "excluded_ids[]": littleSisIds,
      category_id: categoryId,
      order: order
    }

    const httpRequest = makeCancelable(findConnections(params))

    httpRequest
      .promise
      .then(results => {
        console.debug(`Find connections results for ${props.id} / ${categoryId} / ${littleSisIds}`, results)
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
  }, [props.id, categoryId, num, order, littleSisIds])


  const changeCategory = useCallback(callWithTargetValue(value => {
    setCategoryId(parseInt(value))
    setResults(null)
  }), [setCategoryId, setResults])

  const hasResults = !loading && Array.isArray(results) && results.length > 0

  return (
    <div className="oligrapher-add-connections">
      <EditorHeader title="Add Connections" />
      <AddConnectionsCategory categoryId={categoryId} onChange={changeCategory} variant="standard" />
      <AddConnectionsOrderPicker onChange={setOrder} value={order} />


      <AddConnectionsNumberPicker onChange={setNum} value={num} />
      <Button className={classes.button} onClick={addConnections} variant='contained' disabled={!hasResults}>add</Button>

      <div className={classes.statusBox}>
        <StatusBox className={classes.p} results={results} loading={loading} />
      </div>
    </div>
  )

}
