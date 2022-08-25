import React, { useState, useCallback, useRef } from 'react'
import PropTypes from 'prop-types'
import { useSelector } from 'react-redux'
import { Popover } from '@mui/material'

import { callWithTargetValue } from '../util/helpers'

export default function EmbedForm({ open, anchor, close, }) {
  const baseUrl = useSelector(state => state.settings.url)
  const embeddedUrl = baseUrl + '/embedded'
  const [width, setWidth] = useState(700)
  const [height, setHeight] = useState(600)

  const onWidthChange = callWithTargetValue(setWidth)
  const onHeightChange = callWithTargetValue(setHeight)

  const textareaRef = useRef()
  const selectAll = useCallback(() => textareaRef.current.select(), [])

  const code = `<iframe height="${height}" width="${width}" scrolling="no" style="border: 0px; overflow: hidden;" src="${embeddedUrl}"></iframe>`

  return (
    <Popover
      open={open}
      anchorEl={anchor}
      onClose={close}
      anchorOrigin={{
        vertical: 40,
        horizontal: 'left',
      }}
      transitionDuration={0}
    >
      <div id="oligrapher-embed-form">
        <div>
          Width: <input type="text" value={width} onChange={onWidthChange} />
          &nbsp;&nbsp;
          Height: <input type="text" value={height} onChange={onHeightChange} />
        </div>

        <textarea ref={textareaRef} onClick={selectAll} value={code} readOnly={true}></textarea>
      </div>
    </Popover>
  )
}

EmbedForm.propTypes = {
  open: PropTypes.bool.isRequired,
  anchor: PropTypes.object,
  close: PropTypes.func.isRequired
}
