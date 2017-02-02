import React from "react";
import { shallow, mount } from "enzyme";
import merge from 'lodash/merge';

import GraphHeader from '../GraphHeader';
import GraphTitle from '../GraphTitle';
import GraphTitleForm from '../GraphTitleForm';
import GraphByLine from '../GraphByLine';
import GraphLinks from '../GraphLinks';

describe('GraphHeader', () => {
  
  let defaultProps = {
    user: { name: 'name', url: 'http://url.com' },
    date: 'right now',
    title: 'eyes on the ties',
    updateTitle: function(){},
    url: 'oligrapher.info'
  }

  const graphHeader = props => shallow(<GraphHeader {...merge(defaultProps, props)} />);
  const hasComponent = (root, c) => expect(root.find(c).length).toEqual(1);
  const hasNoComponent = (root, c) => expect(root.find(c).length).toEqual(0);
  
  describe('When editor', () => {
    it('has GraphTitleForm', () => hasComponent(graphHeader({isEditor: true}), GraphTitleForm));
    it('does not have GraphTitle', () => hasNoComponent(graphHeader({isEditor: true}), GraphTitle));
  });

  describe('When not editor', () => {
    it('does not GraphTitleForm', () => hasNoComponent(graphHeader({isEditor: false}), GraphTitleForm));
    it('has GraphTitle', () => hasComponent(graphHeader({isEditor: false}), GraphTitle));
  });

  describe('when user and date is provided', () => {
    it('has GraphByLine', () => hasComponent(graphHeader({}), GraphByLine));
  });

  describe('when user or date is not provided', () => {
    it('does not have graphByLine', ()  => {
      hasNoComponent(graphHeader({user: null, date: null}), GraphByLine)
    })
  });

  describe('graph links', () => {
    it('has Graphlinks', () => hasComponent(graphHeader({links: []}), GraphLinks));
    it('has no Graph links', () => hasNoComponent(graphHeader({links: null}), GraphLinks));
  })

});
