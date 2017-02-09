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

  describe('layout', () => {
    beforeEach( () => wrapper = shallow(<EmbeddedGraphAnnotation annotation={annotation} embedded={embedded} hasTracker={true} />) )
    it('shows title', () =>  expect(wrapper.find('strong').text()).toEqual('Header') );
    it('shows text', () => {
      expect(wrapper.find('#oligrapherEmbeddedGraphAnnotationText').render().text()).toEqual("A modest amount of annotation text.");
    });
  })

  describe('tracker option', () => {
    it('sets height correctly if there is a tracker', () => {
      let element = shallow(<EmbeddedGraphAnnotation annotation={annotation} embedded={embedded} hasTracker={true} />); 
      expect(element.find('#oligrapherEmbeddedGraphAnnotation').prop('style').height).toEqual(55);
    });
    it('sets height correctly if there is not a tracker', () => {
      let element = shallow(<EmbeddedGraphAnnotation annotation={annotation} embedded={embedded} hasTracker={false} />); 
      expect(element.find('#oligrapherEmbeddedGraphAnnotation').prop('style').height).toEqual(85);
    });
  });
});
