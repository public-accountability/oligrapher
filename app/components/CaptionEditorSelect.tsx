import React from 'react'
import { Select, MenuItem } from '@mui/material'
import { styled } from '@mui/material/styles';

const StyledSelect = styled(Select)`
marginTop: 5;
marginRight: 5;
fontSize: 12;
lineHeight: 1.2;
width: ${props => props.width};
`

const StyledMenuItem = styled(MenuItem)`
fontSize: 12;
lineHeight: 1;
`

export default function CaptionEditorSelect(props: CaptionEditorSelectProps) {
  return (
    <StyledSelect
      id={`caption-editor-select-${props.name}`}
      MenuProps={{ id: 'caption-editor-select-menu', transitionDuration: 0 }}
      value={props.value}
      onChange={props.onChange(props.name)}
      variant="outlined">
      {
        props.options.map(({ value, label }) => (
        <StyledMenuItem dense={true} value={value} key={value}>{label}</StyledMenuItem>
      )) }
    </StyledSelect>
  )
}

interface CaptionEditorSelectProps {
  value: string,
  onChange: (name: string) => () => void,
  options: Array<{ value: any, label: any }>,
  width: number,
  name: string
}
