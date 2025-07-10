import React from 'react'
import PropTypes from 'prop-types'

import { User } from '../util/defaultState'

const renderUsers = function(users: User[]) {
  const name = (user: User) => (
    <a key={user.name} href={user.url} target="_blank" rel="noopener noreferrer">
      {user.name}
    </a>
  )

  const names = users.map(name).reduce((prev, current, i): any => {
    const separator = (i == users.length - 1) ? ' and ' : ', '
    return [prev, separator, current]
  })

  return (
    <div id="oligrapher-attribution-users">
      <span>by {names}</span>
    </div>
  )
}


const renderDate = function(created_date: string, modified_date: string) {
  return (
    <div id="oligrapher-attribution-date">
      Created on {created_date}.  Last updated on {modified_date}.
    </div>
  )
}


export default function Attribution({ users, created_date, modified_date }: AttributionProps) {
  return (
    <div id="oligrapher-attribution">
      {renderUsers(users)}
      {renderDate(created_date, modified_date)}
    </div>
  )
}

interface AttributionProps {
  users: User[],
  created_date: string,
  modified_date: string
}
