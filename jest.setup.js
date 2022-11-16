import "whatwg-fetch" // Polyfill "window.fetch"
import "@testing-library/jest-dom"
import userEvent from "@testing-library/user-event"
import React from "react"
import { Provider } from "react-redux"
import { render } from "@testing-library/react"
import { rest } from "msw"
import { setupServer } from "msw/node"
import createOligrapherStore from "./app/util/store"
import { isElement } from "react-dom/test-utils"

// global.API_URL = 'http://localhost:8080'
global.API_URL = ""
global.OLIGRAPHER_COMMIT = "b49f3feea29bbe57f8c6615eca03842b44e9b1fd"
global.OLIGRAPHER_VERSION = "test"

global.rest = rest
global.setupServer = setupServer
global.createElement = React.createElement

global.renderWithStore = (Element, props = null, configuration = {}) => {
  const user = userEvent.setup()
  const store = createOligrapherStore(configuration)

  const app = React.createElement(
    Provider,
    { store: store },
    isElement(Element) ? Element : React.createElement(Element, props)
  )
  return { user, store, ...render(app) }
}

global.jsonHandler = (url, data) =>
  rest.get(url, (req, res, ctx) => res(ctx.delay(), ctx.json(data)))
