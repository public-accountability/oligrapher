import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { ThemeProvider } from '@mui/material/styles'
import { Grid, Hidden } from '@mui/material'
import Header from './Header'
import CondensedHeader from './CondensedHeader'
import Graph from './Graph'
import FloatingEditors from './FloatingEditors'
import ZoomControl from './ZoomControl'
import UserMessage from './UserMessage'
import CondensedAnnotations from './CondensedAnnotations'
import AnnotationsToggler from './AnnotationsToggler'
import theme from '../util/theme'
import {
  showAnnotationsSelector, annotationsListSelector, hasUnsavedChangesSelector, showHeaderSelector, showZoomControlSelector
} from '../util/selectors'

import Annotations from './Annotations'
import Editor from './Editor'

export const ROOT_CONTAINER_ID = "oligrapher-container"

export function Root() {
  const showAnnotations = useSelector(showAnnotationsSelector)
  const hasAnnotations = useSelector(annotationsListSelector).length > 0
  const hasUnsavedChanges = useSelector(hasUnsavedChangesSelector)
  const showHeader = useSelector(showHeaderSelector)
  const showZoomControl = useSelector(showZoomControlSelector)
  const editorMode = useSelector(state => state.display.modes.editor)

  // to pevent backspace form navigating away from page
  // in firefox and possibly other browsers
  useEffect(() => {
    window.addEventListener('keydown', event => {
      const isBackspace = event.key === 'Backspace'
      const isInput = ['INPUT', 'TEXTAREA', 'SELECT'].includes(event.target.tagName)

      if (isBackspace && !isInput) {
        event.preventDefault()
      }
    })
  })

  useEffect(() => {
    if (hasUnsavedChanges) {
      const handleBeforeunload = event => {
        event.returnValue = "Are you sure you want to leave? You have unsaved changes!"
        return event.returnValue
      }

      window.addEventListener('beforeunload', handleBeforeunload)

      return () => {
        window.removeEventListener('beforeunload', handleBeforeunload);
      }
    }
  }, [hasUnsavedChanges])


  return (
    <div id={ROOT_CONTAINER_ID}>
      <ThemeProvider theme={theme}>
        {
          showHeader &&
            <Hidden xsDown>
              <Header />
            </Hidden>
        }
        <Hidden smUp>
          <CondensedHeader />
        </Hidden>

        <Grid container spacing={0}>
          <Grid item xs={12} md={showAnnotations ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph />
              <Hidden xsDown>
                { editorMode && <Editor /> }
              </Hidden>
              { showZoomControl && <ZoomControl /> }
              <FloatingEditors />
              <UserMessage />
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
      </ThemeProvider>
    </div>
  )
}

export default Root
