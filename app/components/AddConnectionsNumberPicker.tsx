import React from 'react'
import { callWithTargetValue } from '../util/helpers'
import toNumber from 'lodash/toNumber'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

interface AddConnectionNumberPickerProps {
  value: number
  onChange: (arg0: number) => void
}

type CallWithNumberValueType = (f: (n: number) => any) => (event: any) => void

const callWithNumberValue: CallWithNumberValueType = (f) => (event) => {
  f(toNumber(event.target.value))
}

const useStyles = makeStyles({})

export default function AddConnectionsNumberPicker(props: AddConnectionNumberPickerProps) {
  return <Select
           value={props.value}
           onChange={callWithNumberValue(props.onChange)}
           label="Number"
           inputProps={{ id: 'add-connections-number-select' }}
    >
    <MenuItem aria-label="None" value=""></MenuItem>
    <MenuItem value={1}>1</MenuItem>
    <MenuItem value={5}>5</MenuItem>
    <MenuItem value={10}>10</MenuItem>
    <MenuItem value={20}>20</MenuItem>
  </Select>
}

// return <select onChange={callWithNumberValue(props.onChange)} value={props.value} children={NumberChoices()}></select>
