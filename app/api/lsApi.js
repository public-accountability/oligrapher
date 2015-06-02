//privates
var apiKey = require('../../credentials').lsApiKey;
//var apiKey = process.env.LS_API_KEY;
console.log("PROCESS ENV >>>>", process.env);
console.log("API KEY>>>>>", apiKey);
var request = require('superagent');
var baseUrl = 'https://api.littlesis.org/';
var unwrap = (res) => res.body.Response.Data;


//module
var lsApi = {};

//searchEntities(String) -> Promise[Entity]
lsApi.searchEntities = (query) => {
  var unwrapThis = res => unwrap(res).Entities.Entity || [];
  return new Promise((resolve, reject) =>
    request
      .get(baseUrl + 'entities.json')
      .query({q: query, _key: apiKey})
      .end((err, res) => err ? reject(err) : resolve(unwrapThis(res))));
};

//getAdjacentEntities(String) -> Promise[Array[Entity]]
lsApi.getAdjacentEntities = (id) => {
  var unwrapThis = res =>  unwrap(res).Degree2Entities.Entity || [];
  return new Promise((resolve, reject) =>
    request
      .get(baseUrl + 'entity/' + id + '/related/degree2.json')
      .query({ cat1_ids: 1, cat2_ids: 1, order1: 2, order2: 1, _key: apiKey })
      .end((err, res) => err ? reject(err) : resolve(unwrapThis(res))));
};

module.exports = lsApi;
