import React from 'react'
import sinon from 'sinon'

import HeaderMenuItem from '../../app/components/HeaderMenuItem'

describe("<HeaderMenuItem>", function() {
  it('returns url', function() {
    let component = shallow(<HeaderMenuItem text="About" url="https://example.com/about" />)
    expect(component.find('li')).to.have.lengthOf(1)
    expect(component.find('a').prop('href')).to.eq("https://example.com/about")
  })

  it('sets onClick if action passed', function() {
    let spy = sinon.spy()
    let component = shallow(<HeaderMenuItem text="Edit" action={spy} />)

    expect(component.find('li')).to.have.lengthOf(1)
    expect(component.find('a').prop('href')).to.eq("#")
    component.find('a').simulate('click')
    expect(spy.calledOnce).to.be.ok

  })
})
