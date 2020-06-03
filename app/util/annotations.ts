import { generate } from 'shortid'
import merge from 'lodash/merge'

import { DisplayState } from './defaultState'

export interface AnnotationAttributes {
  id?: string,
  title?: string,
  text?: string,
  nodeIds?: string[],
  edgeIds?: string[],
  captionIds?: string[]
}

export interface Annotation {
  id: string,
  title: string,
  text: string,
  nodeIds: string[],
  edgeIds: string[],
  captionIds: string[]
}

const defaults = (): Annotation => ({
  id: generate(),
  title: 'New Annotation',
  text: '',
  nodeIds: [],
  edgeIds: [],
  captionIds: []
})

export function newAnnotation(attributes?: AnnotationAttributes): Annotation {
  return merge(defaults(), attributes)
}

export const createAnnotation = (display: DisplayState): void => {
  display.annotations.list.push(newAnnotation())
  display.annotations.currentIndex = display.annotations.list.length - 1
}

export const moveAnnotation = (display: DisplayState, from: number, to: number): void => {
  let { list, currentIndex, show } = display.annotations
  const currentId = list[currentIndex].id
  list.splice(to, 0, list.splice(from, 1)[0])
  currentIndex = list.findIndex(item => item.id === currentId)

  display.annotations = { list, currentIndex, show }
}

export const showAnnotation = (display: DisplayState, index: number): void => {
  display.annotations.currentIndex = index
}

export const updateAnnotation = (display: DisplayState, id: string, attributes: AnnotationAttributes): void => {
  const index = display.annotations.list.findIndex(item => item.id === id)

  Object.entries(attributes).forEach(([key, value]) => {
    display.annotations.list[index][key as keyof Annotation] = value
  })
}

export const removeAnnotation = (display: DisplayState, id: string): void => {
  display.annotations.currentIndex = Math.max(0, display.annotations.currentIndex - 1)
  display.annotations.list = display.annotations.list.filter(item => item.id !== id)
}