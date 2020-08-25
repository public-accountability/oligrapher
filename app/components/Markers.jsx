import React from 'react'

const MARKER_SIZE = 3.5

export default React.memo(function Markers() {
  return (
    <>
      <marker id="marker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L10,0L0,5" fill="#999">
        </path>
      </marker>
      <marker id="marker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L-10,0L0,5" fill="#999">
        </path>
      </marker>
      <marker id="highlightedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L10,0L0,5" fill="#000">
        </path>
      </marker>
      <marker id="highlightedmarker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L-10,0L0,5" fill="#000">
        </path>
      </marker>
      <marker id="fadedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L10,0L0,5" fill="#ddd">
        </path>
      </marker>
      <marker id="fadedmarker2" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L-10,0L0,5" fill="#ddd">
        </path>
      </marker>
      <marker id="selectedmarker1" viewBox="0 -5 10 10" refX="8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L10,0L0,5" fill="#444">
        </path>
      </marker>
      <marker id="selectedmarker2" viewBox="-10 -5 10 10" refX="-8" refY="0" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} orient="auto">
        <path d="M0,-5L-10,0L0,5" fill="#444">
        </path>
      </marker>
    </>
  )
})
