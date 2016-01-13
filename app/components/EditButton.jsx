import React, { Component, PropTypes } from 'react';

export default class EditButton extends Component {

  render() {
    return (
      <button 
        id="oligrapherEditButton" 
        className={"btn btn-sm btn-default " + (this.props.showEditTools ? "editContentMode" : "editAnnotationsMode")}
        title={this.props.showEditTools ? "disable graph editor" : "enable graph editor"}
        onClick={this.props.toggle}>
        <span className="glyphicon glyphicon-pencil"></span>
      </button>
    );
  }
}
