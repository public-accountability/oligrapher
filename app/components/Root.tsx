import React, { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import useResizeObserver from "@react-hook/resize-observer"
import { ThemeProvider } from "@mui/material/styles"
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
import LockManager from "./LockManager"

import {
  showAnnotationsSelector,
  hasUnsavedChangesSelector,
  showHeaderSelector,
  showZoomControlSelector,
  showFloatingEditorsSelector,
  editModeSelector,
  debugModeSelector,
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
export function Root(props: { cable?: any }) {
  const dispatch = useDispatch()
  const smallScreen = useMediaQuery("(max-height:600px)")

  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasUnsavedChanges = useSelector(hasUnsavedChangesSelector)
  const showHeader = useSelector(showHeaderSelector)
  const showZoomControl = useSelector(showZoomControlSelector)
  const editorMode = useSelector(editModeSelector)
  const debugMode = useSelector(debugModeSelector)
  const showFloatingEditors = useSelector(showFloatingEditorsSelector)

  const showAnnotationsOnRight = showAnnotations && !smallScreen
  const showAnnotationsOnBottom = showAnnotations && smallScreen

  const svgRef = React.useRef(null)
  const containerRef = React.useRef(null)

  // Set svg height and scale when resized
  useResizeObserver(containerRef, _entry => {
    dispatch({ type: "SET_SVG_HEIGHT" })
    dispatch({ type: "SET_SVG_SCALE" })
  })

  // prevent backspace form navigating away from page in firefox and possibly other browsers
  useEffect(() => {
    window.addEventListener("keydown", event => {
      if (event.key === "Backspace") {
        if (!["INPUT", "TEXTAREA", "SELECT"].includes(event.target.tagName)) {
          if (!event.target.classList.contains("editor-open")) {
            event.preventDefault()
          }
        }
      }
    })
  }, [])

  // Reset view once after page is loaded
  useEffect(() => {
    dispatch({ type: "RESET_VIEW" })
  }, [])

  // Set svg height and scale whenever root is re-rendered
  useEffect(() => {
    dispatch({ type: "SET_SVG_HEIGHT" })
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

  return (
    <ThemeProvider theme={theme}>
      <SvgRefContext.Provider value={svgRef}>
        <div id={ROOT_CONTAINER_ID} ref={containerRef}>
          {showHeader && <Header />}
          <div style={{ flex: 1 }}>
            <Grid container style={{ height: "100%" }}>
              <Grid sm={showAnnotationsOnRight ? 8 : 12}>
                <div id="oligrapher-graph-container">
                  <Graph />
                  {editorMode && <Editor />}
                  {showZoomControl && <ZoomControl />}
                  {showFloatingEditors && <FloatingEditors />}
                  <UserMessage />
                </div>
              </Grid>
              {showAnnotationsOnRight && (
                <Grid sm={4}>
                  <Annotations />
                </Grid>
              )}
            </Grid>
          </div>

          {showAnnotationsOnBottom && (
            <div style={{ flex: 1 }}>
              <CondensedAnnotations />
            </div>
          )}

          {debugMode && <DebugMessage />}
          <LockManager />
        </div>
      </SvgRefContext.Provider>
    </ThemeProvider>
  )
}

export default Root
