import React from 'react'
import EntitySearch from '../../app/components/tools/EntitySearch'
import EntitySearchResults from '../../app/components/tools/EntitySearchResults'
import * as littlesis3 from '../../app/datasources/littlesis3'
import { stubDispatch } from "../../test/testHelpers"
import waitUntil from 'async-wait-until'
import sinon from 'sinon'

describe('<EntitySearch>', function() {
  let wrapper, mockDispatch, restoreDispatch

  beforeEach(function () {
    [mockDispatch, restoreDispatch] = stubDispatch()
  })

  afterEach(function () {
    restoreDispatch()
  })

  it('shows loading', function() {
    let mockFindNodes = () => {
      return new Promise((resolve, reject) => setTimeout(() => resolve([]), 10))
    }
    sinon.stub(littlesis3, "findNodes").callsFake(mockFindNodes)
    wrapper = mount(<EntitySearch query="bob" />)
    expect(wrapper.html().toLowerCase()).to.contain("loading")
    littlesis3.findNodes.restore()
  })

  it('shows error', async function() {
    let mockFindNodes = () => {
      return new Promise((resolve, reject) => setTimeout(() => reject("error"), 10))
    }
    sinon.stub(littlesis3, "findNodes").callsFake(mockFindNodes)
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    expect(wrapper.html().toLowerCase()).to.contain("error")
    littlesis3.findNodes.restore()
  })

  it('shows no results', async function() {
    let data = []
    let mockFindNodes = () => {
      return new Promise((resolve, reject) => setTimeout(() => resolve(data), 10))
    }
    sinon.stub(littlesis3, "findNodes").callsFake(mockFindNodes)
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    expect(wrapper.html().toLowerCase()).to.contain("no results")
    littlesis3.findNodes.restore()    
  })

  it('shows search results', async function() {
    let data = [{ id: 1, name: "Bob", description: "a person", image: null, url: null }]
    let mockFindNodes = () => {
      return new Promise((resolve, reject) => setTimeout(() => resolve(data), 10))
    }
    sinon.stub(littlesis3, "findNodes").callsFake(mockFindNodes)
    wrapper = mount(<EntitySearch query="bob" />)
    
    await waitUntil(() => {
      wrapper.update()
      return !wrapper.html().includes("loading")
    })

    let results = wrapper.find(EntitySearchResults)
    expect(results).to.have.lengthOf(1)
    expect(results.prop('results')).to.equal(data)
    littlesis3.findNodes.restore()
  })
})