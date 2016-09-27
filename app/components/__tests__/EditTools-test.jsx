import React from 'react'; 
import { shallow } from 'enzyme';
import EditTools from '../EditTools';
import EditButtons from '../EditButtons';
import LayoutButtons from '../LayoutButtons';
import UndoButtons from '../UndoButtons';
import AddEdgeForm from '../AddEdgeForm';
import AddCaptionForm from '../AddCaptionForm';
import AddConnectedNodesForm from '../AddConnectedNodesForm';
import DeleteSelectedButton from '../DeleteSelectedButton';
import UpdateNodeForm from '../UpdateNodeForm';
import UpdateEdgeForm from '../UpdateEdgeForm';
import UpdateCaptionForm from '../UpdateCaptionForm';
import HelpScreen from '../HelpScreen';

const GraphApi = () => ({
  getGraph: jest.fn(),
  zoomIn: jest.fn(),
  zoomOut: jest.fn(),
  resetZoom: jest.fn(),
  prune: jest.fn(),
  circleLayout: jest.fn(),
  addNode: jest.fn(),
  addEdge: jest.fn(),
  addCaption: jest.fn(),
  updateNode: jest.fn(),
  updateEdge: jest.fn(),
  updateCaption: jest.fn(),
  deselectAll: jest.fn(),
  deleteAll: jest.fn(),
  addSurroundingNodes: jest.fn()
});

// helpers //
const hasComponent = (root, c) => expect(root.find(c).length).toEqual(1);
const hasNoComponent = (root, c) => expect(root.find(c).length).toEqual(0);

describe('Edit Tools Component', () => {
  
  describe('Always present components', () => {
    let graphApi = GraphApi();
    let graph = {nodes: []};
    let editTools = shallow(
      <EditTools 
         graphApi={graphApi} 
         graph={graph}
         nodeResults={[]}
         /> );
    
    it('contains editTools div', () => hasComponent(editTools, '#editTools'));
    it('contains buttons div', () => expect(editTools.find('#buttons').length).toEqual(1));
    it('contains EditButtons', () => expect(editTools.containsMatchingElement(EditTools)).toBe(true));
    it('contains LayoutButtons', () => expect(editTools.find(LayoutButtons).length).toEqual(1));
    it('contains UndoButtons', () => expect(editTools.find(UndoButtons).length).toEqual(1));
  });
  
  describe('Conditionally displayed components', () => {
    let graphApi = GraphApi();
    let graph = {nodes: []};

    describe('currentForm', () => {

      it('displays UpdateCaptionForm', ()=>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                currentForm='UpdateCaptionForm' />);
        expect(editTools.find(UpdateCaptionForm).length).toEqual(1);
        expect(editTools.find(AddCaptionForm).length).toEqual(0);
      });

      it('displays AddCaptionForm', ()=>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}/>);
        expect(editTools.find(UpdateCaptionForm).length).toEqual(0);
        expect(editTools.find(AddCaptionForm).length).toEqual(1);
      });
    });

    describe('helpButton', () => {

      it('displays helpButton if hideHelp is falsy', ()=>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                hideHelp={false}
                                />);
        hasComponent(editTools, '#helpButton');
      });

      it('does not display helpButton if hideHelp is truthy', ()=>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                hideHelp={true}
                                />);
        hasNoComponent(editTools, '#helpButton');
      });
    });

    describe('addForm', () => {

      it('displays addEdgeForm if addForm is AddEdgeForm', () =>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                addForm='AddEdgeForm'
                                />);
        hasComponent(editTools, AddEdgeForm);
        hasNoComponent(editTools, DeleteSelectedButton);
      });

      it('does not display addEdgeForm', () =>{
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                addForm='' />);
        hasNoComponent(editTools, AddEdgeForm);
      });
    });

    describe('currentForm', () => {
      
      it('displays UpdateEdgeForm', () => {
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                currentForm='UpdateEdgeForm' />);

        hasComponent(editTools, UpdateEdgeForm);
        hasComponent(editTools, DeleteSelectedButton);
      });
      
      it('displays UpdateNodeForm', () => {
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                currentForm='UpdateNodeForm' />);

        hasComponent(editTools, UpdateNodeForm);
        hasComponent(editTools, DeleteSelectedButton);
        hasNoComponent(editTools, AddConnectedNodesForm);
      });

      it('displays AddConnectedNodesForm', () => {
        let source = { getConnectedNodes: jest.fn() };
        let editTools = shallow(<EditTools
                                graphApi={graphApi} 
                                graph={graph}
                                nodeResults={[]}
                                currentForm='UpdateNodeForm' 
                                source={source}
                                />);
        hasComponent(editTools, AddConnectedNodesForm);
      });

    });

  });

});
