import React from 'react'; 
import { shallow } from "enzyme";
import { Root } from '../Root';
import { props } from './support';

import GraphHeader from '../GraphHeader';
import Graph from '../Graph';
import Editor from '../Editor';
import EditButton from '../EditButton';
import HelpButton from '../HelpButton';
import SettingsButton from '../SettingsButton';
import GraphSettingsForm from '../GraphSettingsForm';
import GraphAnnotations from '../GraphAnnotations';
import SaveButton from '../SaveButton';
import HelpScreen from '../HelpScreen';

// helpers //
const hasComponent = (root, c) => expect(root.find(c).length).toEqual(1);
const hasNoComponent = (root, c) => expect(root.find(c).length).toEqual(0);
const rootWithProps = newProps => shallow(<Root {...Object.assign({}, props, newProps) } />);

describe('<Root />', ()=>{
  describe('render', ()=>{

    describe('Components', () => {
      const root = shallow(<Root {...props} />);
      it('contains <GraphHeader>', () => hasComponent(root, GraphHeader) );
      it('contains <Graph>', () => hasComponent(root, Graph) );
      it('contains <Editor>', () => hasComponent(root, Editor));
    });

    describe('Oligrapher Meta Buttons', () => {
      it('contains correct components if is editor', () => {
        const root = rootWithProps({isEditor: true});
        hasComponent(root, EditButton);
        hasComponent(root, HelpButton);
        hasComponent(root, SettingsButton);
      });

      it('does not have editing components if not editor', () => {
        const root = rootWithProps({isEditor: false});
        hasNoComponent(root, EditButton);
        hasNoComponent(root, HelpButton);
        hasNoComponent(root, SettingsButton);
      });

      it('does not show settings if hasSetttings is false', () => {
        const root = rootWithProps({isEditor: true, hasSettings: false });
        hasComponent(root, EditButton);
        hasComponent(root, HelpButton);
        hasNoComponent(root, SettingsButton);
      });

      it('shows <GraphSettingsForm> when showSettings is true', () => {
        const root = rootWithProps({isEditor: true, hasSettings: true, showSettings: true });
        hasComponent(root, GraphSettingsForm);
      });

      it('does not show <GraphSettingsForm> when showSettings is false', () => {
        const root = rootWithProps({isEditor: true, hasSettings: true, showSettings: false });
        hasNoComponent(root, GraphSettingsForm);
      });

      it('shows <GraphAnnotations> when visibleAnnotations is true', () => {
        const root = rootWithProps({}, props, {visibleAnnotations: true});
        hasComponent(root, GraphAnnotations);  
      });

      it('does not show <GraphAnnotations> when visibleAnnotations is false', () => {
        const root = rootWithProps({visibleAnnotations: false});
        hasNoComponent(root, GraphAnnotations);  
      });
      
      describe('#oligrapherShowAnnotations', () => {
        const root = rootWithProps({visibleAnnotations: false, isEditor: true});
        it('Creates div#oligrapherShowAnnotations if showAnnoations is false and enableAnnotations() returns true', () => {
          hasComponent(root, '#oligrapherShowAnnotations');
        });

        it('has button', () => {
          expect(root.find('#oligrapherShowAnnotations').find('button').length).toEqual(1);
          expect(root.find('#oligrapherShowAnnotations').find('button').find('span').length).toEqual(1);
          expect(root.find('#oligrapherShowAnnotations').find('button').find('span').hasClass('glyphicon')).toBeTruthy();
        });

        it('does not creates div#oligrapherShowAnnotations if showAnnoations is false and enableAnnotations() returns true', () => {
          const root = rootWithProps({visibleAnnotations: true, isEditor: true});
          hasNoComponent(root, '#oligrapherShowAnnotations');
        });

      });

      describe('<SaveButton>', () => {
        it('has save button if showSaveButton, isEditor and OnSave are true', () => {
          const root = rootWithProps({isEditor: true, showSaveButton: true, onSave: true});
          hasComponent(root, SaveButton);
        });
        
        it('does not have save button if showSaveButton is false', () => {
          const root = rootWithProps({isEditor: true, showSaveButton: false, onSave: true});
          hasNoComponent(root, SaveButton);
        });        

        it('does not have save button if showSaveButton is false', () => {
          const root = rootWithProps({isEditor: true, showSaveButton: false, onSave: true});
          hasNoComponent(root, SaveButton);
        });        
        
        it('does not have save button if isEditor is false', () => {
          const root = rootWithProps({isEditor: false, showSaveButton: true, onSave: true});
          hasNoComponent(root, SaveButton);
        });
        
        it('does not have save button if onSave is false', () => {
          const root = rootWithProps({isEditor: true, showSaveButton: true, onSave: false});
          hasNoComponent(root, SaveButton);
        });        
      });
      
      it('shows <HelpScreen> if showHelpScreen is true', () => {
        const root = rootWithProps({showHelpScreen: true});
        hasComponent(root,HelpScreen);
      });

      it('does not show <HelpScreen> if showHelpScreen is false', () => {
        const root = rootWithProps({showHelpScreen: false});
        hasNoComponent(root,HelpScreen);
      });
    });
  });
});
