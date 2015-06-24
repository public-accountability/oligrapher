var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var sd = require('../support/sampleData.js');
var fakeApiDecks = require('../support/sampleData/fakeApiDecks');
var lsApi = require('../../app/api/lsApi');

chai.use(chaiAsPromised);

describe('LittleSis API Client', () => {

  describe('#searchEntities', () => {

    it("returns an array of entities when the query matches an entity in LittleSis ", () =>
       Promise.resolve(lsApi.searchEntities('walmart'))
         .should.eventually.eql(sd.searchEntitiesResult));

    it("returns an empty array when the query doesn't match anything", () =>
       Promise.resolve(lsApi.searchEntities(',,'))
         .should.eventually.eql([]));

  });

  describe('#getMap', () => {

    it('returns a map that exists', () => {
      Promise.resolve(lsApi.getMap('556'))
        .should.eventually.eql(sd.mitchellMap);
    });

  });

  describe('#getDecks', () => {

    it('returns an array of decks', () => {
      Promise.resolve(lsApi.getMap('fracking'))
        .should.eventually.eql(fakeApiDecks);
    });

  });

});
