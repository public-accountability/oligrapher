jest.dontMock('../Graph');
jest.dontMock('../Node');
jest.dontMock('../Edge');
jest.dontMock('../Caption');
jest.dontMock('classnames');

import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
const Graph = require('../Graph');

describe("Graph Component",  () => {

  const data = { id: "someid", nodes: { 1: { id: 1, display: { name: "Node 1", scale: 1, status: "normal", x: 260.81190983749696, y: 78.09522392060452 } }, 2: { id: 2, display: { name: "Node 2", scale: 1, status: "normal", x: 1.3981085859366804, y: -5.974907363126558 } }, 3: { id: 3, display: { name: "Node 3", scale: 1, status: "normal", x: -258.01571204120563, y: -90.04497885992393 } } }, edges: { 1: { id: 1, node1_id: 1, node2_id: 2, display: { label: "Edge 1", cx: null, cy: null, scale: 1, arrow: false, status: "normal", x1: 260.81190983749696, y1: 78.09522392060452, x2: 1.3981085859366804, y2: -5.974907363126558, s1: 1, s2: 1 } }, 2: { id: 2, node1_id: 2, node2_id: 3, display: { label: "Edge 1", cx: null, cy: null, scale: 1, arrow: false, status: "normal", x1: 1.3981085859366804, y1: -5.974907363126558, x2: -258.01571204120563, y2: -90.04497885992393, s1: 1, s2: 1 } } }, captions: { 1: { id: 1, display: { text: "Caption 1", x: -458.01571204120563, y: -90.04497885992393 } } } };

  it("sould render nodes",  () => {
    let graph = TestUtils.renderIntoDocument(
      <Graph graph={data} />
    );
    let element = ReactDOM.findDOMNode(graph);
    let nodes = element.querySelectorAll(".node");

    expect(nodes.length).toBe(Object.keys(data.nodes).length);
  });

  it("sould render edges",  () => {
    let graph = TestUtils.renderIntoDocument(
      <Graph graph={data} />
    );
    let element = ReactDOM.findDOMNode(graph);
    let edges = element.querySelectorAll(".edge");

    expect(edges.length).toBe(Object.keys(data.edges).length);
  });  

  it("sould render captions",  () => {
    let graph = TestUtils.renderIntoDocument(
      <Graph graph={data} />
    );
    let element = ReactDOM.findDOMNode(graph);
    let captions = element.querySelectorAll(".caption");

    expect(captions.length).toBe(Object.keys(data.captions).length);
  });
});