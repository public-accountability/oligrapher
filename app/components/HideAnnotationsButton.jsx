import React, { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'

export default function HideAnnotationsButton() {
  const dispatch = useDispatch()
  const hide = useCallback(() => dispatch({ type: 'TOGGLE_ANNOTATIONS' }), [dispatch])

  return (
    <div className="oligrapher-annotations-hide" onClick={hide} title="Hide annotations">
      <MdClose />
    </div>
  )
}
