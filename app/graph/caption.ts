import merge from "lodash/merge"
import { nanoid } from "nanoid/non-secure"
import { svgCoordinatesFromMouseEvent } from "../util/dimensions"

type FontChoice = "Arial" | "Monospace" | "Times New Roman"

export interface CaptionAttributes {
  id?: string
  text?: string
  x?: number
  y?: number
  width?: number
  height?: number
  font?: FontChoice
  size?: string
  weight?: string
}

export interface Caption extends CaptionAttributes {
  id: string
  text: string
  x: number
  y: number
  width: number
  height: number
  font: FontChoice
  size: string
  weight: string
}

export const captionDefaults: CaptionAttributes = {
  width: 300,
  height: 200,
  font: "Arial",
  size: "12",
  weight: "400",
}

export function newCaption(attributes: CaptionAttributes = {}): Caption {
  const caption = merge({ id: nanoid(10), text: "New Caption" }, captionDefaults, attributes)
  return caption as Caption
}

/// Event => Caption
export function fromEvent(event: MouseEvent): Caption {
  return newCaption({
    text: "New Caption",
    ...svgCoordinatesFromMouseEvent(event),
  })
}

export default {
  new: newCaption,
  fromEvent: fromEvent,
}
