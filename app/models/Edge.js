import { merge } from 'lodash';

export default class Edge {
  static defaults() {
    return {
      display: { 
        label: "Edge",
        scale: 1,
        arrow: false,
        status: "normal",
      }      
    };
  }

  static setDefaults(edge) {
    return merge(this.defaults(), edge);
  }
}
