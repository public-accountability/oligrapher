import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { useMediaQuery } from '@mui/material'
import Grid from '@mui/material/Unstable_Grid2'

import Header from './Header'
import CondensedHeader from './CondensedHeader'
import Graph from './Graph'
import Editor from './Editor'
import ZoomControl from './ZoomControl'
import FloatingEditors from './FloatingEditors'
import UserMessage from './UserMessage'
import DebugMessage from './DebugMessage'
import Annotations from './Annotations'
import CondensedAnnotations from './CondensedAnnotations'
// import AnnotationsToggler from './AnnotationsToggler'
import theme from '../util/theme'

import {
  showAnnotationsSelector,
  hasUnsavedChangesSelector,
  showHeaderSelector,
  showZoomControlSelector,
  hasAnnotationsSelector,
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
//        <Graph>
//        <Editor>
//        <ZoomControl>
//        <FloatingEditors>
//        <UserMessage>
//        <DebugMessage>
//      Grid-Item
//         <Annotations> or  <CondensedAnnotations>
export function Root() {
  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasAnnotations = useSelector(hasAnnotationsSelector)
  const hasUnsavedChanges = useSelector(hasUnsavedChangesSelector)
  const showHeader = useSelector(showHeaderSelector)
  const showZoomControl = useSelector(showZoomControlSelector)
  const editorMode = useSelector(editModeSelector)
  const debugMode = useSelector(debugModeSelector)

  // used condensed versions of header and annotations for small screens
  const largeHeight = useMediaQuery("(min-height:600px)")
  const largeWidth = useMediaQuery("(min-width:400px)")
  const showNormalHeader = showHeader && (editorMode || largeHeight)
  const showCondensedHeader = showHeader && !showNormalHeader
  const showAnnotationsOnRight =  showAnnotations && (editorMode || largeWidth)
  const showAnnotationsOnBottom =  showAnnotations && !showAnnotationsOnRight && largeHeight

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

  return (
    <ThemeProvider theme={theme}>
      <div id={ROOT_CONTAINER_ID}>
        <Grid container spacing={1}>

          <Grid item xs={12}>
            { showNormalHeader && <Header /> }
            { showCondensedHeader && <CondensedHeader /> }
          </Grid>

          <Grid item xs={12} md={showAnnotationsOnRight ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph />
              { editorMode && <Editor /> }
              { showZoomControl && <ZoomControl /> }
              <FloatingEditors />
              <UserMessage />
              { debugMode && <DebugMessage />}
            </div>
          </Grid>
          { showAnnotationsOnRight && <Grid item xs={4}><Annotations /></Grid> }
          { showAnnotationsOnBottom && <Grid item xs={12}><CondensedAnnotations /></Grid> }
        </Grid>
      </div>
    </ThemeProvider>
  )
}

export default Root
