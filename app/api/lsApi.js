//privates
var apiKey = require('../credentials').lsApiKey;
var request = require('superagent');
var baseUrl = 'http://api.littlesis.org/';
var unwrap = (res) => res.body.Response.Data;


//module
var lsApi = {};

//searchEntities(String, Function) -> Unit
lsApi.searchEntities = (query, handleResponse) => {
  var unwrapThis = (res) => unwrap(res).Entities.Entity || [];
  return new Promise((resolve, reject) => {
    request
      .get(baseUrl + 'entities.json')
      .query({q: query, _key: apiKey})
      .end((err, res) => err ? reject(err) : resolve(unwrapThis(res)));
  });
};

//getAdjacentEntities(String, Function) -> Unit
lsApi.getAdjacentEntities = (id, handleResponse) => {
  request
    .get(baseUrl + 'entity/' + id + 'related/degree2.json')
    .query({ cat1_ids: 1, cat2_ids: 1, order1: 2, order2: 1, _key: apiKey })
    .end((err, res) => {
      handleResponse(err, unwrap(res).Degree2Entities.Entity); });
};


module.exports = lsApi;
