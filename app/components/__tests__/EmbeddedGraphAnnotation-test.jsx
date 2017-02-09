import React from "react";
import { shallow } from "enzyme";
import EmbeddedGraphAnnotation from "../EmbeddedGraphAnnotation";

describe('EmbeddedGraphAnnotation', () => {
  let wrapper;
  let annotation = {
    header: "Header",
    text: "<p>A modest amount of <strong>annotation text</strong>."
  };
  let embedded = {annotationHeight: 100}

  beforeEach( () => wrapper = shallow(<EmbeddedGraphAnnotation annotation={annotation} embedded={embedded} />) )

  it('shows title', () =>  expect(wrapper.find('strong').text()).toEqual('Header') );

  it('shows text', () => {
    expect(wrapper.find('#oligrapherEmbeddedGraphAnnotationText').render().text()).toEqual("A modest amount of annotation text.");
  });
  
});
