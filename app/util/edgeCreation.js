export const setNodes = (display, ids) => {
  display.edgeCreationNodes = ids
}

export const clearNodes = (display) => {
  setNodes(display, [])
}

export const getNodes = (display) => {
  return display.edgeCreationNodes
}

export default {
  setNodes,
  clearNodes,
  getNodes
}