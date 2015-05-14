var apiKey = require('../credentials').lsApiKey; //TODO figure out require paths!
var request = require('superagent');

//privates
var  baseUrl = 'http://api.littlesis.org/';

//module
var apiService = {};

//searchEntities(String, Function, Function) -> Unit
apiService.searchEntities = function(query,handleResponse){
  request
    .get(baseUrl + 'entities.json')
    .query({q: query, _key: apiKey})
    .end(function(err,res){
      handleResponse(err, res.body.Response.Data.Entities.Entity);
    });
};

module.exports = apiService;
