const _ = require('lodash');

export default class Edge {
  static defaults() {
    return {
      display: { 
        label: "Edge",
        scale: 1,
        is_directional: false,
        is_current: true,
        status: "normal",
      }      
    };
  }

  static setDefaults(edge) {
    return _.merge(this.defaults(), edge);
  }
}
