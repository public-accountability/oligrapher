import React from "react";
import { shallow, mount } from "enzyme";

import GraphNavButtons from "components/GraphNavButtons";

describe("GraphNavButtons", () => {

  describe("rendering", () => {
    let wrapper;

    beforeEach(() => {
      wrapper = mount(
        <GraphNavButtons
          isEditor={true} 
          canClickPrev={true}
          canClickNext={true}
          prevClick={jest.fn()}
          nextClick={jest.fn()}
          swapAnnotations={jest.fn()} />
      );
    });

    const getButton = (wrapper, text) => wrapper.find("button").filterWhere(button => button.text() == text);

    it("shows prev button", () => {
      let prevCanClick = getButton(wrapper, 'Prev');
      
      expect(prevCanClick.length).toBe(1);
      expect(prevCanClick.get(0).props.disabled).toBe(false);

      wrapper.setProps({ canClickPrev: false });
      let prevCanNotClick = getButton(wrapper, 'Prev')
      expect(prevCanNotClick.get(0).props.disabled).toBe(true);
    });

    it("shows next button when canClickNext is false", () => {
      let next = getButton(wrapper, 'Next');
      expect(next.length).toBe(1);
      expect(next.get(0).props.disabled).toBe(false);
    });

    it("shows next button when canClickNext is true", () => {
      wrapper.setProps({ canClickNext: false });
      let next = getButton(wrapper, 'Next');
      expect(next.length).toBe(1);
      expect(next.get(0).props.disabled).toBe(true);
    });

    it("shows hide button", () => {
      let hide = wrapper.find("#oligrapherHideAnnotationsButton");
      expect(hide.length).toBe(1);
    });


  });

  describe("alternateRendering", () => {
    let wrapper;
     let annotations = [
      { id: 1, header: "Annotation 1", text: "<p>annotation text 1</p>" }
    ];

    beforeEach(() => {
      wrapper = mount(
        <GraphNavButtons
          annotations={annotations}
          isEditor={false} 
          canClickPrev={true}
          canClickNext={true}
          prevClick={jest.fn()}
          nextClick={jest.fn()}
          swapAnnotations={jest.fn()} />
      );
    });

    it("doesn't show prev button", () => {
      let prev = wrapper.find("button").filterWhere(button => button.text() == "Prev");
      expect(prev.length).toBe(0);
    });

    it("shows next button", () => {
      let next = wrapper.find("button").filterWhere(button => button.text() == "Next");
      expect(next.length).toBe(0);
    });

    it("shows hide button", () => {
      let hide = wrapper.find("#oligrapherHideAnnotationsButton");
      expect(hide.length).toBe(1);
    });


  });

  describe("behavior", () => {
    let prevClick = jest.fn();
    let nextClick = jest.fn();
    let swapAnnotations = jest.fn();
    let wrapper;

    beforeEach(() => {
      wrapper = shallow(
        <GraphNavButtons 
          isEditor={true} 
          canClickPrev={true}
          canClickNext={true}
          prevClick={prevClick}
          nextClick={nextClick}
          swapAnnotations={swapAnnotations} />
      );
    });    

    it("uses prevClick", () => {
      let prev = wrapper.find("button").filterWhere(button => button.text() == "Prev");
      prev.simulate("click");
      expect(prevClick.mock.calls.length).toBe(1);
    });

    it("uses nextClick", () => {
      let next = wrapper.find("button").filterWhere(button => button.text() == "Next");
      next.simulate("click");
      expect(nextClick.mock.calls.length).toBe(1);
    });

    it("uses swapAnnotations", () => {
      let hide = wrapper.find("#oligrapherHideAnnotationsButton");
      hide.simulate("click");
      expect(swapAnnotations.mock.calls.length).toBe(1);
    });
  });
});  
