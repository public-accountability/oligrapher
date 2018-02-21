import merge from 'lodash/merge';
import Helpers from './Helpers';
import eds from '../EdgeDisplaySettings';
import nds from '../NodeDisplaySettings';

export default class Edge {
  static defaults() {
    return {
      id: Helpers.generateId(),
      display: { 
        scale: 1,
        arrow: false,
        status: "normal"
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

  static calculateGeometry(state) {
    // let edge = this.props.edge;
    let { cx, cy, x1, y1, x2, y2, s1, s2 } = state;
    let r1 = s1 * nds.circleRadius;
    let r2 = s2 * nds.circleRadius;

    // set edge position at midpoint between nodes
    let x = (x1 + x2) / 2;
    let y = (y1 + y2) / 2;

    // keep track of which node is on left and right ("a" is left, "b" is right)
    let xa, ya, xb, yb, is_reverse;

    if (x1 < x2) {
      xa = x1;
      ya = y1;
      xb = x2;
      yb = y2;
      is_reverse = false;
    } else {
      xa = x2;
      ya = y2;
      xb = x1;
      yb = y1;
      is_reverse = true;
    }

    // generate curve offset if it doesn't exist
    if (!cx || !cy) {
      cx = -(ya - y) * eds.curveStrength;
      cy = (xa - x) * eds.curveStrength;
    }

    // calculate absolute position of curve midpoint
    let mx = cx + x;
    let my = cy + y;

    // curves should not reach the centers of nodes but rather stop at their edges, so we:

    // calculate spacing between curve endpoint and node center
    let sa = is_reverse ? s2 : s1;
    let sb = is_reverse ? s1 : s2;
    let ra = (is_reverse ? r2 : r1) + (sa * nds.circleSpacing);
    let rb = (is_reverse ? r1 : r2) + (sb * nds.circleSpacing);

    // calculate angle from curve midpoint to node center
    let angleA = Math.atan2(ya - my, xa - mx);
    let angleB = Math.atan2(yb - my, xb - mx);

    // x and y offsets for curve endpoints are the above spacing times the cos and sin of the angle
    let xma = ra * Math.cos(angleA);
    let yma = ra * Math.sin(angleA);
    let xmb = rb * Math.cos(angleB);
    let ymb = rb * Math.sin(angleB);

    // finally update edge with new curve endpoints
    xa = xa - xma;
    ya = ya - yma;
    xb = xb - xmb;
    yb = yb - ymb;

    return { x, y, cx, cy, xa, ya, xb, yb, is_reverse };
  }
  
}
