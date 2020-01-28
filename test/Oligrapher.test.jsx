import * as helpers from '../app/util/helpers'
import * as render from '../app/util/render'
import Oligrapher from '../app/Oligrapher'
import ReactDOM from 'react-dom'



describe('Oligrapher', function() {
  describe('new Oligrapher.jsx()', function() {
    beforeEach(function() {
      sinon.stub(ReactDOM, 'render')
      sinon.stub(helpers, 'getElementById').returns("FakeElement")
    })

    afterEach(function() {
      ReactDOM.render.restore()
      helpers.getElementById.restore()
    })

    it("sets the store", function() {
      let oli = new Oligrapher()
      expect(oli.store).to.exist
    })

    it ("merges in configuration with default state", function() {
      let oli = new Oligrapher({settings: { debug: true} })
      let state = oli.store.getState()
      expect(state.settings.debug).to.eql(true)
      expect(state.graph.nodes).to.eql({})
    })

    it("renders the application once with ReactDOM", function() {
      new Oligrapher()
      expect(ReactDOM.render.callCount).to.eql(1)
    })
  })
})
