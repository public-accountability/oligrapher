import React from "react"
import Button from "@mui/material/Button"

type AnnotationsNavPropTypes = {
  count: number
  currentIndex: number
  prev: () => void
  next: () => void
  size?: "small" | "medium" | "large"
}

export default function AnnotationsNav({
  count,
  currentIndex,
  prev,
  next,
  size = "medium",
}: AnnotationsNavPropTypes) {
  return (
    <>
      <Button variant="outlined" size={size} onClick={prev} disabled={currentIndex === 0}>
        Prev
      </Button>
      &nbsp;
      <Button
        variant="contained"
        color="primary"
        size={size}
        onClick={next}
        disabled={currentIndex > count - 2}
      >
        Next
      </Button>
    </>
  )
}
