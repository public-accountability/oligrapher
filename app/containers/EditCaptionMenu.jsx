import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'

export function EditCaptionMenu(props) {
  return <div className="oligrapher-edit-caption-menu">
           <div className="edit-caption-menu-wrapper">
             <header>Customize Caption: {props.id}</header>

             <main>
             </main>

             <footer>
             </footer>
           </div>
         </div>
}

EditCaptionMenu.propTypes = {
  id: PropTypes.string.isRequired
}

const mapStateToProps = state => {
  const captionId = state.display.editor.editCaption

  return {
    id: captionId
  }
}

export default connect(mapStateToProps)(EditCaptionMenu)
