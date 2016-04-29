jest.disableAutomock();

import React from "react";
import { shallow } from "enzyme";

import ChangeColorInput from "../ChangeColorInput";
import ds from "../../NodeDisplaySettings";
import { CompactPicker } from "react-color";

describe("ChangeColorInput", () => {
  let wrapper;
  let onChange;

  beforeEach(() => {
    onChange = jest.genMockFunction();
    wrapper = shallow(
      <ChangeColorInput
        value="#abc"
        status="highlighted"
        onChange={onChange} />
    );
  });

  it("shows a swatch with the currently selected color", () => {
    let swatch = wrapper.find(".nodeColorInputSwatch");
    expect(swatch.props().style).toEqual({ background: "#abc" });
  });

  it("shows a clear button", () => {
    let clearer = wrapper.find(".nodeColorInputClearer");
    let glyph = wrapper.find(".glyphicon-remove-sign");
    expect(clearer.length).toBe(1);
    expect(glyph.length).toBe(1);
  });

  it("clears color and hides picker when clear button is clicked", () => {
    wrapper.setState({ displayColorPicker: true });
    let clearer = wrapper.find(".nodeColorInputClearer");
    clearer.simulate("click");
    expect(wrapper.state().color).toBe(ds.circleColor["highlighted"]);
  });

  it ("shows and closes color picker when swatch is clicked", () => {
    let swatch = wrapper.find(".nodeColorInputSwatch");
    swatch.simulate("click");

    let picker = wrapper.find(CompactPicker);
    expect(picker.length).toBe(1);
    expect(picker.props().color).toBe("#abc");

    swatch.simulate("click");
    picker = wrapper.find(CompactPicker);
    expect(picker.length).toBe(0);
  });

  it("updates color when receiving new props", () => {
    wrapper.setProps({ value: "#def" });
    expect(wrapper.state().color).toBe("#def");
  });

  it("calls onChange when CompactPicker changes color", () => {
    wrapper.setState({ displayColorPicker: true });
    let picker = wrapper.find(CompactPicker);
    let pickerOnChange = picker.props().onChange;
    pickerOnChange({ hex: "def" });

    expect(onChange.mock.calls.length).toBe(1);
    expect(onChange.mock.calls[0][0]).toBe("#def");
  });
});
