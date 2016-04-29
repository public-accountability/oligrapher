jest.unmock('../BaseComponent');
jest.unmock('../Node');
jest.unmock('../NodeLabel');
jest.unmock('../NodeCircle');
jest.unmock('react-draggable');

import React from 'react'; 
import { shallow } from "enzyme";
import Node from '../Node';
import NodeCircle from "../NodeCircle";
import NodeLabel from "../NodeLabel";

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
    let wrapper = shallow(
      <Node node={data} />
    );
    let element = wrapper.find("g.node");
    let { x, y } = data.display;

    expect(element.props().transform).toBe(`translate(${x}, ${y})`);
  });

  it("should display a NodeCircle", () => {
    let wrapper = shallow(
      <Node node={data} selected={true} />
    );
    let circle = wrapper.find(NodeCircle);

    expect(circle.props().node).toBe(data);
    expect(circle.props().selected).toBe(true);
  });

  it("should display a NodeLabel", () => {
    let wrapper = shallow(
      <Node node={data} selected={true} />
    );
    let label = wrapper.find(NodeLabel);

    expect(label.props().node).toBe(data);
  });

  it("should call click callback if clicked", () => {
    let clickNode = jest.genMockFunction();
    let wrapper = shallow(
      <Node node={data} graph={{id: "someid"}} clickNode={clickNode} />
    );
    let element = wrapper.find("g.node");
    element.simulate("click");

    expect(clickNode.mock.calls[0][0]).toBe(data.id);
  });

  // NOT WORKING: TO FIND .handle WE NEED FULL RENDER, WHICH ISN'T WORKING FOR SVG
  xit("can be dragged to a new position", () => {
    let moveNode = jest.genMockFunction();
    let wrapper = shallow(
      <Node node={data} moveNode={moveNode} />
    );
    let handle = wrapper.find(".handle");

    handle.simulate("dragStart");
    handle.simulate("drag");
    handle.simulate("dragEnd");

    expect(moveNode.mock.calls.length).toBe(1);
  });
});