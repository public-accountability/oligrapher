import React from 'react'
import { act } from "react-dom/test-utils"
import EntitySearch from '../../app/components/tools/EntitySearch'
import EntitySearchResults from '../../app/components/tools/EntitySearchResults'
import * as littlesis3 from '../../app/datasources/littlesis3'
import { stubDispatch } from "../../test/testHelpers"
import sinon from 'sinon'

// Unfortunately, it's currently necessary to mock react-redux's useDispatch 
// in order for enzyme to work. We also can't use enzyme's shallow mounting,
// which currently doesn't run the useEffect hook that we're mostly testing here.

describe('<EntitySearch>', function() {
  let wrapper, mockDispatch, response

  beforeEach(function() {
    mockDispatch = stubDispatch()
    sinon.stub(littlesis3, "findNodes").callsFake(() => response)
  })

  afterEach(function() {
    mockDispatch.restore()
    littlesis3.findNodes.restore()
  })

  it('shows loading', function() {
    response = Promise.resolve([])
    wrapper = mount(<EntitySearch query="bob" />)
    expect(wrapper.html().toLowerCase()).to.contain("loading")
  })

  it('shows error', async function() {
    response = Promise.reject("error")

    await act(async () => {
      wrapper = mount(<EntitySearch query="bob" />)
    })
    
    expect(wrapper.html().toLowerCase()).to.contain("error")
  })

  it('shows no results', async function() {
    response = Promise.resolve([])

    await act(async () => {
      wrapper = mount(<EntitySearch query="bob" />)
    })

    expect(wrapper.html().toLowerCase()).to.contain("no results")
  })

  it('shows search results', async function() {
    let data = [{ id: 1, name: "Bob", description: "a person", image: null, url: null }]
    response = Promise.resolve(data)

    await act(async () => {
      wrapper = mount(<EntitySearch query="bob" />)
    })
    
    // for some reason update() is necessary this one test, perhaps because
    // there's a nested component EntitySearchResults that must render?
    wrapper.update()

    let results = wrapper.find(EntitySearchResults)
    expect(results).to.have.lengthOf(1)
    expect(results.prop('results')).to.equal(data)
  })
})