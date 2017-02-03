import React from "react";
import { shallow } from "enzyme";
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import EmbeddedNavBar from '../EmbeddedNavBar';

describe('EmbeddedGraphAnnotations', () => {
  it('should have EmbeddedNavbar', () => {
    expect(shallow(<EmbeddedGraphAnnotations annotationCount={0} />).find(EmbeddedNavBar).length).toEqual(1);
  });
});
