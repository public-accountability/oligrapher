import React from 'react'
import EditorMenu from '../../app/containers/EditorMenu'
import EditorMenuItem from '../../app/components/editor/EditorMenuItem'

/*
  Layout:

  ()      Add Node
  Aa      Text Box
  ()      Legend
  [ ]     Story editor
  ---------------------------
  (/)     Style Nodes
  ·()·    Organize Map
   🗑     Delete
  ---------------------------
  ☸     Settings
  ⍰      Help

*/

describe('<EditorMenu>', function() {
  it('renders 5 menu items', function() {
    let editorMenu = shallow(<EditorMenu />)
    expect(editorMenu.find(EditorMenuItem)).to.have.lengthOf(5)
  })
})
