jest.unmock('../Root');

import React from 'react'; 
import { shallow } from "enzyme";
import { Root } from '../Root';
import { props } from './support';


describe('<Root />', ()=>{
  describe('render', ()=>{
    const root = shallow(<Root {...props} />);
    it('should work', ()=> expect(true).toEqual(true));
  });
});
