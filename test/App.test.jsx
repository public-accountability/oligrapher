import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import sinon from 'sinon'

import { Root } from '../app/containers/Root'
import { bigGraph } from './testData'
import { createOligrapherStore } from '../app/util/render'
import stateInitializer from '../app/util/stateInitalizer'
import * as littlesis3 from '../app/datasources/littlesis3'
import { removeSpaces } from './testHelpers'

describe('Oligrapher', function() {
  let state, store, container, find, findAll

  beforeEach(function() {
    state = stateInitializer({ 
      graph: bigGraph,
      attributes: {
        title: 'test graph',
        user: { name: 'bozo', url: 'http://example.com' }
      },
      display: {
        modes: { editor: true }
      }
    })

    store = createOligrapherStore(state)
    
    container = render(
      <Provider store={store}>
        <Root />
      </Provider>
    ).container

    find = (selector) => container.querySelector(selector)
    findAll = (selector) => container.querySelectorAll(selector)
  })

  it('shows title', function() {
    const title = findAll('#oligrapher-title')
    expect(title.length).to.equal(1)
  })

  it('shows user', function() {
    const userLink = find('#oligrapher-attribution-user a')
    expect(userLink.innerHTML).to.equal('bozo')
    expect(userLink.href).to.contain('http://example.com')
  })

  it('shows nodes', function() {
    const nodes = findAll('.oligrapher-node')
    expect(nodes.length).to.equal(Object.keys(state.graph.nodes).length)
  })

  it('shows edges', function() {
    const edges = findAll('.oligrapher-edge')
    expect(edges.length).to.equal(Object.keys(state.graph.edges).length)
  })

  it('shows captions', function() {
    const captions = findAll('.oligrapher-caption')
    expect(captions.length).to.equal(Object.keys(state.graph.captions).length)
  })

  it('node tool opens and closes', function() {
    let nodeTool = findAll('.nodetool')
    expect(nodeTool.length).to.equal(0)
    fireEvent.click(find('.editor-menu-item'))
    nodeTool = findAll('.nodetool')
    expect(nodeTool.length).to.equal(1)
    fireEvent.click(find('.editor-menu-item'))
    nodeTool = findAll('.nodetool')
    expect(nodeTool.length).to.equal(0)
  })

  it('node tool adds nodes and edges from littlesis', async function() {
    const initNodeCount = Object.keys(bigGraph.nodes).length
    const initEdgeCount = Object.keys(bigGraph.edges).length
    // stub littlesis requests
    const nodeData = [
      { id: "1", name: "papa kushner", description: null, image: null, url: null },
      { id: "2", name: "baby kushner", description: null, image: null, url: null }
    ]
    sinon.stub(littlesis3, 'findNodes').returns(Promise.resolve(nodeData))
    sinon.stub(littlesis3, 'getEdges').resolves([])

    // click node tool icon and enter search query
    fireEvent.click(find('.editor-menu-item'))
    fireEvent.change(find('.nodetool input'), { target: { value: 'kushner' }})
    // wait for results
    await waitFor(() => find('.entity-search-results'))
    // should be two results
    const resultLinks = findAll('.entity-search-result a')
    expect(resultLinks.length).to.equal(2)
    // click on first result
    fireEvent.click(resultLinks[0])
    // should have added a node
    expect(findAll('.oligrapher-node').length).to.equal(initNodeCount + 1)
    expect(removeSpaces(find('#node-1 .node-label').textContent)).to.equal(removeSpaces(nodeData[0].name))
    // assume that automatic edge fetch has one result
    littlesis3.getEdges.restore()
    sinon.stub(littlesis3, 'getEdges').resolves([
      { id: "1", node1_id: "1", node2_id: "2", label: "family", arrow: false, dash: false, url: null }
    ])
    // click second result
    fireEvent.click(resultLinks[1])
    // two nodes should exist
    expect(findAll('.oligrapher-node').length).to.equal(initNodeCount + 2)
    // should eventually add the edge
    await waitFor(() => {
      expect(findAll('.oligrapher-edge').length).to.equal(initEdgeCount + 1)
      expect(find('#edge-1 .edge-label').textContent).to.equal("family")
    })
    // unstub api
    littlesis3.findNodes.restore()
    littlesis3.getEdges.restore()
  })

  it('node editor opens and edits node', async function() {
    const handle = find('.draggable-node-handle')

    // react-draggable listens to mousedown and mouseup instead of click
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // unclear why bubbles: false is necessary above, 
    // but without it draggable's onmouseup gets called twice,
    // (unlike in real browser interaction), and the node editor 
    // gets toggled twice and thus disappears

    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    const label = find('.oligrapher-node .node-label')
    const input = find('.oligrapher-node-editor input')
    expect(removeSpaces(input.value)).to.equal(removeSpaces(label.textContent))
    // edit node name
    fireEvent.change(input, { target: { value: 'billie' } })
    // node name should have updated
    expect(find('.oligrapher-node .node-label').textContent).to.equal('billie')
  })
  
  it('edge editor opens and edits edge', function() {
    const handle = find('.edge-handle')

    // see comment for node editor click
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 

    const editor = findAll('.oligrapher-edge-editor')
    expect(editor.length).to.equal(1)
    const label = find('.oligrapher-edge .edge-label')
    const input = find('.oligrapher-edge-editor input')
    expect(input.value).to.equal(label.textContent)
    // edit edge label
    fireEvent.change(input, { target: { value: 'accomplices' } })
    // edge label should have updated
    expect(find('.oligrapher-edge .edge-label').textContent).to.equal('accomplices')
  })

  it('opens caption editor', function() {
    const caption = find('.oligrapher-caption')

    // see comment for node editor click
    fireEvent.mouseDown(caption)
    fireEvent.mouseUp(caption, { bubbles: false })

    const editor = findAll('.oligrapher-caption-editor')
    expect(editor.length).to.equal(1)
    // change caption text
    const textarea = find('.oligrapher-caption textarea')
    fireEvent.change(textarea, { target: { value: 'terse commentary' } })
    // close editor
    const editorCloseButton = find('.edit-menu-header button')
    fireEvent.click(editorCloseButton)
    // caption text should have updated
    expect(find('.oligrapher-caption').textContent).to.equal('terse commentary')
  })
})