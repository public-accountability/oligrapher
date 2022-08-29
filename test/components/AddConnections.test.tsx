import React, { PropsWithChildren } from 'react'
import { render } from '@testing-library/react'
import { Provider } from 'react-redux'
import { createOligrapherStore } from '../../app/util/store'
import stateInitializer from '../../app/util/stateInitalizer'

import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { fireEvent, screen } from '@testing-library/react'

import AddConnections from '../../app/components/AddConnections'

//https://redux.js.org/usage/writing-tests#components
function renderWithStore(ui: React.ReactElement, initialState = {}) {
  const store = createOligrapherStore(stateInitializer(initialState))

  function Wrapper({ children }: PropsWithChildren<{}>): JSX.Element {
    return <Provider store={store}>{children}</Provider>
  }

  return { store, ...render(ui, { wrapper: Wrapper})}
}


const handlers = [
  rest.get('/oligrapher/find_connections', (req, res, ctx) => {
    return rest(ctx.json('[]'), ctx.delay(100))
  })
]

const server = setupServer(...handlers)

beforeAll(() => server.listen())
afterEach(() => server.resetHandlers())
afterAll(() => server.close())

describe('AddConnections', function() {
  it('shows loading', function() {
    renderWithStore(<AddConnections id={'1'}/>)
    expect(screen.getByText(/loading/)).toBeInTheDocument()
  })
})
