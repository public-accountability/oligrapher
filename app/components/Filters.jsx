import React from 'react'

export default function Filters() {
  return (
    <defs>
      <filter id="blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" />
      </filter>
    </defs>    
  )
}
