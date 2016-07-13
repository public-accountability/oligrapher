jest.unmock('../DeleteSelectedButton');

import React from "react";
import { shallow } from "enzyme";
import DeleteSelectedButton from '../DeleteSelectedButton';

describe('DeleteSelectedButton', function(){
  let doDeleteMock =  jest.fn();
  let wrapper = shallow(
        <DeleteSelectedButton
         currentForm={"UpdateNodeForm"}
        doDelete={doDeleteMock} />);

  it('sets correct class names on div', () => {
    expect(wrapper.hasClass('editForm')).toEqual(true);
    expect(wrapper.hasClass('form-inline')).toEqual(true);
    expect(wrapper.hasClass('nodeDelete')).toEqual(true);
    expect(wrapper.hasClass('edgeDelete')).toEqual(false);
  });

  it('clicking on button triggers doDelete', () => {
    wrapper.find('button').simulate('click');
    expect(doDeleteMock.mock.calls.length).toEqual(1);
  });

  
});
