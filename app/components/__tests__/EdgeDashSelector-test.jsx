import React from 'react'; 
import { shallow } from "enzyme";
import EdgeDashSelector from '../EdgeDashSelector';

describe('EdgeDashSelector', () => {
  
  it('sets svgDropdownDashed if dashed', () => {
    let wrapper = shallow(<EdgeDashSelector isDashed={true} updateEdge={jest.fn()} edgeId="x"/>);
    expect(wrapper.find('.svgDropdownDashed').length).toEqual(1);
  });
  
  it('does not set svgDropdownDashed if not dashed', () => {
    let wrapper = shallow(<EdgeDashSelector isDashed={false} updateEdge={jest.fn()} edgeId="x "/>);
    expect(wrapper.find('.svgDropdownDashed').length).toEqual(0);
  });

  describe('click on menu', () => {
    let wrapper = shallow(<EdgeDashSelector isDashed={false} updateEdge={jest.fn()} edgeId="x "/>);
    it('updates state and re-renders', ()=>{
      expect(wrapper.state().isOpen).toBe(false);
      expect(wrapper.find('.edgeDropdownOptions').length).toEqual(0);
      wrapper.find('.selectedEdgeDisplay').childAt(0).simulate('click');
      expect(wrapper.state().isOpen).toBe(true);
      expect(wrapper.find('.edgeDropdownOptions').length).toEqual(1);
    });
  });

  describe('select an option', ()=>{
    it('calls updateEdge with correct arg - undashed', () =>{
      let updateEdgeMock = jest.fn();
      let wrapper = shallow(<EdgeDashSelector isDashed={false} updateEdge={updateEdgeMock} edgeId="x"/>);
      wrapper.find('.selectedEdgeDisplay').childAt(0).simulate('click');
      wrapper.find('.svgDropdownUndashed').simulate('click');
      expect(updateEdgeMock.mock.calls.length).toEqual(1);
      expect(updateEdgeMock.mock.calls[0]).toEqual(['x', {display: {dash: false} } ]);
      expect(wrapper.state().isOpen).toBe(false);
      
    });
    it('calls updateEdge with correct arg - dashed', () =>{
      let updateEdgeMock = jest.fn();
      let wrapper = shallow(<EdgeDashSelector isDashed={false} updateEdge={updateEdgeMock} edgeId="x" />);
      wrapper.find('.selectedEdgeDisplay').childAt(0).simulate('click');
      wrapper.find('.svgDropdownDashed').simulate('click');
      expect(updateEdgeMock.mock.calls.length).toEqual(1);
      expect(updateEdgeMock.mock.calls[0]).toEqual(['x', {display: {dash: true}} ]);
      expect(wrapper.state().isOpen).toBe(false);
    });
  });
  
});
