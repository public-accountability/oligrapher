import React from "react"
import { SketchPicker } from "@hello-pangea/color-picker"
import uniq from "lodash/uniq"
import { useSelector } from "react-redux"

const DEFAULT_COLOR = "#CCC"

const COLOR_OPTIONS = [
  "#D0021B",
  "#F5A623",
  "#F8E71C",
  "#8B572A",
  "#7ED321",
  "#417505",
  "#BD10E0",
  "#9013FE",
  "#4A90E2",
  "#50E3C2",
  "#B8E986",
  "#000000",
  "#4A4A4A",
  "#9B9B9B",
]

type NodeEditorColorPropTypes = {
  color: string
  onChange: (hex: string) => void
  colors: string[] | undefined
}

export default function NodeEditorColor(props: NodeEditorColorPropTypes) {
  const colors = useSelector(state => Object.values(state.graph.nodes).map(node => node.color))

  const options: string[] = uniq(
    [DEFAULT_COLOR]
      .concat(props.colors || [])
      .concat(COLOR_OPTIONS)
      .map(color => color.toLowerCase())
  ).slice(0, 16)

  const onChangeComplete = color => props.onChange(color.hex)

  return (
    <SketchPicker color={props.color} presetColors={options} onChangeComplete={onChangeComplete} />
  )
}
