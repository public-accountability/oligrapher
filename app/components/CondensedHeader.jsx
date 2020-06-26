import React from 'react'
import { useDispatch } from 'react-redux'

import { useSelector, useClientRect } from '../util/helpers'
import Title from './Title'

export default function CondendsedHeader() {
  const dispatch = useDispatch()
  const { title } = useSelector(state => state.attributes)
  const { embed, url } = useSelector(state => state.settings)

  const ref = useClientRect(rect => {
    if (rect) {
      dispatch({ type: 'SET_SVG_TOP', svgTop: rect.bottom })
    }
  })

  return (
    <div id="oligrapher-header-condensed" ref={ref}>
      <Title text={title} editable={false} url={embed && url} />
    </div>
  )
}