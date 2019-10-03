import { getElementById } from './helpers'
import { storeWithMiddleware, renderNewApplication } from './util/render'
import configuration from './util/configuration'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

     var oli = new Oligrapher(your Configuration)`

  See app/util/configuration or docs/configuration.js for a list of variables
*/
export default class Oligrapher {
  constructor(config = {}) {
    this.config = configuration(config)
    this.rootElement = getElementById(this.config.domId)
    this.store = storeWithMiddleware(this.config.logActions)
    renderNewApplication(this.store, this.rootElement)
  }
}
