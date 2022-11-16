import React from "react"
import { createRoot } from "react-dom/client"
import { EnhancedStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import Root from "./components/Root"
import { getGraphMarkup } from "./util/imageExport"
import createOligrapherStore from "./util/store"
import { urls } from "./datasources/littlesis3"
import { State } from "./util/defaultState"
import { graphStats } from "./graph/graph"
import { getElementForGraphItem } from "./util/helpers"
import consumer from "./util/consumer"
/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

  const oli = new Oligrapher(<your Configuration>)

  See app/util/defaultState for a list of variables

*/
export default class Oligrapher {
  static COMMIT = OLIGRAPHER_COMMIT
  static VERSION = OLIGRAPHER_VERSION

  configuration: object
  store: EnhancedStore<State>
  element: HTMLElement
  consumer: any

  constructor(configuration = {}) {
    if (window.Oligrapher) {
      if (window.Oligrapher.instance) {
        console.warn("redefining window.Oligrapher.instance")
      }
      window.Oligrapher.instance = this
    }

    this.configuration = configuration
    this.store = createOligrapherStore(configuration)

    const element = document.getElementById(this.store.getState().settings.domId)

    if (!element) {
      throw new Error("could not find requested oligrapher element")
    }

    this.element = element
    this.consumer = consumer

    const root = createRoot(this.element)

    root.render(React.createElement(Provider, { store: this.store }, React.createElement(Root)))
  }

  get state() {
    return this.store.getState()
  }

  get graph() {
    return this.state.graph
  }

  get graphStats() {
    return graphStats(this.graph)
  }

  toSvg() {
    return getGraphMarkup()
  }

  getElementForGraphItem(id: string, t: "node" | "edge" | "caption") {
    return getElementForGraphItem(id, t)
  }

  static get apiUrls() {
    return urls
  }
}
