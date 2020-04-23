// Arrows indicate the direction of edge
//
// If an arrow is set to '1->2', the arrows goes from node1 to node2,
// and therefore the marker should be placed at the end of the path.
// However, if the path is reversed (meaning node 2 is to the left of node 1)
// then the arrow should be placed at the start.
// Possible arrow values:
//    "1->2"
//    "2->1"
//    "both"
//    null
//    false
//
// str, boolean -> str

// see components/graph/Markers
const MARKER_END = {
  normal: "url(#marker1)",
  highlighted: "url(#highlightedmarker1"
}
const MARKER_START = {
  normal: "url(#marker2)",
  highlighted: "url(#highlightedmarker2)"
}

// String, Bool => String
export function markerStartArrow(arrow, is_reverse, status = 'normal') {
  if (arrow === "1->2" && is_reverse) {
    return MARKER_START[status]
  } else if (arrow === "2->1" && !is_reverse) {
    return MARKER_START[status]
  } else if (arrow === 'both') {
    return MARKER_START[status]
  } else {
    return ""
  }
}

// String, Bool => String
export function markerEndArrow(arrow, is_reverse, status = 'normal') {
  if (arrow === "1->2" && !is_reverse) {
    return MARKER_END[status]
  } else if (arrow === "2->1" && is_reverse) {
    return MARKER_END[status]
  } else if (arrow === 'both') {
    return MARKER_END[status]
  } else {
    return ""
  }
}

// String => Object
export function parse(arrow) {
  switch (arrow) {
  case 'both':
    return { node1: true, node2: true }
  case '1->2':
    return { node1: false, node2: true }
  case '2->1':
    return { node1: true, node2: false }
  default:
    return { node1: false, node2: false }
  }
}

// String, Boolean, (1 | 2) => String
export function change(arrow, addArrow, selected) {
  let { node1, node2 } = parse(arrow)

  if (selected === '1') {
    node1 = addArrow
  } else if (selected === '2') {
    node2 = addArrow
  }

  return [
    [null, '1->2'],
    ['2->1', 'both']
  ][Number(node1)][Number(node2)]
}

const marker = {
  start: markerStartArrow,
  end: markerEndArrow,
}

export default { parse, change, marker }
