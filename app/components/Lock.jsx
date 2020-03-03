import React from 'react'
import PropTypes from 'prop-types'

export default function Lock({username}) {
  return <div className="lock">
           <h1>Sorry!</h1>
           <p>
             <strong>{username}</strong> is editing this map right now.
             Get in touch with your team to get editing control.
           </p>
         </div>
}

Lock.propTypes = {
  username: PropTypes.string.isRequired
}
