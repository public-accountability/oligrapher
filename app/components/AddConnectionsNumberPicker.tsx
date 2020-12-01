import React from 'react'
import { callWithTargetValue } from '../util/helpers'
import toNumber from 'lodash/toNumber'

interface AddConnectionNumberPickerProps {
  value: number
  onChange: (arg0: any) => void
}

const callWithNumberValue = (f: (arg: number) => any) => callWithTargetValue((value: any) =>  toNumber(value))

const choices = [1, 5, 10, 20]

function NumberChoices() {
  return choices.map(v => <option key={v} value={v}>{v}</option>)
}

export default function AddConnectionsNumberPicker(props: AddConnectionNumberPickerProps) {
  return <select onChange={callWithNumberValue(props.onChange)} value={props.value} children={NumberChoices()}></select>
}
