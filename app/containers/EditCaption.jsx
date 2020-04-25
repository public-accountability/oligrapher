import React from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import Select from 'react-select'
import toString from 'lodash/toString'
import range from 'lodash/range'

import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import EditCaptionTextarea from './EditCaptionTextarea'

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

export function EditCaption({ caption, updateCaption, deleteCaption }) {
  return (
    <>
      <div>
        <main>
          <label>Font</label>
          <Select options={FONT_FAMILY_OPTIONS} />
          <Select options={FONT_WEIGHT_OPTIONS} />
          <Select options={FONT_SIZE_OPTIONS} />
        </main>

        <footer>
          <EditMenuSubmitButtons 
            hideSubmitButton={true}
            handleDelete={deleteCaption}
            page="main" />
        </footer>
      </div>

      {/* { ReactDOM.createPortal(
          <EditCaptionTextarea caption={caption} updateCaption={updateCaption} />,
          document.getElementById('oligrapher-graph-container')
      )} */}
    </>
  )
}

EditCaption.propTypes = {
  id: PropTypes.string.isRequired,
  caption: PropTypes.object.isRequired,
  deleteCaption: PropTypes.func.isRequired,
  updateCaption: PropTypes.func.isrequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    caption: state.graph.captions[ownProps.id]
  }
}

const mapDispatchToProps = (dispatch, ownProps) => {
  return {
    deleteCaption: () => dispatch({ type: 'DELETE_CAPTION', id: ownProps.id }),
    updateCaption: (attributes) => dispatch({ type: 'UPDATE_CAPTION', id: ownProps.id, attributes })
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditCaption)
