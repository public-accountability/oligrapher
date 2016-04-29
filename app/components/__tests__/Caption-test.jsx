jest.unmock('../BaseComponent');
jest.unmock('../Caption');
jest.unmock('react-draggable');

import React from 'react'; 
import { shallow } from "enzyme";
import Caption from '../Caption';

describe("Caption Component", () => {

  const data = { id: 1, display: { text: "Here's an interesting fact!" } };

  it("should have an svg transform", () => {
    let wrapper = shallow(
      <Caption caption={data} />
    );
    let element = wrapper.find("g.caption");
    let { x, y } = data.display;

    expect(element.props().transform).toBe(`translate(${x}, ${y})`);
  });

  it("should display text", () => {
    let wrapper = shallow(
      <Caption caption={data} />
    );
    let text = wrapper.find("text");

    expect(text.text()).toBe(data.display.text);
  });

  it("should call click callback if clicked", () => {
    let clickCaption = jest.genMockFunction();
    let wrapper = shallow(
      <Caption caption={data} graphId="someid" clickCaption={clickCaption} altKey={true} skipSetRectWidths={true} />
    );
    let element = wrapper.find("g.caption");
    element.simulate("click");

    expect(clickCaption.mock.calls[0][0]).toBe(data.id);
  });
});