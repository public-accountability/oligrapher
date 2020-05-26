import React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/styles'

import { classNames } from '../util/helpers'

const useStyles = makeStyles(() => ({
  select: (width: number) => ({
    marginTop: 5,
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1.2,
    width: width
  }),
  option: {
    fontSize: 12,
    lineHeight: 1
  }
}))

export default function CaptionEditorSelect({ value, onChange, options, width, name }: CaptionEditorSelectProps) {
  const classes = useStyles(width)
  const classNamez = classNames(classes.select, `select-caption-${name}`)

  return (
    <Select
      id={`caption-editor-select-${name}`}
      MenuProps={{ id: 'caption-editor-select-menu', transitionDuration: 0 }}
      className={classNamez}
      value={value}
      onChange={onChange(name)}
      variant="outlined"
    >
      { options.map(({ value, label }) => (
        <MenuItem className={classes.option} dense={true} value={value} key={value}>{label}</MenuItem>)
       ) }
    </Select>
  )
}

interface CaptionEditorSelectProps {
  value: string,
  onChange: (name: string) => () => void,
  options: Array<{ value: any, label: any }>,
  width: number,
  name: string
}