import React from 'react'
import { render, fireEvent, waitFor, getByText } from '@testing-library/react'
import { Provider } from 'react-redux'
import sinon from 'sinon'

import { Root } from '../app/components/Root'
import { bigGraph } from './testData'
import { createOligrapherStore } from '../app/util/store'
import stateInitializer from '../app/util/stateInitalizer'
import * as littlesis3 from '../app/datasources/littlesis3'
import { removeSpaces } from './testHelpers'
import { NODE_RADIUS } from '../app/graph/node'
import * as AnnotationTextEditor from '../app/components/AnnotationTextEditor'

const sandbox = sinon.createSandbox()

describe('Oligrapher', function() {
  let state, store, container, find, findAll, 
    clickHeaderMenuItem, clickActionMenuItem, clickPresent, clickEdit, clickIcon,
    clickHandle, expectCount

  beforeEach(function() {
    sandbox.stub(littlesis3, 'lock').resolves({
      user_has_lock: true
    })
    state = stateInitializer({ 
      graph: Object.assign({}, bigGraph),
      annotations: {
        list: [],
        currentIndex: 0,
        sources: {
          id: 'sources',
          header: 'Sources',
          text: '<div><a href="http://example.com">example</a></div>',
          nodeIds: [],
          edgeIds: [],
          captionIds: []
        }
      },
      attributes: {
        id: '1',
        title: 'test graph',
        user: { id: '1', name: 'bozo', url: 'http://example.com' },
        owner: { id: '1', name: 'bozo', url: 'http://example.com' },
        shareUrl: "http://ecxample.com/share"
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

    find = (selector, root) => (root || container).querySelector(selector)
    findAll = (selector, root) => (root || container).querySelectorAll(selector)

    clickHeaderMenuItem = key => {
      fireEvent.click(
        Array.from(findAll('#oligrapher-header-menu button', document.body)).find(button => button.textContent === key)
      )
    }

    clickActionMenuItem = key => {
      fireEvent.click(find('#toggle-action-menu'))
      fireEvent.click(
        Array.from(findAll('#header-action-menu li', document.body)).find(li => li.textContent === key)
      )
    }

    clickPresent = () => clickActionMenuItem('Present')
    clickEdit = () => clickHeaderMenuItem('Edit')
    
    clickIcon = key => {
      fireEvent.click(find(`.editor-${key}-item`))
    }

    clickHandle = handle => {
      // react-draggable listens to mousedown and mouseup instead of click
      fireEvent.mouseDown(handle)
      fireEvent.mouseUp(handle, { bubbles: false }) 
      // unclear why bubbles: false is necessary above, 
      // but without it draggable's onmouseup gets called twice,
      // (unlike in real browser interaction), and the node editor 
      // gets toggled twice and thus disappears
    }

    expectCount = (selector, count) => {
      expect(findAll(selector, document.body).length).to.equal(count)
    }
  })

  afterEach(function() {
    sandbox.restore()
  })

  it('shows title', function() {
    const title = findAll('#oligrapher-title')
    expect(title.length).to.equal(1)
  })

  it('shows user', function() {
    const userLink = find('#oligrapher-attribution-users a')
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
    clickIcon('node')
    fireEvent.change(find('.node-tool input'), { target: { value: 'kushner' } })
    // wait for results
    await waitFor(() => find('.entity-search-results'))
    // should be two results
    const resultLinks = findAll('.entity-search-result a')
    expect(resultLinks.length).to.equal(2)
    // click on first result
    fireEvent.click(resultLinks[0])
    // should have added a node
    expectCount('.oligrapher-node', initNodeCount + 1)
    expect(removeSpaces(find('#node-1 .node-label').textContent)).to.equal(removeSpaces(nodeData[0].name))
    // assume that automatic edge fetch has one result
    littlesis3.getEdges.restore()
    sandbox.stub(littlesis3, 'getEdges').resolves([
      { id: "1", node1_id: "1", node2_id: "2", label: "family", arrow: false, dash: false, url: null }
    ])
    // click second result
    fireEvent.click(resultLinks[1])
    // two nodes should exist
    expectCount('.oligrapher-node', initNodeCount + 2)
    // should eventually add the edge
    await waitFor(() => {
      expectCount('.oligrapher-edge', initEdgeCount + 1)
      expect(find('#edge-1 .edge-label').textContent).to.equal("family")
    })
    // unstub api
  })

  it('node editor opens and edits node and switches', async function() {
    const nodeId = find('.oligrapher-node').id
    const handle = find(`#${nodeId} .draggable-node-handle`)
    clickHandle(handle)
    // editor should have opened
    expectCount('.oligrapher-node-editor', 1)
    // name input should equal node name
    const label = find(`#${nodeId } .node-label`)
    const input = find('.oligrapher-node-editor input')
    expect(removeSpaces(input.value)).to.equal(removeSpaces(label.textContent))
    // edit node name
    fireEvent.change(input, { target: { value: 'billie' } })
    // node name should have updated
    expect(find(`#${nodeId} .node-label`).textContent).to.equal('billie')
    // "click" on a second node
    const node2 = findAll('.oligrapher-node')[1]
    const handle2 = findAll('.draggable-node-handle')[1]
    clickHandle(handle2)
    // editor should show the second node's details
    const input2 = find('.oligrapher-node-editor input')
    expect(removeSpaces(input2.value)).to.equal(removeSpaces(node2.textContent))
  })
  
  it('edge editor opens and edits edge and switches', function() {
    const handle = find('.edge-handle')
    clickHandle(handle)
    // editor should have opened
    expectCount('.oligrapher-edge-editor', 1)
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
    clickHandle(handle2)
    // editor should show the second edge's details
    const input2 = find('.oligrapher-edge-editor input')
    expect(removeSpaces(input2.value)).to.equal(removeSpaces(edge2.textContent))
  })

  it('caption editor opens and switches', async function() {
    const caption = find('.oligrapher-caption')
    clickHandle(caption)
    // editor should have opened
    expectCount('.oligrapher-caption-editor', 1)
    // "click" the size menu
    const select = find('#caption-editor-select-size')
    fireEvent.mouseDown(select)
    fireEvent.mouseUp(select)
    await waitFor(() => expect(findAll('#caption-editor-select-menu', document.body).length).to.equal(1))
    // click "30" option
    const option = Array.from(findAll('#caption-editor-select-menu ul li', document.body)).find(li => li.textContent === '30')
    fireEvent.click(option)
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
    clickHandle(caption2)
    // editor should show the second caption's details
    const textarea2 = find('.oligrapher-caption textarea')
    expect(removeSpaces(textarea2.value)).to.equal(removeSpaces(caption2.textContent))
  })

  it('opens, closes, and changes settings', function() {
    // click on settings icon
    clickIcon('settings')
    // settings should have opened
    expectCount('.oligrapher-settings', 1)
    // set map to private
    const checkbox = find('.oligrapher-settings input[name=private]')
    expect(checkbox.checked).to.be.false
    fireEvent.click(checkbox)
    expect(checkbox.checked).to.be.true
    // close settings
    clickIcon('settings')
    expectCount('.oligrapher-settings', 0)
  })

  it('deletes node, edge, caption', async function() {
    // count nodes
    const nodeCount = findAll('.oligrapher-node').length
    // "click" node
    const nodeHandle = find('.draggable-node-handle')
    clickHandle(nodeHandle)
    // click delete
    fireEvent.click(find('.oligrapher-node-editor footer button'))
    // should be one fewer node
    await waitFor(() => expectCount('.oligrapher-node', nodeCount - 1))
    // count edges
    const edgeCount = findAll('.oligrapher-edge').length
    const edgeHandle = find('.edge-handle')
    // "click" edge
    clickHandle(edgeHandle)
    // click delete
    fireEvent.click(find('.oligrapher-edge-editor footer button'))
    // should be one fewer edge
    expectCount('.oligrapher-edge', edgeCount - 1)
    // count captions
    const captionCount = findAll('.oligrapher-caption').length
    const caption = find('.oligrapher-caption')
    // "click" caption
    clickHandle(caption)
    // click delete
    fireEvent.click(find('.oligrapher-caption-editor footer button'))
    // should be one fewer caption
    expectCount('.oligrapher-caption', captionCount - 1)
  })

  it('undoes and redoes changes to graph', function() {
    const nodeId = find('.oligrapher-node').id
    const originalName = find(`#${nodeId} .node-label`).textContent
    // "click" node
    const nodeHandle = find(`#${nodeId} .draggable-node-handle`)
    clickHandle(nodeHandle)
    // edit node name
    const input = find('.oligrapher-node-editor input')
    fireEvent.change(input, { target: { value: 'billy bob' } })
    // close editor
    const closeButton = find('.editor-header button')
    fireEvent.click(closeButton)
    // node name should have updated
    expect(find(`#${nodeId} .node-label`).textContent).to.equal('billy bob')
    // click undo
    const undo = find('#oligrapher-undo-redo button')
    fireEvent.click(undo)
    expect(find(`#${nodeId} .node-label`).textContent).to.equal(originalName)
  })

  it('closes node editor when escape key is pressed', function() {
    // click node
    const handle = find('.draggable-node-handle')
    clickHandle(handle)
    // editor should have opened
    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    // press escape key
    fireEvent.keyDown(editor[0], { key: 'Escape', code: 'Escape', keyCode: 27 })
    // editor should have closed
    expectCount('.oligrapher-node-editor', 0)
  })

  it('deletes node when backspace key is pressed in node editor', function() {
    const nodeCount = findAll('.oligrapher-node').length
    // "click" node
    const handle = find('.draggable-node-handle')
    clickHandle(handle)
    // editor should have opened
    const editor = findAll('.oligrapher-node-editor')
    expect(editor.length).to.equal(1)
    // press backspace key
    fireEvent.keyDown(editor[0], { key: 'Backspace', code: 'Backspace', keyCode: 8 })
    // editor should have closed
    expectCount('.oligrapher-node-editor', 0)
    // node should have deleted
    expectCount('.oligrapher-node', nodeCount - 1)
  })

  it('saves map', async function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'update').returns(promise)
    // click save button
    const button = find('#oligrapher-save-button')
    fireEvent.click(button)
    // user message should indicate saving
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Saving map...")
    // user message should eventually indicate saved
    await waitFor(() => expect(message.textContent).to.equal("Saved map :)"))
    // user message should eventually disappear
    await waitFor(() => expectCount('.oligrapher-user-message', 0), { timeout: 5000 })
  }).timeout(6000)

  it('clones map (failure)', async function() {
    const promise = new Promise((resolve, reject) => setTimeout(() => reject(), 10))
    sandbox.stub(littlesis3.oligrapher, 'clone').returns(promise)
    clickActionMenuItem('Clone')
    // user message should indicate cloning
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Cloning map...")
    // user message should eventually indicate failed
    await waitFor(() => expect(message.textContent).to.equal("Failed to clone map :("))
    // user message should eventually disappear
    await waitFor(() => expectCount('.oligrapher-user-message', 0), { timeout: 5000 })
  }).timeout(6000)

  // can't figure out how to make this test work, the modal doesn't seem to appear
  it('deletes map', async function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'delete').returns(promise)
    clickActionMenuItem('Delete')
    // confirmation modal should appear
    expectCount('#oligrapher-confirm', 1)
    // click on delete button
    const button = find('#oligrapher-confirm-button', document.body)
    fireEvent.click(button)
    // user message should indicate deleting
    const message = find('.oligrapher-user-message')
    expect(message.textContent).to.equal("Deleting map...")
    // modal should disappear
    await waitFor(() => expect(findAll('#oligrapher-confirm', document.body).length).to.equal(0))
    // unfortunately we can't test the redirect because we can't stub window.location.replace :(
  })

  it('opens and closes action menu', async function() {
    const promise = new Promise(resolve => setTimeout(() => resolve(), 10))
    sandbox.stub(littlesis3.oligrapher, 'clone').returns(promise)
    // click action menu toggler
    const toggle = find('#toggle-action-menu')
    fireEvent.click(toggle)
    // action menu should appear
    expectCount('#header-action-menu', 1)
    // press escape key
    fireEvent.keyDown(find('#header-action-menu', document.body), { key: 'Escape', code: 'Escape', keyCode: 27 })
    // action menu should disappear
    await waitFor(() => expectCount('#header-action-menu', 0))
    // click action menu toggler
    fireEvent.click(toggle)
    expectCount('#header-action-menu', 1)
    // click "Clone"
    const item = Array.from(findAll('#header-action-menu li', document.body)).find(li => li.textContent === 'Clone')
    fireEvent.click(item)
    // action menu should disappear
    await waitFor(() => expectCount('#header-action-menu', 0))
  })

  it('switches to present mode and back to editor mode', function() {
    // editor menu should be visible
    expectCount('.oligrapher-graph-editor', 1)
    clickPresent()
    // editor menu should disappear
    expectCount('.oligrapher-graph-editor', 0)
    clickEdit()
    // menu should disappear
    expectCount('#oligrapher-header-menu-menu', 0)
    // editor menu should appear
    expectCount('.oligrapher-graph-editor', 1)
  })

  it('opens and closes disclaimer', async function() {
    clickPresent()
    clickHeaderMenuItem('Disclaimer')
    // disclaimer should appear
    expectCount('#oligrapher-disclaimer', 1)
    // click button
    fireEvent.click(find('#oligrapher-disclaimer button', document.body))
    // disclaimer should disappear
    await waitFor(() => expectCount('#oligrapher-disclaimer', 0))
  })

  it('opens and closes help', function() {
    // click on help button
    fireEvent.click(find('.editor-help-item'))
    // help box should appear
    expectCount('#oligrapher-help', 1)
    // click on close button
    fireEvent.click(find('#oligrapher-help button'))
    // help box should disappear
    expectCount('#oligrapher-help', 0)
  })

  it('opens and closes share modal', async function() {
    // click on settings icon
    clickIcon('settings')
    // set map to private
    const checkbox = find('.oligrapher-settings input[type=checkbox]')
    fireEvent.click(checkbox)
    // close settings
    clickIcon('settings')
    clickActionMenuItem('Share')
    // action menu should disappear
    await waitFor(() => expectCount('#header-action-menu', 0))
    // share modal should appear
    expectCount('#oligrapher-share', 1)
    // click OK
    fireEvent.click(find('#oligrapher-share button', document.body))
    // share modal should disappear
    await waitFor(() => expectCount('#oligrapher-share', 0))
    clickPresent()
    clickHeaderMenuItem('Share')
    // share modal should appear
    expectCount('#oligrapher-share', 1)
  })

  it('selects multiple nodes and styles them', function() {
    // shouldn't be any selected nodes
    expectCount('.selected-nodes .oligrapher-node', 0)
    // find first five nodes
    const handles = Array.from(findAll('.draggable-node-handle')).slice(0, 5)
    // hold shift key
    fireEvent.keyDown(document.body, { key: 'Shift', code: 'ShiftLeft', keyCode: 16 })
    // "click" nodes
    handles.forEach(handle => {
      clickHandle(handle)
    })
    // release shift key
    fireEvent.keyUp(document.body, { key: 'Shift', code: 'ShiftLeft', keyCode: 16 })
    // five nodes should be selected
    expectCount('.selected-nodes .oligrapher-node', 5)
    // click style editor icon
    fireEvent.click(find('.editor-menu .editor-style-item'))
    // style editor should be open
    expectCount('.oligrapher-style-nodes', 1)
    // style editor should indicate 5 nodes selected
    expect(find('.oligrapher-style-nodes-count').textContent).to.equal('Nodes selected: 5')
    // click size icon in style editor
    fireEvent.click(find('.oligrapher-style-nodes .entity-size-icon'))
    // click largest circle
    const circles = findAll('.oligrapher-style-nodes .sizepicker .circle')
    fireEvent.click(circles[circles.length - 1])
    // click apply button
    fireEvent.click(find('.oligrapher-style-nodes footer button'))
    // selected nodes should be 3x normal size
    const nodeSizes = Array.from(findAll('.selected-nodes .node-circle')).map(circle => circle.getAttribute('r'))
    expect(nodeSizes).to.eql(new Array(5).fill(String(NODE_RADIUS * 3)))
  })

  it('adds connections', async function() {
    const initNodeCount = Object.keys(bigGraph.nodes).length
    const initEdgeCount = Object.keys(bigGraph.edges).length
    const nodeId = Object.keys(bigGraph.nodes)[0]
    // stub littlesis requests
    const nodeData = [
      { id: "1", name: "papa kushner", description: null, image: null, url: null, edges: [
        { id: "100", node1_id: nodeId, node2_id: "1", label: "pals", arrow: null, dash: false, url: null }
      ] },
      { id: "2", name: "baby kushner", description: null, image: null, url: null, edges: [
        { id: "101", node1_id: nodeId, node2_id: "2", label: "benefactor", arrow: null, dash: false, url: null }
      ] }
    ]
    sandbox.stub(littlesis3, 'findConnections').returns(Promise.resolve(nodeData))
    sandbox.stub(littlesis3, 'getEdges').resolves([])
    // "click" on node
    const handle = find(`#node-${nodeId} .draggable-node-handle`)
    fireEvent.mouseDown(handle)
    fireEvent.mouseUp(handle, { bubbles: false })
    // click on add connections
    fireEvent.click(find('.add-connections-link'))
    // add connections should have appeared
    expectCount('.oligrapher-add-connections', 1)
    // there should be two results
    await waitFor(() => expectCount('.oligrapher-add-connections .entity-search-result', 2))
    // click first result
    const results = findAll('.oligrapher-add-connections .entity-search-result a')
    fireEvent.click(results[0])
    // there should be one more node and one more edge
    expectCount('.oligrapher-node', initNodeCount + 1)
    expectCount('.oligrapher-edge', initEdgeCount + 1)
  })

  it('adds interlocks', async function() {
    const initNodeCount = Object.keys(bigGraph.nodes).length
    const initEdgeCount = Object.keys(bigGraph.edges).length
    // get ids of two nodes we're going to select
    const [node1Id, node2Id] = Array.from(findAll('.oligrapher-node')).map(node => node.id.split('-')[1])
    // stub littlesis requests
    const interlocksData = { nodes: [
      { id: "1", name: "baby kushner", description: null, image: null, url: null }
    ], edges: [
      { id: "100", node1_id: node1Id, node2_id: "1", label: "pals", arrow: null, dash: false, url: null },
      { id: "101", node1_id: node2Id, node2_id: "1", label: "besties", arrow: null, dash: false, url: null }
    ] }
    sandbox.stub(littlesis3, 'getInterlocks').returns(Promise.resolve(interlocksData))
    sandbox.stub(littlesis3, 'getEdges').resolves([])
    // click on interlocks icon
    const icon = find('.editor-interlocks-item')
    fireEvent.click(icon)
    // interlocks should have opened
    expectCount('.oligrapher-interlocks', 1)
    // button should be disabled
    expect(find('.oligrapher-interlocks button').disabled).to.equal(true)
    // select two nodes
    const handles = Array.from(findAll('.draggable-node-handle')).slice(0, 2)
    fireEvent.keyDown(document.body, { key: 'Shift', code: 'ShiftLeft', keyCode: 16 })
    handles.forEach(handle => {
      clickHandle(handle)
    })
    fireEvent.keyUp(document.body, { key: 'Shift', code: 'ShiftLeft', keyCode: 16 })
    // button should be enabled
    expect(find('.oligrapher-interlocks button').disabled).to.equal(false)
    // click button
    fireEvent.click(find('.oligrapher-interlocks button'))
    // should be one more node
    await waitFor(() => expectCount('.oligrapher-node', initNodeCount + 1))
    // should be two more edges
    await waitFor(() => expectCount('.oligrapher-edge', initEdgeCount + 2))
  })

  it('creates, shows, and updates, and removes annotations', function() {
    // stub AnnotationTextEditor because CKEditor hangs the test
    sandbox.stub(AnnotationTextEditor, 'default').returns(<div>text editor</div>)
    // click on annotations icon
    const icon = find('.editor-annotations-item')
    fireEvent.click(icon)
    // should show annotations editor
    expectCount('#oligrapher-annotations', 1)
    // should be no annotations in list
    expectCount('.annotation-list-item', 0)
    // click "add annotation" button twice
    const button = getByText(container, 'Add Annotation')
    fireEvent.click(button)
    fireEvent.click(button)
    // should be two annotations in list
    expectCount('.annotation-list-item', 2)
    // second annotation should be current
    expect(find('.annotation-list-item-current').textContent).to.contain('2.')
    // click on first annotation in list
    fireEvent.click(find('.annotation-list-item'))
    // first annotation should be current
    expect(find('.annotation-list-item-current').textContent).to.contain('1.')
    // edit annotation title
    const title = find('#oligrapher-annotation-form-header')
    fireEvent.change(title, { target: { value: 'New Header' } })
    // title in list should have changed
    expect(find('.annotation-list-item-current').textContent).to.equal('1. New Header')
    // click remove button
    const remove = getByText(container, 'Remove')
    fireEvent.click(remove)
    // should be one annotation
    expectCount('.annotation-list-item', 1)
  })

  it('highlights nodes, edges, captions', function() {
    // stub AnnotationTextEditor because CKEditor hangs the test
    sandbox.stub(AnnotationTextEditor, 'default').returns(<div>text editor</div>)
    // click on annotations icon
    const icon = find('.editor-annotations-item')
    fireEvent.click(icon)
    // add annotation
    const button = getByText(container, 'Add Annotation')
    fireEvent.click(button)
    // control-click two nodes
    const nodes = Array.from(findAll('.draggable-node-handle')).slice(0, 2)
    fireEvent.keyDown(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    nodes.forEach(node => {
      clickHandle(node)
    })
    fireEvent.keyUp(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    // two nodes should be highlighted
    expectCount('.node-halo-highlighted', 2)
    // control-click two edges
    const edges = Array.from(findAll('.edge-handle')).slice(0, 2)
    fireEvent.keyDown(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    edges.forEach(edge => {
      clickHandle(edge)
    })
    fireEvent.keyUp(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    // two edges should be highlighted
    expectCount('.edge-highlight', 2)
    // control-click two captions
    const captions = Array.from(findAll('.caption-text')).slice(0, 2)
    fireEvent.keyDown(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    captions.forEach(caption => {
      clickHandle(caption)
    })
    fireEvent.keyUp(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    // two captions should be highlighted
    expectCount('.caption-text-highlighted', 2)
  })

  it('shows annotations in presentation mode', function() {
    // stub AnnotationTextEditor because CKEditor hangs the test
    sandbox.stub(AnnotationTextEditor, 'default').returns(<div>text editor</div>)
    clickIcon('settings')
    // click on list sources checkbox
    const checkbox = find('input[name=list_sources]')
    fireEvent.click(checkbox)
    clickIcon('annotations')
    // add two annotations
    let button = getByText(container, 'Add Annotation')
    fireEvent.click(button)
    fireEvent.click(button)
    // control-click two nodes
    const nodes = Array.from(findAll('.draggable-node-handle')).slice(0, 2)
    fireEvent.keyDown(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    nodes.forEach(node => {
      clickHandle(node)
    })
    fireEvent.keyUp(document.body, { key: 'Control', code: 'ControlLeft', keyCode: 17 })
    clickActionMenuItem('Present')
    // should show three annotations
    const circles = findAll('.tracker-circle')
    expect(circles.length).to.equal(3)
    // click second tracker circle
    fireEvent.click(circles[1])
    // two nodes should be highlighted
    expectCount('.node-halo-highlighted', 2)
    // click third tracker circle
    fireEvent.click(circles[2])
    // should show sources
    expect(find('.oligrapher-annotation-header').textContent).to.equal('Sources')
    expect(find('.oligrapher-annotation-text').textContent).to.contain('example')
    // click on Annotations button
    button = getByText(container, 'Annotations')
    fireEvent.click(button)
    // should hide annotations
    expectCount('#oligrapher-annotations', 0)
  })

  it('changes annotation settings', function() {
    // stub AnnotationTextEditor because CKEditor hangs the test
    sandbox.stub(AnnotationTextEditor, 'default').returns(<div>text editor</div>)
    clickIcon('settings')
    // click on explore mode only
    let checkbox = find('input[name=exploreModeOnly]')
    fireEvent.click(checkbox)
    clickIcon('annotations')
    // add two annotations
    let button = getByText(container, 'Add Annotation')
    fireEvent.click(button)
    fireEvent.click(button)
    clickPresent()
    // annotations should be hidden
    expectCount('#oligrapher-annotations', 0)
    clickEdit()
    clickIcon('settings')
    // click on story mode only
    checkbox = find('input[name=storyModeOnly]')
    fireEvent.click(checkbox)
    clickPresent()
    expectCount('#oligrapher-annotations', 1)
    expectCount('#oligrapher-annotations-toggler', 0)
  })
})