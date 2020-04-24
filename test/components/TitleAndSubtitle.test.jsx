import React from 'react'
import Title from '../../app/components/Title'
import Subtitle from '../../app/components/Subtitle'

describe("<Title>", function() {
  let component

  beforeEach(function(){
    component = shallow(<Title text="abc" editable={false} />)
  })

  it("renders title into h1", function(){
    expect(component.find('h1').text()).to.equal('abc')
  })

})

describe('<Subtitle>', function() {
  it("renders subtitle into h2", function(){
    let component = shallow(<Subtitle text="xyz" editable={false} />)
    expect(component.find('h2').text()).to.equal('xyz')
  })
})
