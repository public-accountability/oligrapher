import React from 'react'
import { render, fireEvent, waitFor } from '@testing-library/react'
import { Provider } from 'react-redux'
import sinon from 'sinon'

import { Root } from '../app/components/Root'
import { bigGraph } from './testData'
import { createOligrapherStore } from '../app/util/render'
import stateInitializer from '../app/util/stateInitalizer'
import * as littlesis3 from '../app/datasources/littlesis3'
import { removeSpaces } from './testHelpers'

const sandbox = sinon.createSandbox()

describe('Oligrapher', function() {
  let state, store, container, find, findAll

  beforeEach(function() {
    state = stateInitializer({ 
      graph: Object.assign({}, bigGraph),
      attributes: {
        id: '1',
        title: 'test graph',
        user: { id: '1', name: 'bozo', url: 'http://example.com' },
        owner: { id: '1', name: 'bozo', url: 'http://example.com' }
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

  afterEach(function() {
    sandbox.restore()
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
    sandbox.stub(littlesis3, 'findNodes').returns(Promise.resolve(nodeData))
    sandbox.stub(littlesis3, 'getEdges').resolves([])

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
    sandbox.stub(littlesis3, 'getEdges').resolves([
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
    const editorCloseButton = find('.editor-header button')
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
    const nodeHandle = find('.draggable-node-handle')
    fireEvent.mouseDown(nodeHandle)
    fireEvent.mouseUp(nodeHandle, { bubbles: false }) 
    // "click" delete
    fireEvent.click(find('.oligrapher-node-editor button[name="delete"]'))
    // should be one fewer node
    expect(findAll('.oligrapher-node').length).to.equal(nodeCount - 1)

    // count edges
    const edgeCount = findAll('.oligrapher-edge').length
    const edgeHandle = find('.edge-handle')
    // "click" edge
    fireEvent.mouseDown(edgeHandle)
    fireEvent.mouseUp(edgeHandle, { bubbles: false })
    // "click" delete
    fireEvent.click(find('.oligrapher-edge-editor button[name="delete"]'))
    // should be one fewer edge
    expect(findAll('.oligrapher-edge').length).to.equal(edgeCount - 1)

    // count captions
    const captionCount = findAll('.oligrapher-caption').length
    const caption = find('.oligrapher-caption')
    // "click" caption
    fireEvent.mouseDown(caption)
    fireEvent.mouseUp(caption, { bubbles: false })
    // "click" delete
    fireEvent.click(find('.oligrapher-caption-editor button[name="delete"]'))
    // should be one fewer caption
    expect(findAll('.oligrapher-caption').length).to.equal(captionCount - 1)
  })

  it('undoes and redoes changes to graph', function() {
    const originalName = find('.oligrapher-node .node-label').textContent
    // "click" node
    const nodeHandle = find('.draggable-node-handle')
    fireEvent.mouseDown(nodeHandle)
    fireEvent.mouseUp(nodeHandle, { bubbles: false }) 
    // edit node name
    const input = find('.oligrapher-node-editor input')
    fireEvent.change(input, { target: { value: 'billy bob' } })
    // close editor
    const closeButton = find('.editor-header button')
    fireEvent.click(closeButton)
    // node name should have updated
    expect(find('.oligrapher-node .node-label').textContent).to.equal('billy bob')
    // click undo
    const undo = find('#oligrapher-undo-redo button')
    fireEvent.click(undo)
    expect(find('.oligrapher-node .node-label').textContent).to.equal(originalName)
  })

  it('closes node editor when escape key is pressed', function() {
    const handle = find('.draggable-node-handle')
    // "click" node
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // editor should have opened
    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    // press escape key
    fireEvent.keyDown(editor[0], { key: 'Escape', code: 'Escape', keyCode: 27 })
    // editor should have closed
    expect(findAll('.oligrapher-node-editor').length).to.equal(0)
  })

  it('deletes node when backspace key is pressed in node editor', function() {
    const nodeCount = findAll('.oligrapher-node').length
    const handle = find('.draggable-node-handle')
    // "click" node
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false }) 
    // editor should have opened
    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    // press backspace key
    fireEvent.keyDown(editor[0], { key: 'Backspace', code: 'Backspace', keyCode: 8 })
    // editor should have closed
    expect(findAll('.oligrapher-node-editor').length).to.equal(0)
    // node should have deleted
    expect(findAll('.oligrapher-node').length).to.equal(nodeCount - 1)
  })

  it('saves map', async function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'update').returns(promise)
    // click save button
    const button = find('#oligrapher-header button[name="save"]')
    fireEvent.click(button)
    // user message should indicate saving
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Saving map...")
    // user message should eventually indicate saved
    await waitFor(() => expect(message.textContent).to.equal("Saved map :)"))
    // user message should eventually disappear
    await waitFor(() => expect(findAll('.oligrapher-user-message').length).to.equal(0), { timeout: 5000 })
  }).timeout(6000)

  it('clones map (failure)', async function() {
    const promise = new Promise((resolve, reject) => setTimeout(() => reject(), 10))
    sandbox.stub(littlesis3.oligrapher, 'clone').returns(promise)
    // open menu
    const toggle = find('.toggle-action-menu')
    fireEvent.click(toggle)
    // click clone
    const item = Array.from(findAll('.header-action-menu li')).find(li => li.textContent === 'Clone')
    fireEvent.click(item)
    // user message should indicate cloning
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Cloning map...")
    // user message should eventually indicate failed
    await waitFor(() => expect(message.textContent).to.equal("Failed to clone map :("))
    // user message should eventually disappear
    await waitFor(() => expect(findAll('.oligrapher-user-message').length).to.equal(0), { timeout: 5000 })
  }).timeout(6000)

  // can't figure out how to make this test work, the modal doesn't seem to appear
  xit('deletes map', async function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'delete').returns(promise)
    // open menu
    const toggle = find('.toggle-action-menu')
    fireEvent.click(toggle)
    // click delete
    const item = Array.from(findAll('.header-action-menu li')).find(li => li.textContent === 'Delete')
    fireEvent.click(item)
    // confirmation modal should appear
    expect(findAll('.confirm-delete').length).to.equal(1)
    // click on delete button
    const button = find('.confirm-delete button[name="delete"]')
    fireEvent.click(button)
    // user message should indicate deleting
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Deleting map...")
    // unfortunately we can't test the redirect because we can't stub window.location.replace :()
  })

  it('opens and closes action menu', function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'clone').returns(promise)
    // click action menu toggler
    const toggle = find('.toggle-action-menu')
    fireEvent.click(toggle)
    // action menu should appear
    expect(findAll('.header-action-menu').length).to.equal(1)
    // click on node tool
    const nodeToolIcon = find('.editor-node-item')
    fireEvent.click(nodeToolIcon)
    // action menu should disappear
    expect(findAll('.header-action-menu').length).to.equal(0)
    // click action menu toggler
    fireEvent.click(toggle)
    expect(findAll('.header-action-menu').length).to.equal(1)
    // click "Clone"
    const item = Array.from(findAll('.header-action-menu li')).find(li => li.textContent === 'Clone')
    fireEvent.click(item)
    // action menu should disappear
    expect(findAll('.header-action-menu').length).to.equal(0)
  })

  it('switches to present mode and back to editor mode', function() {
    // editor menu should be visible
    expect(findAll('.oligrapher-graph-editor').length).to.equal(1)
    // click action menu toggler
    const toggle = find('.toggle-action-menu')
    fireEvent.click(toggle)
    // action menu should appear
    expect(findAll('.header-action-menu').length).to.equal(1)
    // click on "Present"
    const item = Array.from(findAll('.header-action-menu li')).find(li => li.textContent === 'Present')
    fireEvent.click(item)
    // editor menu should disappear
    expect(findAll('.oligrapher-graph-editor').length).to.equal(0)
    // click "Edit"
    const edit = find('#oligrapher-header-menu-wrapper a')
    fireEvent.click(edit)
    // editor menu should appear
    expect(findAll('.oligrapher-graph-editor').length).to.equal(1)
  })
})