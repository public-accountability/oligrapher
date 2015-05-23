var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var sd = require('./support/sampleData');
var lsApi = require('../app/api/lsApi');

chai.use(chaiAsPromised);

describe('LittleSis API Client', () => {

  describe('searching Entities', () => {

    it("returns an array of entities when the query mathces an entity in LittleSis ", () =>

       Promise.resolve(lsApi.searchEntities('walmart'))
         .should.eventually.eql(sd.expectedSearchEntitiesResult));

    it("returns an empty array when the query doesn't match anything", () =>

       Promise.resolve(lsApi.searchEntities(',,'))
         .should.eventually.eql([]));

  });

});
