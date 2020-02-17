import React from 'react'
import HeaderButtons, { ActionMenu } from '../../app/containers/HeaderButtons'

describe("<HeaderButtons", function() {
  it("renders wrapper div", function() {
    expect(shallow(<HeaderButtons />).find('div.oligrapher-header-buttons')).to.have.lengthOf(1)
  })

  it("open actions menu after clicking", function() {
    let headerButtons = shallow(<HeaderButtons />)
    expect(headerButtons.find(ActionMenu)).to.have.lengthOf(0)
    headerButtons.find('span.toggle-action-menu').simulate('click')
    expect(headerButtons.find(ActionMenu)).to.have.lengthOf(1)
  })
})
