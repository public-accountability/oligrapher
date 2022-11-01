import { useState, useLayoutEffect, useCallback } from "react"
import { useSelector } from "react-redux"
import { getElementById } from "./helpers"
import { currentZoomSelector } from "./selectors"

function calculateScale(zoom: number) {
  const svg = getElementById("oligrapher-svg") as SVGSVGElement
  const scale = (svg.getBoundingClientRect().width / svg.viewBox.baseVal.width) * zoom
  console.log("calculateScale bounding width", svg.getBoundingClientRect().width)
  console.log("calculateScale baseVal", svg.viewBox.baseVal.width)
  console.log("calculateScale", scale)
  return scale
}

export function useScale(svgRef: React.Ref<SVGSVGElement>) {
  const zoom = useSelector(currentZoomSelector)
  const [scale, setScale] = useState(1)

  const calculateAndSetScale = useCallback(() => {
    const svg = svgRef.current
    const scale = (svg.getBoundingClientRect().width / svg.viewBox.baseVal.width) * zoom
    setScale(scale)
  }, [zoom, svgRef])

  return [scale, calculateAndSetScale]
}
