import React from "react";
import { shallow } from "enzyme";
import sinon from 'sinon';
import noop from 'lodash/noop';
import EmbeddedNavButtons from '../EmbeddedNavButtons';


describe('EmbeddedNavButtons', () => {
  it('should have 2 buttons', () => {
    let wrapper = shallow(<EmbeddedNavButtons annotationCount={10} currentIndex={1} nextClick={noop} prevClick={noop} />);
    expect(wrapper.find('button').length).toEqual(2);
    expect(wrapper.find('button.btn-annotation-next').prop('disabled')).toEqual(false);
    expect(wrapper.find('button.btn-annotation-back').prop('disabled')).toEqual(false);
  });

  it('has next button and back button is disabled when current index is 0', () => {
    let wrapper = shallow(<EmbeddedNavButtons annotationCount={3} currentIndex={0} nextClick={noop} prevClick={noop} />);
    expect(wrapper.find('button.btn-annotation-back').prop('disabled')).toEqual(true);
    expect(wrapper.find('button.btn-annotation-next').prop('disabled')).toEqual(false);
    expect(wrapper.find('button.btn-annotation-next').length).toEqual(1);
  });

  it('has back button and next button is disabled when current index is the last', () => {
    let wrapper = shallow(<EmbeddedNavButtons annotationCount={3} currentIndex={2} nextClick={noop} prevClick={noop}  />);
    expect(wrapper.find('button').length).toEqual(2);
    expect(wrapper.find('button.btn-annotation-back').prop('disabled')).toEqual(false);
    expect(wrapper.find('button.btn-annotation-next').prop('disabled')).toEqual(true);
  });

  describe('clicking', () => {
    it('triggers prevClick', () => {
      let spy = sinon.spy();
      let wrapper = shallow(<EmbeddedNavButtons annotationCount={10} currentIndex={1} nextClick={noop} prevClick={spy} />);
      wrapper.find('button.btn-annotation-back').simulate('click');
      expect(spy.calledOnce).toEqual(true);
    });

    it('triggers nextClick', () => {
      let spy = sinon.spy();
      let wrapper = shallow(<EmbeddedNavButtons annotationCount={10} currentIndex={1} nextClick={spy} prevClick={noop} />);
      wrapper.find('button.btn-annotation-next').simulate('click');
      expect(spy.calledOnce).toEqual(true);
    });
  });
});
