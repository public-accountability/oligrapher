jest.unmock("../NodeLabel");
jest.unmock("../../NodeDisplaySettings");

import React from "react";
import { shallow } from "enzyme";
import NodeLabel from "../NodeLabel";
import ds from "../../NodeDisplaySettings";
import merge from "lodash/object/merge";

describe("NodeLabel", () => {
  let wrapper;
  const data = {
    id: 34627, 
    display: {
      name: "Benjamin Shalom  Bernanke",
      x: 332.1385584381518,
      y: -305.26797977275623,
      scale: 1,
      status: "highlighted",
      image: "//s3.amazonaws.com/pai-littlesis/images/profile/6a7809b213a39c95b7d15334a33fe1f41e417a7b_1232040065.png",
      url: "//littlesis.org/person/34627/Ben_Bernanke"
    }
  };

  beforeEach(() => {
    wrapper = shallow(
      <NodeLabel node={data} />
    );
  });

  it("should show text with tspans", () => {
    let text = wrapper.find("text");
    expect(text.length).toBe(1);
    expect(text.props().textAnchor).toBe("middle");

    let tspans = wrapper.find("tspan");
    expect(tspans.length).toBe(2);
    expect(tspans.map(tspan => tspan.text()).join(" ")).toBe(data.display.name.replace(/\s+/g, " "));

    tspans.forEach(tspan => {
      expect(tspan.props().fill).toBe(ds.textColor[data.display.status]);
      expect(tspan.props().opacity).toBe(ds.textOpacity[data.display.status]);
    });
  });

  it("should show link", () => {
    let link = wrapper.find("a");
    expect(link.length).toBe(1);
    expect(link.props().xlinkHref).toBe(data.display.url);
    expect(link.props().target).toBe("_blank");
  });

  it("should show rects", () => {
    let rects = wrapper.find("rect");
    expect(rects.length).toBe(2);
  });
});