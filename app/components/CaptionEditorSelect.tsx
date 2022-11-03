import React from "react"
import Select from "@mui/material/Select"
import MenuItem from "@mui/material/MenuItem"

/* margintop: 5;
 * marginright: 5;
 * fontsize: 12;
 * lineheight: 1.2;
 * width: ${props => props.width};


 * menu item
 * fontsize: 12;
 * lineheight: 1;
 */

export default function CaptionEditorSelect(props: CaptionEditorSelectProps) {
  return (
    <Select
      sx={{ mt: 1 }}
      id={`caption-editor-select-${props.name}`}
      MenuProps={{ id: "caption-editor-select-menu", transitionDuration: 0 }}
      value={props.value}
      onChange={props.onChange}
      variant="outlined"
    >
      {props.options.map(({ value, label }) => (
        <MenuItem dense={true} value={value} key={value}>
          {label}
        </MenuItem>
      ))}
    </Select>
  )
}

interface CaptionEditorSelectProps {
  value: string
  onChange: React.ChangeEvent<HTMLSelectElement>
  options: Array<{ value: any; label: any }>
  name: string
}
