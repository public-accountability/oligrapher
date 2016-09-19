import merge from 'lodash/merge';
import Helpers from './Helpers';

export default class Edge {
  static defaults() {
    return {
      id: Helpers.generateId(),
      display: { 
        scale: 1,
        arrow: false,
        status: "normal",
      }      
    };
  }

  static setDefaults(edge) {
    return merge(this.defaults(), edge);
  }

  static combine(edge1, edge2) {
    if (!edge2) {
      return edge1;
    }

    return merge({}, edge1, {
      display: {
        label: edge1.display.label + ", " + edge2.display.label,
        scale: Math.max(edge1.display.scale, edge2.display.scale),
        arrow: edge1.display.arrow && edge2.display.arrow && (edge1.node1_id == edge2.node1_id && edge1.node2_id == edge2.node2_id),
        status: this.combineStatuses(edge1.display.status, edge2.display.status)
      }
    });
  }

  static combineStatuses(status1, status2) {
    if (status1 == status2) {
      return status1;      
    } 
    else if (status1 == "highlighted" || status2 == "highlighted") {
      return "highlighted";
    }
    else if (status1 == "normal" || status2 == "normal") {
      return "normal";
    }
    else {
      return "faded";
    }
  }
}
