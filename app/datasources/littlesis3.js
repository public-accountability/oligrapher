import wretch from 'wretch'

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

export function deleteOligrapher(id) {
  validateId(id)

  return wretch(urls.deleteOligrapher(id))
    .options({ credentials: "same-origin" })
    .headers(headers())
    .delete()
}

export default {
  findNodes,
  findConnections,
  getRelationship,
  createOligrapher,
  updateOligrapher,
  deleteOligrapher,
  oligrapher: {
    create: createOligrapher,
    update: updateOligrapher,
    "delete": deleteOligrapher
  }
}
