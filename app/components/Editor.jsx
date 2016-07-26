import React, { Component, PropTypes } from 'react';
import ReactDOM from 'react-dom';
import { HotKeys } from 'react-hotkeys';
import BaseComponent from './BaseComponent';
import ZoomButtons from './ZoomButtons';
import EditTools from './EditTools';
import merge from 'lodash/object/merge';
import values from 'lodash/object/values';
import cloneDeep from 'lodash/lang/cloneDeep';
import pick from 'lodash/object/pick';
require('../styles/bootstrap-3.3.6.css');
require('../styles/oligrapher.editor.css');

export default class Editor extends BaseComponent {
  constructor(props) {
    super(props);
    this.state = { helpScreen: false };
  }

  render() {
    let zoomIn, zoomOut, resetZoom;

    if (this.props.graphApi) {
      zoomIn = () => this.props.graphApi.zoomIn();
      zoomOut = () => this.props.graphApi.zoomOut();
      resetZoom = () => this.props.graphApi.resetZoom();    
    }

    const keyMap = { 
      'altP': ['alt+p', 'ctrl+p'],
      'altO': ['alt+o', 'ctrl+o'],
      'altN': ['alt+n', 'ctrl+n'],
      'altE': ['alt+e', 'ctrl+e'],
      'altH': ['alt+h', 'ctrl+h'],
      'altR': ['alt+r', 'ctrl+r'],
      'esc': 'esc',
      'enter': 'enter'
    };

    const keyHandlers = {
      'altP': () => this.props.graphApi.prune(),
      'altO': () => this.props.graphApi.circleLayout(),
      'altN': () => this._focusAddNodeInput(),
      'altE': () => this._toggleAddEdgeForm(),
      'altH': () => this._toggleHelpScreen(),
      'altR': () => this._toggleAddConnectedNodesForm(),
      'esc': () => this._clearForms()
    };

    let _closeAddForm = () => this.props.toggleAddForm(null);

    let { currentForm, formData, addForm } = this._computeEditForms(this.props.selection);

    let fetchInterlocks = () => {};
    let showInterlocksButton = (
      this.props.isEditor && this.props.dataSource && this.props.dataSource.getInterlocks && formData && formData.length == 2
    );

    if (showInterlocksButton) {
      let node1Id = formData[0].id;
      let node2Id = formData[1].id;
      let nodeIds = Object.keys(this.props.graph.nodes);
      fetchInterlocks = () => { 
        this.props.fetchInterlocks(node1Id, node2Id, nodeIds, this.props.dataSource.getInterlocks);
      }
    }

    return (
      <div id="oligrapherEditorContainer" style={{ height: '100%' }}>
        <HotKeys focused={true} attach={window} keyMap={keyMap} handlers={keyHandlers}>
          <ZoomButtons zoomIn={zoomIn} zoomOut={zoomOut} />
          { this.props.showEditButton && this.props.isEditor && 
            <button 
              id="toggleEditTools" 
              className="btn btn-sm btn-default" 
              onClick={() => this.props.toggleEditTools()}>
              <span className="glyphicon glyphicon-pencil"></span>
            </button>
          }
          { this.props.showEditTools && 
            <EditTools
              ref="editTools"
              {...this.props}
              closeAddForm={_closeAddForm} 
              source={this.props.dataSource} 
              toggleAddEdgeForm={() => this._toggleAddEdgeForm()}
              toggleHelpScreen={() => this._toggleHelpScreen()}
              clearGraph={() => this._clearGraph()}
              data={formData}
              addForm={addForm}
              currentForm={currentForm}
              showInterlocksButton={showInterlocksButton}
              fetchInterlocks={fetchInterlocks}
              delete={this.props.delete} />
          }       
        </HotKeys>
      </div>
    );
  }

  _computeEditForms() {
    let currentForm = null;
    let formData = null;
    let addForm = this.props.addForm;

    let { nodeIds, edgeIds, captionIds } = this.props.selection;
    let graph = this.props.graph;
    let nodes = pick(graph.nodes, nodeIds);
    let edges = pick(graph.edges, edgeIds);
    let captions = pick(graph.captions, captionIds);
    let nodeCount = Object.keys(nodes).length;
    let edgeCount = Object.keys(edges).length;
    let captionCount = Object.keys(captions).length;

    if (nodeCount == 1 && edgeCount == 0 && captionCount == 0) {
      if (addForm != 'AddEdgeForm') { currentForm = 'UpdateNodeForm'; }
      formData = values(nodes)[0];
    } else if (nodeCount == 0 && edgeCount == 1 && captionCount == 0) {
      currentForm = 'UpdateEdgeForm';
      addForm = null;
      formData = values(edges)[0];
    } else if (nodeCount == 0 && edgeCount == 0 && captionCount == 1) {
      currentForm = 'UpdateCaptionForm';
      addForm = null;
      formData = values(captions)[0];
    } else if (nodeCount == 2 && edgeCount == 0 && captionCount == 0) {
      currentForm = null;
      addForm = 'AddEdgeForm';
      formData = values(nodes);
    } else {
      currentForm = null;
      formData = null;
    }

    return { currentForm, formData, addForm };
  }

  _toggleAddEdgeForm() {
    this.props.toggleAddForm('AddEdgeForm');
  }

  _toggleAddCaptionForm() {
    this.props.toggleAddForm('AddCaptionForm');
  }

  _toggleAddConnectedNodesForm() {
    this.props.toggleAddForm('AddConnectedNodesForm');
  }

  _toggleHelpScreen() {
    this.props.toggleHelpScreen();
  }

  _clearGraph() {
    if (confirm("Are you sure you want to clear the graph? This can't be undone!")) {
      this.props.graphApi.deleteAll();
      this.props.toggleAddForm(null);
    }
  }

  _clearForms() {
    this.props.toggleAddForm(null);
    this.props.graphApi.deselectAll();
    this.refs.editTools.refs.editButtons.refs.addNodeInput.clear();
  }

  _focusAddNodeInput() {
    this.refs.editTools.refs.editButtons.refs.addNodeInput.refs.name.focus();
  }
}
