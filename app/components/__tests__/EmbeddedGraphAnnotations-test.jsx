import React from "react";
import { shallow } from "enzyme";
import noop from 'lodash/noop';
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import EmbeddedNavBar from '../EmbeddedNavBar';
import EmbeddedGraphAnnotation from '../EmbeddedGraphAnnotation';


describe('EmbeddedGraphAnnotations', () => {
  it('should have EmbeddedNavbar', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} />);
    expect(wrapper.find(EmbeddedNavBar).length).toEqual(1);
  });

  it('should have EmbeddedGraphAnnotation', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} />);
    expect(wrapper.find(EmbeddedGraphAnnotation).length).toEqual(1);
  });
});
