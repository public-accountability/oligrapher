import React from 'react'
import Attribution from '../../app/components/Attribution'

describe("<Attribution>", function(){
  it("has wrapper div", function(){
    expect(
      shallow(<Attribution />)
        .find('div#oligrapher-header-attribution-wrapper')
        .length
    ).to.equal(1)
  })

  it("renders user with link", function(){
    let user = { "name": "TestName", "url": "https://example.com/TestName" }
    let component = shallow(<Attribution user={user} />)

    expect(component.find('#oligrapher-header-attribution-user').text()).to.equal("by TestName")
    expect(component.find('a').prop('href')).to.equal(user.url)
  })

  it("renders user without link", function(){
    let component = shallow(<Attribution user={{"name": "TestName"}} />)
    expect(component.find('a').length).to.equal(0)
  })

  it("skips byline when missing username", function() {
    let component = shallow(<Attribution />)
    expect(component.find('#oligrapher-header-attribution-user').length)
      .to.equal(0)
  })

  it("renders date", function(){
    let component = shallow(<Attribution date="Test Date"/>)
    expect(component.find('#oligrapher-header-attribution-date').text())
      .to.equal("Test Date")
  })
})
