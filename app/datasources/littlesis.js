import { client } from "@public-accountability/littlesis-api"

// const api = client('https://littlesis.org');
const api = client('https://littlesis.org');


export function findNodes(text, callback) {
  let params = {
    q: text,
    num: 12,
    desc: true,
    with_ids: true    
  }  

  return api.get('/maps/find_nodes', params).then(callback);
}


export default {
  name: "LittleSis",
  findNodes: findNodes
}

