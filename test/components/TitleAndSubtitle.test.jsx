import React from 'react'
import { expect } from 'chai'
import { shallow } from 'enzyme'

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
