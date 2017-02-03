import React from "react";
import { shallow } from "enzyme";
import EmbeddedNavBar from '../EmbeddedNavBar';
import EmbeddedNavButtons from '../EmbeddedNavButtons';

describe('EmbeddedNavBar', () => {
  it('should have EmbeddedNavButtons', () => {
    expect(shallow(<EmbeddedNavBar annotationCount={0}/>).find(EmbeddedNavButtons).length).toEqual(1);
  });
});
