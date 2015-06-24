var chai = require('chai');
var chaiAsPromised = require('chai-as-promised');
var should = chai.should();
var sd = require('../support/sampleData.js');
var fakeDeck = require('../support/sampleData/fakeDecks');
var lsApi = require('../../app/api/lsApi');

chai.use(chaiAsPromised);

describe('LittleSis API Client', () => {

  describe('searching Entities', () => {

    it("returns an array of entities when the query mathces an entity in LittleSis ", () =>
       Promise.resolve(lsApi.searchEntities('walmart'))
         .should.eventually.eql(sd.searchEntitiesResult));

    it("returns an empty array when the query doesn't match anything", () =>
       Promise.resolve(lsApi.searchEntities(',,'))
         .should.eventually.eql([]));

  });

  xdescribe('getting Adjacent Entities', () => {

    it('returns an array of entities when the entity has adjacencies', () =>
       Promise.resolve(lsApi.getAdjacentEntities('1'))
         .should.eventually.eql(sd.getAdjacentEntitiesResult));

    it("throws an error when the queried entity doesn't exist", () =>
       Promise.resolve(lsApi.getAdjacentEntities('0'))
         .should.be.rejectedWith('Not Found'));

  });

  describe('getting a Map', () => {

    it('returns a map that exists', () => {
      Promise.resolve(lsApi.getMap('556'))
        .should.eventually.eql(sd.mitchellMap);
    });

  });

  describe('getting a Deck', () => {

    it('returns a deck', () => {
      Promise.resolve(lsApi.getMap('fracking'))
        .should.eventually.eql(fakeDeck);
    });

  });

});
