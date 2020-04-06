import React from 'react'
import EntitySearch from '../../app/components/tools/EntitySearch'
import EntitySearchResults from '../../app/components/tools/EntitySearchResults'
import * as littlesis3 from '../../app/datasources/littlesis3'
import { stubDispatch } from "../../test/testHelpers"
import waitUntil from 'async-wait-until'
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
    response = new Promise((resolve, reject) => setTimeout(() => resolve([]), 10))
    wrapper = mount(<EntitySearch query="bob" />)
    expect(wrapper.html().toLowerCase()).to.contain("loading")
  })

  it('shows error', async function() {
    response = new Promise((resolve, reject) => setTimeout(() => reject("error"), 10))
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    expect(wrapper.html().toLowerCase()).to.contain("error")
  })

  it('shows no results', async function() {
    let data = []
    response = new Promise((resolve, reject) => setTimeout(() => resolve(data), 10))
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    expect(wrapper.html().toLowerCase()).to.contain("no results")
  })

  it('shows search results', async function() {
    let data = [{ id: 1, name: "Bob", description: "a person", image: null, url: null }]
    response = new Promise((resolve, reject) => setTimeout(() => resolve(data), 10))
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    let results = wrapper.find(EntitySearchResults)
    expect(results).to.have.lengthOf(1)
    expect(results.prop('results')).to.equal(data)
  })
})