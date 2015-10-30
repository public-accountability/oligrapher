const _ = require('lodash');

class Node {
  static defaults() {
    return {
      display: {
        name: 'Node',
        scale: 1,
        status: "normal"
      }
    };    
  }

  static setDefaults(node) {
    return _.merge({}, this.defaults(), node);
  }
}

module.exports = Node;