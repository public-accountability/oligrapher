import React from "react";
import { shallow } from "enzyme";
import noop from 'lodash/noop';
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import EmbeddedNavBar from '../EmbeddedNavBar';
import EmbeddedGraphAnnotation from '../EmbeddedGraphAnnotation';


describe('EmbeddedGraphAnnotations', () => {
  const embedded = {annotationSize: '100px'};
  
  it('sets div height', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find('#oligrapherEmbeddedGraphAnnotations').prop('style').height).toEqual('100px');
  });

  it('should have EmbeddedNavbar', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find(EmbeddedNavBar).length).toEqual(1);
  });

  it('should have EmbeddedGraphAnnotation', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find(EmbeddedGraphAnnotation).length).toEqual(1);
  });
});
