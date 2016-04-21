import React, { Component, PropTypes } from 'react';
import UndoButtons from './UndoButtons';
import LayoutButtons from './LayoutButtons';
import EditButtons from './EditButtons';
import AddEdgeForm from './AddEdgeForm';
import AddCaptionForm from './AddCaptionForm';
import AddConnectedNodesForm from './AddConnectedNodesForm';
import UpdateNodeForm from './UpdateNodeForm';
import UpdateEdgeForm from './UpdateEdgeForm';
import UpdateCaptionForm from './UpdateCaptionForm';
import HelpScreen from './HelpScreen';

export default class EditTools extends Component {

  render() {
    let { graphApi, source, data, graph, addForm, currentForm, helpScreen,
          clearGraph, closeAddForm, toggleHelpScreen, toggleAddEdgeForm } = this.props;

    let { zoomIn, zoomOut, resetZoom, prune, circleLayout, 
        addNode, addEdge, addCaption, addSurroundingNodes,
        updateNode, updateEdge, updateCaption, deselectAll,
        deleteAll, getGraph } = graphApi;

    return (
      <div id="editTools">
        <div id="buttons">
          <EditButtons
            ref="editButtons"
            addNode={addNode}
            addEdge={addEdge}
            closeAddForm={closeAddForm} 
            source={source}
            nodes={graph.nodes}
            nodeResults={this.props.nodeResults}
            setNodeResults={this.props.setNodeResults}
            toggleAddEdgeForm={toggleAddEdgeForm}
            showInterlocksButton={this.props.showInterlocksButton}
            fetchInterlocks={this.props.fetchInterlocks} />
          <LayoutButtons 
            prune={prune} 
            circleLayout={circleLayout} 
            clearGraph={clearGraph} />
          <UndoButtons 
            undo={this.props.undo}
            redo={this.props.redo} 
            canUndo={this.props.canUndo}
            canRedo={this.props.canRedo} />
         
          { this.props.hideHelp ? null : <button id="helpButton" className="btn btn-sm btn-default buttonGroup" onClick={toggleHelpScreen}>help</button> }

        </div>

        { addForm == 'AddEdgeForm' && 
          <AddEdgeForm 
            addEdge={addEdge} 
            nodes={graph.nodes}
            closeAddForm={closeAddForm} 
            data={data} /> }
        { addForm == 'AddCaptionForm' && 
          <AddCaptionForm 
            addCaption={addCaption} 
            closeAddForm={closeAddForm} /> }
        { currentForm == 'UpdateNodeForm' && 
          <UpdateNodeForm 
            updateNode={updateNode} 
            data={data} 
            deselect={deselectAll} /> }
        { currentForm == 'UpdateEdgeForm' && 
          <UpdateEdgeForm 
            updateEdge={updateEdge} 
            getGraph={getGraph} 
            data={data}
            deselect={deselectAll} /> }
        { currentForm == 'UpdateCaptionForm' && 
          <UpdateCaptionForm 
            updateCaption={updateCaption} 
            data={data}
            deselect={deselectAll} /> }
        { currentForm == 'UpdateNodeForm' && source && source.getConnectedNodes && 
          <AddConnectedNodesForm
            data={data}
            source={source} 
            closeAddForm={closeAddForm} 
            graph={graph}
            addSurroundingNodes={addSurroundingNodes} 
            addEdge={addEdge} /> }
        { helpScreen && !this.props.hideHelp ? <HelpScreen source={source} /> : null }
      </div>
    );
  }
}