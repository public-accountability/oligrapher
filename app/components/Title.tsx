import React from 'react'
import { callWithTargetValue } from '../util/helpers'
import noop from 'lodash/noop'

interface TitleProps {
  text: string;
  editable: boolean;
  onChange?(value: string): any;
  url?: string;
}

export default function Title({ text, editable, url, onChange = noop }: TitleProps) {
  let content: React.ReactNode

  if (editable)
    content = <input value={text} onChange={callWithTargetValue(onChange)} placeholder="Title" data-testid="oligrapher-title-input" />
  else if (url) {
    content = <a href={url} target="_blank" rel="noreferrer" title="View this map on LittleSis">{text}</a>
  } else {
    content = text
  }

  return <h1 id="oligrapher-title">{content}</h1>
}
