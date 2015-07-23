let FEdge = {
  generateId: () => `x${Math.random() * 1000000000000}`,
  build: (specs) =>
    {
      id: specs.id || this.generateId(),
      n1: specs.n1,
      n2: specs.n2,
      content: specs.content || {},
      display: specs.display || {}
    }
};


let FGraph = {};

FGraph.build = (specs) =>
  {
    nodes: specs.nodes || {},
    edges: specs.edges || {}
  };

FGraph.connectNodes = (g, n1_id, n2_id, specs={}) => {
  const e = FEdge.build({
    n1: g.nodes[n1_id],
    n2: g.nodes[n2_id],
    content: specs.content,
    display: specs.display});

  return g.update('edges', g.get('edges').push(e));
};
