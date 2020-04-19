import React from 'react'
import { act } from "react-dom/test-utils"
import EntitySearch from '../../app/components/tools/EntitySearch'
import EntitySearchResults from '../../app/components/tools/EntitySearchResults'
import * as littlesis3 from '../../app/datasources/littlesis3'
import { stubDispatch, createMockStore, mountWithStore } from "../../test/testHelpers"
import sinon from 'sinon'

// Unfortunately, it's currently necessary to mock react-redux's useDispatch 
// in order for enzyme to work. We also can't use enzyme's shallow mounting,
// which currently doesn't run the useEffect hook that we're mostly testing here.

describe('<EntitySearch>', function() {
  let wrapper, mockDispatch, response, state, store

  beforeEach(function() {
    mockDispatch = stubDispatch()
    sinon.stub(littlesis3, "findNodes").callsFake(() => response)
    state = {
      graph: { nodes: { "100": { id: "100" } } },
      settings: { automaticallyAddEdges: true }
    }
    store = createMockStore(state)
  })

  afterEach(function() {
    mockDispatch.restore()
    littlesis3.findNodes.restore()
  })

  it('shows loading', function() {
    response = Promise.resolve([])
    wrapper = mountWithStore(store, <EntitySearch query="bob" />)
    expect(wrapper.html().toLowerCase()).to.contain("loading")
  })

  it('shows error', async function() {
    response = Promise.reject("error")

    await act(async () => {
      wrapper = mountWithStore(store, <EntitySearch query="bob" />)
    })
    
    expect(wrapper.html().toLowerCase()).to.contain("error")
  })

  it('shows no results', async function() {
    response = Promise.resolve([])

    await act(async () => {
      wrapper = mountWithStore(store, <EntitySearch query="bob" />)
    })

    expect(wrapper.html().toLowerCase()).to.contain("no results")
  })

  it('shows search results', async function() {
    let data = [{ id: 1, name: "Bob", description: "a person", image: null, url: null }]
    response = Promise.resolve(data)

    await act(async () => {
      wrapper = mountWithStore(store, <EntitySearch query="bob" />)
    })
    
    // for some reason update() is necessary this one test, perhaps because
    // there's a nested component EntitySearchResults that must render?
    wrapper.update()

    let results = wrapper.find(EntitySearchResults)
    expect(results).to.have.lengthOf(1)
    expect(results.prop('results')).to.equal(data)
  })

  it('adds node', async function() {
    let data = [{ id: "1", name: "Bob", description: "a person", image: null, url: null }]
    response = Promise.resolve(data)

    await act(async () => {
      wrapper = mountWithStore(store, <EntitySearch query="bob" />) 
    })

    wrapper.update()

    let link = wrapper.find('.entity-search-result a')

    await act(async () => {
      link.simulate('click')    
    })

    expect(mockDispatch.callCount).to.equal(1)
    expect(mockDispatch.getCall(0).args[0]).to.eql({ type: 'ADD_NODE', node: data[0] })
  })
})