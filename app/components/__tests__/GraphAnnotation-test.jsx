import React from "react";
import { shallow } from "enzyme";
import GraphAnnotation from "../GraphAnnotation";

describe("GraphAnnotation", () => {
  let wrapper;
  let annotation = {
    header: "Header",
    text: "<p>A modest amount of <strong>annotation text</strong>."
  };

  beforeEach(() => {
    wrapper = shallow(
      <GraphAnnotation annotation={annotation} />
    );
  });

  it("shows header", () => {
    let header = wrapper.find("h2");
    expect(header.text()).toBe(annotation.header);
  });

  it("shows text", () => {
    let text = wrapper.find("#oligrapherGraphAnnotationText");
    expect(text.props().dangerouslySetInnerHTML.__html).toBe(annotation.text);
  });
});
