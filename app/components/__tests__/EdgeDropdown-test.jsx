import React from "react";
import ReactDOM from 'react-dom';
import { shallow } from "enzyme";
import EdgeDropdown from "../EdgeDropdown";
import { legacyArrowConverter } from '../../helpers';
import EdgeArrowSelector from '../EdgeArrowSelector';
import EdgeDashSelector from '../EdgeDashSelector';

describe("EdgeDropdown", () => {
  
  describe('layout', () => {
    let wrapper = shallow(<EdgeDropdown 
                          updateEdge={jest.fn()}
                          edgeId="123"
                          dash={false}
                          arrow="left" />);

    it('has EdgeDashSelector', () => expect(wrapper.find(EdgeDashSelector).length).toEqual(1));
    it('has two EdgeArrowSelector', () => expect(wrapper.find(EdgeArrowSelector).length).toEqual(2));
  });

  describe('legacyArrowConverter', () => {
    
    it('returns input if given left/right/both', () => {
      expect(legacyArrowConverter('left')).toEqual('left');
      expect(legacyArrowConverter('right')).toEqual('right');
      expect(legacyArrowConverter('both')).toEqual('both');
    });
    
    it('returns left if input is truthy', () => {
      expect(legacyArrowConverter(true)).toEqual('left');
      expect(legacyArrowConverter('yes')).toEqual('left');
    });

    it('returns false if input is falsy', () => {
      expect(legacyArrowConverter(false)).toEqual(false);
      expect(legacyArrowConverter(null)).toEqual(false);
      expect(legacyArrowConverter(undefined)).toEqual(false);
    });
    
  });
  
});
