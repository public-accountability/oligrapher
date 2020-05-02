import React from 'react'
import { hot } from 'react-hot-loader/root'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
import FloatingMenus from './FloatingMenus'
import ZoomControl from '../components/ZoomControl'
import UserMessage from './UserMessage'

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
        <Graph>        graph UI
        <Editor>       Editing menu and interface
        <ZoomControl>  Zoom Buttons
        <FloatingMenu> Editing menus
  editing interface (<Editor>)

  It needs rendered inside a Redux Provider

*/
export function Root() {
  return (
    <div id="oligrapher-container">
      <Header />
      <div id="oligrapher-graph-container">
        <Graph />
        <Editor />
        <ZoomControl />
        <FloatingMenus />
        <UserMessage />
      </div>
    </div>
  )
}

export default hot(Root)