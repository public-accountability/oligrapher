var Node = require('./Node');

class Converter{

  static entityToNode(entity){
    return new Node({
      id: genId(),
      content: { entity: entity },
      display: { x: entity.x, y: entity.y, name: entity.name}
    });
    function genId(){ return entity.id; }
  }

  static relToEdgeSpecs(rel){
    return {
      id: rel.id,
      content: {
        rel: rel
      },
      display: {
        label: rel.label,
        x1: rel.x1,
        y1: rel.y1
      }
    };
  }
}

module.exports = Converter;
