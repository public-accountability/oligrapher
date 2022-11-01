import React from "react"

export default function AnnotationsTracker({ count, currentIndex, show }: AnnotationsTrackerProps) {
  const className = i => "tracker-circle" + (i === currentIndex ? " tracker-circle-selected" : "")

  return (
    <div id="oligrapher-annotations-tracker">
      {Array(count)
        .fill(null)
        .map((e, i) => (
          <div key={i} className={className(i)} onClick={() => show(i)}></div>
        ))}
    </div>
  )
}

interface AnnotationsTrackerProps {
  count: number
  currentIndex: number
  show: (i: number) => void
}
