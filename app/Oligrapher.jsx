import React from 'react'
import ReactDOM from 'react-dom'

import Graph from './graph/graph'
import Root from './components/Root'

import { createOligrapherStore, withStore } from './util/render'
import stateInitalizer from './util/stateInitalizer'
import { getElementById } from './util/helpers'

import './oligrapher.scss'

import LittleSisApi from './datasources/littlesis3'

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
    this.element = getElementById(this.store.getState().settings.domId)
    this.graph = () => this.store.getState().graph

    const Application = withStore(this.store)(Root)

    ReactDOM.render(<Application />, this.element)
  }
}
