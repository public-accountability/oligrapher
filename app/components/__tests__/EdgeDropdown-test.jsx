jest.disableAutomock();

import React from "react";
import ReactDOM from 'react-dom';
import { shallow } from "enzyme";
import { mount } from "enzyme";

import EdgeDropdown from "../EdgeDropdown";

describe("EdgeDropdown", () => {
  let wrapper;
  let onChange;

  beforeEach(() => {
    onChange = jest.genMockFunction();
    wrapper = mount(
      <EdgeDropdown
        dash={true}
        arrow="left"
        onChange={onChange} />
    );
  });

  it("it shows a div for both potential arrowheads and each should contain an svg", () => {
    let arrows = wrapper.find(".dropdownHolder.arrowHead").children();
    expect(arrows.length).toBe(2);
    let allArrows = true;
    arrows.forEach(function(a){
      if (a.find("svg").length != 1){
        allArrows = false;
      }
    })
    
    expect(allArrows).toBe(true);
  });

  it("it shows one div for the dash/undash dropdown and it should contain an svg", () => {
    let central = wrapper.find(".dropdownHolder.strokeMain").children();
    expect(central.length).toBe(1);
    expect(central.find("svg").length).toBe(1);
  });

  it("it should not show dropdown lists prior to clicking", () => {
    let dropdowns = wrapper.find(".svgDropdown.edgeDropdownOptions");
    expect(dropdowns.length).toBe(0);
  });

  it("shows/hides a dropdown when clicked and the state reflects that", () => {
    expect(wrapper.state()["leftSideOpen"]).toBe(false);
    expect(wrapper.state()["rightSideOpen"]).toBe(false);
    expect(wrapper.state()["centerOpen"]).toBe(false);

    let dropdownButtons = wrapper.find(".selectedEdgeDisplay");
    dropdownButtons.forEach(function(d){
      d.simulate("click");
    });
    wrapper.update();

    let dropdowns = wrapper.find(".svgDropdown.edgeDropdownOptions");
    expect(dropdowns.length).toBe(3);

    expect(wrapper.state()["leftSideOpen"]).toBe(true);
    expect(wrapper.state()["rightSideOpen"]).toBe(true);
    expect(wrapper.state()["centerOpen"]).toBe(true);

    dropdowns.forEach(function(dr){
      dr.find("li").at(0).simulate("click");
    });

    expect(wrapper.state()["leftSideOpen"]).toBe(false);
    expect(wrapper.state()["rightSideOpen"]).toBe(false);
    expect(wrapper.state()["centerOpen"]).toBe(false);

    wrapper.update();

    let dropdownsUpdated = wrapper.find(".svgDropdown.edgeDropdownOptions");

    expect(dropdownsUpdated.length).toBe(0);

  });
  

  it("updates the state to match the clicked-on value from the drop-down list", () => {
    expect(wrapper.state()["leftSideArrow"]).toBe(true);
    expect(wrapper.state()["rightSideArrow"]).toBe(false);
    expect(wrapper.state()["centerDashed"]).toBe(true);

    let dropdownButtons = wrapper.find(".selectedEdgeDisplay");
    dropdownButtons.forEach(function(d){
      d.simulate("click");
    });
    wrapper.update();

    let dropdowns = wrapper.find(".svgDropdown.edgeDropdownOptions");
    dropdowns.at(0).find("li.svgDropdownLeftNoArrow").simulate("click");
    dropdowns.at(1).find("li.svgDropdownUndashed").simulate("click");
    dropdowns.at(2).find("li.svgDropdownRightArrow").simulate("click");

    expect(wrapper.state()["leftSideArrow"]).toBe(false);
    expect(wrapper.state()["rightSideArrow"]).toBe(true);
    expect(wrapper.state()["centerDashed"]).toBe(false);
  })

});
