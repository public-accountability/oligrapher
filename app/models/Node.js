import merge from 'lodash/merge';
import isNumber from 'lodash/isNumber';
import Helpers from './Helpers';

class Node {
  static defaults() {
    return {
      id: Helpers.generateId(),
      display: {
        x: 0,
        y: 0,
        scale: 1,
        status: "normal"
      }
    };    
  }

  static setDefaults(node) {
    return merge({}, this.defaults(), node);
  }

  static hasPosition(node) {
    return isNumber(node.display.x) && isNumber(node.display.y);
  }
}

module.exports = Node;
