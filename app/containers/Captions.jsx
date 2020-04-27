import React from 'react'
import { useSelector } from 'react-redux'

import Caption from './Caption'
import FloatingMenu from '../util/floatingMenu'

export default function Captions() {
  const captions = useSelector(state => state.graph.captions)
  const editedCaptionId = useSelector(state => FloatingMenu.getId(state, 'caption'))

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