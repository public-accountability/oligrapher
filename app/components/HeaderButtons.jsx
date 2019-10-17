import React from 'react'
import PropTypes from 'prop-types'

export default function HeaderButtons({saveAction, discardAction}) {
  return <div className="oligrapher-header-buttons-wrapper">

           <button className="oligrapher-save-btn" onClick={saveAction} >
           </button>

           <button className="oligrapher-discard-btn" onClick={discardAction} >
           </button>

         </div>
}

HeaderButtons.propTypes = {
    saveAction: PropTypes.func.isRequired,
    discardAction: PropTypes.func.isRequired
}
