import React, { Component, PropTypes } from 'react';

export default class HelpScreen extends Component {

  render() {
    return (
      <div id="oligrapherHelpScreen">
        <div id="oligrapherHelpScreenCloseButton"><span className="glyphicon glyphicon-remove" onClick={this.props.close}></span></div>
        <h3>User Guide</h3>
        Use this editor to create a network graph along with an optional series of annotations overlaying the graph. Annotations consists of a title, a text body, and a highlighted section of the graph.<br />
        <br />
        The pencil button swaps between graph editing mode and annotation editing mode. It will appear green when editing the graph and yellow when editing annotations. You can edit the graph title at the top of the screen.<br />
        <br />
        When you are finished editing, click the SAVE button to save your changes.<br />
        <br />
        <strong>Graph Editing Mode</strong><br />
        <br />
        Type a name in the "add node" box and press enter to add the node to the graph. 
        { this.props.source ? ` Nodes from ${this.props.source.name} matching the name you type will appear below; click on them to add them to the graph.` : "" }        
        <br />
        ALT+C opens a form for adding a new caption in the top right of the graph.<br />
        <br />
        CLICK a node, edge, or caption to select or deselect it.<br />
        SHIFT+CLICK to select mutiple nodes, edges, or captions.<br />
        <br />
        Select a single node, edge, or caption to view an editing form in the top-right corner of the map. Changes you make in the form will upate the item immediately.<br />
        <br />
        The CIRCLE button arranges nodes in a circle.<br />
        The PRUNE button removes unconnected nodes.<br />
        The CLEAR button deletes all content from the graph.<br />
        The HELP button displays this user guide.<br />
        <br />
        <strong>Annotation Editing Mode</strong><br />
        <br />
        Annotations are edited using the sidebar on the right. Click the big "A" button to hide or show the sidebar.<br />
        <br />
        Click the NEW ANNOTATION button create a new annotation and display a form for editing it. Click on any annotation title in the list to edit it. A REMOVE button at the bottom of the edit form will delete the annotation. When editing an annotation, click on nodes, edges, or captions from the graph to highlight them in that annotation. Drag annotaions up and down the list to reorder them.<br />
        <br />
        <strong>Shortcut Keys</strong><br />
        <br />
        LEFT &amp; RIGHT ARROWS navigate to the previous and next annotations.<br />
        ALT+H toggles this user guide.<br />
        ALT+H swaps the editing mode between graph editing and annotations.<br />
        ALT+D deletes selected nodes and edges.<br />
        ALT+E adds an edge. Selected nodes will be auto-populated in the form.<br />
        ALT+C adds a caption.<br />
        <br />
        If ALT keys interfere with your browser or operating system shortcuts, all of the above shortcuts will work with CTRL instead of ALT.<br />
        <br />
        CTRL+"=" zooms in.<br />
        CTRL+"-" zooms out.<br />
        CTRL+0 resets zoom.<br />
        <br />
        ESC closes all forms.<br />
      </div>
    );
  }
}