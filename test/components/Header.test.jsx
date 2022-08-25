import React from 'react'
import { ThemeProvider } from '@mui/material/styles'

import Header from '../../app/components/Header'
import Attribution from '../../app/components/Attribution'
import Title from '../../app/components/Title'
import HeaderRight from '../../app/components/HeaderRight'
import { createMockStore, mountWithStore } from '../testHelpers'
import { muiTheme } from '../../app/util/helpers'

import { expect } from 'chai'

describe('<Header>', function() {
  let header, store

  beforeEach(function(){
    store = createMockStore({
      attributes: {
        title: "Example Title",
        subtitle: "Example Subtitle",
        user: { id: "1", "name": "Bob", "url": "https://example.com" },
        owner: { id: "1", "name": "Bob", "url": "https://example.com" }
      },
      display: { modes: { editor: true } }
    })

    header = mountWithStore(store,
      <ThemeProvider theme={muiTheme}>
        <Header />
      </ThemeProvider>
    )
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

  it('has HeaderRight', function(){
    expect(header.find(HeaderRight).length).to.equal(1)
  })

  it('has left/right wrappers', function() {
    expect(header.find('#oligrapher-header-left-wrapper').length).to.equal(1)
    expect(header.find('#oligrapher-header-right-wrapper').length).to.equal(1)
  })
})
