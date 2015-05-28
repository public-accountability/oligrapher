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
}

module.exports = Converter;
