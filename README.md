# Oligrapher

Oligrapher is a JavaScript app for visualizing network graphs. It allows a user to design a nice-looking network graph using a combination of imported or manually entered data, and to create a collection of annotations for a graph.

Oligrapher was originally developed by [LittleSis](https://littlesis.org) before it was separated into a standalone library. LittleSis has a large collection of [maps created with Oligrapher](https://littlesis.org/oligrapher).

Oligrapher is built with [React](https://reactjs.com) and [Redux](https://redux.js.org) and is bundled with [Webpack](https://webpack.js.org)

- [Features](#features)
- [Install](#install)
- [Development](#development)
- [Data Schema](#data-schema)
- [API](#api)
- [Data Sources](#data-sources)
- [Editing Guide](#editing-guide)

![Oligrapher Demo Screenshot](https://user-images.githubusercontent.com/8505044/189668138-500bbbe0-5781-4f80-8fae-ad1f4efb85d2.png)

Features
--------

- easily create and display network graphs
- tell a story about networks with click-through series of annotations
- add images, labels, links, and captions
- customize graph layout by dragging nodes and edges
- import data from LittleSis and other APIs
- undo and redo edits to a graph
- runs on all modern web browsers
- export map as svg or jpeg
- save map to LittleSis.org account

Install
-------

To run Oligrapher app in a web page, include *oligrapher.js*  and *oligrapher.css* on your page and create a element for the map:

```html
<link rel="stylesheet" href="oligrapher.css">
<script src="oligrapher.js"></script>

<div id="example-oligrapher"></div>

<script>
const oli = new Oligrapher({ isEditor: true, domId: "example-oligrapher" })
</script>
```

See [defaultState.ts](./app/util/defaultState.ts) for configuration options

Development
-----------

To run this app in development mode:

```
git clone https://github.com/public-accountability/oligrapher
cd oligrapher
npm install
npm run dev-server
```

Start the webpack dev server : `npm run dev-server`

Then point your browser to [localhost:8090/dev.html](http://localhost:8090/dev.html) to view a demo graph.

Also available:

`/index.html` blank map
`/editor.html` example map in editor mode
`/embedded.html` embedded-mode
`/article.html` an map in embedded-mode using an inframe


Development build: `npm run build-dev`

Production build: `npm run build-prod`

Run tests: `npm test`

Data Schema
-----------

### Node Attributes
- ```id:``` **(required)** a string uniquely identifying the node
- ```name:``` **(required)** a string, which will be displayed underneath the node (on multiple lines if necessary)
- ```scale:``` relative size of node (```1``` is default and smallest)
- ```status:```  default is ```normal```, can also be ```highlighted``` or ```faded```
- ```color:``` hexcodeof node color
- ```image:``` image URL or dataurl
- ```url:``` optional source URL
- ```x:``` x-coordinate of the node's position
- ```y:``` y-coordinate of the node's position
- ```edgeIds``` array of connected edges, calculated internally

### Edge Attributes
- ```id:``` **(required)** an integer or string uniquely identifying the edge
- ```node1_id:``` **(required)** equal to the first node's id
- ```node2_id:``` **(required)** equal to the second node's id
- ```label:``` **(required)** label appearing above the edge
- ```url:``` optional source URL
- ```scale:``` relative thickness of edge (```1``` is default, ```2``` is twice as thick, etc)
- ```status:```  default is ```normal```, can also be ```highlighted``` or ```faded```
- ```arrow:``` Direction of the arrow: ``` 'left', 'right', 'both' or false ```  (default is ```false```)
- ```dash:``` the kind of dash displayed in edge's line (default is ```null```, a solid line)
- ```cx:``` x-coordinate of the control point for the edge's quadratic [Bezier curve](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Bezier_Curves), *relative to the midpoint of the straight line between the two nodes* (if not specified, this is computed to display a slight curve)
- ```cy:``` y-coordinate of the control point for the edge's quadratic [Bezier curve](https://developer.mozilla.org/en-US/docs/Web/SVG/Tutorial/Paths#Bezier_Curves), *relative to the midpoint of the straight line between the two nodes* (if not specified, this is computed to display a slight curve)

### Caption Attributes
- ```id:``` **(required)** an integer or string uniquely identifying the caption
- ```text:``` **(required)** the caption's text content
- ```x:``` x-coordinate of the caption's position
- ```y:``` y-coordinate of the caption's position
- ```size:``` caption font-size
- ```font:``` caption font-family
- ```weight:``` caption font-weight

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
