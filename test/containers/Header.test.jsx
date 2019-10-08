import React from 'react'
import { Header } from '../../app/containers/Header'
import Attribution from '../../app/components/Attribution'
import Title from '../../app/components/Title'

describe('<Header>', function() {
  let header

  beforeEach(function(){
    header = shallow(<Header
                     title="Example Title"
                     subtitle="Example Subtitle"
                     user={{"name": "Example UserName", "url": "https://example.com"}}
                   />)
  })

  it('has container div', function()  {
    expect(header.find('#oligrapher-header').length).to.equal(1)
  })

  it('has title container', function() {
    expect(header.find(Title).length).to.equal(1)
  })

  it('has attribution container', function(){
    expect(header.find(Attribution).length).to.equal(1)
  })
})
