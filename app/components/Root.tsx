import React, { useRef, useLayoutEffect, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { ThemeProvider, useTheme } from '@mui/material/styles'
import useMediaQuery from '@mui/material/useMediaQuery'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Unstable_Grid2'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
import ZoomControl from './ZoomControl'
import FloatingEditors from './FloatingEditors'
import UserMessage from './UserMessage'
import DebugMessage from './DebugMessage'
import Annotations from './Annotations'
import CondensedAnnotations from './CondensedAnnotations'
import theme from '../util/theme'

import {
  showAnnotationsSelector,
  hasUnsavedChangesSelector,
  showHeaderSelector,
  showZoomControlSelector,
  headerIsCollapsedSelector,
  editModeSelector,
  debugModeSelector
} from '../util/selectors'

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
  const headerIsCollapsed = useSelector(headerIsCollapsedSelector)

  const showAnnotationsOnRight =  showAnnotations && !smallScreen
  const showAnnotationsOnBottom =  showAnnotations && smallScreen
  const showCondensedHeader = showHeader && !editorMode && !smallScreen

  const containerRef = React.useRef(null)
  const headerGridRef = React.useRef(null)

  // prevent backspace form navigating away from page in firefox and possibly other browsers
  useEffect(() => {
    window.addEventListener('keydown', event => {
      const isBackspace = event.key === 'Backspace'
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)

      if (isBackspace && !isInput) {
        event.preventDefault()
      }
    })
  })

  // Check for unsaved changed in beforeunload event
  useEffect(() => {
    if (hasUnsavedChanges) {
      window.addEventListener('beforeunload', handleBeforeunload)
      return () => {
        window.removeEventListener('beforeunload', handleBeforeunload);
      }
    }
  }, [hasUnsavedChanges])

  // Set SVG Height to fill container to bottom
  useLayoutEffect(() => {
    if (headerGridRef.current && containerRef.current) {
      let height = containerRef.current.clientHeight - headerGridRef.current.clientHeight - 5
      dispatch({ type: 'SET_SVG_HEIGHT', height })
    }
  }, [showCondensedHeader, headerIsCollapsed])

  return (
    <ThemeProvider theme={theme}>
      <div id={ROOT_CONTAINER_ID} ref={containerRef}>
        <Grid container spacing={1} alignItems="stretch">
          { showHeader && <Grid ref={headerGridRef} item sm={12}><Header /></Grid> }
          <Grid item sm={showAnnotationsOnRight ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph />
              { editorMode && <Editor /> }
              { showZoomControl && <ZoomControl /> }
              <FloatingEditors />
              <UserMessage />
            </div>
          </Grid>
          { showAnnotationsOnRight && <Grid item sm={4}><Annotations /></Grid> }
          { showAnnotationsOnBottom && <Grid item sm={12}><CondensedAnnotations /></Grid> }
        </Grid>
        { debugMode && <DebugMessage />}
      </div>
    </ThemeProvider>
  )
}

export default Root


/*



 */
