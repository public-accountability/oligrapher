import React, { useState, useEffect } from 'react'

export default function Example() {
  const [results, setResults] = useState(null)

  useEffect(() => {
    fetch("/hello")
      .then(response => response.text())
      .then(text => setResults(text))
      .catch(console.error)
  })

  if (results) {
    return <p data-testid="example-results">{results}</p>
  } else {
    return <p data-testid="example-loading">loading</p>
  }

}
