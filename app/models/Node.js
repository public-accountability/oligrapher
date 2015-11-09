import { merge } from 'lodash';
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
}

module.exports = Node;