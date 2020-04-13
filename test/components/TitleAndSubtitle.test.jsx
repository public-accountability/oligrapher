import React from 'react'
import Title from '../../app/components/Title'
import Subtitle from '../../app/components/Subtitle'

describe("<Title>", function() {
  let component

  beforeEach(function(){
    component = shallow(<Title text="abc" editable={false} />)
  })

  it("renders wrapper div", function(){
    expect(component.find('div#oligrapher-header-title-wrapper').length)
      .to.equal(1)
  })

  it("renders title into h1", function(){
    expect(component.find('h1').html()).to.equal("<h1>abc</h1>")
  })

})

describe('<Subtitle>', function() {
  it("renders subtitle into h2", function(){
    let component = shallow(<Subtitle text="xyz" editable={false} />)
    expect(component.find('h2').html()).to.equal("<h2>xyz</h2>")
  })
})
