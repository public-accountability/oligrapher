import React from 'react'
import { Select, MenuItem } from '@material-ui/core'

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

interface AddConnectionsCategoryProps {
  categoryId: string | number,
  onChange: (arg0: any) => void,
  variant: 'filled' | 'outlined' | 'standard'
}

export default function AddConnectionsCategory({ categoryId, onChange, variant }: AddConnectionsCategoryProps) {
  return (
    <Select
      className="add-connections-category"
      MenuProps={{ transitionDuration: 0 }}
      onChange={onChange}
      value={categoryId.toString()}
      fullWidth={true}
      variant={variant}
    >
      { CATEGORIES.map((name, id) =>
        <MenuItem value={id} key={id} dense={true}>{name}</MenuItem>)
      }
    </Select>
  )
}
