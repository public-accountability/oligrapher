jest.disableAutomock();

import React from "react";
import { mount } from "enzyme";

import UpdateEdgeForm from "../UpdateEdgeForm";
import EdgeDropdown from "../EdgeDropdown";


describe("UpdateEdgeForm", () => {
  let wrapper;
  let updateEdge;
  let data = {
    id: 1,
    node1_id: 1,
    node2_id: 2,
    display: { 
      label: "Edge",
      url: "http://example.com/node",
      scale: 3,
      arrow: "right",
      dash: false,
      status: "highlighted"
    }
  };

  beforeEach(() => {
    updateEdge = jest.genMockFunction();
    wrapper = mount(
      <UpdateEdgeForm 
        updateEdge={updateEdge} 
        data={data} 
        deselect={jest.genMockFunction()} />
    );
  });

  describe("rendering", () => {

    it("shows label input", () => {
      let input = wrapper.ref("label");
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.label);
    });

    it("shows a dropdown menu that reflects the selected edge's appearance", () => {
      let edgeDropdown = wrapper.ref("edgeDropdown");
      expect(edgeDropdown.length).toBe(1);
      expect(edgeDropdown.props().arrow).toBe(data.display.arrow);
      expect(edgeDropdown.props().dash).toBe(data.display.dash);
    });

    it("shows scale dropdown with selected option", () => {
      let select = wrapper.ref("scale");
      expect(select.length).toBe(1);
      expect(select.props().value).toBe(data.display.scale);

      let option = select.children().findWhere(child => child.props().value === data.display.scale);
      expect(option.length).toBe(1);
      expect(option.text()).toBe(data.display.scale + "x");
    });

    it("shows url input", () => {
      let input = wrapper.ref("url");
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.url);
    });
  });

  describe("behavior", () => {

    it("passes updated scale to updateEdge", () => {
      let select = wrapper.ref("scale");
      select.get(0).value = 1.5;
      select.props().onChange();

      expect(updateEdge.mock.calls.length).toBe(1);
      expect(updateEdge.mock.calls[0][1].display.scale).toBe(1.5);
    });

    it("passes updated url to updateEdge", () => {
      let input = wrapper.ref("url");
      let newUrl = "htt://example.com/noder ";
      input.get(0).value = newUrl;
      input.props().onChange();

      expect(updateEdge.mock.calls.length).toBe(1);
      expect(updateEdge.mock.calls[0][1].display.url).toBe(newUrl.trim());
    });

    it("passes updated edge appearance to updateEdge", () => {
      let edgeDropdown = wrapper.ref("edgeDropdown");
      let dropdownOnChange = edgeDropdown.props().onChange;
      dropdownOnChange("left", true);

      expect(updateEdge.mock.calls.length).toBe(1);
      expect(updateEdge.mock.calls[0][1].display.arrow).toBe("left");
      expect(updateEdge.mock.calls[0][1].display.dash).toBe(true);
    });

  });
});