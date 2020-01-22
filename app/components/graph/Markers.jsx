import React from 'react'

export default React.memo(function Markers() {
  return <defs>
           <marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
             <path d="M0,-5L10,0L0,5" fill="#999">
             </path>
           </marker>
           <marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
             <path d="M0,-5L-10,0L0,5" fill="#999">
             </path>
           </marker>
           <marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth="6" markerHeight="6" orient="auto">
             <path d="M0,-5L10,0L0,5">
             </path>
           </marker>
         </defs>
})
