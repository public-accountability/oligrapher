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
      graph: Object.assign({}, bigGraph),
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
    // node tool shouldn't be open
    let nodeTool = findAll('.node-tool')
    expect(nodeTool.length).to.equal(0)
    // click node tool icon
    fireEvent.click(find('.editor-menu-item'))
    // node tool should have opened
    nodeTool = findAll('.node-tool')
    expect(nodeTool.length).to.equal(1)
    // close node tool
    fireEvent.click(find('.editor-menu-item'))
    nodeTool = findAll('.node-tool')
    // should have closed
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
    fireEvent.click(find('.editor-node-item'))
    fireEvent.change(find('.node-tool input'), { target: { value: 'kushner' }})
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

  it('node editor opens and edits node and switches', async function() {
    const handle = find('.draggable-node-handle')

    // react-draggable listens to mousedown and mouseup instead of click
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // unclear why bubbles: false is necessary above, 
    // but without it draggable's onmouseup gets called twice,
    // (unlike in real browser interaction), and the node editor 
    // gets toggled twice and thus disappears
  
    // editor should have opened
    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    // name input should equal node name
    const label = find('.oligrapher-node .node-label')
    const input = find('.oligrapher-node-editor input')
    expect(removeSpaces(input.value)).to.equal(removeSpaces(label.textContent))
    // edit node name
    fireEvent.change(input, { target: { value: 'billie' } })
    // node name should have updated
    expect(find('.oligrapher-node .node-label').textContent).to.equal('billie')
    // "click" on a second node
    const node2 = findAll('.oligrapher-node')[1]
    const handle2 = findAll('.draggable-node-handle')[1]
    fireEvent.mouseDown(handle2)
    fireEvent.mouseUp(handle2, { bubbles: false })
    // editor should show the second node's details
    const input2 = find('.oligrapher-node-editor input')
    expect(removeSpaces(input2.value)).to.equal(removeSpaces(node2.textContent))
  })
  
  it('edge editor opens and edits edge and switches', function() {
    const handle = find('.edge-handle')
    // see comment for node editor click
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // editor should have opened
    const editor = findAll('.oligrapher-edge-editor')
    expect(editor.length).to.equal(1)
    // label input should equal edge label
    const label = find('.oligrapher-edge .edge-label')
    const input = find('.oligrapher-edge-editor input')
    expect(input.value).to.equal(label.textContent)
    // edit edge label
    fireEvent.change(input, { target: { value: 'accomplices' } })
    // edge label should have updated
    expect(find('.oligrapher-edge .edge-label').textContent).to.equal('accomplices')
    // "click" on a second edge
    const edge2 = findAll('.oligrapher-edge')[1]
    const handle2 = findAll('.edge-handle')[1]
    fireEvent.mouseDown(handle2)
    fireEvent.mouseUp(handle2, { bubbles: false })
    // editor should show the second edge's details
    const input2 = find('.oligrapher-edge-editor input')
    expect(removeSpaces(input2.value)).to.equal(removeSpaces(edge2.textContent))
  })

  it('caption editor opens and switches', function() {
    const caption = find('.oligrapher-caption')
    // see comment for node editor click
    fireEvent.mouseDown(caption)
    fireEvent.mouseUp(caption, { bubbles: false })
    // editor should have opened
    const editor = findAll('.oligrapher-caption-editor')
    expect(editor.length).to.equal(1)
    // change the font size
    const select = find('.edit-caption-size')
    fireEvent.change(select, { target: { value: '30' } })
    // change caption text
    const textarea = find('.oligrapher-caption textarea')
    fireEvent.change(textarea, { target: { value: 'terse commentary' } })
    // close editor
    const editorCloseButton = find('.edit-menu-header button')
    fireEvent.click(editorCloseButton)
    // caption text should have updated
    expect(find('.caption-text').style.fontSize).to.equal('30px')
    expect(find('.caption-text').textContent).to.equal('terse commentary')
    // "click" on a second caption
    const caption2 = findAll('.oligrapher-caption')[1]
    fireEvent.mouseDown(caption2)
    fireEvent.mouseUp(caption2, { bubbles: false })
    // editor should show the second caption's details
    const textarea2 = find('.oligrapher-caption textarea')
    expect(removeSpaces(textarea2.value)).to.equal(removeSpaces(caption2.textContent))
  })

  it('opens, closes, and changes settings', function() {
    // click on settings icon
    const icon = find('.editor-settings-item')
    fireEvent.click(icon)
    // settings should have opened
    expect(findAll('.oligrapher-settings').length).to.equal(1)
    // set map to private
    const checkbox = find('.oligrapher-settings input[type=checkbox]')
    expect(checkbox.checked).to.be.false
    fireEvent.click(checkbox)
    expect(checkbox.checked).to.be.true
    // close settings
    fireEvent.click(icon)
    expect(findAll('.oligrapher-settings').length).to.equal(0)
  })

  it('deletes node, edge, caption', function() {
    // count nodes
    const nodeCount = findAll('.oligrapher-node').length
    // "click" node
    const handle = find('.draggable-node-handle')
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // "click" delete
    const button = find('.oligrapher-node-editor button[name="delete"]')
    fireEvent.click(button)
    // should be one fewer node
    expect(findAll('.oligrapher-node').length).to.equal(nodeCount - 1)
  })
})