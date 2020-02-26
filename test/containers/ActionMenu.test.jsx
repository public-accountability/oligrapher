import React from 'react'
import * as ReactRedux from 'react-redux'
import ActionMenu from '../../app/containers/ActionMenu'

describe("<ActionMenu>", function() {
  let dispatchSpy, actionMenu

  beforeEach(function() {
    dispatchSpy = sinon.spy()
    sinon.stub(ReactRedux, 'useDispatch').returns(dispatchSpy)
    actionMenu = shallow(<ActionMenu />)
  })

  afterEach(function() {
    ReactRedux.useDispatch.restore()
  })

  it("clicking on present changes editor mode to false", function() {
    actionMenu.find('li').at(0).simulate('click')
    expect(dispatchSpy.calledOnce).to.be.true
    expect(dispatchSpy.getCall(0).firstArg).to.eql(
      {type: 'SET_MODE', mode: 'editor', enabled: false}
    )
  })
})
