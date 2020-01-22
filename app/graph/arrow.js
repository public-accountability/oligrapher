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
const MARKER_END = "url(#marker1)"
const MARKER_START = "url(#marker2)"

// String, Bool => String
export function markerStartArrow(arrow, is_reverse) {
  if (arrow === "1->2" && is_reverse) {
    return MARKER_START
  } else if (arrow === "2->1" && !is_reverse) {
    return MARKER_START
  } else if (arrow === 'both') {
    return MARKER_START
  } else {
    return ""
  }
}

// String, Bool => String
export function markerEndArrow(arrow, is_reverse) {
  if (arrow === "1->2" && !is_reverse) {
    return MARKER_END
  } else if (arrow === "2->1" && is_reverse) {
    return MARKER_END
  } else if (arrow === 'both') {
    return MARKER_END
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

// String, Boolean, ("1" | "2") => String
export function change({arrow, addArrow, selected}) {
  const removeArrow = !addArrow
  const arrowState = parse(arrow)
  const oneSelected = selected === '1'
  const twoSelected = selected === '2'

  if (addArrow && (!arrow || arrowState.node1) && oneSelected) {
    return '2->1'
  }

  if (addArrow && (!arrow || arrowState.node2) && twoSelected) {
    return '1->2'
  }

  if (addArrow && ((oneSelected && arrowState.node2) || (twoSelected && arrowState.node1)) ) {
    return 'both'
  }

  if (removeArrow && arrow === 'both' && oneSelected) {
    return '1->2'
  }

  if (removeArrow && arrow === 'both' && twoSelected) {
    return '2->1'
  }

  if (removeArrow && arrow !== 'both') {
    return false
  }
}

const marker = {
  start: markerStartArrow,
  end: markerEndArrow,
}

export default { parse, change, marker }
