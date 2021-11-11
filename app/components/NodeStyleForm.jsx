import React from 'react'
import PropTypes from 'prop-types'
import { MdPhotoSizeSelectSmall } from "@react-icons/all-files/md/MdPhotoSizeSelectSmall"
import { MdFormatColorFill } from "@react-icons/all-files/md/MdFormatColorFill"

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
