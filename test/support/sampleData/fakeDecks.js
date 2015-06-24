const Deck = require('../../../app/models/Deck');
const Graph = require('../../../app/models/Graph');
const { Map } = require('immutable');

module.exports = [
  new Deck({
    "id": 146,
    "title": "The Berman-Considine frackademia astroturf",
    "graphIds": [146]
  }),
  new Deck({
    "id": 282,
    "title": "MoMA and Finance",
    "graphIds": [282, '282-1', '282-2', '282-3', '282-4', '282-5']
  }),
  new Deck({
    "id": 431,
    "title": "Updated: How Hillary Clinton and David Goldwyn sold fracking",
    "graphIds": [431]
  }),
  new Deck({
    "id": 454,
    "title": "The Fracking Lobby and the Cuomo administration: A Family Affair",
    "graphIds": [454]
  }),
  new Deck({
    "id": 507,
    "title": "Frackademia in Depth: Timothy Considine",
    "graphIds": [507]
  })
];
