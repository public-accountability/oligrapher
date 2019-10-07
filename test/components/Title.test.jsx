import React from 'react'
import Title from '../../app/components/Title'

describe("<Title>", function() {
  let component

  beforeEach(function(){
    component = shallow(<Title title="abc" subtitle="xyz"/>)
  })

  it("renders wrapper div", function(){
    expect(component.find('div#oligrapher-header-title-wrapper').length)
      .to.equal(1)
  })

  it("renders title into h1", function(){
    expect(component.find('h1').html()).to.equal("<h1>abc</h1>")
  })

  it("renders subtitle into h2", function(){
    expect(component.find('h2').html()).to.equal("<h2>xyz</h2>")
  })

})
