jest.dontMock('../BaseComponent');
jest.dontMock('../Node');
jest.dontMock('../NodeLabel');
jest.dontMock('../NodeCircle');
jest.dontMock('react-draggable');

import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
const Node = require('../Node');

describe("Node Component", () => {
  const data = {
    id: 34627, 
    display: {
      name: "Ben Bernanke",
      x: 332.1385584381518,
      y: -305.26797977275623,
      scale: 1,
      status: "normal",
      image: "//s3.amazonaws.com/pai-littlesis/images/profile/6a7809b213a39c95b7d15334a33fe1f41e417a7b_1232040065.png",
      url: "//littlesis.org/person/34627/Ben_Bernanke"
    }
  };

  it("should have an svg transform", () => {
    let node = TestUtils.renderIntoDocument(
      <Node node={data} />
    );
    let element = ReactDOM.findDOMNode(node);
    let { x, y } = data.display;

    expect(element.getAttribute("transform")).toBe(`translate(${x}, ${y})`);
  });

  it("should display a name", () => {
    let node = TestUtils.renderIntoDocument(
      <Node node={data} />
    );
    let element = ReactDOM.findDOMNode(node);
    let text = element.querySelector("text");

    expect(text.textContent).toBe(data.display.name);
  });

  it("should display an image if provided an image url", () => {
    let node = TestUtils.renderIntoDocument(
      <Node node={data} />
    );
    let element = ReactDOM.findDOMNode(node);
    let image = element.querySelector("img"); // for some reason we have to select "img" instead of "image"

    expect(image.getAttribute("xlink:href")).toBe(data.display.image);
  });

  it("should swap selection if clicked", () => {
    let clickNode = jest.genMockFunction();
    let node = TestUtils.renderIntoDocument(
      <Node node={data} graph={{id: "someid"}} clickNode={clickNode} />
    );
    let element = ReactDOM.findDOMNode(node);
    let select = element.querySelector(".nodeSelect");

    TestUtils.Simulate.click(select);
    expect(clickNode.mock.calls[0][0]).toBe("someid");
    expect(clickNode.mock.calls[0][1]).toBe(data.id);
  });

  // NOT WORKING: EVENT HANDLERS ARENT TRIGGERED FOR SOME REASON
  xit("can be dragged to a new position", () => {
    let moveNode = jest.genMockFunction();
    let node = TestUtils.renderIntoDocument(
      <Node node={data} moveNode={moveNode} />
    );
    let element = ReactDOM.findDOMNode(node);
    let handle = element.querySelector(".handle");

    TestUtils.Simulate.mouseDown(handle);
    TestUtils.Simulate.mouseUp(handle);

    expect(moveNode.mock.calls.length).toBe(1);
  });
});