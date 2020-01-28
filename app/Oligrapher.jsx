import React from 'react'
import ReactDOM from 'react-dom'
import { connect } from 'react-redux'
import flow from 'lodash/flow'

import Graph from './graph/graph'
import Root from './containers/Root'

import { createOligrapherRefs, withRefs } from './RefsContex'
import { createOligrapherStore, withStore } from './util/render'
import stateInitalizer from './util/stateInitalizer'
import { getElementById } from './util/helpers'

import './oligrapher.scss'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

  const oli = new Oligrapher(<your Configuration>)

  See app/util/defaultState for a list of variables

*/
export default class Oligrapher {
  static Graph = Graph

  constructor(initialState = {}) {
    this.store = createOligrapherStore(stateInitalizer(initialState))
    this.element = getElementById(this.store.getState().settings.domId)
    this.graph = () => this.store.getState().graph

    const Application = withStore(this.store)(Root)

    ReactDOM.render(<Application />, this.element)
  }
}
