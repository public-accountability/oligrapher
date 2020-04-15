import React, { useRef, useEffect } from 'react'
import ReactDOM from 'react-dom'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { classNames, getElementById } from '../util/helpers'
import isEqual from 'lodash/isEqual'
import noop from 'lodash/noop'

import DraggableComponent from '../components/graph/DraggableComponent'
import CaptionTextbox from '../components/graph/CaptionTextbox'

import FloatingMenu from '../util/floatingMenu'

const InvisibleTextbox = React.forwardRef((props, ref) => {
  return <input ref={ref} value={props.value} onChange={props.onChange} type="text" />
})

InvisibleTextbox.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

export function Caption(props) {
  const inputRef = useRef(null)
  const handleTextChange = event => props.updateCaption({ text: event.target.value })

  const className = classNames('caption', props.isFocused ? 'focused' : null)

  useEffect( () => {
    if (props.isFocused) {
      inputRef.current.focus()
    }
  },[ props.isFocused ])

  return <DraggableComponent actualZoom={props.actualZoom}
                             onStop={props.moveCaption}
                             onDrag={noop}
                             onClick={props.openEditMenu}
                             handle=".caption">

           <g className={className} id={`caption-${props.id}`} >

             {/*
                 This is something of a hack because SVG elements cannot be
                 easily made editiable like html divs or inputs.
                 It uses a lesser-known react feature called portals to render an invisible <input>
                 into an empty divin <FloatingMenu>.

               */}

             { props.isFocused && ReactDOM.createPortal(<InvisibleTextbox value={props.text}
                                                                           onChange={handleTextChange}
                                                                           ref={inputRef} />,
                                                         getElementById('caption-text-input') )}

             <CaptionTextbox x={props.x}
                             y={props.y}
                             text={props.text} />
           </g>
         </DraggableComponent>
}

Caption.propTypes = {
  // Caption Attributes
  id: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
  x: PropTypes.number.isRequired,
  y: PropTypes.number.isRequired,
  scale: PropTypes.number.isRequired,
  // Action Functions
  updateCaption: PropTypes.func.isRequired,
  moveCaption: PropTypes.func.isRequired,
  openEditMenu: PropTypes.func.isRequired,
  // Other fields from store
  actualZoom: PropTypes.number.isRequired,
  isFocused: PropTypes.bool.isRequired
}

const mapStateToProps = (state, ownProps) => {
  return {
    ...state.graph.captions[ownProps.id],
    isFocused: isEqual(state.display.editor.tool, 'text') && isEqual(FloatingMenu.getId(state, 'caption'), ownProps.id),
    actualZoom: state.display.actualZoom,
  }
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  openEditMenu: () => dispatch({type: 'OPEN_EDIT_CAPTION_MENU', id: ownProps.id }),
  updateCaption: attributes => dispatch({
    type: 'UPDATE_CAPTION',
    attributes: attributes,
    id: ownProps.id
  }),
  moveCaption: deltas => dispatch({
    type: 'MOVE_CAPTION',
    deltas: deltas,
    id: ownProps.id
  })
})

export default connect(mapStateToProps, mapDispatchToProps)(Caption)
