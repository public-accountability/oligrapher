import React from 'react'
import { FloatingMenus, mapStateToProps } from '../../app/containers/FloatingMenus'

import EditNodeMenu from '../../app/containers/EditNodeMenu'
import EditEdgeMenu from '../../app/containers/EditEdgeMenu'

describe('<FloatingMenus>', function() {

  const floatMenus = (state) => shallow(<FloatingMenus {...mapStateToProps(state)} />)

  it("renders nothing", function() {
    let state = { display: { editor: { tool: null }}}
    expect(floatMenus(state).html()).to.eql('<div style="width:0;overflow:hidden" id="caption-text-input"></div>')
  })

  it("shows edit node menu", function() {
    let state = { display: { editor: { tool: 'node', editNode: 'abc' } } }
    expect(floatMenus(state).find(EditNodeMenu)).to.have.lengthOf(1)
    expect(floatMenus(state).find(EditEdgeMenu)).to.have.lengthOf(0)
  })

  it("shows edit edge menu", function() {
    let state = { display: { editor: { tool: 'edge', editEdge: 'abc' } } }
    expect(floatMenus(state).find(EditNodeMenu)).to.have.lengthOf(0)
    expect(floatMenus(state).find(EditEdgeMenu)).to.have.lengthOf(1)
  })
})
