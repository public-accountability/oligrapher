import curry from "lodash/curry"
import Graph, { calculateCenter, GRAPH_PADDING } from "../../app/graph/graph"
import Node from "../../app/graph/node"
import Edge from "../../app/graph/edge"
import Caption from "../../app/graph/caption"
import { xy, distance } from "../../app/util/geometry"

describe("Graph", function () {
  test("new()", function () {
    const g = Graph.new()
    expect(g.nodes).toEqual({})
    expect(g.edges).toEqual({})
    expect(Graph.new()).toEqual(Graph.new())
    expect(Graph.new()).not.toBe(Graph.new())
  })

  test("Getters", function () {
    const graph = Graph.new()
    const n1 = Node.new({ id: "n1", x: -10, y: 30 })
    const n2 = Node.new({ id: "n2", x: 0, y: -30 })
    const n3 = Node.new({ id: "n3", x: 10, y: 0 })
    const n4 = Node.new({ id: "n4", x: 0, y: 0 })
    const e1 = Edge.newEdgeFromNodes(n1, n2)
    const e2 = Edge.newEdgeFromNodes(n2, n3)
    Graph.addNodes(graph, [n1, n2, n3, n4])
    Graph.addEdgesIfNodes(graph, [e1, e2])

    const edgesOf = curry(Graph.edgesOf)(graph)
    const nodesOf = curry(Graph.nodesOf)(graph)

    expect(edgesOf(n1.id).length).toEqual(1)
    expect(edgesOf(n2.id).length).toEqual(2)
    expect(edgesOf(n3.id).length).toEqual(1)
    expect(edgesOf(n4.id).length).toEqual(0)
    expect(nodesOf(e1.id).map(node => node.id)).toEqual([n1.id, n2.id])
    expect(nodesOf(e1.id).map(node => node.id)).toEqual([n1.id, n2.id])
    expect(nodesOf(e2.id).map(node => node.id)).toEqual([n2.id, n3.id])
  })

  test("Stats", function () {
    const graph = Graph.new()
    const n1 = Node.new({ x: -10, y: 30 })
    const n2 = Node.new({ x: 0, y: -30 })
    const n3 = Node.new({ x: 10, y: 0 })
    Graph.addNodes(graph, [n1, n2, n3])
    const edge = Edge.newEdgeFromNodes(n1, n2)
    Graph.addEdge(graph, edge)
    const stats = Graph.graphStats(graph)
    expect(stats.nodeCount).toEqual(3)
    expect(stats.edgeCount).toEqual(1)
    expect(stats.minNodeX).toEqual(-10)
    expect(stats.minNodeY).toEqual(-30)
    expect(stats.maxNodeX).toEqual(10)
    expect(stats.maxNodeY).toEqual(30)
  })

  describe("Nodes", function () {
    test("addNode() - with values", function () {
      const g = Graph.new()
      const n = { id: "example", x: 1, y: 1, title: "🪷" }
      expect(g.nodes).toEqual({})
      Graph.addNode(g, n)
      expect(g.nodes["example"].title).toEqual("🪷")
    })

    test("addNode() - placed at center", function () {
      const g = Graph.new()
      const n = Node.new()
      expect(g.nodes).toEqual({})
      Graph.addNode(g, n)
      expect(n.id in g.nodes).toBeTruthy()
      expect(xy(g.nodes[n.id])).toEqual({ x: 0, y: 0 })
    })

    // test("addNode() - placed away from center", function () {
    //   const g = Graph.new()
    //   const n1 = Node.new()
    //   const n2 = Node.new()
    //   Graph.addNode(g, n1)
    //   Graph.addNode(g, n2)
    //   expect(xy(g.nodes[n2.id])).not.toEqual({ x: 0, y: 0 })
    // })

    test("removeNode()", function () {
      const n = Node.new()
      const g = Graph.new()
      expect(g.nodes[n.id]).toBeFalsy()
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).toBeTruthy()
      Graph.removeNode(g, n.id)
      expect(g.nodes[n.id]).toBeFalsy()
      Graph.addNode(g, n)
      expect(g.nodes[n.id]).toBeTruthy()
    })

    test("updateNode", function () {
      const n = Node.new()
      const g = Graph.new()
      Graph.addNode(g, n)
      expect(g.nodes[n.id].scale).toEqual(1)
      Graph.updateNode(g, n.id, { scale: 2 })
      expect(g.nodes[n.id].scale).toEqual(2)
    })

    test("removeNode", function () {
      const g = Graph.new()
      const n1 = Node.new()
      const n2 = Node.new()
      Graph.addNodes(g, [n1, n2])
      const e = Edge.new({ node1_id: n1.id, node2_id: n2.id })
      Graph.addEdge(g, e)
      Graph.removeNode(g, n2.id)
      expect(Object.keys(g.nodes)).toEqual([n1.id])
      expect(Object.values(g.edges).length).toEqual(0)
    })

    test("moveNode", function () {
      const n = Node.new({ x: 1, y: 2 })
      const g = Graph.new()
      Graph.addNode(g, n)
      expect(xy(g.nodes[n.id])).toEqual({ x: 1, y: 2 })
      Graph.moveNode(g, n.id, { x: 2, y: 4 })
      expect(xy(g.nodes[n.id])).toEqual({ x: 3, y: 6 })
    })
  })

  test("Edges", function () {
    const n1 = Node.new()
    const n2 = Node.new()
    const n3 = Node.new()
    const g = Graph.new()
    Graph.addNodes(g, [n1, n2, n3])
    const edge = Edge.new({ node1_id: n1.id, node2_id: n2.id })
    expect(g.edges).toEqual({})
    Graph.addEdge(g, edge)
    expect(g.edges).toEqual({ [edge.id]: edge })
    // shouldn't be able to add edge where node1 = node2
    const weirdEdge = Edge.new({ node1_id: n1.id, node2_id: n1.id })
    Graph.addEdge(g, weirdEdge)
    expect(Object.keys(g.edges).length).toEqual(1)
  })

  test("control points", function () {
    const g = Graph.new()
    expect(g.edges).toEqual({})
    const node1 = Node.new({ x: -100, y: -100 })
    const node2 = Node.new({ x: 100, y: 100 })
    const edge1 = Edge.newEdgeFromNodes(node1, node2)
    const edge2 = Edge.newEdgeFromNodes(node1, node2)
    const edge3 = Edge.newEdgeFromNodes(node1, node2)
    Graph.addNodes(g, [node1, node2])
    Graph.addSimilarEdges(g, [edge1, edge2, edge3])
    // control points for these edges should be reasonably far apart
    const { cx: x1, cy: y1 } = g.edges[edge1.id]
    const { cx: x2, cy: y2 } = g.edges[edge2.id]
    const { cx: x3, cy: y3 } = g.edges[edge3.id]
    expect(distance({ x: x1, y: y1 }, { x: x2, y: y2 })).toBeGreaterThan(20)
    expect(distance({ x: x2, y: y2 }, { x: x3, y: y3 })).toBeGreaterThan(20)
    expect(distance({ x: x1, y: y1 }, { x: x3, y: y3 })).toBeGreaterThan(20)
  })

  describe("move node", function () {
    const node1 = Node.new({ x: 5, y: 10 })
    const node2 = Node.new({ x: 10, y: 20 })
    const graph = Graph.new()
    Graph.addNodes(graph, [node1, node2])
    expect(xy(graph.nodes[node2.id])).toEqual({ x: 10, y: 20 })
    Graph.moveNode(graph, node2.id, { x: -2, y: -5 })
    expect(xy(graph.nodes[node2.id])).toEqual({ x: 8, y: 15 })
  })

  test("calculateCenter()", function () {
    let graph = Graph.new()
    expect(calculateCenter(graph)).toEqual({ x: 0, y: 0 })
  })

  test("connectedNodeIds", function () {
    const graph = Graph.new()
    const n1 = Node.new()
    const n2 = Node.new()
    const n3 = Node.new()
    const n4 = Node.new()
    const e1 = Edge.newEdgeFromNodes(n1, n2)
    const e2 = Edge.newEdgeFromNodes(n1, n3)
    Graph.addNodes(graph, [n1, n2, n3, n4])
    Graph.addEdgesIfNodes(graph, [e1, e2])
    const connectedNodeIds = Graph.connectedNodeIds(graph, n1.id)
    expect(connectedNodeIds).toContain(n2.id)
    expect(connectedNodeIds).toContain(n3.id)
  })

  test("littleSisNodes", function () {
    const graph = Graph.new()
    Graph.addNodes(graph, [
      Node.new({ id: "100" }),
      Node.new({ id: "200" }),
      Node.new({ id: "abc" }),
    ])
    expect(Graph.littleSisNodes(graph).length).toEqual(2)
  })

  test("calculateViewBox", function () {
    const n1 = Node.new({ x: -100, y: 0 })
    const n2 = Node.new({ x: 50, y: -100 })
    const n3 = Node.new({ x: 100, y: -50 })
    const c = Caption.new({ x: 50, y: 50, width: 100, height: 100 })
    const nodes = [n1, n2, n3]
    const edges = []
    const captions = [c]
    expect(Graph.calculateViewBox(nodes, edges, captions)).toEqual({
      minX: -100 - GRAPH_PADDING,
      minY: -100 - GRAPH_PADDING,
      w: 250 + 2 * GRAPH_PADDING,
      h: 250 + 2 * GRAPH_PADDING,
    })
  })
})
