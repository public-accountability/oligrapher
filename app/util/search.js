import { client } from '@public-accountability/littlesis-api'

const api = client('http://127.0.0.1:8081')

const urls = {
  findNodes: '/maps/find_nodes'
}

// String ---> Promise
export function findNodes(query) {
  if (!query) { return Promise.resolve([]) }

  let params = { num: 12,
                 desc: true,
                 with_ids: true,
                 q: query }

  return api.get(urls.findNodes, params)
}
