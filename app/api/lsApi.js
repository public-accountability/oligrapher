//privates
const apiKey = require('../../credentials').lsApiKey;
const request = require('superagent');
const baseUrlSymf = 'https://api.littlesis.org/';
const baseUrlRails = 'https://littlesis.org/';
const parse = (res) => res.body.Response.Data;

//module
var lsApi = {};

//searchEntities(String) -> Promise[Entity]
lsApi.searchEntities = (query) => {
  const parseThis = res => parse(res).Entities.Entity || [];
  return new Promise((resolve, reject) =>
    request
      .get(baseUrlSymf + 'entities.json')
      .query({q: query, _key: apiKey})
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//getAdjacentEntities(String) -> Promise[Array[Entity]]
lsApi.getAdjacentEntities = (id) => {
  const parseThis = res =>  parse(res).Degree2Entities.Entity || [];
  return new Promise((resolve, reject) =>
    request
      .get(baseUrlSymf + 'entity/' + id + '/related/degree2.json')
      .query({ cat1_ids: 1, cat2_ids: 1, order1: 2, order2: 1, _key: apiKey })
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//getMap(Int) -> Promise[GraphSpecs]
lsApi.getMap = (id) => {
  const parseThis = res => res.data || {};
  return new Promise((resolve, reject) =>
    request
      .get(`${baseUrlRails}maps/${id}.json`)
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

module.exports = lsApi;
