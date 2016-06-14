import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

export default class Node extends BaseComponent {

  constructor(props) {
    super(props);

    this.state = {
      "leftSideOpen": false,
      "centerOpen": false, 
      "rightSideOpen": false,
      "leftSideArrow": false,
      "centerDashed": props.dash, 
      "rightSideArrow": false
    };
  }

  componentWillReceiveProps() {
	this.setState({"centerDashed": this.props.dash});
  }


  render () {
  	var leftClass = this.state.leftSideOpen ? "svgDropdownLeftArrow" : "";
  	var centerClass = this.props.dash ? "svgDropdownDashed" : "";
  	var rightClass = this.state.rightSideOpen ? "svgDropdownRightArrow" : "";
  	return (
  		<div className="strokeDropdowns">
		  	<div className ="dropdownHolder arrowHead">
		  		<div className ="selectedEdgeDisplay svgDropdown"
  					onClick={() => this._toggleView("leftSideOpen")}>
  					<div className = {""}>
  						<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
  					</div>
  				</div>
  				{ this.state.leftSideOpen &&
		  			<ul className={"svgDropdown edgeDropdownOptions"}>
		  				<li 
		  					onClick={() => this._toggleView("leftSideOpen")}>
		  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
		  				</li>
		  				<li className="svgDropdownLeftArrow"
		  					onClick={() => this._toggleView("leftSideOpen")}>
		  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
		  				</li>
		  			</ul>
		  		}
				</div>
	  		<div className ="dropdownHolder strokeMain">
	  			<div className ="selectedEdgeDisplay svgDropdown"
  					onClick={() => this._toggleView("centerOpen")}>
  					<div className = {centerClass}>
  						<svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
  					</div>
  				</div>
	  			{ this.state.centerOpen &&
		  			<ul className={"svgDropdown edgeDropdownOptions"}>
		  				<li
		  					onClick={() => this._toggleView("centerOpen")}>
		  					<svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
		  				</li>
		  				<li className="svgDropdownDashed"
		  					onClick={() => this._toggleView("centerOpen")}>
		  					<svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
		  				</li>
		  			</ul>
		  		}
			</div>
			<div className ="dropdownHolder arrowHead">
	  			<div className ="selectedEdgeDisplay svgDropdown"
  					onClick={() => this._toggleView("rightSideOpen")}>
  					<div className = {""}>
  						<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
  					</div>
  				</div>
				{ this.state.rightSideOpen &&
	  			<ul className={"svgDropdown edgeDropdownOptions"}>
	  				<li
	  					onClick={() => this._toggleView("rightSideOpen")}>
	  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	  				</li>
	  				<li className="svgDropdownRightArrow"
	  					onClick={() => this._toggleView("rightSideOpen")}>
	  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	  				</li>
	  			</ul>
	  			}
			</div>
		</div>
	  )

  }

	_toggleView(whichView){
		if (this.state[whichView]){
			this.state[whichView] = false
		} else {
			this.state[whichView] = true;
		}

		this.forceUpdate();
	}

}
