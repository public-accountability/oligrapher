import React from "react";
import { shallow, mount } from "enzyme";
import merge from 'lodash/merge';

import GraphHeader from '../GraphHeader';
import GraphTitle from '../GraphTitle';
import GraphTitleForm from '../GraphTitleForm';
import GraphByLine from '../GraphByLine';
import GraphLinks from '../GraphLinks';

describe('GraphHeader', () => {
  
 const defaultProps = {
    user: { name: 'name', url: 'http://url.com' },
    date: 'right now',
    title: 'eyes on the ties',
    updateTitle: function(){},
    url: 'oligrapher.info',
    isEmbedded: false
  }

  let embedded = {headerFontSize: '20px'};

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

  describe('when user and date is provided and isEmbedded is true', () => {
    it('does not have GraphByLine', () => { 
      hasNoComponent(graphHeader({isEmbedded: true, embedded: embedded}), GraphByLine); 
    });
  });

  describe('when user or date is not provided', () => {
    it('does not have graphByLine', ()  => {
      hasNoComponent(graphHeader({user: null, date: null}), GraphByLine)
    })
  });

  describe('graph links', () => {
    it('has Graphlinks', () => {
      let gh = shallow(<GraphHeader {...merge(defaultProps, {links: [], isEmbedded: false} )} />);
      hasComponent(gh, GraphLinks);
    });
    
    it('has no Graph links', () => hasNoComponent(graphHeader({links: null}), GraphLinks));

    it('does not have graphLinks when embedded is true', () => {
      hasNoComponent(graphHeader({links: [], isEmbedded: true}), GraphLinks);
    });
  });

});
