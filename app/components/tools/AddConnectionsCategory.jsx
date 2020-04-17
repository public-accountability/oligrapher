import React from 'react'

export const CATEGORIES = [
  'All Categories',
  'Position',
  'Education',
  'Membership',
  'Family',
  'Donation',
  'Transaction',
  'Lobbying',
  'Social',
  'Professional',
  'Ownership',
  'Hierarchy',
  'Generic'
]

export default function AddConnectionsCategory({ onChange }) {
  return (
      <select className="add-connections-category" onChange={onChange}>
        { CATEGORIES.map((name, id) => <option value={id} key={id}>{name}</option>) }
      </select>
  )
}