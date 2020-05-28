import React from 'react'
import PropTypes from 'prop-types'
import { MdPhotoSizeSelectSmall, MdFormatColorFill } from "react-icons/md"

export default function NodeStyleForm({ setPage }) {
  return (
    <div className="editor-page-buttons">
      <label>Style</label>
      <div>
        <span title="Size" className="entity-size-icon" onClick={() => setPage('size')}>
          <MdPhotoSizeSelectSmall />
        </span>

        <span title="Color" className="entity-color-icon" onClick={() => setPage('color')}>
          <MdFormatColorFill />
        </span>
      </div>
    </div>
  )
}

NodeStyleForm.propTypes = {
  setPage: PropTypes.func.isRequired
}