import React from 'react'
import PropTypes from 'prop-types'

export default function HeaderButtons({saveAction, discardAction}) {
  return <div className="oligrapher-header-buttons-wrapper">

           <button name="save" onClick={saveAction} >
             Save
           </button>

           <button name="discard" onClick={discardAction} >
             Discard
           </button>

         </div>
}

HeaderButtons.propTypes = {
    saveAction: PropTypes.func.isRequired,
    discardAction: PropTypes.func.isRequired
}
