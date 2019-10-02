/*
 This contains the props for the root element of a very simple graph that contains:
4 nodes, 3 edges, 1 caption, and 1 annotation with nothing selected.
*/

export const  props = {};
props.canUndo = false;
props.canRedo = false;
props.selection =  {"nodeIds":[],"edgeIds":[],"captionIds":[]};
props.zoom = 1;
props.showEditTools = true;
props.addForm = null;
props.nodeResults = [];
props.title = "just a test map";
props.currentIndex = 0;
props.numAnnotations =  1;
props.annotation = {
  "id": "BJQrZSrD",
  "header": "Node 4 is up to something.",
  "text": "",
  "nodeIds": ["rylk-HBv"],
  "edgeIds": [],
  "captionIds": []
};
props.annotations =  [{"id":"BJQrZSrD","header":"Node 4 is up to something.","text":"","nodeIds":["rylk-HBv"],"edgeIds":[],"captionIds":[]}];
props.visibleAnnotations =  true;
props.graphSettings = {
  is_private:false,
  is_featured:false
};
props.hasSettings = true;
props.showHelpScreen =  false;
props.showSettings = false;

props.height = 500;
props.embedded = {
  headerSize: '100px',
  headerFontSize: '20px',
  annotationSize: '100px'
};

props.graph =  {
  "nodes": {
    "r11ooVSP": {
      "id": "r11ooVSP",
      "display": {
        "x": 94.16432563629611,
        "y": 0,
        "scale": 1,
        "status": "normal",
        "name": "node1"
      }
    },
    "Hkfoo4BP": {
      "id": "Hkfoo4BP",
      "display": {
        "x": -183.90870191102516,
        "y": 36.69999920637521,
        "scale": 1,
        "status": "normal",
        "name": "node2",
        "color": "#ccc"
      }
    },
    "H1SisNBv": {
      "id": "H1SisNBv",
      "display": {
        "x": -47.0821628181481,
        "y": -81.54869813126268,
        "scale": 1,
        "status": "normal",
        "name": "node3"
      }
    },
    "Hk2TjVrw": {
      "id": "Hk2TjVrw",
      "display": {
        "x": -110.20110811532244,
        "y": -226.64049288336088,
        "scale": 1,
        "status": "normal",
        "name": "node4"
      }
    }
  },
  "edges": {
    "S1Qhs4rw": {
      "id": "S1Qhs4rw",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "connection",
        "x1": -183.90870191102516,
        "y1": 36.69999920637521,
        "x2": -47.0821628181481,
        "y2": -81.54869813126268,
        "s1": 1,
        "s2": 1,
        "cx": -49.01543706943632,
        "cy": -97.94717582738568
      },
      "node1_id": "Hkfoo4BP",
      "node2_id": "H1SisNBv"
    },
    "SyBajVBv": {
      "id": "SyBajVBv",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "shhhh",
        "x1": 94.16432563629611,
        "y1": 0,
        "x2": -47.0821628181481,
        "y2": -81.54869813126268,
        "s1": 1,
        "s2": 1
      },
      "node1_id": "r11ooVSP",
      "node2_id": "H1SisNBv"
    },
    "r1EV24BP": {
      "id": "r1EV24BP",
      "display": {
        "scale": 1,
        "arrow": false,
        "status": "normal",
        "label": "love/hate",
        "x1": -110.20110811532244,
        "y1": -226.64049288336088,
        "x2": -47.0821628181481,
        "y2": -81.54869813126268,
        "s1": 1,
        "s2": 1,
        "cx": null,
        "cy": null
      },
      "node1_id": "Hk2TjVrw",
      "node2_id": "H1SisNBv"
    }
  },
  "captions": {
    "rJkd24rv": {
      "id": "rJkd24rv",
      "display": {
        "text": "corporate lies!",
        "x": -302.6755074222323,
        "y": -128.26558970864625,
        "scale": "2",
        "status": "normal"
      }
    }
  }
};
