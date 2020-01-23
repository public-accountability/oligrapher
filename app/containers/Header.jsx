import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import HeaderRight from './HeaderRight'
import Attribution from '../components/Attribution'
import Title from '../components/Title'
import Subtitle from '../components/Subtitle'

/*

  |------------------------------------------------------------|
  |  Title (#oligrapher-header-top)                            |                                  |
  |------------------------------------------------------------|
  | #oligrapher-header-bottom
  |
  |                                      One of:               |
  |  Subtitle                              HeaderMenu          |
  |  Attribution                           HeaderButtons       |
  |------------------------------------------------------------|
*/

export function Header(props) {
  return <div id="oligrapher-header">

             <div id="oligrapher-header-top">
               <Title text={props.title} />
             </div>

             <div id="oligrapher-header-bottom">

               <div id="oligrapher-header-left-wrapper">
                 <Subtitle text={props.subtitle} />
                 <Attribution user={props.user} date={props.date} />
               </div>

               <div id="oligrapher-header-right-wrapper">
                 <HeaderRight />
               </div>

             </div>
           </div>
}

Header.propTypes = {
  editor:     PropTypes.bool,
  title:      PropTypes.string,
  subtitle:   PropTypes.string,
  date:       PropTypes.string,
  user:       PropTypes.shape({ name: PropTypes.string, url:  PropTypes.string })
}

const mapStateToProps = state => ({
  editor:   state.display.modes.editor,
  title:    state.attributes.title,
  subtitle: state.attributes.subtitle,
  user:     state.attributes.user,
  date:     state.attributes.date
})


export default connect(mapStateToProps)(Header)
