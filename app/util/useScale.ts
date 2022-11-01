import { useState, useCallback } from "react"
import { useSelector } from "react-redux"
import { currentZoomSelector } from "./selectors"

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
