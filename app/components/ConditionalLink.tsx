import React from 'react'

type ConditionalLinkProps = {
  children: React.ReactNode,
  condition: boolean,
  url?: string
}

export default function ConditionalLink({ children, condition, url }: ConditionalLinkProps) {
  if (condition && url) {
    return <a target="_blank" rel="noopener noreferrer" href={url}>{children}</a>
  } else {
    return <>{children}</>
  }
}
