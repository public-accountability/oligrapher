import React, { useEffect, useRef } from 'react'
import Draggable, { DraggableEventHandler } from 'react-draggable'
import { useDispatch, useSelector } from 'react-redux'
import type { State } from '../util/defaultState'
import type { Point } from '../util/geometry'

type PannablePropTypes = {
  children: React.ReactNode

}

export default function Pannable2(props: PannablePropTypes) {
  const dispatch = useDispatch()
  const offset = useSelector<State, Point>(state => state.display.offset)

  const onStop: DraggableEventHandler = (_event, data) => {
    const deltas = { x: data.x, y: data.y }
    dispatch({ type: 'SET_OFFSET', offset: deltas })
  }

  return (
    {/* <Draggable position={offset} handle=".pannable-handle" onStop={onStop}> */}
      <g id="oligrapher-pannable" className="pannable pannable-handle">
        {props.children}
      </g>
    </Draggable>
  )


}
