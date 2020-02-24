import React from 'react'
import PropTypes from 'prop-types'

import CustomizeButton from './CustomizeButton'

export default function NodeStyleForm({ setPage }) {
  return <div className="style-form">
           <div>Style</div>
           <div>
             <CustomizeButton icon="size" onClick={() => setPage('size')} />
             <CustomizeButton icon="color" onClick={() => setPage('color')} />
             <CustomizeButton icon="shapes" onClick={() => console.error('Shapes not yet implemented')}  />
           </div>
         </div>
}

NodeStyleForm.propTypes = {
  setPage: PropTypes.func.isRequired
}
