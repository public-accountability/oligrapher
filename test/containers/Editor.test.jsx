import React from 'react'
import { Editor } from '../../app/containers/Editor'
import EditorMenu from '../../app/containers/EditorMenu'

describe('<Editor>', function() {
  it("renders nothing if the editor is disabled", function() {
    expect(shallow(<Editor disabled={true} />).html()).eql('')
  })

  it("renders editor menu", function() {
    let editor = shallow(<Editor disabled={false} />)
    expect(editor.find(EditorMenu)).to.have.lengthOf(1)
  })
})
