import React from "react"
import { useSelector } from "react-redux"
import { ThemeProvider } from "@mui/material/styles"

import CondensedHeader from "./CondensedHeader"
import Graph from "./Graph"
import ZoomControl from "./ZoomControl"
import CondensedAnnotations from "./CondensedAnnotations"
import AnnotationsToggler from "./AnnotationsToggler"
import theme from "../util/theme"
import { showAnnotationsSelector, annotationsListSelector } from "../util/selectors"

export const ROOT_CONTAINER_ID = "oligrapher-container"

export function EmbeddedRoot() {
  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasAnnotations = useSelector(annotationsListSelector).length > 0

  return (
    <div id={ROOT_CONTAINER_ID}>
      <ThemeProvider theme={theme}>
        <CondensedHeader />
        <div id="oligrapher-graph-container">
          <Graph rootContainerId={ROOT_CONTAINER_ID} />
          <ZoomControl />
        </div>
        {showAnnotations && <CondensedAnnotations />}
        {!showAnnotations && hasAnnotations && (
          <div id="oligrapher-condensed-annotations-toggler">
            <AnnotationsToggler />
          </div>
        )}
      </ThemeProvider>
    </div>
  )
}

export default EmbeddedRoot
