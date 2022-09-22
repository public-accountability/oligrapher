import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { Hidden, useMediaQuery } from '@mui/material'
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
import AnnotationsToggler from './AnnotationsToggler'

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
//    <Header />
//    <CondensedHeader />
//   Grid-Container
//      Grid-Item
//        <Graph>
//        <Editor>
//        <ZoomControl>
//        <FloatingEditors>
//        <UserMessage>
//        <DebugMessage>
//      Grid-Item if Annotations are visible
//         <Annotations>
//   <CondensedAnnotations>
//   <AnnotationsToggler>
//
export function Root() {
  const shortScreen = useMediaQuery("(max-height:600px)")
  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasAnnotations = useSelector(hasAnnotationsSelector)
  const hasUnsavedChanges = useSelector(hasUnsavedChangesSelector)
  const showHeader = useSelector(showHeaderSelector)
  const showZoomControl = useSelector(showZoomControlSelector)
  const editorMode = useSelector(editModeSelector)
  const debugMode = useSelector(debugModeSelector)

  const showNormalHeader = showHeader && (editorMode || !shortScreen)
  const showCondensedHeader = showHeader && !showNormalHeader

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

          <Grid item xs={12} md={showAnnotations ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph />
              { editorMode && <Editor /> }
              { showZoomControl && <ZoomControl /> }
              <FloatingEditors />
              <UserMessage />
              { debugMode && <DebugMessage />}
            </div>
          </Grid>

          { showAnnotations &&
            <Hidden smDown>
              <Grid item xs={4}>
                <Annotations />
              </Grid>
            </Hidden>
          }



        </Grid>

        { showAnnotations &&
          <Hidden mdUp>
            <CondensedAnnotations />
          </Hidden>
        }

        { !showAnnotations && hasAnnotations &&
          <Hidden smUp>
            <div id="oligrapher-condensed-annotations-toggler">
              <AnnotationsToggler />
            </div>
          </Hidden>
        }
      </div>
    </ThemeProvider>
  )
}

export default Root
