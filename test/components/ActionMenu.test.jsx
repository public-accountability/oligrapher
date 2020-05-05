import React from 'react'
import sinon from 'sinon'

import ActionMenu from '../../app/components/ActionMenu'
import { stubDispatch } from "../testHelpers"

describe("<ActionMenu>", function() {
  let dispatchSpy, actionMenu, toggleSpy

  beforeEach(function() {
    dispatchSpy = stubDispatch()
    toggleSpy = sinon.spy()
    actionMenu = shallow(<ActionMenu toggleActionMenu={toggleSpy} />)
  })

  afterEach(function() {
    dispatchSpy.restore()
  })

  it("clicking on present changes editor mode to false", function() {
    actionMenu.find('li').at(0).simulate('click')
    expect(dispatchSpy.calledOnce).to.be.true
    expect(dispatchSpy.getCall(0).firstArg).to.eql(
      { type: 'SET_MODE', mode: 'editor', enabled: false }
    )
  })

  it("opens editor menu and disappears", function() {
    actionMenu.find('li').at(1).simulate('click')
    expect(dispatchSpy.calledOnce).to.be.true
    expect(dispatchSpy.getCall(0).firstArg).to.eql(
      { type: 'OPEN_TOOL', item: 'editors' }
    )
    expect(toggleSpy.calledOnce).to.be.true
  })
})
