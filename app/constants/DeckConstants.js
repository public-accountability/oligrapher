const Marty = require('marty');

module.exports = Marty.createConstants([
  'FETCH_DECKS', // (topic: String)
  // FETCH_DECKS_STARTING,
  // FETCH_DECKS_DONE ({ decks: [Deck], graphs: [Graph] }),
  // FETCH_DECKS_FAILED (error)
  'DECK_SELECTED', // (id: String)
  'SLIDE_SELECTED', // (index: Int)
  'NEXT_SLIDE_REQUESTED',
  'PREVIOUS_SLIDE_REQUESTED',
  'CLOSE_DECK',
  'ZOOMED_IN',
  'ZOOMED_OUT',
  'FETCH_DECK'
]);
