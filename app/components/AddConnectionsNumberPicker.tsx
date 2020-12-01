import React from 'react'
import { callWithTargetValue } from '../util/helpers'
import toNumber from 'lodash/toNumber'

//import NativeSelect from '@material-ui/core/NativeSelect';
import Select from '@material-ui/core/Select';
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
  return <Select native
           value={props.value}
           onChange={callWithNumberValue(props.onChange)}
           label="Number"
           inputProps={{ id: 'add-connections-number-select' }}
  >
  <option aria-label="None" value="" />
  <option value={1}>1</option>
  <option value={5}>5</option>
  <option value={10}>10</option>
  <option value={20}>20</option>
  </Select>
}

// return <select onChange={callWithNumberValue(props.onChange)} value={props.value} children={NumberChoices()}></select>
