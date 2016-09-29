import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';
import { newArrowState } from '../helpers';
import capitalize from 'lodash/capitalize';

export default class EdgeArrowSelector extends BaseComponent {
  
   constructor() {
      super();
      this.state = { isOpen: false };
      this.bindAll('_updateArrow', '_arrowClass');
   }

   render() {
       let { arrowSide }  = this.props;
       return(
            <div className ="dropdownHolder arrowHead">
                <div className ="selectedEdgeDisplay svgDropdown"
                     onClick={ () => this.setState({isOpen: true})} >
                    <div className = {this._arrowClass()}>
                        <svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
                    </div>
                </div>
                { this.state.isOpen &&
                  <ul className={"svgDropdown edgeDropdownOptions"}>
	              <li className={`svgDropdown${capitalize(arrowSide)}NoArrow`}
                          onClick={ () => this._updateArrow(false) }>
	                  <svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	              </li>
	              <li className={`svgDropdown${capitalize(arrowSide)}Arrow`}
                          onClick={ () => this._updateArrow(true) }>
	                  <svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	              </li>
                  </ul>
                } </div>)
  }

    _arrowClass() {
        let { arrow, arrowSide } = this.props;
        if (arrow === arrowSide || arrow === 'both'){
            return `svgDropdown${capitalize(arrowSide)}Arrow`
        } else {
            return '';
        }
    }

    _updateArrow(showArrow) {
        const oldArrowState = this.props.arrow;
        const arrowSide = this.props.arrowSide;
        const _newArrowState = newArrowState(oldArrowState, arrowSide, showArrow)
        if (oldArrowState !== _newArrowState) {
            this.props.updateEdge(this.props.edgeId, {display: {arrow: _newArrowState }});
        }
        this.setState({isOpen: false});
    }

}

/* 
   arrowSide must be exactly 'left' or 'right'
   Possible arrow states: 'left', 'right', 'both', false/true
*/
EdgeArrowSelector.propTypes = {
    updateEdge: PropTypes.func.isRequired,
    edgeId: PropTypes.any.isRequired,
    arrowSide: PropTypes.string.isRequired,
    arrow: PropTypes.any
};
