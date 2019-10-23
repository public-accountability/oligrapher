# Graph Functions

``` javascript
import Node from 'app/graph/node'
import Edge from 'app/graph/edge'
import Graph from 'app/graph/graph'

const graph = Graph.new()
const api = Graph.api(graph)

// to perform an action you you can use the api shortcuts:

const node = Node.new({display: { x: 100, y: 200 }})
const newGraph = api.addNode(node)

// or use the exported the functions
const node = Node.new({display: { x: 100, y: 200 }})
const newGraph = Graph.addNode(graph, node)
```
