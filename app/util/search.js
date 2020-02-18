import { client } from '@public-accountability/littlesis-api'

const api = client('http://127.0.0.1:8081')

const urls = {
  findNodes: '/oligrapher/find_nodes'
}

// String ---> Promise
export function findNodes(query) {
  if (!query) { return Promise.resolve([]) }

  return api.get(urls.findNodes, { num: 12, q: query })
}
