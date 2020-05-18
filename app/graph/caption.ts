import PropTypes from 'prop-types'
import merge from 'lodash/merge'
import { generate } from 'shortid'

import { svgCoordinatesFromMouseEvent } from '../util/dimensions'

export interface CaptionAttributes {
  id?: string,
  text?: string,
  x?: number,
  y?: number,
  width?: number,
  height?: number,
  font?: string,
  size?: string
  weight?: string
}

export interface Caption extends CaptionAttributes {
  id: string,
  text: string,
  x: number,
  y: number,
  width: number,
  height: number,
  font: string,
  size: string,
  weight: string
}

export interface CaptionDefaults extends CaptionAttributes {
  width: number,
  height: number,
  font: string,
  size: string,
  weight: string
}

export const captionDefaults: CaptionDefaults = {
  width: 300,
  height: 200,
  font: 'Arial',
  size: '20',
  weight: '400'
}

export const captionShape = {
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired
}

export function newCaption(attributes: CaptionAttributes = {}): Caption {
  let caption = merge({ id: generate(), text: "New Caption" }, captionDefaults, attributes)

  return caption as Caption
}

/// Event => Caption
export function fromEvent(event: MouseEvent): Caption {
  return newCaption({
    text: "New Caption",
    ...svgCoordinatesFromMouseEvent(event)
  })
}

export default {
  "new": newCaption,
  "fromEvent": fromEvent
}
