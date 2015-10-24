var LsDataConverter = {
  convertMapData: function(data) {
    var nodes =  data.entities.map(function(e) {
      return {
        id: e.id,
        display: { 
          name: e.name,
          x: e.x,
          y: e.y,
          scale: e.scale
        }
      };
    });

    var edges = data.rels.map(function(r) {
      return {
        id: r.id,
        n1: r.entity1_id,
        n2: r.entity2_id,
        display: { 
          label: r.label,
          cx: r.x1,
          cy: r.y1,
          scale: r.scale,
          is_directional: r.is_directional === true,
          is_current: r.is_current === true
        }
      }
    });

    return {
      id: data.id,
      title: data.title,
      nodes: nodes,
      edges: edges
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
