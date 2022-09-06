import React from 'react'
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux'
import type { Store } from 'redux'
import Root from './components/Root'
import EmbeddedRoot from './components/EmbeddedRoot'
import { toSvg, toJpeg } from './util/imageExport'
import createOligrapherStore from './util/store'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

  const oli = new Oligrapher(<your Configuration>)

  See app/util/defaultState for a list of variables

*/
export default class Oligrapher {
  store: Store;
  element: HTMLElement;

  constructor(configuration = {}) {
    this.store = createOligrapherStore(configuration)

    const element = document.getElementById(this.store.getState().settings.domId)

    if (!element) { throw new Error('could not find requested oligrapher element') }

    this.element = element

    const isEmbedded = this.store.getState().settings.embed

    const root = createRoot(this.element)
    const rootElement = React.createElement(isEmbedded ? EmbeddedRoot: Root)
    root.render(React.createElement(Provider, { store: this.store }, rootElement))
  }

  graph() {
    return this.store.getState().graph
  }

  toSvg() {
    return toSvg(this.store.getState())
  }

  toJpeg() {
    return toJpeg(this.store.getState())
  }

}
