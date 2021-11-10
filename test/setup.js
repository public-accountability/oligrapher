import Enzyme from 'enzyme'
// import Adapter from 'enzyme-adapter-react-16'
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { JSDOM } from 'jsdom'

Enzyme.configure({ adapter: new Adapter() })

// Webpack bundles scss files using `require ()` and this instructs Mocha to skip those files.
// source: https://stackoverflow.com/questions/33881123/handle-webpack-css-imports-when-testing-with-mocha-and-babel/37184369#37184369
require.extensions['.scss'] = () => null

// JSDOM is used by enzyme's `mount` (full DOM rendering)
// Source: https://airbnb.io/enzyme/docs/guides/jsdom.html

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')
const { window } = jsdom

global.window = window
global.document = window.document
global.navigator = { userAgent: 'node.js' }


const MockResizeObserver = function(callback) {}
MockResizeObserver.prototype.observe = function() {}
MockResizeObserver.prototype.unobserve = function() {}
MockResizeObserver.prototype.disconnect = function() {}

global.window.ResizeObserver = MockResizeObserver

global.requestAnimationFrame = function(callback) {
  return setTimeout(callback, 0)
}

global.cancelAnimationFrame = function(id) {
  clearTimeout(id)
}

// Copy window props to global
Object.defineProperties(global, {
  ...Object.getOwnPropertyDescriptors(window),
  ...Object.getOwnPropertyDescriptors(global),
})
