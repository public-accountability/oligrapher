import 'whatwg-fetch'  // Polyfill "window.fetch"
import '@testing-library/jest-dom'
import React from 'react'
import { Provider } from 'react-redux'
import { render } from '@testing-library/react'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import createOligrapherStore from './app/util/store'

global.rest = rest
global.setupServer = setupServer

global.renderWithStore  = (Element, props = null, configuration = {}) => {
  const store = createOligrapherStore(configuration)
  const app = React.createElement(Provider, { store: store }, React.createElement(Element, props))
  return { store, ...render(app) }
}
