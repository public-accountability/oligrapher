# Oligrapher 2

Oligrapher is a JavaScript app for visualizing network graphs. It allows a user to design a nice-looking network graph using a combination of imported or manually entered data, and to create a collection of annotations for a graph.

Oligrapher was originally developed by [LittleSis](http://littlesis.org) before it was separated into a standalone library. LittleSis has a large collection of [maps created with Oligrapher](http://littlesis.org/oligrapher). 

Oligrapher 2 is built with [React](http://reactjs.com) and [Redux](http://rackt.org/redux) and is bundled into a single JavaScript file that is easy to run on any web page.

- [Demo](http://oli2.littlesis.org)
- [Features](#features)
- [Install](#install)
- [Development](#development)
- [Data Schema](#data-schema)
- [API](#api)
- [Data Sources](#data-sources)
- [Editing Guide](#editing-guide)

![Oligrapher Demo Screenshot](https://cloud.githubusercontent.com/assets/981611/12380419/5fbd509e-bd40-11e5-823b-07f093ef6844.png)

Features
--------

- easily create and display network graphs
- tell a story about networks with click-through series of annotations
- add images, labels, links, and captions
- customize graph layout by dragging nodes and edges
- import data from LittleSis and other APIs
- undo and redo edits to a graph
- runs on all modern web browsers

Install
-------

To run Oligrapher app in a web page, include [oligrapher.min.js](build/oligrapher.min.js) in your page and mount the app in an HTML element:

```html
<script src="oligrapher.min.js"></script>
<script>
var elem = document.getElementById('oligrapher');
var oli = new Oligrapher({ 
  root: elem,
  isEditor: true
});
</script>
```
Examine [build/index.html](build/index.html) in the repository for a complete example.

Development
-----------

To run this app in development mode:

```
cd /var/www/
clone https://github.com/skomputer/oligrapher2.git
npm install
npm run dev-build
```

Then point your browser to the repository's [build/dev.html](build/dev.html) to view a demo graph with annotations in edit mode. In development mode the React application is served by webpack with hot loading.

To include Oligrapher in a Node.js application, include the `oligrapher2` node module in the app's [package.json](package.json) and then `require` it in the application code.

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
  - ```arrow:``` Direction of the arrow: ``` 'left', 'right', 'both' or false ```  (default is ```false```)
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

### `constructor(config)`
Returns an Oligrapher instance within a specified ```root``` DOM element and accepts other configuration options.
```javascript
var elem = document.getElementById('#oligrapher');
var data = getDataFromSomeWhere();
var config = { 
  root: elem,   // DOM element to mount Oligrapher within
  data: data,   // initial graph data to load and display (null by default)
  isEditor: true,   // if true, clicking nodes or edges selects them; if false, clicking highlights (false by defaut)
  isLocked: false,   // if true, nodes and edges cannot be dragged by the user
  isEmbedded: false // if true, the oligrapher is set to be in 'embedded' mode
  viewOnlyHighlighted: false,   // center viewbox around highlighted content
  dataSource: LsDataSource,   // API wrapper for importing nodes and edges from a data source, see build/LsDataSource.js for an example
  user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },   // optional author data to display
  date: "August 30, 2015",   // optional date data to display
  url: "https://example.com", // optional url for the graph title to link to
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

### `import(data)`
Imports `data` into Oligrapher and displays it. Existing Oligrapher data will be overwritten.

### `export()`
Returns a snapshot of the current data, including `graph`, `annotations`, `title`, and `settings`. This data can be `import`ed later to display the identical graph.

### `exportGraph()`
Returns a snapshot of the graph data with highlights applied.

### `exportAnnotation()`
Returns the currently displayed annotation.

### `showAnnotation(index)`
Displays the annotation with the given index in the `annotations` array.

### `zoomIn()`
Zooms in by 20%. This can be triggered with the keyboard shortcut `ctrl+equals`.

### `zoomOut()`
Zooms out by 20%. This can be triggered with the keyboard shortcut `ctrl+minus`.

### `resetZoom()`
Resets the zoom to the default level (1.00). 

### `addNode(node)`
Adds given node to graph. Node must conform to data schema described above. Returns `id` of new node.

### `addEdge(edge)`
Adds given edge to graph. Edge must conform to data schema described above. Returns `id` of new edge.

### `addCaption(caption)`
Adds given caption to graph. Caption must conform to data schema described above. Returns `id` of new caption.

### `deleteNode(id)`
Deletes the node with the given `id` and any edges connected to it from the current graph.

### `deleteEdge(id)`
Deletes the edge with the given `id` from the current graph.

### `deleteCaption(id)`
Deletes the caption with the given `id` from the current graph.

### `deleteAll()`
Deletes all nodes, edges, and captions from the graph, as well as all annotations.

### `getHighlights()`
Returns the displayed graph filtered to only highlighted nodes, edges, and captions.

### `getSelection()`
Returns an object with the ids of the currently selected nodes, edges, and captions. NOTE: selection is only enabled when `isEditor: true` is present in the config object at initialization. Unlight highlighting, selection does not alter a graph's data; it is used only for editing purposes.

### `deselectAll()`
Clears selection.

### `deleteSelection()`
Deletes the currently selected nodes, edges, and captions, as well as any other edges connected to the deleted nodes. This can be triggered with the keyboard shortcut `ctrl+d`.

### `updateNode(nodeId, data)`
Merges the provided `data` into the node specified by `nodeId`. Null `data` fields will erase those fields in the node.

### `updateEdge(edgeId, data)`
Merges the provided `data` into the edge specified by `edgeId`. Null `data` fields will erase those fields in the edge.

### `updateCaption(captionId, data)`
Merges the provided `data` into the caption specified by `captionId`. Null `data` fields will erase those fields in the caption.

### `prune()`
Removes all nodes that aren't connected by edges to other nodes.

### `circleLayout()`
Arranges all nodes in a circle.

Data Sources
------------

In order to add nodes from an external data source from within the Oligrapher editor UI, you must pass a valid data source object to the `dataSource` configuration option. See [build/LsDataSource.js](build/LsDataSource.js) for an example data source that fetches nodes and edges from the LittleSis API.

If you want to create your own data source object, it must implement the following API:

### `findNodes(text, callback)`

This function accepts a search string and passes a resulting array of nodes (conforming to the Data Schema above) to the given callback function. Each node in the array must have an `id` that can be provided to `getNodeWithEdges()` below. 

### `getNodeWithEdges(nodeId, nodeIds, callback)`

This function accepts the id of a new node to be added to the graph, an array of node ids already in the graph, and a callback. It should return an object with a `node` and an array of `edges` conforming to the Data Schema above. The `id` of the resulting `node` should be equal to the provided `nodeId` and the resulting `edges` should each connect the `node` to one of the existing nodes in the graph (i.e., for each edge, either `node1_id` or `node2_id` is equal to `nodeId`, and the other one belongs to `nodeIds`).

### `getConnectedNodes(nodeId, nodeIds, options, callback)`

This function returns an array of new `nodes` connected to an existing node in the graph, as well as an array of `edges` that connect the new `nodes` to the existing node. It accepts the id of the existing node, an array of node ids already in the graph (so that duplicate nodes are not returned), an optional `options` hash, and a callback.

### `getConnectedNodesOptions`

This attribute of the data source object should provide a hash of keys and possible values to be passed as the `options` object to `getConnectedNodes`. The Oligrapher editor UI will display a drop-down menu for each key. 

Editing Guide
-------------

Use the editor to create a network graph along with an optional series of annotations overlaying the graph. Annotations consists of a title, a text body, and a highlighted section of the graph.

The pencil button swaps between graph editing mode and annotation editing mode. It will appear green when editing the graph and yellow when editing annotations.

### Graph Editing Mode

Type a name in the "add node" box and press enter to add the node to the graph. If Oligrapher is connected to an external data source, nodes from the data source matching the name you type will appear below; click on them to add them to the graph.      

ALT+C opens a form for adding a new caption in the top right of the graph.  
CLICK a node, edge, or caption to select or deselect it.  
SHIFT+CLICK to select mutiple nodes, edges, or captions.

Select a single node, edge, or caption to view an editing form in the top-right corner of the map. Changes you make in the form will upate the item immediately.

The CIRCLE button arranges nodes in a circle.  
The PRUNE button removes unconnected nodes.  
The CLEAR button deletes all content from the graph.  
The HELP button displays this user guide.

### Annotation Editing Mode

Annotations are edited using the sidebar on the right. Click the big "A" button to hide or show the sidebar.

Click the NEW ANNOTATION button create a new annotation and display a form for editing it. Select text in the annotation body input to display a formatting toolbar. Click on any annotation title in the list to edit it. A REMOVE button at the bottom of the edit form will delete the annotation. When editing an annotation, click on nodes, edges, or captions from the graph to highlight them in that annotation. Drag annotaions up and down the list to reorder them.

### Shortcut Keys

LEFT & RIGHT ARROWS navigate to the previous and next annotations.  
ALT+H toggles this user guide.  
ALT+H swaps the editing mode between graph editing and annotations.  
ALT+D deletes selected nodes and edges.  
ALT+E adds an edge. Selected nodes will be auto-populated in the form.  
ALT+C adds a caption.  

If ALT keys interfere with your browser or operating system shortcuts, all of the above shortcuts will work with CTRL instead of ALT.

CTRL+"=" zooms in.
CTRL+"-" zooms out.
CTRL+0 resets zoom.

ESC closes all forms and deselects graph content.

Embedded-mode
-----------

This is a display-only mode intended to be used inside an iFrame. You can use some of the same options as the normal oligrapher mode. To enable embedded mode, you include the option:``` isEmbbedded = true ``` .

There are additional embedded-specific configurations that can be included in an options objects. If not included, defaults will be used. See example configuration:

#### `constructor(config)`

Returns an Oligrapher instance within a specified ```root``` DOM element and accepts other configuration options.
```javascript
var config = { 
  root: document.getElementById('#oligrapher'),   // DOM element to mount Oligrapher within
  data: getDataFromSomeWhere(),   // graph data to load and display
  isEditor: false 
  isLocked: true,
  showSaveButton: false,
  isEmbedded: true // set this to true to enable embedded mode
  user: { name: "Kevin", url: "http://littlesis.org/user/kevin" },   // optional author data to display
  date: "August 30, 2015",
  startAnnotation: 0,
  embedded: {
	  headerPct: 10, // percentage of height taken up by the header
	  annotationPct: 25, // percentage of width taken up by the annoations
	  logoUrl: 'https://link_to_logo' // optional logo to display in right hand corner
	  linkUrl: 'https://link_to_view_on_littlesis' // optional link & text to display at bottom
	}
}

var oli = new Oligrapher(config);
```

