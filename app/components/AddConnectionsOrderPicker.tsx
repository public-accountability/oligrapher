import React, { useEffect, useState, useCallback } from 'react'

import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import { makeStyles } from '@material-ui/core/styles';

import { AddConnectionsOrder } from '../datasources/littlesis3'

interface Props {
  onChange: (arg0: AddConnectionsOrder) => void,
  value: AddConnectionsOrder
}

export default function AddConnectionsOrderPicker(props: Props) {
  let onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.onChange(event.target.value as AddConnectionsOrder)
  }

  return <Select className="add-connections-category" label="priority" id="add-connection-order-picker" value={props.value} onChange={onChange} fullWidth={true} title="Order the results by">
           <MenuItem value={'link_count'}>Popularity</MenuItem>
           <MenuItem value={'current'}>Is Current</MenuItem>
           <MenuItem value={'amount'}>Amount</MenuItem>
           <MenuItem value={'updated'}>Recently Updated</MenuItem>
        </Select>
}
