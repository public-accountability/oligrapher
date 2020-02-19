import React from 'react'

import EditNodeMenu from '../../app/containers/EditNodeMenu'
import EditEdgeMenu from '../../app/containers/EditEdgeMenu'
import FloatingMenus from '../../app/containers/FloatingMenus'

describe('<FloatingMenus>', function() {
  let store, useSelectorStub

  beforeEach(function() {
    store = createMockStore()
    // useSelectorStub = sinon.stub(React, "useSelector") // not working/
  })

  // afterEach(function(){
  //   useSelectorStub.restore()
  // })

  it("renders caption-text-input div", function() {
    expect(
      mountWithStore(store, <FloatingMenus />).find('div#caption-text-input').exists()
    ).to.be.ok
  })

  xit("shows edit node menu", function() {
    let floatingMenus = shallowMountWithStore(store, <FloatingMenus />)
    expect(floatingMenus.find(EditNodeMenu)).to.have.lengthOf(1)
  })

  xit("shows edit edge menu", function() {
    expect(floatMenus(state).find(EditNodeMenu)).to.have.lengthOf(0)
    expect(floatMenus(state).find(EditEdgeMenu)).to.have.lengthOf(1)
  })
})
