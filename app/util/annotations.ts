import { generate } from 'shortid'
import merge from 'lodash/merge'

import { AnnotationsState } from './defaultState'

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

export const createAnnotation = (annotations: AnnotationsState): void => {
  annotations.list.push(newAnnotation())
  annotations.currentIndex = annotations.list.length - 1
}

export const moveAnnotation = (annotations: AnnotationsState, from: number, to: number): void => {
  let { list, currentIndex } = annotations
  const currentId = list[currentIndex].id
  list.splice(to, 0, list.splice(from, 1)[0])
  currentIndex = list.findIndex(item => item.id === currentId)

  annotations.list = list
  annotations.currentIndex = currentIndex
}

export const showAnnotation = (annotations: AnnotationsState, index: number): void => {
  annotations.currentIndex = index
}

export const updateAnnotation = (annotations: AnnotationsState, id: string, attributes: AnnotationAttributes): void => {
  const index = annotations.list.findIndex(item => item.id === id)

  Object.entries(attributes).forEach(([key, value]) => {
    annotations.list[index][key as keyof Annotation] = value
  })
}

export const removeAnnotation = (annotations: AnnotationsState, id: string): void => {
  annotations.currentIndex = Math.max(0, annotations.currentIndex - 1)
  annotations.list = annotations.list.filter(item => item.id !== id)
}