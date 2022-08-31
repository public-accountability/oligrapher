import React from 'react'
import {render, fireEvent, waitFor, screen} from '@testing-library/react'
import Example from '../../app/components/Example'

test('Example Component', async () => {
  render(<Example />)
  expect(screen.queryByTestId('example-loading')).toBeTruthy()
  expect(screen.queryByTestId('example-results')).toBeNull()

  await waitFor(() => {
    expect(screen.getByTestId('example-results')).toBeInTheDocument()
  })

  expect(screen.queryByTestId('example-results').textContent).toEqual('world')
})
