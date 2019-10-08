import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import sinon from 'sinon'

Enzyme.configure({ adapter: new Adapter() })

global.shallow = Enzyme.shallow
global.sinon = sinon

// Webpack bundles scss files using `require ()` and this instructs Mocha to skip those files.
// source: https://stackoverflow.com/questions/33881123/handle-webpack-css-imports-when-testing-with-mocha-and-babel/37184369#37184369
require.extensions['.scss'] = () => null
