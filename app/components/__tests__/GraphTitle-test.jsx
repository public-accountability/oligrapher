import React from "react";
import { shallow } from "enzyme";
import GraphTitle from '../GraphTitle';

describe('GraphTitle', () => {
  
  it('has h1', () => {
    expect(shallow(<GraphTitle title="title" />).find('h1').length).toEqual(1);
  });
  
  it('does not have fontSize set when isEmedded is false', () => {
    let graphTitle = shallow(<GraphTitle title="title" isEmbedded={false} embedded={{headerFontStyle: {fontSize: '20px'}}} />)
    expect(graphTitle.find('h1').prop('style').fontSize).toBeUndefined();
  });

  it('does not have fontSize set when isEmedded is undefined', () => {
    let graphTitle = shallow(<GraphTitle title="title" />)
    expect(graphTitle.find('h1').prop('style').fontSize).toBeUndefined();
  });

  it('has fontSize set when isEmedded', () => {
    let graphTitle = shallow(<GraphTitle title="title" isEmbedded={true} embedded={{headerFontStyle: {fontSize: '20px'}}} />)
    expect(graphTitle.find('h1').prop('style').fontSize).toEqual('20px');
  })

  it('does not have a link by default', () => {
    let graphTitle = shallow(<GraphTitle title="title" isEmbedded={true} embedded={{headerFontStyle: {fontSize: '20px'}}} />)
    expect(graphTitle.find('a').exists()).toEqual(false);
  })

  it('create link when provided url as prop', () => {
    let graphTitle = shallow(<GraphTitle title="title" isEmbedded={false} url="http://example.com"  />)
    expect(graphTitle.find('a').exists()).toEqual(true);
  })


});
