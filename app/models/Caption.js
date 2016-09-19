import merge from 'lodash/merge';
import Helpers from './Helpers';

class Caption {
  static defaults() {
    return {
      id: Helpers.generateId(),
      display: {
        text: "Caption",
        x: 0,
        y: 0,
        scale: 1,
        status: "normal"
      }
    };    
  }

  static setDefaults(caption) {
    return merge({}, this.defaults(), caption);
  }
}

module.exports = Caption;
