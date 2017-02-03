import React from "react";
import { shallow } from "enzyme";
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import EmbeddedNavBar from '../EmbeddedNavBar';
import noop from 'lodash/noop';

describe('EmbeddedGraphAnnotations', () => {
  it('should have EmbeddedNavbar', () => {
    let wrapper = shallow(<EmbeddedGraphAnnotations annotationCount={0} currentIndex={0} prevClick={noop} nextClick={noop} />);
    expect(wrapper.find(EmbeddedNavBar).length).toEqual(1);
  });
});
