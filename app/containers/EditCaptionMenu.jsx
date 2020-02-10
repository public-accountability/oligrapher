import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import toString from 'lodash/toString'
import range from 'lodash/range'

import EditMenu from '../components/editor/EditMenu'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'

const FONT_FAMILY_OPTIONS = [
  { value: 'Arial', label: 'Arial' },
  { value: 'Monospace', label: 'Monospace'},
  { value: 'Times New Roman', label: 'Times New Roman' }
 ]

const FONT_WEIGHT_OPTIONS = [
  { value: '400', label: 'Normal'},
  { value: '700', label: 'Bold' },
  { value: '200', label: 'Light'}
]

const FONT_SIZE_OPTIONS = range(8, 31, 2).map(toString).map(i => ({ value: i, label: i }))

function FontFamilyPicker(props) {
  const onChange = v => console.log('on change', v)
  return <Select options={FONT_FAMILY_OPTIONS} onChange={onChange}/>
}

function FontWeightPicker(props) {
  return <Select options={FONT_WEIGHT_OPTIONS} />
}

function FontSizePicker() {
  return <Select options={FONT_SIZE_OPTIONS} />
}

export function EditCaptionMenu(props) {
  const handleSubmit = () => console.log('updating caption attributes...')
  const handleDelete = () => props.deleteCaption()

  return <EditMenu tool="caption">
           <main>
             <label>Font</label>
             <FontFamilyPicker />
             <FontWeightPicker />
             <FontSizePicker />
           </main>

           <footer>
             <EditMenuSubmitButtons handleSubmit={handleSubmit}
                                    handleDelete={handleDelete}
                                    page="main"/>
           </footer>
         </EditMenu>
}

EditCaptionMenu.propTypes = {
  id: PropTypes.string.isRequired,
  deleteCaption: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const captionId = state.display.editor.editCaption

  return {
    id: captionId
  }
}

const mapDispatchToProps = dispatch => ({
  deleteCaption: () => dispatch({ type: "DELETE_CAPTION" })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditCaptionMenu)
