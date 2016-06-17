import React, { Component, PropTypes } from 'react';
import BaseComponent from './BaseComponent';

export default class EdgeDropdown extends BaseComponent {

  constructor(props) {
    super(props);
    var hasLeft = (this.props.arrow == "left" || this.props.arrow == "both") ? true : false;
    var hasRight = (this.props.arrow == "right" || this.props.arrow == "both") ? true : false;

    this.state = {
      "leftSideOpen": false,
      "centerOpen": false, 
      "rightSideOpen": false,
      "leftSideArrow": hasLeft,
      "centerDashed": props.dash, 
      "rightSideArrow": hasRight
    };
  }

  componentWillReceiveProps() {
  	var hasLeft = (this.props.arrow == "left" || this.props.arrow == "both") ? true : false;
    var hasRight = (this.props.arrow == "right" || this.props.arrow == "both") ? true : false;
	this.setState({"leftSideArrow": hasLeft});
    this.setState({"rightSideArrow": hasRight});
	this.setState({"centerDashed": this.props.dash});
  }

  componentDidUpdate() {
  	if (this.state.centerDashed != this.props.dash){
  		this.setState({"centerDashed": this.props.dash});
  	}
  	var hasLeft = (this.props.arrow == "left" || this.props.arrow == "both") ? true : false;
    var hasRight = (this.props.arrow == "right" || this.props.arrow == "both") ? true : false;
	
	if (this.state.leftSideArrow != hasLeft){
		this.setState({"leftSideArrow": hasLeft});
	}
	if (this.state.rightSideArrow != hasRight){
		this.setState({"rightSideArrow": hasRight});
	}
  }


  render () {
  	var leftClass = this.state.leftSideArrow ? "svgDropdownLeftArrow" : "";
  	var centerClass = this.state.centerDashed ? "svgDropdownDashed" : "";
  	var rightClass = this.state.rightSideArrow ? "svgDropdownRightArrow" : "";
  	return (
  		<div className="strokeDropdowns">
		  	<div className ="dropdownHolder arrowHead">
		  		<div className ="selectedEdgeDisplay svgDropdown"
  					onClick={() => this._toggleView("leftSideOpen")}>
  					<div className = {leftClass}>
  						<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
  					</div>
  				</div>
  				{ this.state.leftSideOpen &&
		  			<ul className={"svgDropdown edgeDropdownOptions"}>
		  				<li 
		  					onClick={() => this._toggleView("leftSideOpen", ["leftSideArrow", false])}>
		  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
		  				</li>
		  				<li className="svgDropdownLeftArrow"
		  					onClick={() => this._toggleView("leftSideOpen", ["leftSideArrow", true])}>
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
		  					onClick={() => this._toggleView("centerOpen", ["centerDashed", false])}>
		  					<svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
		  				</li>
		  				<li className="svgDropdownDashed"
		  					onClick={() => this._toggleView("centerOpen", ["centerDashed", true])}>
		  					<svg><line x1="98%" y1="50%" x2="2%" y2="50%" /></svg>
		  				</li>
		  			</ul>
		  		}
			</div>
			<div className ="dropdownHolder arrowHead">
	  			<div className ="selectedEdgeDisplay svgDropdown"
  					onClick={() => this._toggleView("rightSideOpen")}>
  					<div className = {rightClass}>
  						<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
  					</div>
  				</div>
				{ this.state.rightSideOpen &&
	  			<ul className={"svgDropdown edgeDropdownOptions"}>
	  				<li
	  					onClick={() => this._toggleView("rightSideOpen", ["rightSideArrow", false])}>
	  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	  				</li>
	  				<li className="svgDropdownRightArrow"
	  					onClick={() => this._toggleView("rightSideOpen", ["rightSideArrow", true])}>
	  					<svg><line x1="75%" y1="50%" x2="25%" y2="50%" /></svg>
	  				</li>
	  			</ul>
	  			}
			</div>
		</div>
	  )

  }

  _handleChange(){
  	var whichArrow;
  	if (this.state.leftSideArrow && this.state.rightSideArrow){
  		whichArrow = "both";
  	} else if (!this.state.leftSideArrow && !this.state.rightSideArrow) {
  		whichArrow = null;
  	} else if (this.state.leftSideArrow){
  		whichArrow = "left";
  	} else {
  		whichArrow = "right";
  	}
  	this.props.onChange(whichArrow, this.state.centerDashed);
  }

	_toggleView(whichView, whichProperty){
		if (this.state[whichView]){
			this.state[whichView] = false
		} else {
			this.state[whichView] = true;
		}

		if (whichProperty != undefined){
			this.state[whichProperty[0]] = whichProperty[1];
		}
		this._handleChange();
	}

}
