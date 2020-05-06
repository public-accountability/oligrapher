import React from 'react'
import { hot } from 'react-hot-loader/root'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
import FloatingEditors from './FloatingEditors'
import ZoomControl from './ZoomControl'
import UserMessage from './UserMessage'

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
  return (
    <div id={ROOT_CONTAINER_ID}>
      <Header />
      <div id="oligrapher-graph-container">
        <Graph rootContainerId={ROOT_CONTAINER_ID} />
        <Editor />
        <ZoomControl />
        <FloatingEditors />
        <UserMessage />
      </div>
    </div>
  )
}

export default hot(Root)