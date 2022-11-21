import baseWretch from "wretch"
import QueryStringAddon from "wretch/addons/queryString"
const wretch = baseWretch().addon(QueryStringAddon)

import { Editor } from "../util/defaultState"
import { Graph } from "../graph/graph"
import { ArrowType } from "../graph/arrow"
import { Node } from "../graph/node"
import { Edge } from "../graph/edge"

// API_URL is set by the "define" option of esbuild
export const urls = {
  // Search API
  findNodes: () => `${API_URL}/oligrapher/find_nodes`,
  findConnections: () => `${API_URL}/oligrapher/find_connections`,
  getEdges: () => `${API_URL}/oligrapher/get_edges`,
  getInterlocks: () => `${API_URL}/oligrapher/get_interlocks`,
  getInterlocks2: () => `${API_URL}/oligrapher/get_interlocks2`,
  // Uses our regular api
  getRelationship: (id: string) => `${API_URL}/api/relationships/${id}`,
  // Uses jsserver
  getDataUrl: (url: string) => `${API_URL}/dataurl/${url}`,
  // NetworkMap crud actions
  createOligrapher: () => `${API_URL}/oligrapher`,
  updateOligrapher: (id: number) => `${API_URL}/oligrapher/${id}`,
  cloneOligrapher: (id: number) => `${API_URL}/oligrapher/${id}/clone`,
  embeddedOligrapher: (id: number) => `${API_URL}/oligrapher/${id}/embedded`,
  deleteOligrapher: (id: number) => `${API_URL}/oligrapher/${id}`,
  // Locking
  editors: (id: number) => `${API_URL}/oligrapher/${id}/editors`,
}

const isInteger = (x: any): boolean => RegExp("^[0-9]+$").test(x.toString())

const getCsrfToken = (): string => {
  const token = document.head.querySelector('meta[name="csrf-token"]')?.content

  if (!token) {
    //throw new Error("No csrf token found")
  }

  return token
}

const headers = () => ({
  "Content-Type": "application/json",
  Accept: "application/json",
  "X-CSRF-Token": getCsrfToken(),
})

const validateId = (id: number): void => {
  if (!id) {
    throw new Error("Missing id")
  }
}

// API

export interface LsNode {
  id: string
  name: string
  description?: string
  image?: string
  url: string
}

export interface LsEdge {
  id: string
  node1_id: string
  node2_id: string
  label: string
  arrow: ArrowType | null
  dash: boolean
  url: string
}

export interface LsNodeWithEdges extends LsNode {
  edges: Array<LsEdge>
}

export interface LsMap {
  id: number
  graph_data: Graph
  attributes: {
    title: string | null
    description: string | null
    is_private: boolean
    is_cloneable: boolean
    list_sources: boolean
    settings: string
    annotations_data: string
    oligrapher_commit: string
  }
}

interface LsRedirect {
  url: string
}

export type AddConnectionsOrder = "link_count" | "current" | "amount" | "updated"

interface FindConnectionsParams {
  entity_id: string
  num?: number
  category_id?: string | number
  order?: AddConnectionsOrder
  "excluded_ids[]"?: string[]
}

export function findNodes(query: string): Promise<LsNode[]> {
  if (!query) {
    return Promise.resolve([])
  }

  return wretch.url(urls.findNodes()).query({ num: 20, q: query }).get().json()
}

export function findConnections(params: FindConnectionsParams): Promise<LsNodeWithEdges[]> {
  if (!params.num) {
    params.num = 30
  }

  return wretch.url(urls.findConnections()).query(params).get().json()
}

export function getEdges(entity1Id: string, entity2Ids: string[]): Promise<LsEdge[]> {
  return wretch
    .url(urls.getEdges())
    .query({ entity1_id: entity1Id, entity2_ids: entity2Ids.join(",") })
    .get()
    .json()
}

export function getInterlocks(
  entity1Id: string,
  entity2Id: string,
  entityIds: string[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  return wretch
    .url(urls.getInterlocks())
    .query({
      entity1_id: entity1Id,
      entity2_id: entity2Id,
      entity_ids: entityIds.join(","),
      num: 10,
    })
    .get()
    .json()
}

export function getInterlocks2(
  entityIds: string[],
  otherNodes: string[]
): Promise<{ nodes: Node[]; edges: Edge[] }> {
  return wretch
    .url(urls.getInterlocks2())
    .query({
      entity_ids: entityIds.join(","),
      other_ids: otherNodes.join(","),
      num: 10,
    })
    .get()
    .json()
}

export function createOligrapher(data: LsMap): Promise<LsRedirect> {
  return wretch
    .url(urls.createOligrapher())
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post(data)
    .json()
}

export function updateOligrapher(data: LsMap): Promise<any> {
  validateId(data.id)

  return wretch
    .url(urls.updateOligrapher(data.id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .patch(data)
    .json()
}

export function cloneOligrapher(id: number): Promise<LsRedirect> {
  validateId(id)

  return wretch
    .url(urls.cloneOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post()
    .json()
}

export function deleteOligrapher(id: number): Promise<LsRedirect> {
  validateId(id)

  return wretch
    .url(urls.deleteOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .delete()
    .json()
}

export const oligrapher = {
  create: createOligrapher,
  update: updateOligrapher,
  delete: deleteOligrapher,
  clone: cloneOligrapher,
}

const editorAction =
  (action: string) =>
  (id: number, username: string): Promise<{ editors: Editor[] }> => {
    validateId(id)

    return wretch
      .url(urls.editors(id))
      .headers(headers())
      .post({ editor: { action, username } })
      .json()
  }

export const addEditor = editorAction("add")
export const removeEditor = editorAction("remove")

export const editors = {
  add: addEditor,
  remove: removeEditor,
}

type DataUrlResult = { dataurl: string }

export function getDataUrl(url: string): Promise<DataUrlResult> {
  return wretch.url(urls.getDataUrl(url)).headers(headers()).get().json()
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
  getDataUrl,
}
