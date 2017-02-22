import React from "react";
import { shallow } from "enzyme";
import noop from 'lodash/noop';
import merge from 'lodash/merge';
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import EmbeddedNavBar from '../EmbeddedNavBar';
import EmbeddedGraphAnnotation from '../EmbeddedGraphAnnotation';


describe('EmbeddedGraphAnnotations', () => {
  const embedded = {annotationSize: '100px'};
  
  it('should have EmbeddedNavbar', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={10} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find(EmbeddedNavBar).length).toEqual(1);
  });

  it('should have two columns if there is a tracker', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={10} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find('div.col-sm-12').length).toEqual(2);
  });

  it('should not have EmbeddedNavbar if annotation count is 1', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={1} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find(EmbeddedNavBar).length).toEqual(0);
  });

  it('should have EmbeddedGraphAnnotation', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={5} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find(EmbeddedGraphAnnotation).length).toEqual(1);
  });

  it('should have img if provided logoUrl', () => {
    let e = merge(embedded, {logoUrl: '/logo.png'})
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={5} currentIndex={0} prevClick={noop} nextClick={noop} embedded={e} />);
    expect(wrapper.find('img').length).toEqual(1);
  });

  it('should not have img if there is no provided logoUrl', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={5} currentIndex={0} prevClick={noop} nextClick={noop} embedded={embedded} />);
    expect(wrapper.find('img').length).toEqual(1);
  });

});
