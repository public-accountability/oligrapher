# State Object

## Reducers

### Graph

The core elements of the graph

`nodes`         {Nodes}
`edges`         {Edges}
`captions`      {Captions}
`Annotations`   [Annotations]

### Display

When ` story = true ` it's in "story mode" otherwise it's presentation mode

`embedded` is a view-only mode designed to be used in an iFrame on websites. It can be
used in conjunction with either story mode or presentation mode.

`editor` enables the editor. When the editor is enabled "story" toggles between editing the annotations or graph itself.

Editor cannot be enabled while embedded is set to true.

`zoom`               Number               Zoom state
`story`              Boolean              Display annotations
`embedded`           Boolean              Use alternative embedded layout
`editor`             Boolean              Display the editor
`highlight`          Object               Nodes and Edges to highlight
`highlight.nodes`    Array
`highlight.edges`    Array
`highlight.captions` Array
`selection`          Object               Nodes and Edges that are selected
`selection.nodes`    Array
`selection.edges`    Array
`selection.captions` Array

### Settings

`dataSource`       String|Object          API to fetch new data
`debug`            Boolean                Debugging messages
`domId`            String                 Element ReactDOM's renders into
`draggableNodes`   Boolean                Can the nodes be dragged
`draggableEdges`   Boolean                Can the edges be dragged

### Hooks

Call backs for various oligrapher actions

`onSave`      Function
`onNav`       Function


### Attributes

Header, metadata, and other graph settings.

`id`           Number|String
`title`        String
`subtitle`     String
`date`         String
`user`         Object
`user.name`    String
`user.url`     String (valid url)
`links`        [Link]
`settings`     Object



## TYPES

### Node

- ```id:``` **(required)** an integer or string uniquely identifying the node
- ```display:``` **(required)** an object with attributes related to the node's appearance
  - ```name:``` **(required)** a string, which will be displayed underneath the node (on multiple lines if necessary)
  - ```scale:``` relative size of node (```1``` is default, ```1.5``` is 50% wider, etc)
  - ```status:```  default is ```normal```, can also be ```highlighted``` or ```faded```
  - ```image:``` optional image URL
  - ```url:``` optional source URL
  - ```x:``` x-coordinate of the node's position
  - ```y:``` y-coordinate of the node's position


### Edge
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
  - ```cx:``` x-coordinate of the control point for the edge's quadratic
  - ```cy:``` y-coordinate of the control point for the edge's quadratic


### Caption
- ```id:``` **(required)** an integer or string uniquely identifying the caption
- ```display:``` **(required)** an object with attributes related to the captions's appearance
  - ```text:``` **(required)** the caption's text content
  - ```x:``` x-coordinate of the caption's position
  - ```y:``` y-coordinate of the caption's position



### Annotation

`header`     String
`text`       String
`nodeIds`    Array
`edgeIds`    Array
`captionIds` Array
