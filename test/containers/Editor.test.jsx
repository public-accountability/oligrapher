import React from 'react'
import { Editor } from '../../app/containers/Editor'


describe.only('<Editor>', function() {
  it("renders nothing if the editor is disabled", function() {
    expect(shallow(<Editor disabled={true} />).html()).eql('')
  })
})
