jest.disableAutomock();

import React from "react";
import { mount, shallow } from "enzyme";

import UpdateCaptionForm from "components/UpdateCaptionForm";

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
    updateCaption = jest.fn();
    wrapper = mount(
      <UpdateCaptionForm 
        updateCaption={updateCaption} 
        data={data} 
        deselect={jest.fn()} />
    );
  });

  describe("rendering", () => {
    it("shows text input", () => {
      let input = wrapper.find('input[type="text"]');
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.text);
    });

    it("shows scale dropdown with selected option", () => {
      let select = wrapper.find('select.form-control')
      expect(select.length).toBe(1);
      expect(select.props().value).toBe(data.display.scale);

      let option = select.children().findWhere(child => child.props().value === data.display.scale);
      expect(option.length).toBe(1);
      expect(option.text()).toBe(data.display.scale + "x");
    });
  });

  describe("behavior", () => {
    it("passes updated text to updateCaption", () => {
      let input = wrapper.find('input[type="text"]');
      input.at(0).instance().value = "Caption 2 ";
      input.props().onChange();

      expect(updateCaption.mock.calls.length).toBe(1);
      expect(updateCaption.mock.calls[0][1].display.text).toBe("Caption 2");
    });

    it("passes updated scale to updateCaption", () => {
      let select = wrapper.find('select.form-control');
      select.at(0).instance().value = 1.5;
      select.props().onChange();

      expect(updateCaption.mock.calls.length).toBe(1);
      expect(updateCaption.mock.calls[0][1].display.scale).toBe(1.5);
    });
  });
});
