import React from 'react'

import { useSelector } from 'react-redux'
import identity from 'lodash/identity'
import get from 'lodash/get'
import isNull from 'lodash/isNull'
import isArrayLike from 'lodash/isArrayLike'
import map from 'lodash/map'
import isPlainObject from 'lodash/isPlainObject'
import isString from 'lodash/isString'
import isEmpty from 'lodash/isEmpty'

import { State } from '../util/defaultState'


const formatValue = (v: any): string | React.ReactNode => {
  if (typeof v === 'undefined') {
    return <b>undefined</b>
  } else if (isString(v)) {
    return <em>{v}</em>
  } else if (isNull(v)) {
    return "null"
  } else if (isArrayLike(v)) {
    if (isEmpty(v)) {
      return "[]"
    } else {
      return map(v, formatValue).join(",")
    }
  } else if (isPlainObject(v)) {
    return JSON.stringify(v)
  } else {
    return v.toString()
  }
}

type DebugMessage = { k: string, v: string | React.ReactNode }
const Item: React.FC<DebugMessage> = (props) => <tr><td>{props.k}</td><td>{props.v}</td></tr>

export default function() {
  const state = useSelector<State>(identity)

  const data: DebugMessage[] = [
    "display.zoom",
    "display.svgHeight",
    "display.viewBox.minX",
    "display.viewBox.minY",
    "display.viewBox.w",
    "display.viewBox.h",
    "display.overNode",
    "display.selection.node",
    "display.selection.edge",
    "display.floatingEditor"
  ].map(k => ({ k, v: formatValue(get(state, k))}))

  return (
    <div className="oligrapher-debug-message">
      <table>
        <tbody>
          { data.map( props => <Item key={props.k} {...props} />) }
        </tbody>
      </table>
    </div>
  )
}
