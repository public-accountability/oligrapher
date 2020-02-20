import { client } from '@public-accountability/littlesis-api'
import merge from 'lodash/merge'

const api = client('http://127.0.0.1:8081')

const urls = {
  findNodes: () => '/oligrapher/find_nodes',
  findConnections: id => `/api/entities/${id}/connections`
}

// String ---> Promise
export function findNodes(query) {
  if (!query) { return Promise.resolve([]) }

  return api.get(urls.findNodes(), { num: 12, q: query })
}

// possible options: page, category_id
export function findConnections(entityId, options = {}) {
  const params = merge({}, options, { page: 1 })

  return api.get(urls.findConnections(entityId), params)
}
