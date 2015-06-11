//privates
const apiKey = require('../../credentials').lsApiKey;
const request = require('superagent');
//require('superagent-jsonp')(request);
const baseUrlSymf = 'https://api.littlesis.org/';
const baseUrlRails = 'https://littlesis.org/';
const parse = (res) => res.body.Response.Data;

//module
var lsApi = {};

//getEntity(Int) -> Promise[GraphSpecs]
lsApi.getEntity = (id) => {
  const parseThis = res => res.body.entity || {};
  return new Promise(
    (resolve, reject) =>
      request
        .get(`${baseUrlRails}entiites/${id}.json`)
        .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//searchEntities(String) -> Promise[Entity]
lsApi.searchEntities = (query) => {
  const parseThis = res => parse(res).Entities.Entity || [];
  return new Promise((resolve, reject) =>
    request
      .get(baseUrlSymf + 'entities.json')
      .query({q: query, _key: apiKey})
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//getMap(Int) -> Promise[GraphSpecs]
lsApi.getMap = (id) => {
  const parseThis = res => res.body.map || {};
  return new Promise(
    (resolve, reject) =>
      request
        .get(`${baseUrlRails}maps/${id}.json`)
        .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

module.exports = lsApi;
