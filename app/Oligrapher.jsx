import omit from 'lodash/omit'
import { createOligrapherStore, renderNewApplication } from './util/render'
import configuration from './util/configuration'

import './oligrapher.scss'

/*
  Main entry point of Oligrapher.

  This is how to initialize a new map on a page:

     var oli = new Oligrapher(your Configuration)`

  See app/util/configuration or docs/configuration.js for a list of variables
*/
export default class Oligrapher {
  constructor(userConfig = {}) {
    let config = configuration(userConfig)
    this.config = omit(config, 'graph')
    this.store = createOligrapherStore(config)
    renderNewApplication(this.store, this.rootElement)
  }
}
