const BaseComponent = require('./BaseComponent');
const Node = require('./Node');
const Edge = require('./Edge');
const Marty = require('marty');
const Draggable = require('react-draggable');

class Graph extends BaseComponent {
  constructor() {
    super();
  }

  render(){
    const markers = `<marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L10,0L0,5"></path></marker><marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto"><path d="M0,-5L-10,0L0,5"></path></marker>`;
    const viewBox = this._computeViewbox();

    return (
      <svg version="1.1" xmlns="http://www.w3.org/2000/svg" xlink="http://www.w3.org/1999/xlink" className="Graph" width='100%' height='100%' viewBox={viewBox} preserveAspectRatio="xMinYMin">
        <Draggable
          handle="#zoom-handle"
          moveOnStartChange={false}
          zIndex={100} >

          <g id="zoom">
            <rect id="zoom-handle" x="-5000" y="-5000" width="10000" height="10000" fill="#fff" />
            { this.props.graph.edges.map(e =>
                <Edge key={e.id} edge={e} />) }
            { this.props.graph.nodes.map(n =>
                <Node key={n.id} node={n} />) }
          </g>

        </Draggable>
        <defs dangerouslySetInnerHTML={ { __html: markers } }/>
      </svg>
    );
  }

  _computeViewbox() {
    const w = this.props.graph.computeWidth() * 1.2;
    const h = this.props.graph.computeWidth() * 1.2;
    const x = -w/2;
    const y = -h/2;
    return `${x} ${y} ${w} ${h}`;
  }
}

module.exports = Marty.createContainer(Graph);
