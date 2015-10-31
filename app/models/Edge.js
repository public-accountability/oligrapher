import { merge } from 'lodash';

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
    return merge(this.defaults(), edge);
  }
}
