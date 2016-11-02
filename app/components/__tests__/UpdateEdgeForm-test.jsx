import React from "react";
import { shallow } from "enzyme";
import UpdateEdgeForm from "../UpdateEdgeForm";
import EdgeDropdown from "../EdgeDropdown";

describe("UpdateEdgeForm", () => {
  let wrapper;
  let updateEdge;
  let data = {
    id: 1,
    node1_id: 1,
    node2_id: 2,
    display: { 
      label: "Edge",
      url: "url",
      scale: 3,
      arrow: "right",
      dash: false,
      status: "highlighted"
    }
  };

  beforeEach(() => {
    updateEdge = jest.genMockFunction();
    wrapper = shallow(
      <UpdateEdgeForm 
         updateEdge={updateEdge} 
         data={data}
         getGraph={jest.genMockFunction()}
         deselect={jest.genMockFunction()} />
    );
  });

  describe("rendering", () => {

    it("shows 2 inputs", () => {
      expect(wrapper.find('input').length).toBe(2);
    });
    
    it('shows input with value label', () => {
      expect(wrapper.find('input[value="Edge"]').length).toBe(1);
      
    });

    it('shows input with value url', () => {
      expect(wrapper.find('input[value="url"]').length).toBe(1);
    });

    it('renders EdgeDropDown', () => {
      expect(wrapper.find(EdgeDropdown).length).toBe(1);
    });

    it('passes correct props to EdgeDrop down', () => {
      let edgeProps = wrapper.find(EdgeDropdown).props();
      expect(edgeProps.arrow).toBe(data.display.arrow);
      expect(edgeProps.dash).toBe(data.display.dash);  
    });

    it('shows <select>', ()=>{
      expect(wrapper.find('select').length).toBe(1);
    });

    it("shows scale dropdown with selected option", () => {
      let select = wrapper.find("select");
      expect(select.props().value).toBe(data.display.scale);
      let option = select.children().findWhere(child => child.props().value === data.display.scale);
      expect(option.length).toBe(1);
      expect(option.text()).toBe(data.display.scale + "x");
    });
  });

});
