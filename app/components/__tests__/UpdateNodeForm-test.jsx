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
      url: "http://example.com/node",
      image: "http://example.com/image.png",
      color: "#abc",
      scale: 3,
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

  describe("rendering", () => {
    it("shows name input", () => {
      let input = wrapper.ref("name");
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.name);
    });

    it("shows image input", () => {
      let input = wrapper.ref("image");
      expect(input.length).toBe(1);
      expect(input.props().value).toBe(data.display.image);
    });

    it("shows color picker with current node color", () => {
      let picker = wrapper.find(ChangeColorInput);
      expect(picker.length).toBe(1);
      expect(picker.props().value).toBe(data.display.color);
      expect(picker.props().status).toBe(data.display.status);
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
    it("passes updated name to updateNode", () => {
      let input = wrapper.ref("name");
      input.get(0).value = "Noder";
      input.props().onChange();

      expect(updateNode.mock.calls.length).toBe(1);
      expect(updateNode.mock.calls[0][1].display.name).toBe("Noder");
    });

    it("passes updated image to updateNode", () => {
      let input = wrapper.ref("image");
      input.get(0).value = " ";
      input.props().onChange();

      expect(updateNode.mock.calls.length).toBe(1);
      expect(updateNode.mock.calls[0][1].display.image).toBe("");
    });

    it("passes new color to updateNode", () => {
      let picker = wrapper.find(ChangeColorInput);
      let pickerOnChange = picker.props().onChange;
      pickerOnChange("#def");

      expect(updateNode.mock.calls.length).toBe(1);
      expect(updateNode.mock.calls[0][1].display.color).toBe("#def");
    });

    it("passes updated scale to updateNode", () => {
      let select = wrapper.ref("scale");
      select.get(0).value = 1.5;
      select.props().onChange();

      expect(updateNode.mock.calls.length).toBe(1);
      expect(updateNode.mock.calls[0][1].display.scale).toBe(1.5);
    });

    it("passes updated url to updateNode", () => {
      let input = wrapper.ref("url");
      let newUrl = "htt://example.com/noder ";
      input.get(0).value = newUrl;
      input.props().onChange();

      expect(updateNode.mock.calls.length).toBe(1);
      expect(updateNode.mock.calls[0][1].display.url).toBe(newUrl.trim());
    });
  });
});