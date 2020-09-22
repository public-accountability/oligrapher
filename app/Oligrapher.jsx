import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Graph from './graph/graph'
import Root from './components/Root'
import EmbeddedRoot from './components/EmbeddedRoot'
import { toSvg, toJpeg } from './util/imageExport'
import { createOligrapherStore } from './util/store'
import stateInitalizer from './util/stateInitalizer'
import LittleSisApi from './datasources/littlesis3'
import './oligrapher.scss'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

  const oli = new Oligrapher(<your Configuration>)

  See app/util/defaultState for a list of variables

*/
export default class Oligrapher {
  static Graph = Graph
  static Api = LittleSisApi

  constructor(initialState = {}) {
    this.store = createOligrapherStore(stateInitalizer(initialState))
    this.element = document.getElementById(this.store.getState().settings.domId)
    this.graph = () => this.store.getState().graph
    this.toSvg = () => toSvg(this.store.getState())
    this.toJpeg = () => toJpeg(this.store.getState())
    this.hideAnnotations = () => this.store.dispatch({type: 'HIDE_ANNOTATIONS'})

    const isEmbedded = this.store.getState().settings.embed

    ReactDOM.render(
      <Provider store={this.store}>
        { isEmbedded ? <EmbeddedRoot /> : <Root /> }
      </Provider>,
      this.element
    )
  }
}
