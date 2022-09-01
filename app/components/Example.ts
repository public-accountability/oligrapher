import React, { createElement, useState, useEffect } from 'react'
import { useSelector } from 'react-redux'

export default function Example() {
  const [results, setResults] = useState('')
  const mapId = useSelector(state => state.attributes.id)

  useEffect(() => {
    fetch("/hello")
      .then(response => response.text())
      .then(text => setResults(text))
      .catch(console.error)
  })

  const content = results ? createElement('p', { "data-testid": "example-results" }, results) : createElement('p', { "data-testid": "example-loading" }, "Loading")

  return createElement('div', { id: 'example'},
                       createElement('h1', null, `This is map number ${mapId}`),
                       content)
}
