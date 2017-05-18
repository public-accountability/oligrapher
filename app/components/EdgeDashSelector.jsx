import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';

export default class EdgeDashSelector extends BaseComponent {

  constructor(){
      super();
      this.state = { isOpen: false };
      this.bindAll('_menuOptions', '_updateEdge');
  }
  
  render(){
    return(
        <div className ="dropdownHolder strokeMain">
            <div className ="selectedEdgeDisplay svgDropdown">
                <div 
                    className = {this.props.isDashed ? "svgDropdownDashed" : ""  } 
                    onClick={ () => this.setState({isOpen: true})} >
                    <svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
                </div>
                {this.state.isOpen && this._menuOptions() }
            </div>
        </div> )
  }

    _menuOptions(){
        return (
            <ul className={"svgDropdown edgeDropdownOptions"}>
                <li className="svgDropdownUndashed"
                    onClick={() => this._updateEdge(false) } >
                    <svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
                </li>
                <li className="svgDropdownDashed" 
                    onClick={() => this._updateEdge(true) } >
                    <svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
                </li>
            </ul>
        )
    }
    
    _updateEdge(newDashState) {
        let { updateEdge, edgeId} = this.props;
        updateEdge(edgeId, {display: {dash: newDashState }});
        this.setState({isOpen: false});
    }
    
}

EdgeDashSelector.propTypes = {
  isDashed: PropTypes.bool.isRequired,
  updateEdge: PropTypes.func.isRequired,
  edgeId: PropTypes.any.isRequired   
};
