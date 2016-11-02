import React from "react";
import ReactDOM from 'react-dom';
import { shallow } from "enzyme";
import EdgeDropdown from "../EdgeDropdown";
import EdgeArrowSelector from '../EdgeArrowSelector';
import EdgeDashSelector from '../EdgeDashSelector';

describe("EdgeDropdown", () => {
  
  const  graph = {
    "nodes": {
      "1": {
        "id": "1",
        "display": {
          "x": 0,
          "y": 0,
          "scale": 1,
          "name": "n1"
        }
      },
      "2": {
        "id": "2",
        "display": {
          "x": 0,
          "y": 0,
          "scale": 1,
          "name": "n2"
        }
      }
    },
    "edges": {
      "123": {
        "id": "123",
        "display": {
          "scale": 1,
          "arrow": true,
          "label": "edge!",
          "x1": 0,
          "y1": 0,
          "x2": 122.87581699346406,
          "y2": -5.228758169934641,
          "s1": 1,
          "s2": 1
        },
        "node1_id": "1",
        "node2_id": "2"
      }
    }
  };

  const getGraph = () => graph;

  describe('layout', () => {
    let wrapper = shallow(<EdgeDropdown 
                          updateEdge={jest.fn()}
                          edgeId="123"
                          dash={false}
                          getGraph={getGraph}
                          arrow="1->2" />);

    it('has EdgeDashSelector', () => expect(wrapper.find(EdgeDashSelector).length).toEqual(1));
    it('has two EdgeArrowSelector', () => expect(wrapper.find(EdgeArrowSelector).length).toEqual(2));
    it('has 1 strokeDropdown div', () => expect(wrapper.find('.strokeDropdowns').length).toEqual(1));
    it('has 2 arrow-node-name divs', () => expect(wrapper.find('.arrow-node-name').length).toEqual(2));
    it('contains two svgs', ()=> expect(wrapper.find('svg').length).toEqual(2));
    it('contains <text> with node names', ()=>{
      expect(wrapper.find('text').map( node => node.text())).toEqual(['n1', 'n2']);
    });
  });
  
});
