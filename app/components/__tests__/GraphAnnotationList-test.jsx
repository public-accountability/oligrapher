import React from "react";
import { shallow, mount } from "enzyme";

import GraphAnnotationList from "../GraphAnnotationList";

describe("GraphAnnotationList", () => {
  let wrapper;
  let annotations = [
    { id: 1, header: "Annotation 1", text: "<p>annotation text 1</p>" },
    { id: 2, header: "Annotation 2", text: "<p>annotation text 2</p>" },
    { id: 3, header: "", text: "<p>annotation text 3</p>" },
    { id: 4, header: "Annotation 4", text: "<p>annotation text 4</p>" }
  ];

  describe("rendering", () => {
    let currentIndex;

    beforeEach(() => {
      currentIndex = 3;
      wrapper = shallow(
        <GraphAnnotationList 
          annotations={annotations}
          currentIndex={currentIndex}
          isEditor={true}
          create={jest.genMockFunction()}
          show={jest.genMockFunction()}
          move={jest.genMockFunction()}
          hideEditTools={jest.genMockFunction()} />
      );
    });

    it("shows annotations", () => {
      let items = wrapper.find("li");
      items.forEach((item, i) => {
        expect(item.props()["data-id"]).toBe(i);
        expect(item.props().draggable).toBe(true);
        expect(item.text()).toBe(annotations[i].header || "Untitled Annotation");

        if (i == currentIndex) {
          expect(item.props().className).toBe("active");
        }
      });
    });

    it("shows add button", () => {
      let button = wrapper.find("button");
      expect(button.text()).toBe("New Annotation");
    });
  });

  describe("behavior", () => {
    let currentIndex = 3;
    let create, show, move, hideEditTools;

    beforeEach(() => {
      create = jest.genMockFunction();
      show = jest.genMockFunction();
      move = jest.genMockFunction();
      hideEditTools = jest.genMockFunction();
      wrapper = mount(
        <GraphAnnotationList 
          annotations={annotations}
          currentIndex={currentIndex}
          isEditor={true}
          create={create}
          show={show}
          move={move}
          hideEditTools={hideEditTools} />
      );
    });

    it("shows annotation when clicked", () => {
      let items = wrapper.find("li");
      items.forEach(item => {
        item.simulate("click", { target: { dataset: { id: item.props()["data-id"] } } });
      });

      expect(show.mock.calls.length).toBe(items.length);
      expect(show.mock.calls.map(call => call[0])).toEqual(annotations.map((a, i) => i));
      expect(hideEditTools.mock.calls.length).toBe(items.length);
    });

    it("creates annotation", () => {
      let button = wrapper.find("button");
      button.simulate("click");
      expect(create.mock.calls.length).toBe(1);
    });

    // TODO: test dragging
  });
});
