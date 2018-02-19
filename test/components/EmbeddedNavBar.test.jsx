import React from "react";
import { shallow } from "enzyme";
import noop from 'lodash/noop';
import EmbeddedNavBar from 'components/EmbeddedNavBar';
import EmbeddedNavButtons from 'components/EmbeddedNavButtons';
import AnnotationsTracker from 'components/AnnotationsTracker';


describe('EmbeddedNavBar', () => {
  it('should have EmbeddedNavButtons', () => {
    let wrapper = shallow(<EmbeddedNavBar annotationCount={5} currentIndex={1} nextClick={noop} prevClick={noop} />)
    expect(wrapper.find(EmbeddedNavButtons).length).toEqual(1);
  });
  
  it('should have AnnotationsTracker', () => {
    let wrapper = shallow(<EmbeddedNavBar annotationCount={5} currentIndex={1} nextClick={noop} prevClick={noop} />)
    expect(wrapper.find(EmbeddedNavButtons).length).toEqual(1);
  });
});
