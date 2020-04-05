import React from 'react'
import NodeTool from '../../app/components/tools/Node'
import Toolbox from "../../app/components/tools/Toolbox"
import EntitySearch from "../../app/components/tools/EntitySearch"
import { stubDispatch } from "../../test/testHelpers"

describe('<NodeTool>', function() {
  let wrapper, mockDispatch, restoreDispatch

  beforeEach(function() {
    [mockDispatch, restoreDispatch] = stubDispatch()
    wrapper = shallow(<NodeTool />)
  })

  afterEach(function() {
    restoreDispatch()
  })

  it('renders toolbox with title', function() {
    let toolbox = wrapper.find(Toolbox)
    expect(toolbox).to.have.lengthOf(1)
    expect(toolbox.prop('title')).to.equal("Add Node")
  })

  it('renders input', function() {
    let input = wrapper.find('input')
    expect(input).to.have.lengthOf(1)
    expect(input.prop('placeholder')).to.equal('Search database')
  })

  it('renders create entity link when query is entered', function() {
    wrapper.find('input').simulate('change', { target: { value: "bob" } })
    let button = wrapper.find('button')
    expect(button).to.have.lengthOf(1)
    expect(button.text()).to.contain("Create")
  })

  it('renders EntitySearch only when query is more than two characters', function() {
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "b" } })
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "bo" } })
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "bob" } })
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(1)
    expect(wrapper.find(EntitySearch).prop('query')).to.equal("bob")
  })

  it('dispatches ADD_NODE when create entity link is clicked', function() {
    wrapper.find('input').simulate('change', { target: { value: "bob" } })
    let button = wrapper.find('button')
    button.simulate('click')
    let dispatchArgs = mockDispatch.getCall(0).args[0]
    expect(dispatchArgs.type).to.equal('ADD_NODE')
    expect(dispatchArgs.attributes.name).to.equal("bob")
  })
})
