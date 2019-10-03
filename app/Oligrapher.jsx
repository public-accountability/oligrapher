import merge from 'lodash/merge'
import { getElementById } from './helpers'
import { storeWithMiddleware, renderNewApplication } from './util/render'
import configuration from './util/configuration'

/*
  Main entry point of Oligrapher.

  This object is how to initialize a map and interact with oligrapher from javascript

  var oli = new Oligrapher(your Configuration)
*/
export default class Oligrapher {
  constructor(config = {}) {
    this.config = configuration(config)
    this.rootElement = getElementById(this.config.domId)
    this.store = storeWithMiddleware(this.config.logActions)
    renderNewApplication(this.store, this.rootElement)
  }
}
