import React from 'react'
import { Select, MenuItem } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'

import { classNames } from '../util/helpers'

const useStyles = makeStyles({
  select: (props: CaptionEditorSelectProps) => ({
    marginTop: 5,
    marginRight: 5,
    fontSize: 12,
    lineHeight: 1.2,
    width: props.width
  }),
  option: {
    fontSize: 12,
    lineHeight: 1
  }
})

export default function CaptionEditorSelect(props: CaptionEditorSelectProps) {
  const classes = useStyles(props)
  const classNamez = classNames(classes.select, `select-caption-${props.name}`)

  return (
    <Select
      id={`caption-editor-select-${props.name}`}
      MenuProps={{ id: 'caption-editor-select-menu', transitionDuration: 0 }}
      className={classes.select}
      value={props.value}
      onChange={props.onChange(props.name)}
      variant="outlined"
    >
      { props.options.map(({ value, label }) => (
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
