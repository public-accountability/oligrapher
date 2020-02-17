import React from 'react'
import { HeaderRight } from '../../app/containers/HeaderRight'
import HeaderMenu from '../../app/components/HeaderMenu'
import HeaderButtons from '../../app/containers/HeaderButtons'

describe('<HeaderRight>', function() {
  it("shows HeaderMenu when not in editor mode", function() {
    let spy = sinon.spy()
    let component = shallow(<HeaderRight editorMode={false} enableEditorMode={spy} />)

    expect(component.find(HeaderMenu)).to.have.lengthOf(1)
    expect(component.find(HeaderButtons)).to.have.lengthOf(0)

  })

  it("shows HeaderButtons in editor mode", function() {
    let spy = sinon.spy()
    let component = shallow(<HeaderRight editorMode={true} enableEditorMode={spy} />)

    expect(component.find(HeaderMenu)).to.have.lengthOf(0)
    expect(component.find(HeaderButtons)).to.have.lengthOf(1)
  })
})
