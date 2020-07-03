import React from 'react'
import { useSelector } from 'react-redux'
import { hot } from 'react-hot-loader/root'
import { ThemeProvider } from '@material-ui/core/styles'

import CondensedHeader from './CondensedHeader'
import Graph from './Graph'
import ZoomControl from './ZoomControl'
import CondensedAnnotations from './CondensedAnnotations'
import AnnotationsToggler from './AnnotationsToggler'
import { muiTheme } from '../util/helpers'
import { showAnnotationsSelector } from '../util/selectors'

export const ROOT_CONTAINER_ID = "oligrapher-container"

export function EmbeddedRoot() {
  const showAnnotations = useSelector(showAnnotationsSelector)

  return (
    <div id={ROOT_CONTAINER_ID}>
      <ThemeProvider theme={muiTheme}>
        <CondensedHeader />
        <div id="oligrapher-graph-container">
          <Graph rootContainerId={ROOT_CONTAINER_ID} />
          <ZoomControl />
        </div>
        { showAnnotations &&
          <CondensedAnnotations />
        }
        { !showAnnotations &&
          <div id="oligrapher-embedded-annotations-toggler">
            <AnnotationsToggler />
          </div>
        }
      </ThemeProvider>
    </div>
  )
}

export default hot(EmbeddedRoot)