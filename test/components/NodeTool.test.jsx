import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

import NodeTool from '../../app/components/NodeTool'
import Toolbox from "../../app/components/Toolbox"
import EntitySearch from "../../app/components/EntitySearch"
import { stubDispatch } from "../../test/testHelpers"

// Currently we have to mock react-redux's useDispatch hook
// in order to use enzyme.

describe('<NodeTool>', function() {
  let wrapper, mockDispatch

  beforeEach(function() {
    mockDispatch = stubDispatch()
    wrapper = shallow(<NodeTool />)
  })

  afterEach(function() {
    mockDispatch.restore()
  })

  it('renders Toolbox with title', function() {
    let toolbox = wrapper.find(Toolbox)
    expect(toolbox).to.have.lengthOf(1)
    expect(toolbox.prop('title')).to.equal("Add Node")
  })

  it('renders input', function() {
    let input = wrapper.find('input')
    expect(input).to.have.lengthOf(1)
    expect(input.prop('placeholder')).to.not.be.empty
  })

  it('renders create link and EntitySearch only when query is more than two characters', function() {
    expect(wrapper.find('a')).to.have.lengthOf(0)
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "b" } })
    expect(wrapper.find('a')).to.have.lengthOf(0)
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "bo" } })
    expect(wrapper.find('a')).to.have.lengthOf(0)
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(0)
    wrapper.find('input').simulate('change', { target: { value: "bob" } })
    expect(wrapper.find('a')).to.have.lengthOf(1)
    expect(wrapper.find(EntitySearch)).to.have.lengthOf(1)
    expect(wrapper.find(EntitySearch).prop('query')).to.equal("bob")
  })

  it('dispatches ADD_NODE when create entity link is clicked', function() {
    wrapper.find('input').simulate('change', { target: { value: "bob" } })
    let link = wrapper.find('a')
    link.simulate('click')
    let dispatchArgs = mockDispatch.getCall(0).args[0]
    expect(dispatchArgs.type).to.equal('ADD_NODE')
  })
})
