jest.dontMock('../BaseComponent');
jest.dontMock('../Caption');
jest.dontMock('react-draggable');

import React from 'react'; 
import ReactDOM from 'react-dom'; 
import TestUtils from 'react-addons-test-utils';
const Caption = require('../Caption');

describe("Caption Component", () => {

  const data = { id: 1, display: { text: "Here's an interesting fact!" } };

  it("should have an svg transform", () => {
    let caption = TestUtils.renderIntoDocument(
      <Caption caption={data} />
    );
    let element = ReactDOM.findDOMNode(caption);
    let { x, y } = data.display;

    expect(element.getAttribute("transform")).toBe(`translate(${x}, ${y})`);
  });

  it("should display text", () => {
    let caption = TestUtils.renderIntoDocument(
      <Caption caption={data} />
    );
    let element = ReactDOM.findDOMNode(caption);
    let text = element.querySelector("text");

    expect(text.textContent).toBe(data.display.text);
  });

  it("should call click callback if clicked", () => {
    let clickCaption = jest.genMockFunction();
    let caption = TestUtils.renderIntoDocument(
      <Caption caption={data} graphId="someid" clickCaption={clickCaption} altKey={true} />
    );
    let element = ReactDOM.findDOMNode(caption);

    TestUtils.Simulate.click(element);
    expect(clickCaption.mock.calls[0][0]).toBe("someid");
    expect(clickCaption.mock.calls[0][1]).toBe(data.id);
  });
});