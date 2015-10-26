var LsDataConverter = {
  convertMapData: function(data) {
    var nodes =  data.entities.map(function(e) {
      return {
        id: e.id,
        display: { 
          name: e.name,
          x: e.x,
          y: e.y,
          scale: e.scale ? e.scale : 1,
          status: e.status ? e.status : "normal",
          url: null // e.url.match(/littlesis\.org/) ? e.url : "//littlesis.org" + e.url
        }
      };
    });

    var edges = data.rels.map(function(r) {
      return {
        id: r.id,
        node1_id: r.entity1_id,
        node2_id: r.entity2_id,
        display: { 
          label: r.label,
          cx: r.x1,
          cy: r.y1,
          scale: r.scale ? r.scale : 1,
          is_directional: r.is_directional === true,
          is_current: r.is_current === true,
          status: r.status ? r.status : "normal"
        }
      }
    });

    return {
      id: data.id,
      title: data.title,
      nodes: nodes,
      edges: edges,
      captions: []
    };
  },

  convertMapCollectionData: function(data) {
    var that = this;

    return {
      id: data.id,
      title: data.title,
      graphs: data.maps.map(function(map) { 
        return that.convertMapData(map); 
      })
    };
  }
}

window.LsDataConverter = LsDataConverter;
module.exports = LsDataConverter;
