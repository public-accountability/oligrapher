import { createOligrapherStore, renderNewApplication } from './util/render'
import stateInitalizer from './util/stateInitalizer'
import { getElementById } from './util/helpers'
import Graph from './graph/graph'
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
    this.graph = () => this.store.getState().graph

    renderNewApplication(this.store,
                         getElementById(this.store.getState().settings.domId))
  }
}
