import React from "react";
import { shallow } from "enzyme";
import EmbeddedNavButtons from '../EmbeddedNavButtons';

describe('EmbeddedNavButtons', () => {
  it('should have 2 buttons', () => {
    expect(shallow(<EmbeddedNavButtons annotationCount={2} />).find('button').length).toEqual(2);
  });
});
