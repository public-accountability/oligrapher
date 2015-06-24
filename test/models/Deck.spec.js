const chai = require('chai');
const should = chai.should();
const Graph = require('../../app/models/Graph');
const Deck = require('../../app/models/Deck');

describe('Deck methods', () => {

  const fakeApiDecks = require('../support/sampleData/fakeApiDecks').map_collections;
  const fakeDecks = require('../support/sampleData/fakeDecks');

  describe('#parseApiDeck', () => {

    it('renders a Array[Deck, Array[Graph]] tuple', () => {

      const [deck, graphs] = Deck.parseApiDeck(fakeApiDecks[0]);
      deck.should.eql(fakeDecks[0]);
      graphs.length.should.eql(fakeDecks[0].graphIds.length);
    });

  });

  describe('#parseApiDecks', () => {

    it('renders a {decks: Array[Deck], graphs: Array[Graph]} map', () => {

      const { decks, graphs } = Deck.parseApiDecks(fakeApiDecks);
      decks.should.eql(fakeDecks);
    });

  });

});
