jest.dontMock('../Edge');

import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
const Edge = require('../Edge');

describe("Edge Component", () => {
  const data = {
    id: 93362,
    node1_id: 34963,
    node2_id: 15957,
    display: {
      label: "former chair",
      cx: null,
      cy: null,
      scale: 1,
      arrow: true,
      dash: null,
      status: "normal",
      url: "//littlesis.org/relationship/view/id/93362",
      x1: 569.3762350992062,
      y1: -255.7819366545154,
      x2: -56.66444213745007,
      y2: -402.53869654584355,
      s1: 1,
      s2: 1.5
    }
  };

  it("should render a curve with a control point", () => {
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let curve = element.querySelector(".edge-line");

    expect(curve.getAttribute("d")).toMatch(/M [-\d.]+, [-\d.]+ Q [-\d.]+, [-\d.]+, [-\d.]+, [-\d.]+/);
  });

  it("should render a label", () => {
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let label = element.querySelector("text");

    expect(label.textContent).toBe(data.display.label);
  });

  it("should render an arrow", () => {
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let curve = element.querySelector(".edge-line");
    let hasMarker = curve.getAttribute("marker-start") || curve.getAttribute("marker-end");

    expect(hasMarker).toBeTruthy();
  });
});