const React = require('react');
const BaseComponent = require('./BaseComponent');
const Node = require('./Node');
const Edge = require('./Edge');
const Marty = require('marty');
const Draggable = require('react-draggable');
const _ = require('lodash');

class Graph extends BaseComponent {
  constructor() {
    super();
  }

  render() {
    const sp = this._getSvgParams(this.props.graph);
    const viewBox = this.props.prevGraph ? this._computeViewbox(this.props.prevGraph, this.props.shrinkFactor) : sp.viewBox;

    return (
      <svg id="svg" version="1.1" xmlns="http://www.w3.org/2000/svg" className="Graph" width="100%" viewBox={viewBox} preserveAspectRatio="xMidYMin">
        <Draggable
          ref="zoom"
          handle="#zoom-handle"
          moveOnStartChange={false}
          zIndex={100} >

          <g id="zoom">
            <rect id="zoom-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
            { sp.edges }
            { sp.nodes }
            { sp.captions }
          </g>

        </Draggable>
        <defs dangerouslySetInnerHTML={ { __html: sp.markers } }/>
      </svg>
    );
  }

  componentDidMount() {
    React.findDOMNode(this).setAttribute("xmlns:xlink", "http://www.w3.org/1999/xlink");
    this._setSVGHeight();
    this._animateTransition();
  }

  componentDidUpdate() {
    this._animateTransition();    
  }

  _setSVGHeight() {
    const height = document.getElementById("mainContainer").clientHeight - 120;
    React.findDOMNode(this).setAttribute("height", height);    
  }

  _animateTransition(duration = 0.7) {    
    this._resetZoomState();

    if (!this._isSmallDevice() && this.props.prevGraph !== undefined) {
      const oldViewbox = this._computeViewbox(this.props.prevGraph).split(" ").map(function(part) { return parseInt(part); });
      const newViewbox = this._computeViewbox(this.props.graph).split(" ").map(function(part) { return parseInt(part); });
      const start = this._now();
      const that = this;

      let req;

      const draw = function() {
        req = requestAnimationFrame(draw);

        let time = (that._now() - start);
        let fraction = time / duration;
        let viewbox = oldViewbox.map(function(part, i) {
          return oldViewbox[i] + (newViewbox[i] - oldViewbox[i]) * that._linear(fraction);
        }).join(" ");

        React.findDOMNode(that).setAttribute("viewBox", viewbox);

        if (time > duration) {
          cancelAnimationFrame(req);
        }
      };

      requestAnimationFrame(draw);

    } else {
      React.findDOMNode(this).setAttribute("viewBox", this._computeViewbox(this.props.graph, this.props.shrinkFactor));
    }
  }

  _linear(t) {
    return t;
  }

  _easeInOutQuad(t) { 
    return (t < .5) ? (2 * t * t) : (-1 + (4 - 2 * t) * t);
  }

  _now() {
    return new Date().getTime() / 1000;
  }

  _resetZoomState() {
    this.refs.zoom.resetState();    
  }

  _getSvgParams(graph) {
    return {
      edges: _.values(graph.edges).map(e => <Edge key={e.id} edge={e} />),
      nodes: _.values(graph.nodes).map(n => <Node key={n.id} node={n} />),
      markers: `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5" fill="#999"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5" fill="#999"></path></marker><marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker>`,
      viewBox: this._computeViewbox(graph, this.props.shrinkFactor),
      captions: _.values(this.props.graph.display.captions || []).map(c => <text x={c.x} y={c.y}>{c.text}</text>)
    };
  }

  _computeViewbox(graph, shrinkFactor = 1.2) {
    const highlightedOnly = true;
    const rect = graph.computeViewbox(highlightedOnly);
    const w = Math.max(rect.w * shrinkFactor, 600);
    const h = Math.max(rect.h * shrinkFactor, 400);
    const x = rect.x + rect.w/2 - (w/2);
    const y = rect.y + rect.h/2 - (h/2);

    return `${x} ${y} ${w} ${h}`;
  }

  _isSmallDevice() {
    return window.innerWidth < 990;
  }
}

module.exports = Marty.createContainer(Graph, {
  listenTo: ['deckStore'],
  fetch: {
    shrinkFactor() {
      return this.app.deckStore.getShrinkFactor();
    },
    prevGraph() {
      const graphId = this.app.deckStore.getPrevGraphId();

      if (!graphId) {
        return undefined;
      }

      return this.app.graphStore.getGraph(graphId);
    }
  }
});