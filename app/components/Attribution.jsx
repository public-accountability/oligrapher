import React from 'react'
import PropTypes from 'prop-types'

const renderUsers = function(users) {
  const name = user => (
    user.url 
      ? <a key={user.name} href={user.url} target="_blank" rel="noopener noreferrer">
          {user.name}
        </a>
      : user.name
  )

  const names = users.map(name).reduce((prev, current, i) => {
    const separator = (i == users.length - 1) ? ' and ' : ', '
    return [prev, separator, current]
  })

  return (
    <div id="oligrapher-attribution-users">
      <span>by {names}</span>
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


export default function Attribution({ users, date }) {
  return (
    <div id="oligrapher-attribution">
      {renderUsers(users)}
      {renderDate(date)}
    </div>
  )
}

Attribution.propTypes = {
  users: PropTypes.array.isRequired,
  date: PropTypes.string
}

Attribution.defaultProps = {
  user: { "name": '', "url": ''},
  date: null
}
