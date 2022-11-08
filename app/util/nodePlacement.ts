import { Node } from "../graph/node"

export function lineBetween(node1: Node, node2: Node, newNodes: Node[]): Node[] {
  const midX = (node1.x + node2.x) / 2
  const midY = (node1.y + node2.y) / 2
  const angle = Math.atan2(node1.x - node2.x, node2.y - node1.y)
  const num = newNodes.length
  const spacing = Math.max(50, 200 - num * 10)

  return newNodes.map((node: Node, i: number) => {
    return Object.assign({}, node, {
      x: midX + Math.cos(angle) * ((-(num - 1) * spacing) / 2 + i * spacing),
      y: midY + Math.sin(angle) * ((-(num - 1) * spacing) / 2 + i * spacing),
    })
  })
}
