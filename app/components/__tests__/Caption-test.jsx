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

  it("should swap selection if alt+clicked", () => {
    let selectCaption = jest.genMockFunction();
    let caption = TestUtils.renderIntoDocument(
      <Caption caption={data} graph={{id: "someid"}} selectCaption={selectCaption} altKey={true} />
    );
    let element = ReactDOM.findDOMNode(caption);

    TestUtils.Simulate.click(element);
    expect(selectCaption.mock.calls[0][0]).toBe(data.id);
  });

  it("should not swap selection if clicked without alt key", () => {
    let selectCaption = jest.genMockFunction();
    let caption = TestUtils.renderIntoDocument(
      <Caption caption={data} graph={{id: "someid"}} selectCaption={selectCaption} altKey={false} />
    );
    let element = ReactDOM.findDOMNode(caption);

    TestUtils.Simulate.click(element);
    expect(selectCaption.mock.calls.length).toBe(0);
  });
});