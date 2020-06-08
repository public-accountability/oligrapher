import React from 'react'

import { useSelector } from '../util/helpers'
import Caption from './Caption'
import FloatingEditor from '../util/floatingEditor'

export default function Captions() {
  const captions = useSelector(state => state.graph.captions)
  const editedCaptionId = useSelector(state => FloatingEditor.getId(state.display, 'caption'))
  const highlightedCaptionIds = useSelector(state => {
    const { list, currentIndex } = state.annotations
    return list[currentIndex]?.captionIds || []
  })

  return (
    <g className="captions">
      { Object.entries(captions).map(([id, caption]) => (
        <Caption 
          key={id} 
          caption={caption} 
          currentlyEdited={id === editedCaptionId} 
          highlighted={highlightedCaptionIds.includes(id)} />
      )) }
    </g>
  )
}