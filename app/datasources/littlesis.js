import { client } from "@public-accountability/littlesis-api"
import merge from 'lodash/merge'

const api = client(
  typeof API_URL === 'undefined' ? 'https://littlesis.org' : API_URL
)

export const getConnectedNodesOptions = {
  category_id: {
    1: "Position",
    2: "Education",
    3: "Membership",
    4: "Family",
    5: "Donation",
    6: "Transaction",
    7: "Lobbying",
    8: "Social",
    9: "Professional",
    10: "Ownership",
    11: "Hierarchy",
    12: "Generic"
  }
}

export function findNodes(text, callback) {
  let params = {
    q: text,
    num: 12,
    desc: true,
    with_ids: true    
  }

  return api.get('/maps/find_nodes', params).then(callback)
}

export function getNodeWithEdges(nodeId, nodeIds, callback) {
  let params = { node_id: nodeId, node_ids: nodeIds }
  return api.get('/maps/node_with_edges', params).then(callback)
}

export function getConnectedNodes(nodeId, nodeIds, options, callback) {
  let params = merge(options, {
    node_id: nodeId,
    node_ids: nodeIds
  })

  return api.get('/maps/edges_with_nodes', params).then(callback)
}

export function getInterlocks(node1Id, node2Id, nodeIds, options, callback) {
  let params = merge(options,{
    "node1_id": node1Id,
    "node2_id": node2Id,
    "node_ids": nodeIds    
  })

  return api.get('/maps/interlocsk', params).then(callback)
}
  
export default {
  name: "LittleSis",
  getConnectedNodesOptions: getConnectedNodesOptions,
  findNodes: findNodes,
  getNodeWithEdges: getNodeWithEdges,
  getConnectedNodes: getConnectedNodes,
  getInterlocks: getInterlocks
}
