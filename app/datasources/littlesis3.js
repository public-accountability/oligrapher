import wretch from "wretch"

// API_URL is defined by webpack.DefinePlugin
// see webpack.config.js
const urls = {
  findNodes: () => `${API_URL}/oligrapher/find_nodes`,
  findConnections: id => `${API_URL}/api/entities/${id}/connections`,
  getRelationship: id => `${API_URL}/api/relationships/${id}`,
  createOligrapher: () => `${API_URL}/oligrapher`,
  updateOligrapher: id => `${API_URL}/oligrapher/${id}`,
  deleteOligrapher: id => `${API_URL}/oligrapher/${id}`
}

const isInteger = x => RegExp('^[0-9]+$').test(x.toString())

function validateId(id) {
  if (!id) {
    throw new Error('Missing id')
  }

  if (!isInteger(id)) {
    throw new Error(`id is not valid integer`)
  }
}

export function findNodes(query) {
  if (!query) {
    return Promise.resolve([])
  }

  return wretch(urls.findNodes())
    .query({ num: 12, q: query })
    .get()
    .json()
}

export function findConnections(entityId, options = {}) {
  validateId(entityId)

  return wretch(urls.findConnections(entityId))
    .query({ page: 1, ...options })
    .get()
    .json()
}

export function getRelationship(id) {
  validateId(id)

  return wretch(urls.getRelationship(id))
    .get()
    .json()
}

export function createOligrapher(data) {}

export function updateOligrapher(data) {}

export function deleteOligrapher(id) {}

export default {
  findNodes,
  findConnections,
  getRelationship,
  createOligrapher,
  updateOligrapher,
  deleteOligrapher
}
