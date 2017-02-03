import React from "react";
import { shallow } from "enzyme";
import AnnotationsTracker from '../AnnotationsTracker';

describe('AnnotationsTracker', () => {

  it('has correct number of circles', () => {
    expect(shallow(<AnnotationsTracker annotationCount={10} currentIndex={0} />).find('.tracker-circle').length).toEqual(10);
  });

  it('has only one selected circle', () => {
    expect(shallow(<AnnotationsTracker annotationCount={10} currentIndex={0} />).find('.tracker-circle-selected').length).toEqual(1);
  });

  it('highlights correct circle', () => {
    let annotationsTracker = shallow(<AnnotationsTracker annotationCount={10} currentIndex={2} />)
    expect(annotationsTracker.find('#annotationsTracker').childAt(2).hasClass('tracker-circle-selected')).toEqual(true);
  });

});
