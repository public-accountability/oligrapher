import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
import Edge from '../Edge';
import merge from 'lodash/merge';

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
    let getArrow = jest.genMockFunction();
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} getArrow={getArrow}/>
    );
    let element = ReactDOM.findDOMNode(edge);
    let curve = element.querySelector(".edge-line");

    expect(curve.getAttribute("d")).toMatch(/M [-\d.]+, [-\d.]+ Q [-\d.]+, [-\d.]+, [-\d.]+, [-\d.]+/);
  });

  it("should render a label", () => {
    let getArrow = jest.genMockFunction();
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} getArrow={getArrow} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let label = element.querySelector("text");

    expect(label.textContent).toBe(data.display.label);
  });

  /*not sure of most effective way of testing arrow rendering*/
  it("should render an arrow", () => {
    let getArrow = jest.genMockFunction().mockImplementation(function () {
      data["display"]["arrow"] = "1->2";
          return data;
        });
    let updateArrow = jest.genMockFunction();

    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} getArrow={getArrow()} updateArrow={updateArrow} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let curve = element.querySelector(".edge-line");
    let hasMarker = curve.getAttribute("marker-start") || curve.getAttribute("marker-end");

    expect(hasMarker).toBeTruthy();
  });

  it("should call click callback if clicked", () => {
    let getArrow = jest.genMockFunction();
    let updateArrow = jest.genMockFunction();
    let clickEdge = jest.genMockFunction();
    let edge = TestUtils.renderIntoDocument(
      <Edge edge={data} graphId="someid" clickEdge={clickEdge} getArrow={getArrow} updateArrow={updateArrow} />
    );
    let element = ReactDOM.findDOMNode(edge);
    let select = element.querySelector(".edgeSelect");

    TestUtils.Simulate.click(select);
    expect(clickEdge.mock.calls[0][0]).toBe(data.id);
  });

  it('should calculate correct arrow attribute for markerStart', () => {
    let edge = TestUtils.renderIntoDocument(<Edge edge={data}  /> );
    expect(edge._markerStartArrow('1->2', false)).toEqual('');
    expect(edge._markerStartArrow('1->2', true)).toEqual("url(#marker2)");
    expect(edge._markerStartArrow('2->1', false)).toEqual("url(#marker2)");
    expect(edge._markerStartArrow('2->1', true)).toEqual("");
    expect(edge._markerStartArrow('both', true)).toEqual("url(#marker2)");
    expect(edge._markerStartArrow('both', false)).toEqual("url(#marker2)");
  });
  
  it('should calculate correct arrow attribute for markerEnd', () => {
    let edge = TestUtils.renderIntoDocument(<Edge edge={data}  /> );
    expect(edge._markerEndArrow('1->2', false)).toEqual('url(#marker1)');
    expect(edge._markerEndArrow('1->2', true)).toEqual('');
    expect(edge._markerEndArrow('2->1', false)).toEqual('');
    expect(edge._markerEndArrow('2->1', true)).toEqual('url(#marker1)');
    expect(edge._markerEndArrow('both', true)).toEqual("url(#marker1)");
    expect(edge._markerEndArrow('both', false)).toEqual("url(#marker1)");
  });

});
