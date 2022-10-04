import React from 'react'
import { useSelector } from 'react-redux'

export default function UserMessage() {
  const message = useSelector(state => state.display.userMessage)
  return message ? <div className="oligrapher-user-message">{message}</div> : null
}
