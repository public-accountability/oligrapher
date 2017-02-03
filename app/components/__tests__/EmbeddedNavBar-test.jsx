import React from "react";
import { shallow } from "enzyme";
import EmbeddedNavBar from '../EmbeddedNavBar';
import EmbeddedNavButtons from '../EmbeddedNavButtons';
import noop from 'lodash/noop';

describe('EmbeddedNavBar', () => {
  it('should have EmbeddedNavButtons', () => {
    let wrapper = shallow(<EmbeddedNavBar annotationCount={5} currentIndex={1} nextClick={noop} prevClick={noop} />)
    expect(wrapper.find(EmbeddedNavButtons).length).toEqual(1);
  });
});
