import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { classNames } from '../util/helpers'

export function Clickable(props) {
  return <>
           { props.enabled && <rect className={props.className}
                                    x="-5000"
                                    y="-5000"
                                    width="10000"
                                    height="10000"
                                    fill="#fff"
                                    onClick={props.onClick} /> }
           { props.children }
         </>
}

Clickable.propTypes = {
  children:  PropTypes.node.isRequired,
  enabled:   PropTypes.bool.isRequired,
  onClick:   PropTypes.func,
  className: PropTypes.string
}

const mapStateToProps = state => {
  const openTool = state.display.editor.tool
  const enabled = openTool === 'text'
  const className = classNames("clickable-rect", enabled ? `clickable-tool-${openTool}` : null)

  return { enabled, className }

}

const mapDispatchToProps = dispatch => ({
  onClick: () => dispatch({ type: 'BACKGROUND_CLICK' })
})


export default connect(mapStateToProps, mapDispatchToProps)(Clickable)
