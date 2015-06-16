var Node = require('./Node');
const helpers = require('./helpers/GraphHelpers');

class Converter{

  static entityToNode(entity){
    return new Node({
      id: helpers.generateId(),
      content: { entity: entity },
      display: {
        x: entity.x,
        y: entity.y,
        name: entity.name,
        scale: entity.scale,
        image: entity.image && entity.image.indexOf('assets/netmap') === -1 ? entity.image : null
      }
    });
  }

  static relToEdgeSpecs(rel){
    return {
      id: helpers.generateId(),
      content: {
        rel: rel
      },
      display: {
        label: rel.label,
        cx: rel.x1,
        cy: rel.y1,
        dash: rel.is_current !== 1,
        scale: rel.scale,
        is_directional: rel.is_directional === true
      }
    };
  }
}

module.exports = Converter;
