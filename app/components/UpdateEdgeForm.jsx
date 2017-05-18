import PropTypes from 'prop-types';
import React, { Component } from 'react';
import BaseComponent from './BaseComponent';
import EdgeDropdown from './EdgeDropdown';
import { HotKeys } from 'react-hotkeys';
import values from 'lodash/values';
import sortBy from 'lodash/sortBy';
import merge from 'lodash/merge';

export default class UpdateEdgeForm extends BaseComponent {

  render() {
    let { display } = this.props.data;
    const keyMap = { 
      'esc': 'esc'
    };

    const keyHandlers = {
      'esc': () => this.props.deselect()
    };


    const scales = [
      [null, "Scale"],
      [1, "1x"],
      [1.5, "1.5x"],
      [2, "2x"],
      [3, "3x"]
    ];

    return (
      <div className="editForm updateForm form-inline">
        <HotKeys keyMap={keyMap} handlers={keyHandlers}>
          <div>
            <input 
              type="text" 
              className="form-control input-sm"
              placeholder="label" 
              ref="label" 
              value={display.label} 
              onChange={() => this.apply()} />
            &nbsp;<select 
              value={display.scale} 
              className="form-control input-sm" 
              ref="scale" 
              onChange={() => this.apply()}>
              { scales.map((scale, i) =>
                <option key={scale[1]} value={scale[0]}>{scale[1]}</option>
              ) }
            </select>
          </div>
          <div>
            <input
              id="edgeUrlInput"
              className="form-control input-sm"
              type="text"
              ref="url"
              placeholder="link URL"
              value={display.url}
              onChange={() => this.apply()} />
          </div>
          <EdgeDropdown
            ref="edgeDropdown"
            arrow={display.arrow}
            dash={display.dash}
            getGraph={this.props.getGraph}
            edgeId={this.props.data.id}
            updateEdge={this.props.updateEdge}
            onChange={(arrow, dash) => this.apply(arrow, dash)}/>
        </HotKeys>
      </div>
    );
  }

  apply(whichArrow, isDashed) {
      let label = this.refs.label.value;
      let arrow = whichArrow || this.refs.edgeDropdown.props.whichArrow;
      let dash = isDashed;
      let scale = parseFloat(this.refs.scale.value);
      let url = this.refs.url.value.trim();
      this.props.updateEdge(this.props.data.id, { display: { label, arrow, dash, scale, url } });
  }
}
