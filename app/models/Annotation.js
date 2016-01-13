import merge from 'lodash/object/merge';
import shortid from 'shortid';

export default class Annotation {
  static defaults() {
    return {
      id: shortid.generate(),
      header: "Untitled Annotation",
      text: "",
      nodeIds: [],
      edgeIds: [],
      captionIds: []
    };
  }

  static setDefaults(annotation) {
    return merge({}, this.defaults(), annotation);
  } 
}