import React from 'react'

export default function ConditionalLink({ children, condition, ...linkProps }: ConditionalLinkProps) {
  return (
    <>
      { condition && <a {...linkProps}>{children}</a> }
      { condition || children }
    </>
  )
}

interface ConditionalLinkProps {
  children: any,
  condition: boolean,
  [key: string]: any
}