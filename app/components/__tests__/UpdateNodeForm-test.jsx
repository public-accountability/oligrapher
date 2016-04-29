jest.disableAutomock();

import React from "react";
import { mount } from "enzyme";

import UpdateNodeForm from "../UpdateNodeForm";
import ChangeColorInput from "../ChangeColorInput";

describe("UpdateNodeForm", () => {
  let wrapper;
  let updateNode;
  let data = {
    id: 1,
    display: { 
      name: "Node",
      color: "#abc",
      status: "highlighted"
    }
  };

  beforeEach(() => {
    updateNode = jest.genMockFunction();
    wrapper = mount(
      <UpdateNodeForm 
        updateNode={updateNode} 
        data={data} 
        deselect={jest.genMockFunction()} />
    );
  });

  it("shows color picker with current node color", () => {
    let picker = wrapper.find(ChangeColorInput);

    expect(picker.length).toBe(1);
    expect(picker.props().value).toBe(data.display.color);
    expect(picker.props().status).toBe(data.display.status);
  });

  it("passes new color to updateNode", () => {
    let picker = wrapper.find(ChangeColorInput);
    let pickerOnChange = picker.props().onChange;
    pickerOnChange("#def");

    expect(updateNode.mock.calls.length).toBe(1);
    expect(updateNode.mock.calls[0][1].display.color).toBe("#def");
  });
});