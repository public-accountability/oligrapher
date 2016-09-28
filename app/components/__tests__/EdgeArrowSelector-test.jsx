import React from 'react'; 
import { shallow } from "enzyme";
import EdgeArrowSelector from '../EdgeArrowSelector';
import { newArrowState } from '../../helpers';


const element = () => shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="left" arrow="left" />);

describe('EdgeArrowSelector', () => {
   
  it('has dropDownHolder', () => expect(element().find('.dropdownHolder').length).toEqual(1));
  it('has selectedEdgeDisplay', () => expect(element().find('.selectedEdgeDisplay').length).toEqual(1));
  it('sets correct class name for left-left', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="left" arrow="left" />);
    expect(e.find('.svgDropdownLeftArrow').length).toEqual(1);
  });
  it('sets correct class name for left-right', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="left" arrow="right" />);
    expect(e.find('.svgDropdownLeftArrow').length).toEqual(0);
  });
  it('sets correct class name for right-right', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="right" arrow="right" />);
    expect(e.find('.svgDropdownRightArrow').length).toEqual(1);
  });
  it('sets correct class name for right-left', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="right" arrow="left" />);
    expect(e.find('.svgDropdownRightArrow').length).toEqual(0);
  });
  it('sets correct class name for right-both', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="right" arrow="both" />);
    expect(e.find('.svgDropdownRightArrow').length).toEqual(1);
  });
  it('sets correct class name for left-both', () =>{
    let e = shallow(<EdgeArrowSelector updateEdge={jest.fn()} edgeId="x" arrowSide="left" arrow="both" />);
    expect(e.find('.svgDropdownLeftArrow').length).toEqual(1);
  });

  it('updates state and re-renders when clicked on', () => {
    let e = element();
    expect(e.state().isOpen).toBe(false);
    expect(e.find('.edgeDropdownOptions').length).toEqual(0);
    e.find('.selectedEdgeDisplay').simulate('click');
    expect(e.state().isOpen).toBe(true);
    expect(e.find('.edgeDropdownOptions').length).toEqual(1);
  });

  it('updates Edge with new arrow setting', () => {
    let updateEdgeMock = jest.fn();
    let e = shallow(<EdgeArrowSelector updateEdge={updateEdgeMock} edgeId="x" arrowSide="left" arrow="left" />);
    e.find('.selectedEdgeDisplay').simulate('click');
    e.find('.svgDropdownLeftNoArrow').simulate('click');
    expect(e.state().isOpen).toBe(false);
    expect(updateEdgeMock.mock.calls.length).toEqual(1);
    expect(updateEdgeMock.mock.calls[0]).toEqual(['x', {display: {arrow: false} } ]);
  });

});


describe('newArrowState()', ()=>{
     
  it('when current state is left', ()=> {
    expect(newArrowState('left', 'left', false)).toEqual(false);
    expect(newArrowState('left', 'left', true)).toEqual('left');
    expect(newArrowState('left', 'right', false)).toEqual('left');
    expect(newArrowState('left', 'right', true)).toEqual('both');
  });
  it('when current state is right', ()=> {
    expect(newArrowState('right', 'left', false)).toEqual('right');
    expect(newArrowState('right', 'left', true)).toEqual('both');
    expect(newArrowState('right', 'right', false)).toEqual(false);
    expect(newArrowState('right', 'right', true)).toEqual('right');
  });
  it('when current state is both', ()=> {
    expect(newArrowState('both', 'left', false)).toEqual('right');
    expect(newArrowState('both', 'left', true)).toEqual('both');
    expect(newArrowState('both', 'right', false)).toEqual('left');
    expect(newArrowState('both', 'right', true)).toEqual('both');
  });

});

