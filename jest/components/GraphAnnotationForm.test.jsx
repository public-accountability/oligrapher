import React from "react";
import { shallow, mount } from "enzyme";
import GraphAnnotationForm from "components/GraphAnnotationForm";
import Editor from "react-medium-editor";

describe("GraphAnnotationForm", () => {
  let wrapper;
  let annotation = {
    header: "Header",
    text: "This is some text to test."
  };
  let remove;
  let update;

  beforeEach(() => {
    remove = jest.fn();
    update = jest.fn();
    wrapper = mount(
      <GraphAnnotationForm
        annotation={annotation}
        remove={remove}
        update={update} />
    );
  });

  describe("rendering", () => {
    it("shows header input", () => {
      expect(wrapper.ref("header").value).toEqual(annotation.header);
    });

    it("shows text editor", () => {
      let text = wrapper.find(Editor);
      expect(text.props().text).toBe(annotation.text);
    });

    it("shows delete button", () => {
      let button = wrapper.find("button");
      expect(button.text()).toBe("Remove");
    });
  });

  describe("behavior", () => {
    it("updates annotation with new header", () => {
      let header = wrapper.find('#oligrapherGraphAnnotationFormHeader')
      
      header.at(0).instance().value = 'New Header'
      header.simulate('change');

      expect(update.mock.calls.length).toBe(1);
      expect(update.mock.calls[0][0].header).toBe("New Header");
    });

    it("updates annotation with new text", () => {
      let editor = wrapper.find('#oligrapherGraphAnnotationFormText')
      let newText = "This is some EDITED text to test.";
      editor.get(0).props.onChange(newText);

      expect(update.mock.calls.length).toBe(1);
      expect(update.mock.calls[0][0].text).toBe(newText);
    });

    it("removes annotation when delete button is clicked", () => {
      let button = wrapper.find("button");
      spyOn(window, 'confirm').and.returnValue(true);
      button.simulate("click");

      expect(remove.mock.calls.length).toBe(1);
    });
  });
});
