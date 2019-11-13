import values from 'lodash/values'
import min from 'lodash/min'
import max from 'lodash/max'
/*
  |------ User Svg ---
  |  aspectRatio: 16 / 9
  |   [0,0, 800, 450]
  |
*/
export function legacyComputeViewBox(graph, zoom, onlyHighlighted = true) {
  let rect
  let nodes = values(graph.nodes)
      .filter(n => !onlyHighlighted || n.display.status === "highlighted")
      .map(n => n.display)

  let captions = values(graph.captions)
      .filter(c => !onlyHighlighted || c.display.status === "highlighted")
      .map(c => c.display)

  let items = nodes.concat(captions)

  // show all nodes and captions if none are highlighted
  if (items.length == 0) {
    nodes = values(graph.nodes).map(n => n.display)
    captions = values(graph.captions).map(c => c.display)
    items = nodes.concat(captions)
  }

  if (items.length > 0) {
    const padding = 100
    const xs = items.map(i => i.x)
    const ys = items.map(i => i.y)
    const textPadding = 100 // node text might extend below node
    let x = min(xs) - padding
    let y = min(ys) - padding
    let w = max(xs) - min(xs) + padding * 2
    let h = max(ys) - min(ys) + textPadding + padding
    let factor = Math.min(400/w, 400/h)

    if (factor > 1) {
      x = x - (w * (factor - 1) / 2)
      y = y - (h * (factor - 1) / 2)
      w = w * factor
      h = h * factor
    }

    rect = { x, y, w, h }
  } else {
    rect = { x: -200, y: -200, w: 400, h: 400 }
  }


  let w = rect.w / zoom
  let h = rect.h / zoom
  let x = rect.x + rect.w/2 - (w/2)
  let y = rect.y + rect.h/2 - (h/2)

  return { minX: x, minY: y, w: w, h: h }

  // return `${x} ${y} ${w} ${h}`
}

export function computeViewBox(graph, zoom) {
  const defaultViewBox = { minX: -200, minY: -200, w: 400, h: 400 }
  const padding = 100

  const nodes = values(graph.nodes)

  if (nodes.length === 0) {
    return defaultViewBox
  }

  const xValues = nodes.map(n => n.display.x)
  const yValues = nodes.map(n => n.display.y)
  // Calculate the maximum and minimum X/Y values
  const minNodeX = Math.min(...xValues)
  const minNodeY = Math.min(...yValues)
  const maxNodeX = Math.max(...xValues)
  const maxNodeY = Math.max(...yValues)

  // Subtract padding and calculate ViewBox
  const minX = minNodeX - padding
  const minY = minNodeY - padding
  const w = maxNodeX - minNodeX + (padding * 2)
  const h = maxNodeY - minNodeY + (padding * 2)

  const viewBox = { minX, minY, w, h }

  // We can return here if the zoom is 1
  if (zoom === 1) {
    return viewBox
  }

  // Update viewBox according to zoom settings
  const zoomW = w / zoom
  const zoomH = h / zoom
  const zoomMinX = minX + (w / 2) - (zoomW / 2)
  const zoomMinY = minY + (h / 2) - (zoomH / 2)

  return {
    minX: zoomMinX,
    minY: zoomMinY,
    w: zoomW,
    h: zoomH
  }

}


export function computeActualZoom(viewBox, domNode) {
  const { width, height } = domNode.getBoundingClientRect()
  const xFactor = width / viewBox.w
  const yFactor = height / viewBox.h
  return Math.min(xFactor, yFactor)
}
