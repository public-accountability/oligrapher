import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import { edgePropTypes } from '../graph/edge'

export function EditEdgeMenu(props)  {
  const [label, setLabel] = useState(props.edge.label || '')

  useEffect(() => {
    setLabel(props.edge.label || '')
  }, [props.edge.label])

  return <div className="oligrapher-edit-edge-menu">
           <div className="edit-edge-menu-wrapper">
             <header>Customize Edge</header>
             <main>
               <form className="oligrapher-edit-edge-menu-form">
                 <div>
                   <label>Title</label>
                   <input type="text"
                          placeholder="label"
                          value={label}
                          onChange={ (evt) => setLabel(evt.target.value) } />
                 </div>
               </form>
             </main>
           </div>
         </div>

}

EditEdgeMenu.propTypes = {
  id: PropTypes.string.isRequired,
  edge: PropTypes.shape(edgePropTypes),
  updateEdge: PropTypes.func.isRequired
}

const mapStateToProps = state => {
  const id = state.display.editor.editEdge

  return {
    id: id,
    edge: state.graph.edges[id]
  }
}

const mapDispatchToProps = (dispatch) => ({
  updateEdge: (id, attributes) => dispatch({type: "UPDATE_EDGE", id, attributes })
})

export default connect(mapStateToProps, mapDispatchToProps)(EditEdgeMenu)
