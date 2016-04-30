jest.disableAutomock();

import React from "react";
import { mount } from "enzyme";

import UpdateCaptionForm from "../UpdateCaptionForm";

describe("UpdateCaptionForm", () => {
  let wrapper;
  let updateCaption;
  let data = {
    id: 1,
    node1_id: 1,
    node2_id: 2,
    display: { 
      text: "Caption",
      scale: 3,
      status: "highlighted"
    }
  };

  beforeEach(() => {
    updateCaption = jest.genMockFunction();
    wrapper = mount(
      <UpdateCaptionForm 
        updateCaption={updateCaption} 
        data={data} 
        deselect={jest.genMockFunction()} />
    );
  });

  describe("rendering", () => {
    it("shows text input", () => {
      let input = wrapper.ref("text");
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.text);
    });

    it("shows scale dropdown with selected option", () => {
      let select = wrapper.ref("scale");
      expect(select.length).toBe(1);
      expect(select.props().value).toBe(data.display.scale);

      let option = select.children().findWhere(child => child.props().value === data.display.scale);
      expect(option.length).toBe(1);
      expect(option.text()).toBe(data.display.scale + "x");
    });
  });

  describe("behavior", () => {
    it("passes updated text to updateCaption", () => {
      let input = wrapper.ref("text");
      input.get(0).value = "Caption 2 ";
      input.props().onChange();

      expect(updateCaption.mock.calls.length).toBe(1);
      expect(updateCaption.mock.calls[0][1].display.text).toBe("Caption 2");
    });

    it("passes updated scale to updateCaption", () => {
      let select = wrapper.ref("scale");
      select.get(0).value = 1.5;
      select.props().onChange();

      expect(updateCaption.mock.calls.length).toBe(1);
      expect(updateCaption.mock.calls[0][1].display.scale).toBe(1.5);
    });
  });
});