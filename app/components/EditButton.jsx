import PropTypes from 'prop-types';
import React, { Component } from 'react';
import Octicon, {Pencil} from '@githubprimer/octicons-react';

export default class EditButton extends Component {

  render() {
    return (
      <button 
        id="oligrapherEditButton" 
        className={"btn btn-sm btn-default " + (this.props.showEditTools ? "editContentMode" : "editAnnotationsMode")}
        title={this.props.showEditTools ? "disable graph editor" : "enable graph editor"}
        onClick={this.props.toggle}>
        <Octicon icon={Pencil}/>
      </button>
    );
  }
}
