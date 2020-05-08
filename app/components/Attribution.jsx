import React from 'react'
import PropTypes from 'prop-types'

const renderUser = function(user) {
  const link = (
    <a href={user.url} target="_blank" rel="noopener noreferrer">
      {user.name}
    </a>
  )
  const name = user.url ? link : user.name

  if (!name) {
    return null
  }

  return (
    <div id="oligrapher-attribution-user">
      <span>by {name}</span>
    </div>
  )
}


const renderDate = function(date) {
  if (!date) {
    return null
  }

  return (
    <div id="oligrapher-attribution-date">
      {date}
    </div>
  )
}


export default function Attribution({ user, date }) {
  return (
    <div id="oligrapher-attribution">
      {renderUser(user)}
      {renderDate(date)}
    </div>
  )
}

Attribution.propTypes = {
  user: PropTypes.shape({
    name: PropTypes.string,
    url: PropTypes.string
  }),
  date: PropTypes.string
}

Attribution.defaultProps = {
  user: { "name": '', "url": ''},
  date: null
}
