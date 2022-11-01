import React from "react"
import { MdPhotoSizeSelectSmall, MdFormatColorFill } from "react-icons/md"

type NodeStyleFormPropTypes = {
  setPage: (page: string) => void
}

export default function NodeStyleForm({ setPage }: NodeStyleFormPropTypes) {
  return (
    <div className="editor-page-buttons">
      <label>Style</label>
      <div>
        <span title="Size" className="entity-size-icon" onClick={() => setPage("size")}>
          <MdPhotoSizeSelectSmall />
        </span>

        <span title="Color" className="entity-color-icon" onClick={() => setPage("color")}>
          <MdFormatColorFill />
        </span>
      </div>
    </div>
  )
}
