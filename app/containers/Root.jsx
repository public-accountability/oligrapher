import React from 'react'
import Header from './Header'
import Graph from './Graph'
import Editor from './Editor'
import FloatingMenus from './FloatingMenus'
import ZoomControl from '../components/ZoomControl'

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

  It needs rendered inside a Redux Provider and RefsContext.Provider

*/
export default function Root() {
  return <div id="oligrapher-container">
           <Header />
           <div className="oligrapher-graph-container">
             <Graph />
             <Editor />
             <ZoomControl />
             <FloatingMenus />
           </div>
         </div>
}
