import React from "react"
import { classNames } from "../util/helpers"

const SIZES = [1, 1.5, 2, 3]
const pixelMultiplier = 15

function Circle({ currentScale, scaleChoice, onChange }: CircleSizePickerProps) {
  const pixelSize = (pixelMultiplier * scaleChoice).toString() + "px"
  const wrapperStyle = { width: pixelSize }
  const circleStyle = { width: pixelSize, height: pixelSize }
  const onClick = () => onChange(scaleChoice)
  const text = scaleChoice.toString() + "x"
  const circleClass = classNames("circle", scaleChoice === currentScale ? "current" : undefined)

  return (
    <div key={text}>
      <div style={wrapperStyle} className="circle-wrapper">
        <div onClick={onClick} style={circleStyle} className={circleClass}></div>
      </div>
      <div className="text">{text}</div>
    </div>
  )
}

export default function SizePicker({ scale, onChange }: SizePickerProps) {
  return (
    <div className="sizepicker">
      {SIZES.map(size => Circle({ currentScale: scale, scaleChoice: size, onChange }))}
    </div>
  )
}

interface SizePickerProps {
  scale: number
  onChange: (scale: number) => void
}

interface CircleSizePickerProps {
  currentScale: number
  scaleChoice: number
  onChange: (scale: number) => void
}
