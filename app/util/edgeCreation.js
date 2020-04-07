export const setNodes = (graph, ids) => {
  graph.edgeCreation.nodes = ids
}

export const clearNodes = (graph) => {
  setNodes(graph, [])
}

export const getNodes = (graph) => {
  return graph.edgeCreation.nodes
}

export default {
  setNodes,
  clearNodes,
  getNodes
}