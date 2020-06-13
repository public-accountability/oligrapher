import React from 'react'
import { useSelector } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import { ThemeProvider } from '@material-ui/core/styles'
import { Grid } from '@material-ui/core'

import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
import FloatingEditors from './FloatingEditors'
import ZoomControl from './ZoomControl'
import UserMessage from './UserMessage'
import Annotations from './Annotations'
import { muiTheme } from '../util/helpers'
import { showAnnotationsSelector } from '../util/selectors'

export const ROOT_CONTAINER_ID = "oligrapher-container"

/*
  This is the root container

  Oligrapher's layout can be divided into three components

   _ _ _ _ _ _ _ _
  |   header      |
  |_ _ _ _ _ _ _  |
  |       |       |
  | graph | story |
  |       |       |

  The graph section has these components:
        <Graph>            graph UI
        <Editor>           Editing menu and interface
        <ZoomControl>      Zoom Buttons
        <FloatingEditors>  Node, edge, and caption editors
  editing interface (<Editor>)

  It needs rendered inside a Redux Provider
*/

export function Root() {
  const showAnnotations = useSelector(showAnnotationsSelector)

  return (
    <div id={ROOT_CONTAINER_ID}>
      <ThemeProvider theme={muiTheme}>
        <Header />
        <Grid container spacing={0}>
          <Grid item xs={12} md={showAnnotations ? 8 : 12}>
            <div id="oligrapher-graph-container">
              <Graph rootContainerId={ROOT_CONTAINER_ID} />
              <Editor />
              <ZoomControl />
              <FloatingEditors />
              <UserMessage />
            </div>
          </Grid>
          { showAnnotations &&
            <Grid item xs={12} md={4}>
              <Annotations />
            </Grid>
          }
        </Grid>
      </ThemeProvider>
    </div>
  )
}

export default hot(Root)