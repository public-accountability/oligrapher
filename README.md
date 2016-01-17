# Oligrapher 2
Oligrapher is a JavaScript app for visualizing network graphs. It allows a user to design a nice-looking network graph using a combination of imported or manually entered data, and to create a collection of annotations for a graph.

Oligrapher 1 was originally developed by [LittleSis](http://littlesis.org) before it was separated into a standalone library. LittleSis has a large collection of [maps created with Oligrapher](http://littlesis.org/oligrapher). 

Oligrapher 2 is built with [React](http://reactjs.com) and [Redux](http://rackt.org/redux) and is bundled into a single JavaScript file that is easy to run on any web page.

![Oligrapher Demo Screenshot](https://cloud.githubusercontent.com/assets/981611/12380419/5fbd509e-bd40-11e5-823b-07f093ef6844.png)

Quick Start
-----------

To run Oligrapher app in a web page, include the .js file from the build directory in your page header and mount the app in an HTML element. Examine ```build/index.html``` in the repository for an example:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/><meta charset="UTF-8">
    <title>Oligrapher Demo</title>
    <script src="oligrapher.js"></script>
    <script src="LsDataSource.js"></script>
    <script src="oligrapher-demo-data.js"></script>
    <style>
      body {
        margin: 10px;
      }
    </style>
  </head>
  <body>
    <div id="oligrapher"></div>
    <script>
      var elem = document.getElementById('oligrapher');
      var oli = new Oligrapher({ 
        root: elem,
        isEditor: true,
        isLocked: false,
        logActions: false,
        viewOnlyHighlighted: false,
        dataSource: LsDataSource,
        data: oligrapherDemoData,
        user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },
        date: "August 30, 2015",
        startIndex: 0,
        showSaveButton: true,
        onSave: function(data) { console.log(data); },
        onNav: function(index) { console.log("navigating to annotation " + String(index)); },
        links: [
          { text: "some", url: "http://some.net" },
          { id: "exampleLink", text: "example", url: "http://example.com" },
          { method: "POST", text: "clone", url: "http://lilsis.local/maps/118-satoshi/clone" }
        ],
        settings: {
          is_private: false,
          is_featured: false
        }
      });
    </script>
  </body>
</html>
```

Development
-----------

To run this app in development mode:

```
cd /var/www/
clone https://github.com/skomputer/oligrapher2.git
npm install
npm run dev-build
```

Then point your browser to the repository's `build/dev.html` to view a demo graph with annotations in edit mode. In development mode the React application is served by webpack with hot loading.

To include Oligrapher in a Node.js application, include the `oligrapher2` node module in the app's `package.json` and then `require` it in the application code.

Data Schema
-----------

Initial data can be provided to the app with the `data` configuration option. If no data is provided at initialization the app will begin empty. Data consists of a `graph` and, optionally, an array of `annotations` as well as `title`, `user`, and `date`. 

`graph` data should conform to the following general schema:

```javascript
{
  id: 'NkpdQPQfx',
  nodes: {
    1: { id: 1, display: { name: "Node 1" } },
    2: { id: 2, display: { name: "Node 2" } },
    3: { id: 3, display: { name: "Node 3" } }
  },
  edges: {
    1: { id: 1, node1_id: 1, node2_id: 2, display: { label: "Edge 1" } },
    2: { id: 2, node1_id: 2, node2_id: 3, display: { label: "Edge 2" } }
  },
  captions: {
    1: { id: 1, display: { text: "Caption 1" } }
  }
};
```

The ```id``` of the graph itself is optional, Oligrapher will generate it if not provided. Nodes only require an ```id``` and a ```name```; edges also require ```node1_id``` and ```node2_id```, which refer to the ```id```s of the two nodes they connect. A number of optional attributes control the layout and appearance of nodes and edges. All position coordinates are relative to the center of the display area, with the x-axis increasing righward and the y-axis increasing downward.

### Node Attributes
- ```id:``` **(required)** an integer or string uniquely identifying the node
- ```display:``` **(required)** an object with attributes related to the node's appearance
  - ```name:``` **(required)** a string, which will be displayed underneath the node (on multiple lines if necessary)
  - ```scale:``` relative size of node (```1``` is default, ```1.5``` is 50% wider, etc)
  - ```status:```  default is ```normal```, can also be ```highlighted``` or ```faded```
  - ```image:``` optional image URL
  - ```url:``` optional source URL
  - ```x:``` x-coordinate of the node's position
  - ```y:``` y-coordinate of the node's position

### Edge Attributes
- ```id:``` **(required)** an integer or string uniquely identifying the edge
- ```node1_id:``` **(required)** equal to the first node's id
- ```node2_id:``` **(required)** equal to the second node's id
- ```display:``` **(required)** an object with attributes related to the edge's appearance
  - ```label:``` **(required)** label appearing above the edge
  - ```url:``` optional source URL
  - ```scale:``` relative thickness of edge (```1``` is default, ```2``` is twice as thick, etc)
  - ```status:```  default is ```normal```, can also be ```highlighted``` or ```faded```
  - ```arrow:``` whether the edge has an arrow indicating a direction (default is ```false```)
  - ```dash:``` the kind of dash displayed in edge's line (default is ```null```, a solid line)
  - ```cx:``` x-coordinate of the control point for the edge's quadratic [Bezier curve](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Bezier_Curves), *relative to the midpoint of the straight line between the two nodes* (if not specified, this is computed to display a slight curve)
  - ```cy:``` y-coordinate of the control point for the edge's quadratic [Bezier curve](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Bezier_Curves), *relative to the midpoint of the straight line between the two nodes* (if not specified, this is computed to display a slight curve)fa

### Caption Attributes
- ```id:``` **(required)** an integer or string uniquely identifying the caption
- ```display:``` **(required)** an object with attributes related to the captions's appearance
  - ```text:``` **(required)** the caption's text content
  - ```x:``` x-coordinate of the caption's position
  - ```y:``` y-coordinate of the caption's position

### Annotation Attributes

The `annotations` array should conforms to the following schema:

```javascript
[
  { 
    header: "The Revolving Door", 
    text: "Goldman Sachs has many former executives with top positions in the federal government.", 
    nodeIds: [...], 
    edgeIds: [...], 
    captionIds: [...] 
  },
  { 
    header: "Treasury Department", 
    text: "Former Treasury Secretary Robert Rubin was co-chair of Goldman before joining the Clinton Administration in 1993." , 
    nodeIds: [...], 
    edgeIds: [...], 
    captionIds: [] 
  },
  ...
]
```

- ```header:``` **(required)** a header to be displayed above the annotation
- ```text:``` **(required)** the text body of the annotation, with optional HTML markup
- ```nodeIds:``` **(required)** an array of ids of nodes to highlight from the underlying graph (can be empty)
- ```edgeIds:``` **(required)** an array of ids of edges to highlight from the underlying graph (can be empty)
- ```captionIds:``` **(required)** an array of ids of captions to highlight from the underlying graph (can be empty)

If no node, edge, or captions are highlighted, the graph will have its normal appearance when viewing the annotation. If there are highlights, non-highlighted content will appear faded.

API
---

### ```constructor(config)```
Returns an Oligrapher instance within a specified ```root``` DOM element and accepts other configuration options.
```javascript
var elem = document.getElementById('#oligrapher');
var data = getDataFromSomeWhere();
var config = { 
  root: elem,   // DOM element to mount Oligrapher within
  data: data,   // initial graph data to load and display (null by default)
  isEditor: true,   // if true, clicking nodes or edges selects them; if false, clicking highlights (false by defaut)
  isLocked: false,   // if true, nodes and edges cannot be dragged by the user
  viewOnlyHighlighted: false,   // center viewbox around highlighted content
  dataSource: LsDataSource,   // API wrapper for importing nodes and edges from a data source, see build/LsDataSource.js for an example
  user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },   // optional author data to display
  date: "August 30, 2015",   // optional date data to display
  startAnnotation: 0,   // index of annotation to load initially
  showSaveButton: true,   // show a save button
  onSave: function(data) { console.log(data); },   // callback triggered by save button
  onNav: function(index) { console.log("navigating to annotation " + String(index)); },   // callback triggered by annotation navigation buttons
  links: [
    { text: "some", url: "http://some.net" },
    { id: "exampleLink", text: "example", url: "http://example.com" },
    { method: "POST", text: "clone", url: "http://lilsis.local/maps/118-satoshi/clone" }
  ],   // links to display beside the title, author, and date; text attributes are required, url, id, method, and target attributes are optional
  settings: {
    is_private: false,
    is_featured: false
  },   // checkboxes with initial values to appear on the settings screen; settings are included in data setn to onSave callback
  logActions: false   // for development purposes, logs all Redux actions to the browser console
}

var oli = new Oligrapher(config);
```

### ```import(data)```
Imports graph ```data``` into Oligrapher and displays it, returning the imported graph's ```id```.
```javascript
var oli = new Oligrapher(config);
var id1 = oli.import(data1);
var id2 = oli.import(data2);
```

### ```export()```
Returns a snapshot of the currently displayed graph data, including display attributes. This data can be ```import```ed later to display the identical graph.
```javascript
var oli = new Oligrapher(config);
var data = getGraphFromDatabase();
oli.import(data);
// ... user edits graph ...
data = oli.export();   // get data snapshot
// ... user edits graph some more ...
oli.import(data);   // restore data snapshot
// ... user edits graph some more ...
data = oli.export();
saveGraphToDatabase(data);
```

### ```new```
Creates and displays a blank graph.
```javascript
var oli = new Oligrapher(config);
oli.export();   // { nodeIds: [], edgeIds: [], captionIds: [] }
```

### ```show(id)```
Displays the previously-imported graph with the given ```id```.
```javascript
var oli = new Oligrapher(config);
var id1 = oli.import(data1);
var id2 = oli.import(data2);
oli.show(id1);
```

### ```zoomIn()```
Zooms in by 20%. This can be triggered with the keyboard shortcut ```ctrl+equals```.

### ```zoomOut()```
Zooms out by 20%. This can be triggered with the keyboard shortcut ```ctrl+minus```.
```javascript
var oli = new Oligrapher(config);
oli.import(data);
oli.zoomIn();
oli.zoomOut();   // back to normal
```

### ```resetZoom()```
Resets the zoom to the default level (1.00). 

### ```currentGraphId()```
Returns id of currently displayed graph.
```javascript
var oli = new Oligrapher(config);
var id1 = oli.import(data1);
var id2 = oli.import(data2);
oli.show(id1);
oli.getCurrentId() == id1;   // true
```

### ```addNode(node)```
Adds given node to graph. Node must conform to data schema described above. Returns ```id``` of new node.
```javascript
var oli = new Oligrapher({ root: element, data: data });
var nodeId = oli.addNode({ display: { name: "Kofi Annan" } });
```

### ```addEdge(edge)```
Adds given edge to graph. Edge must conform to data schema described above. Returns ```id``` of new edge.
```javascript
var oli = new Oligrapher({ root: element, data: data });
var edgeId = oli.addEdge({ display: { label: "sister" } });
```

### ```addCaption(caption)```
Adds given caption to graph. Caption must conform to data schema described above. Returns ```id``` of new caption.
```javascript
var oli = new Oligrapher({ root: element, data: data });
var captionId = oli.addCaption({ display: { text: "This is the most interesting thin you'll read today" } });
```

### ```deleteNode(id)```
Deletes the node with the given ```id``` and any edges connected to it from the current graph.

### ```deleteEdge(id)```
Deletes the edge with the given ```id``` from the current graph.

### ```deleteCaption(id)```
Deletes the caption with the given ```id``` from the current graph.

### ```deleteAll()```
Deletes all nodes, edges, and captions from the graph.
```javascript
oli = new Oligrapher(config);
oli.import(data);
oli.deleteAll();
oli.export();   // { nodeIds: [], edgeIds: [], captionIds: [] }
```

### ```getHighlights()```
Returns the displayed graph filtered to only highlighted nodes, edges, and captions.

### ```getSelection()```
Returns an object with the ids of the currently selected nodes, edges, and captions. NOTE: selection is only enabled when ```isEditor: true``` is present in the config object at initialization. Unlight highlighting, selection does not alter a graph's data; it is used only for editing purposes.
```javascript
var selection = oli.getSelection();
// { nodeIds: [1, 2], edgeIds: [1], captionIds: [] }
```

### ```deselectAll()```
Clears selection.

### ```deleteSelection()```
Deletes the currently selected nodes, edges, and captions, as well as any other edges connected to the deleted nodes. This can be triggered with the keyboard shortcut ```ctrl+d```.

### ```updateNode(nodeId, data)```
Merges the provided ```data``` into the node specified by ```nodeId```. Null ```data``` fields will erase those fields in the node.
```javascript
var oldNode = oli.export().nodeIds[nodeId]; 
// { id: 64, display: { name: "James Houghton", url: "http://example.com", scale: 1 } }
oli.update(nodeId, { display: { name: "James R Houghton",  url: null, scale: 2 } });
var newNode = oli.export().nodeIds[nodeId];
// { id: 64, display: { name: "James R Houghton", scale: 2 } }
```

React Component Tree
--------------------
```
└─┬ Root
  └─┬ Graph
    ├── Node(s)
    ├── Edge(s)
    └── Caption(s)
```

User Guide
----------

### Keyboard Shortcuts

ALT or COMMAND keys can be used instead of CONTROL in any of the below shortcuts.

**CONTROL+EQUALS:** zoom in  
**CONTROL+MINUS:** zoom out  
**CONTROL+D:** delete selection  
