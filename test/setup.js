import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'
import { JSDOM } from 'jsdom'
import merge from 'lodash/merge'

import { createOligrapherStore} from '../app/util/render'
import defaultState from '../app/util/defaultState'


Enzyme.configure({ adapter: new Adapter() })

// Add globals. All tests can use: shallow, mount, sinon, merge
global.shallow = Enzyme.shallow
global.mount = Enzyme.mount
global.sinon = sinon
global.merge = merge

// Webpack bundles scss files using `require ()` and this instructs Mocha to skip those files.
// source: https://stackoverflow.com/questions/33881123/handle-webpack-css-imports-when-testing-with-mocha-and-babel/37184369#37184369
require.extensions['.scss'] = () => null

global.createMockStore = () => createOligrapherStore(merge({}, defaultState))

// JSDOM is used by when enzyme's `mount` (full DOM rendering)
// Source: https://airbnb.io/enzyme/docs/guides/jsdom.html

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

function copyProps(src, target) {
  Object.defineProperties(target, {
    ...Object.getOwnPropertyDescriptors(src),
    ...Object.getOwnPropertyDescriptors(target),
  })
}

global.window = window
global.document = window.document
global.navigator = { userAgent: 'node.js' }

global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0)
}

global.cancelAnimationFrame = function(id) {
  clearTimeout(id)
}

copyProps(window, global)
