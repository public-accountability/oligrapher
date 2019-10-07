import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import Title from '../components/Title'
import Attribution from '../components/Attribution'


export class Header extends Component {
  render () {
    return <>
             <Title title={this.props.title} subtitle={this.props.subtitle} />
             <Attribution user={this.props.user} />
           </>
  }
}

Header.propTypes = {
  "title":      PropTypes.string,
  "subtitle":   PropTypes.string,
  "user":       PropTypes.shape({ "name": PropTypes.string,
                                  "url":  PropTypes.string })
}

const mapStateToProps = state => ({
  "title": state.attributes.title,
  "subtitle": state.attributes.subtitle,
  "user":state.attributes.user
})


export default connect(mapStateToProps)(Header)
