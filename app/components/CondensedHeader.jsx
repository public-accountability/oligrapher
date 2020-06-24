import React from 'react'

import { useSelector } from '../util/helpers'
import Title from './Title'

export default function CondendsedHeader() {
  const { title } = useSelector(state => state.attributes)

  return (
    <div id="oligrapher-header-condensed">
      <Title text={title} editable={false} />
    </div>
  )
}