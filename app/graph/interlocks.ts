import { LsEdge } from "../datasources/littlesis"
import { lineBetween } from "../util/nodePlacement"
import { Edge } from "./edge"
import Graph, { Graph as GraphType } from "./graph"
import { NodeArray } from "./node"

export function addInterlocks2(
  graph: GraphType,
  selectedNodes: string[],
  nodes: NodeArray,
  edges: Edge[]
) {}

export function addInterlocks(
  graph: GraphType,
  node1Id: string,
  node2Id: string,
  nodes: NodeArray,
  edges: LsEdge[]
) {
  const n1 = graph.nodes[node1Id]
  const n2 = graph.nodes[node2Id]

  lineBetween(n1, n2, nodes).forEach(node => {
    Graph.addNode(graph, node)
  })

  Graph.addEdgesIfNodes(graph, edges)
}
