const Marty = require('marty');

module.exports = Marty.createConstants([
  'RETRIEVE_DECK', // (topick: String)
  // RETRIEVE_DECK_STARTING,
  // RETRIEVE_DECK_DONE,
  // RETRIEVE_DECK_FAILED
  'DECK_SELECTED', // (id: String)
  'SLIDE_SELECTED', // (index: Int)
  'NEXT_SLIDE_REQUESTED',
  'PREVIOUS_SLIDE_REQUESTED'
]);
