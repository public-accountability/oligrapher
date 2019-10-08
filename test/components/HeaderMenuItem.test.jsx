import React from 'react'
import HeaderMenuItem from '../../app/components/HeaderMenuItem'

describe("<HeaderMenuItem>", function() {
  it('produces correct html', function() {
    let headerMenuItem = shallow(<HeaderMenuItem text="About" url="https://example.com/about" />)
    expect(headerMenuItem.html()).to.equal(
      "<li><a href=\"https://example.com/about\">About</a></li>"
    )
  })
})
