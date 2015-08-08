//privates
const config = require('../../config');
const apiKey = config.lsApiKey;
const baseUrlSymf = config.baseApiUrlSymf;
const baseUrlRails = config.baseApiUrlRails;
const request = require('superagent');
const parse = (res) => res.body.Response.Data;

//module
var lsApi = {};

//getEntity(Int) -> Promise[GraphSpecs]
lsApi.getEntity = (id) => {
  const parseThis = res => res.body.entity || {};
  return new Promise(
    (resolve, reject) => request
      .get(`${baseUrlRails}entiites/${id}.json`)
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//searchEntities(String) -> Promise[Entity]
lsApi.searchEntities = (query) => {
  const parseThis = res => parse(res).Entities.Entity || [];
  return new Promise(
    (resolve, reject) => request
      .get(baseUrlSymf + 'entities.json')
      .query({q: query, _key: apiKey})
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//getMap(Int) -> Promise[GraphSpecs]
lsApi.getMap = (id) => {
  const parseThis = res => res.body.map || {};
  return new Promise(
    (resolve, reject) => request
      .get(`${baseUrlRails}maps/${id}.json`)
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

//getDeck(String) -> Promise[Array[ApiDeck]]
lsApi.getDeck = (id) => {
  const parseThis = res => res.body.map_collection || {};
  return new Promise(
    (resolve, reject) => request
      .get(`${baseUrlRails}maps/${id}/collection.json`)
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
}

//getDecks(String) -> Promise[Array[ApiDeck]]
lsApi.getDecks = (topicName) => {
  const parseThis = res => res.body.map_collections || [];
  return new Promise(
    (resolve, reject) => request
      .get(`${baseUrlRails}topics/${topicName}/map_collections.json`)
      .end((err, res) => err ? reject(err) : resolve(parseThis(res))));
};

module.exports = lsApi;
