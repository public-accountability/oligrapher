import React from "react"
import Typography from "@mui/material/Typography"
import { Annotation } from "../util/annotations"

export default function Annotation({ annotation: { header, text } }: { annotation: Annotation }) {
  return (
    <div className="oligrapher-annotation">
      <div className="oligrapher-annotation-header">
        <Typography variant="h4">{header}</Typography>
      </div>

      <div className="oligrapher-annotation-text" dangerouslySetInnerHTML={{ __html: text }}></div>
    </div>
  )
}
