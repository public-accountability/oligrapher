import { screen } from '@testing-library/react'
import { createElement } from 'react'
import { simpleGraph, wrapInSvg } from '../helpers'
import Edge from '../../app/components/Edge'

test('Edge', async () => {
  const element = wrapInSvg(createElement(Edge,{ id: "EW7LJH8ml", currentlyEdited: false, status: "normal" }))
  const result = renderWithStore(element, null, { graph: simpleGraph })
  expect(result.container.querySelector('#edge-EW7LJH8ml')).toBeTruthy()
  expect(result.container.querySelector('path.edge-highlight')).toBeFalsy()
  expect(result.container.querySelector('path.edge-path-selected')).toBeFalsy()
})


test('Edge is selected whiled editing', async () => {
  const element = wrapInSvg(createElement(Edge,{ id: "EW7LJH8ml", currentlyEdited: true, status: "normal" }))
  const result = renderWithStore(element,null, { graph: simpleGraph })
  expect(result.container.querySelector('path.edge-path-selected')).toBeTruthy()
})
