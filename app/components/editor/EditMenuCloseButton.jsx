import React from 'react'
import { useDispatch } from 'react-redux'
import { MdClose } from 'react-icons/md'

export default function EditMenuCloseButton() {
  const dispatch = useDispatch()

  return (
    <button onClick={() => dispatch({ type: 'CLOSE_EDIT_MENU' })}>
      <MdClose />
    </button>
  )
}
