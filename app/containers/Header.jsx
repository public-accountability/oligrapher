import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Attribution from '../components/Attribution'
import Title from '../components/Title'
import HeaderMenu from '../components/HeaderMenu'

/*

  |------------------------------------------------------------|
  |  Title                              One of:                |
  |  Subtitle                              HeaderMenu          |
  |  Attribution                           HeaderButtons       |
  |------------------------------------------------------------|
*/
export class Header extends Component {
  render() {
    return <div id="oligrapher-header">
             <div id="oligrapher-header-left-wrapper">
               <Title title={this.props.title} subtitle={this.props.subtitle} />
               <Attribution user={this.props.user} />
             </div>
             <div id="oligrapher-header-right-wrapper">
               <HeaderMenu items={this.props.headerMenuItems} />
             </div>
           </div>
  }
}

Header.propTypes = {
  "title":      PropTypes.string,
  "subtitle":   PropTypes.string,
  "user":       PropTypes.shape({ "name": PropTypes.string,
                                  "url":  PropTypes.string }),
  "headerMenuItems":  PropTypes.array
}

const mapStateToProps = function(state) {
  return { "title": state.attributes.title,
           "subtitle": state.attributes.subtitle,
           "user": state.attributes.user,
           "headerMenuItems": state.attributes.links }
}


export default connect(mapStateToProps)(Header)
