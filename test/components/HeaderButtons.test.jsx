import React from 'react'
import noop from 'lodash/noop'
import HeaderButtons from '../../app/components/HeaderButtons'

describe("<HeaderButtons", function() {
  it("renders two buttons and a wrapper div", function() {
    let component = shallow(<HeaderButtons saveAction={noop} discardAction={noop} />)
    expect(component.find('button')).to.have.lengthOf(2)
    expect(component.find('div.oligrapher-header-buttons-wrapper')).to.have.lengthOf(1)
  })
})
