const Immutable = require('immutable');

let FEdge = {
  generateId: () => `x${Math.random() * 1000000000000}`,
  build: (specs) =>
    Immutable.fromJS({
      id: specs.id || this.generateId(),
      n1: specs.n1,
      n2: specs.n2,
      content: specs.content || {},
      display: specs.display || {}
    })
};


let FGraph = {};

FGraph.build = (specs) =>
  Immutable.Map({
    nodes: specs.nodes || Immutable.List(),
    edges: specs.edges || Immutable.List()
  });

FGraph.connectNodes = (g, n1_id, n2_id, specs={}) => {
  const e = FEdge.build({
    n1: g.get(n1_id),
    n1: g.get(n1_id),
    content: specs.content,
    display: specs.display});

  return g.update('edges', g.get('edges').push(e));
};
