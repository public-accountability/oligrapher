import React, { useState, useEffect } from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

import CustomizeButton from '../components/editor/CustomizeButton'
import EditMenuSubmitButtons from '../components/editor/EditMenuSubmitButtons'
import { edgePropTypes } from '../graph/edge'

/* Wrapper divs. */
const wrapper = renderChildren => (
  <div className="oligrapher-edit-edge-menu">
    <div className="edit-edge-menu-wrapper">
      <header>Customize Edge</header>
      <main>
        {renderChildren()}
      </main>
    </div>
  </div>)


const form = (label, setLabel) => (
  <form>
    <div>
      <label>Title</label>
      <input type="text"
             placeholder="label"
             value={label}
             onChange={ evt => setLabel(evt.target.value) } />
    </div>
  </form>)


const style = setPage => (
  <div className="style-form">
    <div>Style</div>
    <div>
      <CustomizeButton icon="size" onClick={() => setPage('size')} />
      <CustomizeButton icon="color" onClick={() => setPage('color')} />
    </div>
  </div>
)

const sizePicker = () => (
  <span>Size Picker for edge</span>
)

const colorPicker = () => (
  <span>Color Picker for edge</span>
)


export function EditEdgeMenu(props)  {
  const [page, setPage] = useState('main')
  const [label, setLabel] = useState(props.edge.label || '')
  const [size, setSize] = useState(props.size)
  const [color, setColor] = useState(props.size)

  const handleSubmit = () => props.updateEdge(props.edge.id, { label, size, color})
  const handleDelete = () => console.log(`deleting edge ${props.id}`)

  useEffect(() => {
    setLabel(props.edge.label || '')
  }, [props.edge.label])

  useEffect(() => {
    setSize(props.edge.size)
  }, [props.edge.size])

  useEffect(() => {
    setColor(props.edge.color)
  }, [props.edge.color])


  return wrapper(() => (
    <>
      { page === 'main' && form(label, setLabel) }
      { page === 'main' && style(setPage) }
      { page === 'size' && sizePicker() }
      { page === 'color' && colorPicker() }
      <footer>
        <EditMenuSubmitButtons handleSubmit={handleSubmit}
                               handleDelete={handleDelete}
                               page={page}
                               setPage={setPage} />
      </footer>
    </>
  ))
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
