import React, { Component } from 'react'
import { connect } from 'react-redux'
import Title from '../components/Title'


export class Header extends Component {
  render () {
    return <>
             <Title title={this.props.title}/>
           </>
  }
}

const mapStateToProps = state => ({
  "title": state.attributes.title
})


export default connect(mapStateToProps)(Header)
