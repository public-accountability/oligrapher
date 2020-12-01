import wretch from 'wretch'

import { Editor } from '../util/defaultState'
import { Graph } from '../graph/graph'
import { ArrowType } from '../graph/arrow'
import { Node } from '../graph/node'
import { Edge } from '../graph/edge'
import { LockState } from '../util/lock'

declare var API_URL: string
declare var PRODUCTION: string

// API_URL is defined by webpack.DefinePlugin
// see webpack.config.js
export const urls = {
  findNodes: () => `${API_URL}/oligrapher/find_nodes`,
  findConnections: () => `${API_URL}/oligrapher/find_connections`,
  getEdges: () => `${API_URL}/oligrapher/get_edges`,
  getRelationship: (id: string) => `${API_URL}/api/relationships/${id}`,
  getInterlocks: () => `${API_URL}/oligrapher/get_interlocks`,
  createOligrapher: () => `${API_URL}/oligrapher`,
  updateOligrapher: (id: number) => `${API_URL}/oligrapher/${id}`,
  cloneOligrapher: (id: number) => `${API_URL}/oligrapher/${id}/clone`,
  deleteOligrapher: (id: number) => `${API_URL}/oligrapher/${id}`,
  editors: (id: number) => `${API_URL}/oligrapher/${id}/editors`,
  lock: (id: number) => `${API_URL}/oligrapher/${id}/lock`,
  releaseLock: (id: number) => `${API_URL}/oligrapher/${id}/release_lock`
}

const isInteger = (x: any): boolean => RegExp('^[0-9]+$').test(x.toString())

const getCsrfToken = (): string => {
  const token = (document.head.querySelector('meta[name="csrf-token"]') as HTMLMetaElement)?.content

  if (token) {
    return token
  } else if (PRODUCTION) {
    throw new Error("No csrf token found")
  } else {
    return "LittleSis-Test-CSRF-Token"
  }
}

const headers = () => ({
  'Content-Type': "application/json",
  'Accept': "application/json",
  'X-CSRF-Token': getCsrfToken()
})

const validateId = (id: number): void => {
  if (!id) {
    throw new Error('Missing id')
  }
}

// API

interface LsNode {
  id: string,
  name: string,
  description?: string,
  image?: string,
  url: string
}

export interface LsEdge {
  id: string,
  node1_id: string,
  node2_id: string,
  label: string,
  arrow: ArrowType | null,
  dash: boolean,
  url?: string
}

interface LsNodeWithEdge extends LsNode {
  edge: LsEdge
}

export interface LsMap {
  id: number,
  graph_data: Graph,
  attributes: {
    title: string | null,
    description: string | null,
    is_private: boolean,
    is_cloneable: boolean,
    list_sources: boolean,
    settings: string,
    annotations_data: string
  }
}

interface LsRedirect {
  url: string
}

interface FindConnectionsParams {
  entity_id: string,
  num?: number,
  category_id?: string | number,
  excluded_ids?: string[]
}

export function findNodes(query: string): Promise<LsNode[]> {
  if (!query) {
    return Promise.resolve([])
  }

  return wretch(urls.findNodes())
    .query({ num: 20, q: query })
    .get()
    .json()
}

export function findConnections(params: FindConnectionsParams): Promise<LsNodeWithEdge[]> {
  if (!params.num) {
    params.num = 30
  }

  return wretch(urls.findConnections())
    .query(params)
    .get()
    .json()
}

export function getEdges(entity1Id: string, entity2Ids: string[]): Promise<LsEdge[]> {
  return wretch(urls.getEdges())
    .query({ entity1_id: entity1Id, entity2_ids: entity2Ids.join(',') })
    .get()
    .json()
}

export function getInterlocks(entity1Id: string, entity2Id: string, entityIds: string[]): Promise<{ nodes: Node[], edges: Edge[] }> {
  return wretch(urls.getInterlocks())
    .query({ entity1_id: entity1Id, entity2_id: entity2Id, entity_ids: entityIds.join(','), num: 10 })
    .get()
    .json()
}

export function createOligrapher(data: LsMap): Promise<LsRedirect> {
  return wretch(urls.createOligrapher())
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post(data)
    .json()
}

export function updateOligrapher(data: LsMap): Promise<any> {
  validateId(data.id)

  return wretch(urls.updateOligrapher(data.id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .patch(data)
    .json()
}

export function cloneOligrapher(id: number): Promise<LsRedirect> {
  validateId(id)

  return wretch(urls.cloneOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post()
    .json()
}

export function deleteOligrapher(id: number): Promise<LsRedirect> {
  validateId(id)

  return wretch(urls.deleteOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .delete()
    .json()
}

export const oligrapher = {
  create: createOligrapher,
  update: updateOligrapher,
  "delete": deleteOligrapher,
  "clone": cloneOligrapher
}

const editorAction = (action: string) => (id: number, username: string): Promise<{ editors: Editor[] }> => {
  validateId(id)

  return wretch(urls.editors(id))
    .headers(headers())
    .post({ editor: { action, username } })
    .json()
}

export const addEditor = editorAction('add')
export const removeEditor = editorAction('remove')

export const editors = {
  add: addEditor,
  remove: removeEditor
}

export function lock(id: number): Promise<LockState> {
  validateId(id)
  return wretch(urls.lock(id)).headers(headers()).get().json()
}

export function takeoverLock(id: number): Promise<LockState> {
  validateId(id)
  return wretch(urls.lock(id)).headers(headers()).post().json()
}

export function releaseLock(id: number): Promise<any> {
  validateId(id)
  return wretch(urls.releaseLock(id)).headers(headers()).post().json()
}

export default {
  findNodes,
  findConnections,
  getEdges,
  createOligrapher,
  updateOligrapher,
  deleteOligrapher,
  cloneOligrapher,
  addEditor,
  removeEditor,
  lock,
  takeoverLock
}
