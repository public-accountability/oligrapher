import React from 'react'

import HeaderMenu from '../../app/components/HeaderMenu'
import HeaderMenuItem from '../../app/components/HeaderMenuItem'

describe("<HeaderMenu>", function() {
  it('has div wrapper', function() {
    expect(shallow(<HeaderMenu />).find('#oligrapher-header-menu-wrapper').length)
      .to.equal(1)
  })

  it('has <ul>', function() {
    expect(shallow(<HeaderMenu />).find('ul').length)
      .to.equal(1)
  })


  it('renders multiple HeaderMenuItems', function(){
    let items = [
      { text: "About", url: "https://example.com/about" },
      { text: "Edit", url: "https://example.com/edit" }
    ]

    let menu = shallow(<HeaderMenu items={items} />)

    expect(menu.find(HeaderMenuItem).length).to.equal(2)

  })

  // it('produces correct html', function() {
  //   let headerMenuItem = shallow(<HeaderMenuItem text="About" url="https://example.com/about" />)
  //   expect(headerMenuItem.html()).to.equal(
  //     "<li><a href=\"https://example.com/about\">About</a></li>"
  //   )
  // })
})
