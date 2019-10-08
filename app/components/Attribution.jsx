import React from 'react'
import PropTypes from 'prop-types'

const renderUser = function(user) {
  if (user.name && user.url) {

    return <div id="oligrapher-header-attribution-user">
             <span>by <a href={user.url}>{user.name}</a></span>
           </div> }

  if (user.name) {
    return <div id="oligrapher-header-attribution-user">by {user.name}</div>
  }

  return <></>
}


const renderDate = function(date) {
  if (date) {
    return <div id="oligrapher-header-attribution-date">
             {date}
           </div>
  }

  return <></>

}


export default function Attribution(props) {
  return <div id="oligrapher-header-attribution-wrapper">
           {renderUser(props.user)}
           {renderDate(props.date)}
         </div>
}

Attribution.propTypes = {
  "user": PropTypes.shape({ "name": PropTypes.string,
                            "url":  PropTypes.string }),
  "date": PropTypes.string
}

Attribution.defaultProps = {
  "user": { "name": '', "url": ''},
  "date": null
}
