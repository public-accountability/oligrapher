import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import EditMenu from '../components/editor/EditMenu'

export default function Settings(props) {
  return <EditMenu tool="settings">
           <p>settings</p>
         </EditMenu>
}

Settings.propTypes = {}
