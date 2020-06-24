import React, { useEffect, useRef, useCallback } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import { ThemeProvider } from '@material-ui/core/styles'
import { Grid, Hidden } from '@material-ui/core'

import Header from './Header'
import CondensedHeader from './CondensedHeader'
import Graph from './Graph'
import Editor from './Editor'
import FloatingEditors from './FloatingEditors'
import ZoomControl from './ZoomControl'
import UserMessage from './UserMessage'
import Annotations from './Annotations'
import CondensedAnnotations from './CondensedAnnotations'
import { muiTheme } from '../util/helpers'
import { showAnnotationsSelector } from '../util/selectors'

export const ROOT_CONTAINER_ID = "oligrapher-container"

export function Root() {
  const dispatch = useDispatch()
  const showAnnotations = useSelector(showAnnotationsSelector)
  const { headerIsCollapsed } = useSelector(state => state.display)
  const storyMode = useSelector(state => state.display.modes.story)

  const graphRef = useRef()
  const annotationsRef = useRef()

  const setSvgSize = useCallback(size => {
    dispatch({ type: 'SET_SVG_SIZE', size })
  }, [dispatch])

  useEffect(() => {
    const graphTop = graphRef.current.getBoundingClientRect().top
    const annotationsTop = annotationsRef.current.getBoundingClientRect().top || window.innerHeight
    const height = Math.floor(annotationsTop - graphTop)
    console.log(graphTop, annotationsTop, height, window.innerHeight)

    const { width } = graphRef.current.getBoundingClientRect()
    setSvgSize({ width: Math.floor(width), height })
  }, [headerIsCollapsed, storyMode])

  return (
    <div id={ROOT_CONTAINER_ID}>
      <ThemeProvider theme={muiTheme}>
        <Hidden smDown>
          <Header />
        </Hidden>
        <Hidden mdUp>
          <CondensedHeader />
        </Hidden>
        <Grid container spacing={0}>
          <Grid item xs={12} md={showAnnotations ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph rootContainerId={ROOT_CONTAINER_ID} ref={graphRef} />
              <Editor />
              <ZoomControl />
              <FloatingEditors />
              <UserMessage />
            </div>
          </Grid>
          { showAnnotations &&
            <Hidden smDown>
              <Grid item xs={12} md={4}>
                <Annotations />
              </Grid>
            </Hidden>
          }

          <Hidden mdUp>
            <Grid item xs={12}>
              <CondensedAnnotations ref={annotationsRef} />
            </Grid>
          </Hidden>
        </Grid>
      </ThemeProvider>
    </div>
  )
}

export default hot(Root)