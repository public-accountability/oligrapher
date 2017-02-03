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
import EmbeddedGraphAnnotations from '../EmbeddedGraphAnnotations';
import { legacyArrowConverter, legacyEdgesConverter  } from '../../helpers';


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
      
      it('does not have <EmbeddedGraphAnnotations> by default', () => {
	hasNoComponent(rootWithProps({visibleAnnotations: true}), EmbeddedGraphAnnotations);
	hasNoComponent(rootWithProps({visibleAnnotations: true, isEmbedded: false}), EmbeddedGraphAnnotations);
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

    describe('legacyArrowConverter', () => {
      it('preserves valid values', () => {
        expect(legacyArrowConverter('1->2')).toEqual('1->2');
        expect(legacyArrowConverter('2->1')).toEqual('2->1');
        expect(legacyArrowConverter('both')).toEqual('both');
      });

      it('converts true into 1->2', () => expect(legacyArrowConverter(true)).toEqual('1->2'));
      it('converts left into 2->1', () => expect(legacyArrowConverter('left')).toEqual('2->1'));
      it('converts right into 1->2', () => expect(legacyArrowConverter('right')).toEqual('1->2'));
      it('returns false otherwise', () => expect(legacyArrowConverter('x')).toBe(false)); 
    });

    describe('legacyEdgesConverter', () => {
      it('replaces all legacy edge arrow values', ()=>{
        const oldEdges = {
          "SyGW-SSw": {
            "id": "SyGW-SSw",
            "display": {
              "scale": 1,
              "arrow": true,
              "label": "connection",
              "x1": -2.208952806482037e-14,
              "y1": -120.24979000856933,
              "x2": -120.24979000856933,
              "y2": 1.472635204321358e-14,
              "s1": 1,
              "s2": 1
            },
            "node1_id": "rylk-HBv",
            "node2_id": "rJE0gSrw"
          },
          "HkJfWBBD": {
            "id": "HkJfWBBD",
            "display": {
              "scale": 1,
              "arrow": 'both',
              "label": "love/hate",
              "x1": -2.208952806482037e-14,
              "y1": -120.24979000856933,
              "x2": 120.24979000856933,
              "y2": 0,
              "s1": 1,
              "s2": 1
            },
            "node1_id": "rylk-HBv",
            "node2_id": "rJe0eHrw"
          }
        };
        const newEdges = {
          "SyGW-SSw": {
            "id": "SyGW-SSw",
            "display": {
              "scale": 1,
              "arrow": '1->2',
              "label": "connection",
              "x1": -2.208952806482037e-14,
              "y1": -120.24979000856933,
              "x2": -120.24979000856933,
              "y2": 1.472635204321358e-14,
              "s1": 1,
              "s2": 1
            },
            "node1_id": "rylk-HBv",
            "node2_id": "rJE0gSrw"
          },
          "HkJfWBBD": {
            "id": "HkJfWBBD",
            "display": {
              "scale": 1,
              "arrow": 'both',
              "label": "love/hate",
              "x1": -2.208952806482037e-14,
              "y1": -120.24979000856933,
              "x2": 120.24979000856933,
              "y2": 0,
              "s1": 1,
              "s2": 1
            },
            "node1_id": "rylk-HBv",
            "node2_id": "rJe0eHrw"
          }
        };

        expect(legacyEdgesConverter(oldEdges)).toEqual(newEdges);
      });
    });

    describe('Embedded mode', () => {
      const root = rootWithProps({isEmbedded: true});
      it('has EmbeddedGraphAnnotations', () => hasComponent(root, EmbeddedGraphAnnotations));
      it('does not have GraphAnnotations', () => hasNoComponent(root, GraphAnnotations));
      it('sets correct col div#oligrapherGraphCol', () => {
	expect(root.find('#oligrapherGraphCol').hasClass('col-md-12')).toEqual(true);
      });
    });
  }); /* end Describe render() */
});
