import React from 'react'
import PropTypes from 'prop-types'

const renderUser = function(user) {
  const name = user.url ? <a href={user.url}>{user.name}</a> : user.name

  return (
    <div id="oligrapher-header-attribution-user">
      <span>by {name}</span>
    </div>
  )
}


const renderDate = function(date) {
  if (date) {
    return (
      <div id="oligrapher-header-attribution-date">
        {date}
      </div>
    )
  }

  return <></>
}


export default function Attribution(props) {
  return (
    <div id="oligrapher-header-attribution-wrapper">
      {renderUser(props.user)}
      {renderDate(props.date)}
    </div>
  )
}

Attribution.propTypes = {
  "user": PropTypes.shape({ "name": PropTypes.string,
                            "url": PropTypes.string }),
  "date": PropTypes.string
}

Attribution.defaultProps = {
  "user": { "name": '', "url": ''},
  "date": null
}
