import React, { useRef, useLayoutEffect, useEffect, useCallback } from "react"
import { useDispatch, useSelector } from "react-redux"
import { ThemeProvider, useTheme } from "@mui/material/styles"
import useMediaQuery from "@mui/material/useMediaQuery"
import Grid from "@mui/material/Unstable_Grid2"
import Header from "./Header"
import Graph from "./Graph"
import Editor from "./Editor"
import ZoomControl from "./ZoomControl"
import FloatingEditors from "./FloatingEditors"
import UserMessage from "./UserMessage"
import DebugMessage from "./DebugMessage"
import Annotations from "./Annotations"
import CondensedAnnotations from "./CondensedAnnotations"
import theme from "../util/theme"
import SvgRefContext from "../util/SvgRefContext"

import {
  showAnnotationsSelector,
  hasUnsavedChangesSelector,
  showHeaderSelector,
  showZoomControlSelector,
  headerIsCollapsedSelector,
  showFloatingEditorsSelector,
  editModeSelector,
  debugModeSelector,
  embedSelector,
} from "../util/selectors"

export const ROOT_CONTAINER_ID = "oligrapher-container"

const handleBeforeunload = (event: BeforeUnloadEvent) => {
  event.returnValue = "Are you sure you want to leave? You have unsaved changes!"
  return event.returnValue
}

// Root Oligrapher Component
//
// div#oligrapher-container
//   Grid-Container
//      Grid-Item
//        <Header /> or <CondensedHeader />
//      Grid-Item
//        div#oligrapher-graph-container
//          div#oligrapher-graph-svg
//              <svg>
//        div#oligrapher-graph-editor
//          <Editor>
//        div#oligrapher-zoomcontrol
//          <ZoomControl>
//        <FloatingEditors>
//        <UserMessage>
//        <DebugMessage>
//      Grid-Item
//         <Annotations> or  <CondensedAnnotations>
export function Root() {
  const dispatch = useDispatch()
  const smallScreen = useMediaQuery("(max-height:600px)")

  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasUnsavedChanges = useSelector(hasUnsavedChangesSelector)
  const showHeader = useSelector(showHeaderSelector)
  const showZoomControl = useSelector(showZoomControlSelector)
  const editorMode = useSelector(editModeSelector)
  const debugMode = useSelector(debugModeSelector)
  const embedMode = useSelector(embedSelector)
  const headerIsCollapsed = useSelector(headerIsCollapsedSelector)
  const showFloatingEditors = useSelector(showFloatingEditorsSelector)

  const showAnnotationsOnRight = showAnnotations && !smallScreen
  const showAnnotationsOnBottom = showAnnotations && smallScreen
  const showCondensedHeader = showHeader && (embedMode || (!editorMode && !smallScreen))

  const svgRef = React.useRef(null)
  const containerRef = React.useRef(null)
  const headerGridRef = React.useRef(null)

  // prevent backspace form navigating away from page in firefox and possibly other browsers
  useEffect(() => {
    window.addEventListener("keydown", event => {
      const isBackspace = event.key === "Backspace"
      const isInput = ["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)

      if (isBackspace && !isInput) {
        event.preventDefault()
      }
    })
  }, [])

  useEffect(() => {
    // Set SVG Height to fill container to bottom
    if (headerGridRef.current && containerRef.current) {
      let height = containerRef.current.clientHeight - headerGridRef.current.clientHeight - 1
      dispatch({ type: "SET_SVG_HEIGHT", height })
    }
    // Set Scale
    dispatch({ type: "SET_SVG_SCALE" })
  })

  // Check for unsaved changed in beforeunload event
  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener("beforeunload", handleBeforeunload)
      return () => {
        window.removeEventListener("beforeunload", handleBeforeunload)
      }
    }
  }, [hasUnsavedChanges])

  // spacing={1} alignItems="stretch"
  return (
    <ThemeProvider theme={theme}>
      <SvgRefContext.Provider value={svgRef}>
        <div id={ROOT_CONTAINER_ID} ref={containerRef}>
          <Grid container>
            {showHeader && (
              <Grid ref={headerGridRef} item sm={12}>
                <Header />
              </Grid>
            )}
            <Grid item sm={showAnnotationsOnRight ? 8 : 12}>
              <div id="oligrapher-graph-container">
                <Graph />
                {editorMode && <Editor />}
                {showZoomControl && <ZoomControl />}
                {showFloatingEditors && <FloatingEditors />}
                <UserMessage />
              </div>
            </Grid>
            {showAnnotationsOnRight && (
              <Grid item sm={4}>
                <Annotations />
              </Grid>
            )}
            {showAnnotationsOnBottom && (
              <Grid item sm={12}>
                <CondensedAnnotations />
              </Grid>
            )}
          </Grid>
          {debugMode && <DebugMessage />}
        </div>
      </SvgRefContext.Provider>
    </ThemeProvider>
  )
}

export default Root
