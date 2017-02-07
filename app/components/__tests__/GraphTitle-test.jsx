import React from "react";
import { shallow } from "enzyme";
import GraphTitle from '../GraphTitle';

describe('GraphTitle', () => {
  
  it('has h1', () => {
    expect(shallow(<GraphTitle title="title" />).find('h1').length).toEqual(1);
  });
  
  it('does not have embeddedTitle class when isEmbedded is undefined', () => {
    expect(shallow(<GraphTitle title="title" />).find('h1.embeddedTitle').length).toEqual(0);
  });

  it('does not have embeddedTitle class when isEmbedded is false', () => {
    expect(shallow(<GraphTitle title="title" isEmbedded={false} />).find('h1.embeddedTitle').length).toEqual(0);
  });

  it('has embeddedTitle class when isEmbedded is true', () => {
    expect(shallow(<GraphTitle title="title" isEmbedded={true} />).find('h1.embeddedTitle').length).toEqual(1);
  });

});
