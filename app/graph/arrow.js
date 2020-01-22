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

// String, Boolean, "1" | "2" => String
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

export default { parse, change }
