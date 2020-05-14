import wretch from 'wretch'
import curry from 'lodash/curry'

// API_URL is defined by webpack.DefinePlugin
// see webpack.config.js
const urls = {
  findNodes: () => `${API_URL}/oligrapher/find_nodes`,
  findConnections: () => `${API_URL}/oligrapher/find_connections`,
  getEdges: () => `${API_URL}/oligrapher/get_edges`,
  getRelationship: id => `${API_URL}/api/relationships/${id}`,
  createOligrapher: () => `${API_URL}/oligrapher`,
  updateOligrapher: id => `${API_URL}/oligrapher/${id}`,
  cloneOligrapher: id => `${API_URL}/oligrapher/${id}/clone`,
  deleteOligrapher: id => `${API_URL}/oligrapher/${id}`,
  editors: id => `${API_URL}/oligrapher/${id}/editors`,
  lock: id => `${API_URL}/oligrapher/${id}/lock`
}

const isInteger = x => RegExp('^[0-9]+$').test(x.toString())

const getCsrfToken = () => {
  const token = document.head.querySelector('meta[name="csrf-token"]')?.content

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

const validateId = id => {
  if (!id) {
    throw new Error('Missing id')
  }

  if (!isInteger(id)) {
    throw new Error(`id is not valid integer`)
  }
}

// API

export function findNodes(query) {
  if (!query) {
    return Promise.resolve([])
  }

  return wretch(urls.findNodes())
    .query({ num: 12, q: query })
    .get()
    .json()
}

export function findConnections(entityId, categoryId = null) {
  let params = { entity_id: entityId, num: 30 }

  if (categoryId) {
    params.category_id = categoryId
  }

  return wretch(urls.findConnections())
    .query(params)
    .get()
    .json()
}

export function getEdges(entity1Id, entity2Ids) {
  return wretch(urls.getEdges())
    .query({ entity1_id: entity1Id, entity2_ids: entity2Ids.join(',') })
    .get()
    .json()
}

export function createOligrapher(data) {
  return wretch(urls.createOligrapher())
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post(data)
    .json()
}

export function updateOligrapher(data) {
  validateId(data.id)

  return wretch(urls.updateOligrapher(data.id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .patch(data)
    .json()
}

export function cloneOligrapher(id) {
  validateId(id)

  return wretch(urls.cloneOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .post()
    .json()
}

export function deleteOligrapher(id) {
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

export function getEditors(id) {
  validateId(id)

  return wretch(urls.editors(id))
    .headers(headers())
    .get()
    .json()
}

const editorAction = action => (id, username) => {
  validateId(id)

  return wretch(urls.editors(id))
    .headers(headers())
    .post({ editor: { action, username } })
    .json()
}

export const addEditor = editorAction('add')
export const removeEditor = editorAction('remove')

export const editors = {
  get: getEditors,
  add: addEditor,
  remove: removeEditor
}

export function lock(id) {
  validateId(id)
  return wretch(urls.lock(id)).headers(headers()).get().json()
}

function lockTakeover(id) {
  validateId(id)
  return wretch(urls.lock(id)).headers(headers()).post().json()
}

export default {
  findNodes,
  findConnections,
  getEdges,
  createOligrapher,
  updateOligrapher,
  deleteOligrapher,
  cloneOligrapher,
  getEditors,
  addEditor,
  removeEditor,
  lock,
  lockTakeover
}
