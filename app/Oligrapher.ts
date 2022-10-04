import React from "react"
import { createRoot } from "react-dom/client"
import { EnhancedStore } from "@reduxjs/toolkit"
import { Provider } from "react-redux"
import Root from "./components/Root"
import EmbeddedRoot from "./components/EmbeddedRoot"
import { toSvg, toJpeg } from "./util/imageExport"
import createOligrapherStore from "./util/store"
import { urls } from "./datasources/littlesis3"
import { State } from "./util/defaultState"
import { graphStats } from "./graph/graph"

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

  const oli = new Oligrapher(<your Configuration>)

  See app/util/defaultState for a list of variables

*/
export default class Oligrapher {
  store: EnhancedStore<State>
  element: HTMLElement

  constructor(configuration = {}) {
    this.store = createOligrapherStore(configuration)

    const element = document.getElementById(
      this.store.getState().settings.domId
    )

    if (!element) {
      throw new Error("could not find requested oligrapher element")
    }

    this.element = element

    const isEmbedded = this.store.getState().settings.embed

    const root = createRoot(this.element)

    root.render(
      React.createElement(
        Provider,
        { store: this.store },
        React.createElement(Root)
      )
    )
  }

  graph() {
    return this.store.getState().graph
  }

  graphStats() {
    return graphStats(this.graph())
  }

  toSvg() {
    return toSvg(this.store.getState())
  }

  toJpeg() {
    return toJpeg(this.store.getState())
  }

  static get apiUrls() {
    return urls
  }
}
