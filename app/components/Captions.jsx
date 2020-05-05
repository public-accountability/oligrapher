import React from 'react'

import { useSelector } from '../util/helpers'
import Caption from './Caption'
import FloatingEditor from '../util/floatingEditor'

export default function Captions() {
  const captions = useSelector(state => state.graph.captions)
  const editedCaptionId = useSelector(state => FloatingEditor.getId(state.display, 'caption'))

  return (
    <g className="captions">
      { Object.keys(captions).map(id => (
        <Caption 
          key={id} 
          caption={captions[id]} 
          currentlyEdited={id === editedCaptionId} />
      )) }
    </g>
  )
}